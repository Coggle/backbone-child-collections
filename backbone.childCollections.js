module.exports = function(Backbone) {

    Backbone.Model.prototype.addChildCollection = function(collection) {
        if (!this._child_collections) 
            this._child_collections = new Set([]);
        this._child_collections.add(collection);
    };

    Backbone.Model.prototype.recursiveFetch = function() {
        if (!this._child_collections) return;
        this._child_collections.forEach(function(collection){
            collection.recursiveFetch();
        });
    };

    Backbone.Collection.prototype.recursiveFetch = function() {
        this.fetch({
            success: function() {
                this.each(function(m) {
                    m.recursiveFetch();
                });
            }.bind(this)
        });
    };

};
