Room = Backbone.Model.extend({
  modelType: "Room",
  parse: function(response, options){
    if (response.room) {
      response = response.room;
    }
    return response;
  },

    searchMatches: function(query) {
        if(query == '') {
            return true;
        } else if (this.get("name") && this.get("name").toUpperCase().indexOf(query.toUpperCase()) > -1) {
            return true;
        }
        return false;
    },
  toSimpleString: function() {
    return this.modelType + " " + this.get('id') + ": " + this.get('name');
  }
});

Rooms = Backbone.Collection.extend({
    model: Room,
    getSubsetFromJSONArray: function (localPlaces) {
        var subset = new Rooms();
        subset.add(localPlaces.map(_.bind(function(place){return this.get(place.id)},this)));
        return subset;
    },
    getRoom : function(id) {
        return this.get({"id":id});
    },
    parse : function(response){
        return response.rooms;
    }
});