var async = require('async');

module.exports = function(Backbone) {

    Backbone.Model.prototype.addChildCollection = function(collection) {
        if (!this._child_collections) 
            this._child_collections = new Set([]);
        this._child_collections.add(collection);
    };

    Backbone.Model.prototype.visitDepthFirst = function(visitor, done) {
        if (!this._child_collections) return done();
        async.each(Array.from(this._child_collections), function(collection, callback){
            collection.visitDepthFirst(visitor, callback);
        }, done);
    };

    Backbone.Collection.prototype.visitDepthFirst = function(visitor, done) {
        visitor(this, function(err){
            if (err) return done(err);
            async.each(this, function(model, callback){
                model.visitDepthFirst(visitor, callback);
            }, done);
        }.bind(this));
    };

    Backbone.Model.prototype.recursiveFetch =
    Backbone.Collection.prototype.recursiveFetch = function(done) {
        this.visitDepthFirst(function(collection, callback){
            collection.fetch({
                success: function() { callback(); },
                error: function() { callback(new Error('fetch failed')); }
            });
        }, done);
    };
};
