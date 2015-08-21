
var onMapsReady = function() {
    var MainView = Backbone.View.extend({
      el: 'body',
        initialize: function(){
          this.render();
        },
      template: _.template("<% maps.each( function(map) { %> \
            Name: <%= map.get('name') %> <br /> \
            <% map.get('sections').each( function(section) { %>\
                Section: <%= section.get('name') %> <br /> \
                <% section.get('desk_groups').each( function(desk_group) { %>\
                    DeskGroup:  <br /> \
                    <% desk_group.get('desks').each( function(desk) { %>\
                        Desk: <%= JSON.stringify(desk.get('position')) %> <br /> \
                    <% }); %> \
                <% }); %> \
            <% }); %> \
        <% }); %> "),
      render: function() {
        this.$el.html(this.template({maps:this.model}));
        return this;
      }
    });
    new MainView({model:maps});
}