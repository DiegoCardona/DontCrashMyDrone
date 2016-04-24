// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var example = angular.module('starter', ['ionic','socket-io'])

.run(function($ionicPlatform, socket) {
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

      navigator.geolocation.getCurrentPosition(onSuccess, onError);

      var clientData = {
        id: "jalopezmo",
        role: "admin",
        email: "fake@fake.com",
        droneId: "1969"
      };

      socket.emit("clientConnection", clientData);

      $scope.checkMap = function() {
        if($scope.mapInstance) {
          google.maps.event.trigger($scope.mapInstance, 'resize');
          $scope.mapInstance.setCenter(new google.maps.LatLng(4.6425047, -74.0888265));
        }
        else{
          setTimeout( function() {
            $scope.checkMap();
          }, 200);
        }
      };

      $scope.checkMap();

      $scope.map = {
        center: {
          latitude: 4.6425047,
          longitude: -74.0888265},
        zoom: 13,
        events: {
          tilesloaded: function (map) {
            $scope.$apply(function () {
              $scope.mapInstance = map;

              if(firstExecution) {
                socket.emit("clientConnection", clientData);
                firstExecution = false;
                createClickHandler();
              }
            });
          }
        },
        options: {
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          streetViewControl: false,
          zoomControl: true,
          zoomControlOptions: {
                      position: google.maps.ControlPosition.RIGHT_BOTTOM
                  },
                  mapTypeControl: true,
          scaleControl: false,
          panControl: false
        }, 
        show: true  
      };
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

example.controller("MapController", function($scope){
    google.maps.event.addDomListener(window,"load",function(){
        var mylatlng = new google.maps.LatLng(37.30000,-120.4833);

        var mapOptions = {
          center: mylatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
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
      
    $scope.map = map;

    });
});

