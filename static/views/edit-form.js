var formWrappingTemplate = _.template("" +
  "<table class='<%= divName %>'><%= innerForm %></table>" +
  "<button type='button' id='save'>Save</button>" +
  "<button type='button' id='reset'>reset</button>"
  );
var formDeleteWrappingTemplate = _.template("" +
  "<table class='<%= divName %>'><%= innerForm %></table>" +
  "<button type='button' id='save'>Save</button>" +
  "<button type='button' id='delete'>delete</button>" +
  "<button type='button' id='reset'>reset</button>"
  );

var editUserTemplate = _.template("" +
  "<tr class='formRow' id='edit-id'><td class='inputLabel'>Id:</td><td class='inputField'><%= id %></td></tr>" +
  "<tr class='formRow' id='edit-name'><td class='inputLabel'>Name:</td><td class='inputField'><%= name %></td></tr>" +
  "<tr class='formRow' id='edit-email'><td class='inputLabel'>Email:</td><td class='inputField'><%= email %></td></tr>" +
  "<tr class='formRow' id='edit-deskId'><td class='inputLabel'>DeskId:</td><td class='inputField'><input class='editDeskInput' type='text' name='deskId' value='<%= deskId %>'></td></tr>" +
  "<tr class='formRow' id='edit-admin'><td class='inputLabel'>Admin:</td><td class='inputField'><input class='editAdminInput' type='checkbox' name='admin' value='admin' <%= admin ? 'checked' : '' %>></td></tr>" +
  "<tr><td colspan=2> <span class='adminAlert'>Please make sure you completely trust this user's ability to administer this site before enabling him as an administrator</span></td><tr>"
  );

var editUserNoAdminTemplate = _.template("" +
  "<tr class='formRow' id='edit-id'><td class='inputLabel'>Id:</td><td class='inputField'><%= id %></td></tr>" +
  "<tr class='formRow' id='edit-name'><td class='inputLabel'>Name:</td><td class='inputField'><%= name %></td></tr>" +
  "<tr class='formRow' id='edit-email'><td class='inputLabel'>Email:</td><td class='inputField'><%= email %></td></tr>" +
  "<tr class='formRow' id='edit-deskId'><td class='inputLabel'>DeskId:</td><td class='inputField'><input class='editDeskInput' type='text' name='deskId' value='<%= deskId %>'></td></tr>"
  );

var editPositionTemplate = _.template("<table class='editPositionForm'>" +
  "<tr class='' id='edit-x'><td class='positionInputLabel'>x:</td><td class='positionInputField'><input class='editPosInput' type='text' name='x' value='<%= x %>'></td></tr>" +
  "<tr class='' id='edit-y'><td class='positionInputLabel'>y:</td><td class='positionInputField'><input class='editPosInput' type='text' name='y' value='<%= y %>'></td></tr>" +
  "<tr class='' id='edit-w'><td class='positionInputLabel'>w:</td><td class='positionInputField'><input class='editPosInput' type='text' name='w' value='<%= w%>'></td></tr>" +
  "<tr class='' id='edit-h'><td class='positionInputLabel'>h:</td><td class='positionInputField'><input class='editPosInput' type='text' name='h' value='<%= h %>'></td></tr>" +
  "</table>"
  );

var editXYPositionTemplate = _.template("<table class='editPositionForm'>" +
  "<tr class='' id='edit-x'><td class='positionInputLabel'>x:</td><td class='positionInputField'><input class='editPosInput' type='text' name='x' value='<%= x %>'></td></tr>" +
  "<tr class='' id='edit-y'><td class='positionInputLabel'>y:</td><td class='positionInputField'><input class='editPosInput' type='text' name='y' value='<%= y %>'></td></tr>" +
  "</table>"
  );
var editFeaturesTemplate = _.template("<table class='editFeatureForm'>" +
  "<tr class='' id='edit-chromecast'><td class='featureInputLabel'>Chromecast:</td><td class='featureInputField'><input class='editFeatInput' type='checkbox' name='chromecast' value='chromecast' <%= chromecast ? 'checked' : '' %>></td></tr>" +
  "<tr class='' id='edit-phone'><td class='featureInputLabel'>Phone:</td><td class='featureInputField'><input class='editFeatInput' type='checkbox' name='phone' value='phone' <%= phone ? 'checked' : '' %>></td></tr>" +
  "<tr class='' id='edit-tv'><td class='featureInputLabel'>TV:</td><td class='featureInputField'><input class='editFeatInput' type='checkbox' name='tv' value='tv' <%= tv ? 'checked' : '' %>></td></tr>" +
  "<tr class='' id='edit-seats'><td class='featureInputLabel'>Seats:</td><td class='featureInputField'><input class='editFeatInput' type='text' name='seats' maxlength=3 value='<%= seats %>'></td></tr>" +
  "</table>"
  );

