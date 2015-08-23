var users, plases, rooms, maps, pageState;

gplus = new GPlus();
gplusList = new GPlusUserList();
pageState = new PageState();
$( document ).ready(function(){
    users = new Users();
    users.fetch({success:function(){
      pageState.set("usersLoaded", true);
      renderUsers();
    }});

    places = new Places();
    places.fetch({success:function(){
      pageState.set("placesLoaded", true);
      renderPlaces();
    }});

    rooms = new Rooms();
    rooms.fetch({success:function(){
      pageState.set("roomsLoaded", true);
      renderRooms();
    }});


    maps = new Maps();
    maps.fetch({success:function(){
      pageState.set("mapsLoaded", true);
      renderMapSelecton();
      firstMap = maps.first();
      pageState.selectMapId(firstMap.get("id"));
    }});

    connectGPlusView();

    renderLoadingOverlayView();
    renderEditForm();
    renderSearchBar();
    renderListBarSquishView();
    renderEditBarSquishView();
    renderMapView(pageState);
});