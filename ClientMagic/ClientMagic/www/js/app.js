// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var example = angular.module('starter', ['ionic','socket-io'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);

      var onSuccess = function(position) {
        alert('Latitude: '          + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              'Heading: '           + position.coords.heading           + '\n' +
              'Speed: '             + position.coords.speed             + '\n' +
              'Timestamp: '         + position.timestamp                + '\n');
      };

      var onError = function(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
      };

      // navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.controller("MainController", function($scope, socket, $ionicPopup, $rootScope){
  var clientData = {
    id: "jalopezmo",
    role: "admin",
    email: "fake@fake.com",
    droneId: "1969"
  };

  $scope.droneData;
  $scope.marker;
  $scope.infoWindow = new google.maps.InfoWindow({
    content: "",
    maxWidth: 150
  });
  $scope.circles = [];

  var inputPopup = $ionicPopup.prompt({
    title: "Ingresa el ID de tu drone",
    inputType: 'text',
    inputPlaceholder: 'ID de tu drone',
    okText: 'Aceptar'
  });

  inputPopup.then(function(res) {
    console.log(res);
    clientData.droneId = res;
    socket.emit("clientConnection", clientData);
  });

  socket.on("connection", function(data) {
    console.log(data);
    $scope.nfzArray = data.NFZ;
    $scope.wazArray = data.WAZ;

    $scope.nfzArray.forEach(function(nfz) {
      createCircle(nfz, true);
    });
    $scope.wazArray.forEach(function(waz) {
      createCircle(waz, false);
    });
  });

  socket.on("report", function(droneData) {
    console.log(droneData);

    var parsedData = JSON.parse(droneData);

    var found = false;

    $scope.droneData = parsedData;

    setMarker($scope.droneData);
  });

  var setMarker = function(droneData) {
    var icon = {
      url:"./res/arrow_" + droneData.orientation + ".png",
      scaledSize: new google.maps.Size(30, 34)
    };
    
    if($scope.marker) {
      $scope.marker.setMap(null);
      $scope.marker = null;
    }

    $scope.marker = new google.maps.Marker({
      map:$rootScope.map,
      icon: icon,
      draggable: false,
      position: new google.maps.LatLng(droneData.latitude, droneData.longitude),
      title: droneData.id
    });

    $scope.marker.addListener('click', function(event) {
      $scope.infoWindow.setContent(droneData.id);                             
      $rootScope.map.panTo(event.latLng);
      $scope.infoWindow.open($rootScope.map, this);
    });

    $rootScope.map.panTo(new google.maps.LatLng(droneData.latitude, droneData.longitude));
  }

  var createCircle = function(zoneData, isNFZ) {

    var zoneCircle = new google.maps.Circle({
                  strokeColor: isNFZ?'#ff8080':'#38DEFF',
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: isNFZ?'#ffb3b3':'#6EE7FF',
                  fillOpacity: 0.2,
                  map: $rootScope.map,
                  center: new google.maps.LatLng(parseFloat(zoneData.latitude), parseFloat(zoneData.longitude)),
                  radius: parseFloat(zoneData.radius)
                });

    google.maps.event.addListener(zoneCircle, 'click', function(event) {
      $scope.infoWindow.setContent(zoneData.description);                             
      $scope.infoWindow.setPosition(event.latLng);
      $rootScope.map.panTo(event.latLng);
      $scope.infoWindow.open($rootScope.map, this);
    });

    $scope.circles.push(zoneCircle);
  };
})

example.controller("MapController", function($scope,$rootScope){
    google.maps.event.addDomListener(window,"load",function(){
        var mylatlng = new google.maps.LatLng(4.6425047, -74.0888265);

        var mapOptions = {
          center: mylatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          streetViewControl: false,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
          },
          mapTypeControl: false,
          scaleControl: false,
          panControl: false
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        navigator.geolocation.getCurrentPosition(function(pos){
          map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude),
            map:map,
            title: 'Yo!'
        });
          marker.setMap(map);
        },function(error){
          console.log(error);
        });
      
    $rootScope.map = map;

    });
});

