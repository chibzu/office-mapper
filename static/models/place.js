Place = Backbone.Model.extend({
    searchMatches: function(query) {
        if(query == '') {
            return true;
        } else if (this.get("name") && this.get("name").toUpperCase().indexOf(query.toUpperCase()) > -1) {
            return true;
        }
        return false;
    }
});

Places = Backbone.Collection.extend({
    model: Place,
    getSubsetFromJSONArray: function (localPlaces) {
        var subset = new Places();
        subset.add(localPlaces.map(_.bind(function(place){return this.get(place.id)},this)));
        return subset;
    },
    getPlace : function(id) {
        return this.get({"id":id});
    },
    parse : function(response){
      //TODO(Dustin): figure out why it's sometimes
      //in an object and sometimes not
      if (response.places)
        return response.places;
      else
        return response;
    }
});