var editRoomTemplate = _.template("" +
  "<tr class='formRow' id='edit-id'><td class='inputLabel'>Id:</td><td class='inputField'><%= id %></td></tr>" +
  "<tr class='formRow' id='edit-name'><td class='inputLabel'>Name:</td><td class='inputField'><input class='editInput' type='text' name='name' value='<%= name %>'></td></tr>" +
  "<tr class='formRow' id='edit-features'><td class='inputLabel'>Features:</td><td class='inputField'><%= editFeaturesTemplate(features) %></td></tr>" +
  "<tr class='formRow' id='edit-sectionId'><td class='inputLabel'>Section Id:</td><td class='inputField'><input class='editInput' type='text' name='sectionId' value='<%= sectionId %>'></td></tr>" +
  "<tr class='formRow' id='edit-position'><td class='inputLabel'>Position:</td><td class='inputField'><%= editPositionTemplate(position) %></td></tr>"
  );

var editPlaceTemplate = _.template("" +
  "<tr class='formRow' id='edit-id'><td class='inputLabel'>Id:</td><td class='inputField'><%= id %></td></tr>" +
  "<tr class='formRow' id='edit-name'><td class='inputLabel'>Name:</td><td class='inputField'><input class='editInput' type='text' name='name' value='<%= name %>'></td></tr>" +
  "<tr class='formRow' id='edit-description'><td class='inputLabel'>Description:</td><td class='inputField'><input class='editInput' type='text' name='description' value='<%= description %>'></td></tr>" +
  "<tr class='formRow' id='edit-sectionId'><td class='inputLabel'>Section Id:</td><td class='inputField'><input class='editInput' type='text' name='sectionId' value='<%= sectionId %>'></td></tr>" +
  "<tr class='formRow' id='edit-position'><td class='inputLabel'>Position:</td><td class='inputField'><%= editPositionTemplate(position) %></td></tr>"
  );

var editSectionTemplate = _.template("" +
  "<tr class='formRow' id='edit-id'><td class='inputLabel'>Id:</td><td class='inputField'><%= id %></td></tr>" +
  "<tr class='formRow' id='edit-name'><td class='inputLabel'>Name:</td><td class='inputField'><input class='editInput' type='text' name='name' value='<%= name %>'></td></tr>" +
  // "<tr class='formRow' id='edit-mapId'>mapId: <%= mapId %> </tr>" +
  "<tr class='formRow' id='edit-position'><td class='inputLabel'>Position:</td><td class='inputField'><%= editPositionTemplate(position) %></td></tr>"
  );

var editMapTemplate = _.template(""+
  "<tr class='formRow' id='edit-id'><td class='inputLabel'>id:</td><td class='inputField'><%= id %></td></tr>" +
  "<tr class='formRow' id='edit-name'><td class='inputLabel'>Name:</td><td class='inputField'><input class='editInput' type='text' name='name' value='<%= name %>'></td></tr>"
  // "<div class='' id='edit-mapId'>mapId: <%= mapId %> </div>" +
  // "<div class='' id='edit-position'>position: <%= editPositionTemplate(position) %> </div>" +
  );


var editDeskTemplate = _.template(""+
  "<tr class='formRow' id='edit-id'><td class='inputLabel'>id:</td><td class='inputField'><%= id %></td></tr>" +
  "<tr class='formRow' id='edit-name'><td class='inputLabel'>Name:</td><td class='inputField'><input class='editInput' type='text' name='name' value='<%= name %>'></td></tr>" +
  "<tr class='formRow' id='edit-position'><td class='inputLabel'>Position:</td><td class='inputField'><%= editPositionTemplate(position) %></td></tr>" +
  "<tr class='formRow' id='edit-rotation'><td class='inputLabel'>Rotation:</td><td class='inputField'><input class='editInput' type='text' name='rotation' value='<%= rotation %>'></td></tr>" 
  // "<div class='' id='edit-mapId'>mapId: <%= mapId %> </div>" +
  // "<div class='' id='edit-position'>position: <%= editPositionTemplate(position) %> </div>" +
  );

