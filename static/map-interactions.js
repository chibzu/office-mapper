var MapSectionView = Backbone.View.extend({
  tagName: "div",
  className: "mapSection shadowed",
  showingCreateDialog: false,
  initialize: function() {
    this.render();
    this.listenTo(pageState, 'change', this.render);
  },

  template: _.template(
    "<div class='mapSectionName'><%= attributes.name %></div>" +
    "<% deskGroups.forEach(function(group){ %>" +
      "<%= group.el.outerHTML %>" +
    "<% }); %>" +
    "<% rooms.forEach(function(room){ %>" +
      "<%= room.el.outerHTML %>" +
    "<% }); %>" +
    "<% places.forEach(function(place){ %>" +
      "<%= place.el.outerHTML %>" +
    "<% }); %>" +
    "<div class='mapSectionAddButton clickable shadowed'>+</div>"
  ),

  showCreateDialog: function() {
    if (this.showingCreateDialog) {
      this.$el.find(".mapSectionAddDialog").remove();
    }
    else {
      this.$el.append("<div class='mapSectionAddDialog shadowed'>" +
        "<div class='mapAddPlace clickable' >Place</div>" +
        "<div class='mapAddRoom clickable' >Room</div>" +
        "<div class='mapAddDeskGroup clickable' >Desk Group</div>" +
      "</div>"
      );

      this.$el.find(".mapAddPlace").click(this.createPlace.bind(this));
      this.$el.find(".mapAddRoom").click(this.createRoom.bind(this));
      this.$el.find(".mapAddDeskGroup").click(this.createDeskGroup.bind(this));
    }
    this.showingCreateDialog = !this.showingCreateDialog;
  },

  createRoom: function() {
    this.$el.find(".mapSectionAddDialog").remove();
    this.showingCreateDialog = false;
    var newRoom = this.model.attributes.rooms.create({
        name: "New Room",
        position: {x: 0, y:0, h: 100, w: 100},
        mapId: pageState.attributes.currentMapId,
        sectionId: this.model.attributes.id
    });
    new MapRoomView({model: newRoom});
    this.render();
  },

  createPlace: function() {
    this.$el.find(".mapSectionAddDialog").remove();
    this.showingCreateDialog = false;
    var newPlace = this.model.attributes.places.create({
        name: "New Place",
        position: {x: 0, y:0, h: 100, w: 100},
        mapId: pageState.attributes.currentMapId,
        sectionId: this.model.attributes.id
    });
    new MapPlaceView({model: newPlace});
    this.render();
  },

  createDeskGroup: function() {
    console.log("creating desk group");
    this.$el.find(".mapSectionAddDialog").remove();
    this.showingCreateDialog = false;
    console.dir(this.model.attributes.deskGroups);
    var newDeskGroup = this.model.attributes.deskGroups.create({
        xyPosition: {x: 0, y:0},
        mapId: pageState.attributes.currentMapId,
        sectionId: this.model.attributes.id,
        desks: new Desks()
    });
    new MapDeskGroupView({model: newDeskGroup});
    this.render();
  },

  createDesk: function(evt) {
    var deskGroupId = parseInt(evt.target.parentNode.id.split("_")[2]);
    var clickedDeskGroup = this.model.attributes.deskGroups.get(deskGroupId);
    console.dir(clickedDeskGroup.attributes.desks);
    var newDesk = clickedDeskGroup.attributes.desks.create({
      deskGroupId: deskGroupId,
      position: {x:0, y:0, h:20, w:20},
      rotation: 0
    });
    new MapDeskView({model: newDesk});
    this.render();
  },

  render: function() {
    var localDeskGroups = [];
    this.model.attributes.deskGroups.forEach(function(group){
      localDeskGroups.push(new MapDeskGroupView({model: group}));
    });

    var localRooms = [];
    this.model.attributes.rooms.forEach(function(room){
      localRooms.push(new MapRoomView({model: room}));
    });

    var localPlaces = [];
    this.model.attributes.places.forEach(function(place){
      localPlaces.push(new MapPlaceView({model: place}));
    });

    this.$el.html(this.template({attributes: this.model.attributes,
      rooms: localRooms, places: localPlaces , deskGroups: localDeskGroups}));
    this.$el.css({
      height: this.model.attributes.position.h,
      width: this.model.attributes.position.w,
      top: this.model.attributes.position.y,
      left: this.model.attributes.position.x
    });
    this.$el.draggable({containment: "parent"}).resizable();
    this.$el.find(".mapDeskGroup").draggable({containment: "parent"}).resizable();
    this.$el.find(".mapRoom").draggable({containment: "parent"}).resizable();
    this.$el.find(".mapRoom").click(function(evt){
      pageState.selectObject(rooms.get(parseInt(this.id.split("_")[2])))
    });
    this.$el.find(".mapPlace").draggable({containment: "parent"}).resizable();
    this.$el.find(".mapPlace").click(function(evt){
      pageState.selectObject(places.get(parseInt(this.id.split("_")[2])))
    });
    this.$el.find(".mapDesk").draggable({containment: "parent"}).resizable();
    this.$el.find(".mapSectionAddButton").click(this.showCreateDialog.bind(this));
    this.$el.find(".mapDeskAddButton").click(this.createDesk.bind(this));
    return this;
  }
});

