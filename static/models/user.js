User = Backbone.Model.extend({
    searchMatches: function(query) {
        if(query == '') {
            return true;
        } else if (this.get("name") && this.get("name").toUpperCase().indexOf(query.toUpperCase()) > -1) {
            return true;
        } else if (this.get("email") && this.get("email").toUpperCase().indexOf(query.toUpperCase()) > -1 ) {
            return true;
        }
        return false;
    }
});

Users = Backbone.Collection.extend({
    model: User,
    getUser : function(id) {
        return this.get({"id":id});
    },
    getUserByGPlusId : function(gplus_id) {
        return this.findWhere({"gplusId":gplus_id});
    },
    parse : function(response){
        return response.users;
    }
});