var editDeskGroupTemplate = _.template(""+
  "<tr class='formRow' id='edit-id'><td class='inputLabel'>id:</td><td class='inputField'><%= id %></td></tr>" +
  "<tr class='formRow' id='edit-name'><td class='inputLabel'>Name:</td><td class='inputField'><input class='editInput' type='text' name='name' value='<%= name %>'></td></tr>" +
  "<tr class='formRow' id='edit-position'><td class='inputLabel'>Position:</td><td class='inputField'><%= editXYPositionTemplate(xyPosition) %></td></tr>" +
  "<tr class='formRow' id='edit-sectionId'><td class='inputLabel'>Section Id:</td><td class='inputField'><input class='editInput' type='text' name='sectionId' value='<%= sectionId %>'></td></tr>" +
  "<tr class='formRow' id='edit-rotation'><td class='inputLabel'>Rotation:</td><td class='inputField'><input class='editInput' type='text' name='rotation' value='<%= rotation %>'></td></tr>" 
  // "<div class='' id='edit-mapId'>mapId: <%= mapId %> </div>" +
  // "<div class='' id='edit-position'>position: <%= editPositionTemplate(position) %> </div>" +
  );

var primaryEditTemplate =_.template("<div class='primaryEditForm'><%= innerForm %></div>");

var subEditTemplate = _.template(""+ 
  "<div class='secondaryEditForm'>" +
  "<div class='editDeskTitle'> <%= title %> </div>" +
  "<%= innerForm %>" +
  "</div>"
  );
var unselectedTemplate = _.template(""+
  "Select an object from either the List or the Map to begin editing" 
  );

var unAuthorizedTemplate = _.template(""+
  "You must be logged in and authorized to modify the map.  If you do not have authorization, ask " 
  );
var onlySelfTemplate = _.template(""+
  "You are logged in, but not an admin.  You can only modify yourself" 
  );
