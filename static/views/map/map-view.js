
var MapView = Backbone.View.extend({
  initialize: function(){
    this.render();
    this.listenTo(pageState, 'change', this.render);
    this.listenTo(pageState, 'change', setTimeout.bind(window, this.highlightItem, 1));
    this.currentlyDisplayedMapId = -1;
  },

  el: '#map',

  highlightItem: function(pState) {
    var selectedElement;
    if (pState.attributes.selectedObject instanceof Place) {
      selectedElement = $("#map_place_" + pState.attributes.selectedObject.attributes.id);
    }
    if (pState.attributes.selectedObject instanceof Room) {
      selectedElement = $("#map_room_" + pState.attributes.selectedObject.attributes.id);
    }
    if (pState.attributes.selectedObject instanceof DeskGroup) {
      selectedElement = $("#map_deskgroup_" + pState.attributes.selectedObject.attributes.id).addClass(classToAdd);
    }
    if (pState.attributes.selectedObject instanceof Desk) {
      selectedElement = $("#map_desk_" + pState.attributes.selectedObject.attributes.id).addClass(classToAdd);
    }
    if (pState.attributes.selectedObject instanceof User) {
      selectedElement = $("#map_desk_" + pState.attributes.selectedObject.attributes.deskId).addClass(classToAdd);
    }

    if (selectedElement) {
      var classToAdd = "mapSelectedItem mapAnimateSelectedItem";
      $(".mapSelectedItem.mapAnimateSelectedItem").removeClass(classToAdd);
      if (!pState.mapSelectionClick && isChildPartiallyOutsideOfParent(selectedElement[0], $("#map-wrapper")[0])) {

        selectedElement[0].scrollIntoView();
      }
      selectedElement.addClass(classToAdd);
    }
    pState.mapSelectionClick = false;
  },

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
        var maxY = 0;
        var maxHeight = 0;
        sections.forEach(function(section){
          if (section.attributes.position.x > maxX) {
            maxX = section.attributes.position.x;
            maxWidth = section.attributes.position.w;
          }
          if (section.attributes.position.y > maxY) {
            maxY = section.attributes.position.y;
            maxHeight = section.attributes.position.h;
          }
          $("#map").prepend((new MapSectionView({model: section})).el);
        });
        $("#map").css({width: (maxX+maxWidth+100) + "px", height: (maxY+maxHeight+100) + "px"});
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