var MapDeskGroupView = Backbone.View.extend({
  tagName: "div",
  className: "mapDeskGroup shadowed",
  id: function() {return "map_deskgroup_" + this.model.attributes.id},
  initialize: function() {
    this.render();
    this.listenTo(pageState, 'change', this.render);
  },
  template: _.template(
    "<% desks.forEach(function(desk){ %>" +
      "<%= desk.el.outerHTML %>" +
    "<% }); %>" +
    "<div class='mapDeskAddButton shadowed clickable'>+</div>"
  ),
  render: function() {
    var maxX = 0;
    var maxY = 0;
    var maxWidth = 0;
    var maxHeight = 0;
    var desks = [];
    this.model.attributes.desks.forEach(function(desk){
      maxX = Math.max(maxX, desk.attributes.position.x);
      maxY = Math.max(maxX, desk.attributes.position.y);
      maxWidth = Math.max(maxX, desk.attributes.position.w);
      maxHeight = Math.max(maxX, desk.attributes.position.h);
      desks.push(new MapDeskView({model: desk}));
    });

    this.$el.html(this.template({desks: desks}));
    this.$el.css({
      top: this.model.attributes.xyPosition.y,
      left: this.model.attributes.xyPosition.x,
      height: (maxY + maxHeight + 5) + "px",
      width: (maxX + maxWidth + 30) + "px",
    });
    return this;
  }
});

var MapDeskView = Backbone.View.extend({
  tagName: "div",
  className: "mapDesk shadowed",
  initialize: function() {
    this.render();
    this.listenTo(pageState, 'change', this.render);
  },
  render: function() {
    this.$el.css({
      height: this.model.attributes.position.h,
      width: this.model.attributes.position.w,
      top: this.model.attributes.position.y,
      left: this.model.attributes.position.x
    });
    return this;
  }
});

var MapRoomView = Backbone.View.extend({
  tagName: "div",
  className: "mapRoom shadowed",
  id: function() {return "map_room_" + this.model.id},
  initialize: function() {
    this.render();
    this.listenTo(pageState, 'change', this.render);
  },
  template: _.template(
    "<div class='mapRoomName'><%= name %></div>"
  ),
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    this.$el.css({
      height: this.model.attributes.position.h,
      width: this.model.attributes.position.w,
      top: this.model.attributes.position.y,
      left: this.model.attributes.position.x
    });
    return this;
  }
});

var MapPlaceView = Backbone.View.extend({
  tagName: "div",
  id: function() {return "map_place_" + this.model.id},
  className: "mapPlace shadowed",
  initialize: function() {
    this.render();
    this.listenTo(pageState, 'change', this.render);
  },
  template: _.template(
    "<div class='mapPlaceName'><%= name %></div>"
  ),
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    this.$el.css({
      height: this.model.attributes.position.h,
      width: this.model.attributes.position.w,
      top: this.model.attributes.position.y,
      left: this.model.attributes.position.x
    });
    this.$el.click(function(){alert("bar");});
    return this;
  }
});

var MapView = Backbone.View.extend({
  initialize: function(){
    this.render();
    this.listenTo(pageState, 'change', this.render);
    this.currentlyDisplayedMapId = -1;
  },

  el: '#map',

  render: function() {
    if(pageState.get("currentMapLoaded")) {
      if(this.currentlyDisplayedMapId != this.model.get('currentMapId')) {
        console.log("rendering new map");
        this.listenTo(this.model.getCurrentMap().attributes.sections, 'change', this.render);
        this.currentlyDisplayedMapId = this.model.get('currentMapId')
        $("#map").empty();
        $("#map").append("<div id='new_section_button' class='shadowed clickable'>+</div>");
        var curMap = this.model.getCurrentMap()
        this.$("#map_name").text(curMap.attributes.name);
        var sections = curMap.attributes.sections;
        var maxX = 0;
        var maxWidth = 0;
        sections.forEach(function(section){
          maxX = Math.max(section.attributes.position.x, maxX);
          maxWidth = Math.max(section.attributes.position.w, maxWidth);
          $("#map").prepend((new MapSectionView({model: section})).el);
        });
        $("#map").css({width: (maxX+maxWidth+100) + "px"});
        $("#new_section_button").css({left: ($("#map")[0].scrollWidth - 80)+"px"});
        $("#new_section_button").click(function(){
          var newSection = this.model.getCurrentMap().attributes.sections.create({map_id: this.model.attributes.currentMapId,
            name: "New Section",
            position: {x: 0, y: 0, w: 200, h: 200},
            deskGroups: new DeskGroups([]),
            places: new Places([]),
            rooms: new Rooms([])
          });
          $("#map").prepend((new MapSectionView({model: newSection})).el);
        }.bind(this));
      }
    }
    else
    {
      this.$("#map_name").text("loading...");
    }
    return this;
  }
});

function renderMapView(pState) {
  mapView = new MapView({model:pState});
}