var EditFormView= Backbone.View.extend({
  initialize: function(){
    this.render();
    this.listenTo(pageState, 'change', this.render);
    this.listenTo(gplus, 'change', this.render);
  },

  el: '#edit-form',

  events: {
    "change .primaryEditForm .editInput": "onFieldEdited",
    "change .primaryEditForm .editPosInput": "onPosFieldEdited",
    "change .primaryEditForm .editFeatInput": "onFeatFieldEdited",
    "change .primaryEditForm .editAdminInput": "onAdminFieldEdited",
    "change .primaryEditForm .editUserForm #edit-deskId .editDeskInput": "onUserDeskChanged",

    "click .primaryEditForm #save": "saveSelectedObject",
    "click .primaryEditForm #delete": "deleteSelectedObject",
    "click .primaryEditForm #reset": "resetSelectedObject",

    "change .secondaryEditForm .editInput": "onSecondaryFieldEdited",
    "change .secondaryEditForm .editPosInput": "onSecondaryPosFieldEdited",
  },

  onSecondaryFieldEdited: function(event) {
    console.log("onSecondaryFieldEdited");
  },
  onSecondaryPosFieldEdited: function(event) {
    console.log("onSecondaryPosFieldEdited");
  },
  onUserDeskChanged: function(event) {
    element = event.currentTarget;

    var value = !isNaN(element.value) ? Number(element.value) : element.value;
    !pageState.setDeskOnUserSelectedObject(value, function(occupant){
      element.value = pageState.get("selectedObject").get("deskId");
      $("#desk-occupied-dialog").html("This desk is already occupied by " + occupant.get("name") +". Please choose a different desk");
      $("#desk-occupied-dialog").dialog({appendTo:"#vertical-flexbox",   
        buttons: [{
          text: "Ok",
          click: function() {
            $(this).dialog( "close" );
          }  
        }]
      });
    })
  },
  onPosFieldEdited: function(event) {
    element = event.currentTarget;
    var newPos = {
      x: Number(this.$("[name='x']").val()),
      y: Number(this.$("[name='y']").val()),
      w: Number(this.$("[name='w']").val()),
      h: Number(this.$("[name='h']").val())
    }
    console.log("edit position changed to " + JSON.stringify(newPos));
    pageState.setOnSelectedObject("position", newPos);
  },
 onAdminFieldEdited: function(event) {
    pageState.setOnSelectedObject("admin", this.$("[name='admin']").prop('checked'));
  },
  onFeatFieldEdited: function(event) {
    element = event.currentTarget;
    var newFeats = {
      chromecast: this.$("[name='chromecast']").prop('checked'),
      phone: this.$("[name='phone']").prop('checked'),
      tv: this.$("[name='tv']").prop('checked'),
      seats: Number(this.$("[name='seats']").val())
    }
    // console.log("edit feats changed to " + JSON.stringify(newFeats));
    pageState.setOnSelectedObject("features", newFeats)
  },

  onFieldEdited: function(event) {
    element = event.currentTarget;

    var value = !isNaN(element.value) ? Number(element.value) : element.value;
    // console.log("edit " + element.name + " changed to " + element.value);
    pageState.setOnSelectedObject(element.name, value)
  },

  saveSelectedObject: function(event) {
    console.log("saving!")
    pageState.get("selectedObject").save();
  },
  deleteSelectedObject: function(event) {
    $("#confirm-dialog").html("Are you sure? This will delete this object");
    $("#confirm-dialog").dialog({appendTo:"#vertical-flexbox",   
      buttons: [{
        text: "Ok",
        click: function() {
          console.log("deleting!")
          pageState.get("selectedObject").destroy();
          $(this).dialog( "close" );
        }  
      },
      {
        text: "Cancel",
        click: function() {
          $(this).dialog( "close" );
        }  
      }]
    });
  },

  resetSelectedObject: function(event) {
    console.log("resetting!")
    pageState.get("selectedObject").fetch();
  },

  render: function() {
    var obj = pageState.get("selectedObject");
    if(gplus.isCurrentUserAnAdmin()) {
      if(obj instanceof User) {
        this.$el.html(primaryEditTemplate({innerForm:formWrappingTemplate({divName:'editUserForm', innerForm:editUserTemplate(obj.attributes)})}));

        // if (obj.mapIsLoadedAndVisible()) {
        //   var desk = maps.get(obj.get('mapId')).getDeskById(obj.get('deskId'));
        //   if (desk) {
        //     // this.$el.append(subEditTemplate({title:'Edit Associated Desk',
        //       // innerForm: formWrappingTemplate({divName:'editDeskForm', innerForm:editDeskTemplate(desk.attributes)})}));
        //   } else {
        //     this.$el.append("Desk is not found");
        //   }
        // } else {
        //     this.$el.append("This user is not associated to a desk");
        // }
      } else if (obj instanceof Room) {
        this.$el.html(primaryEditTemplate({innerForm:formDeleteWrappingTemplate({divName:'editRoomForm', innerForm:editRoomTemplate(obj.attributes)})}));
      } else if (obj instanceof Place) {
        this.$el.html(primaryEditTemplate({innerForm:formDeleteWrappingTemplate({divName:'editPlaceForm', innerForm:editPlaceTemplate(obj.attributes)})}));
      } else if (obj instanceof Section) {
        this.$el.html(primaryEditTemplate({innerForm:formWrappingTemplate({divName:'editSectionForm', innerForm:editSectionTemplate(obj.attributes)})}));
      } else if (obj instanceof Map) {
        this.$el.html(primaryEditTemplate({innerForm:formWrappingTemplate({divName:'editMapForm', innerForm:editMapTemplate(obj.attributes)})}));
      } else if (obj instanceof Desk) {
        this.$el.html(primaryEditTemplate({innerForm:formDeleteWrappingTemplate({divName:'editDeskForm', innerForm:editDeskTemplate(obj.attributes)})}));
      } else if (obj instanceof DeskGroup) {
        this.$el.html(primaryEditTemplate({innerForm:formWrappingTemplate({divName:'editDeskForm', innerForm:editDeskGroupTemplate(obj.attributes)})}));
      }
      else {
        this.$el.html(unselectedTemplate());
      }
    } else if(gplus.isLoggedIn()) {
      if(obj instanceof User && users.getUserByGPlusId(gplus.getUserId()) == obj) {
        this.$el.html(primaryEditTemplate({innerForm:formWrappingTemplate({divName:'editUserForm', innerForm:editUserNoAdminTemplate(obj.attributes)})}));
      } else {
        this.$el.html(onlySelfTemplate());
      }
    } else {
      this.$el.html(unAuthorizedTemplate());
    }
    return this;
  }
});
var renderEditForm = function() {
  new EditFormView({pageState: pageState});
};