Map = Backbone.Model.extend({
    defaults: {
        allMapDesks: null
    },
    modelType: "Map",
    parse : function (response) {
        this.set('allMapDesks', new Desks());
        // Can come in from either maps:[{}] or map:{}
        if (response.map) {
            response = response.map;
        }
        if (response.sections) {
            response.sections = new Sections(response.sections, {parse: true, allMapDesks: this.get("allMapDesks")});
        }
        return response;
    },
    isFullyLoaded : function() {
        return this.get("sections");
    },
    getDeskById: function(deskId) {
      return this.get("allMapDesks").findWhere({"id": deskId});
    },
  toSimpleString: function() {
    return "Map " + this.get('id') + ": " + this.get('name');
  }
});

Maps = Backbone.Collection.extend({
    model: Map,
    getMap : function(id) {
        return this.get({"id":id});
    },
    parse : function(response){
        return response.maps;
    }
});
