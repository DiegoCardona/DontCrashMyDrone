(function() {
	var app = angular.module('dcmdAdmin', ['socket-io','google-maps','ui.bootstrap']);

	// app.config(["$socketProvider", function ($socketProvider) {
 //      $socketProvider.setUrl("http://localhost:3000");
 //    }]);

	app.controller('AdminController', ['$scope','socket',function($scope, socket) {

		var firstExecution = true;

		var clientData = {
			id: "jalopezmo",
			role: "admin",
			email: "fake@fake.com",
			droneId: "1969"
		};

		$scope.droneArray = [];
		$scope.markers = [];
		$scope.circles = [];
		$scope.nfzArray = [{description:"Aeropuerto El Dorado", latitude:4.697395, longitude:-74.141688, radius:5}];
		$scope.wazArray = [{description:"Lluvia leve", latitude:4.6326047, longitude:-74.1088265, radius:2}];

		$scope.infoWindow = new google.maps.InfoWindow({
			content: "",
			maxWidth: 150
		});

		socket.on("connection", function(data) {
			console.log(data);
			updateContent();
		});

		socket.on("report", function(droneData) {
			console.log(droneData);

			var parsedData = JSON.parse(droneData);

			var found = false;

			for(var i = 0; i < $scope.droneArray.length; i++) {
				if($scope.droneArray[i].id == parsedData.id) {
					$scope.droneArray[i] = parsedData;
					found = true;
					break;
				}
			}

			if(!found) {
				$scope.droneArray.push(parsedData);
			}

			updateContent();
		})

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

		var updateContent = function() {
			$scope.markers.forEach(function(marker) {
				marker.setMap(null);
			});
		
			$scope.markers = [];

			$scope.circles.forEach(function(circle) {
				circle.setMap(null);
			});
		
			$scope.markers = [];
			$scope.circles = [];

			$scope.droneArray.forEach(function(drone) {
				createMarker(drone);
			});
			$scope.nfzArray.forEach(function(nfz) {
				createZone(nfz, true);
			});
			$scope.wazArray.forEach(function(waz) {
				createZone(waz, false);
			});
		};

		var createMarker = function(droneData) {
			var icon = {
				url:"./res/arrow_" + droneData.orientation + ".png",
				scaledSize: new google.maps.Size(30, 34)
			};
			
			var marker = new google.maps.Marker({
				map:$scope.mapInstance,
				icon: icon,
				draggable: false,
				position: new google.maps.LatLng(droneData.latitude, droneData.longitude),
				title: droneData.id
			});

			marker.addListener('click', function(event) {
				$scope.infoWindow.setContent(droneData.id);															
				$scope.mapInstance.panTo(event.latLng);
				$scope.infoWindow.open($scope.mapInstance, this);
			});

			$scope.markers.push(marker);
		}

		var createZone = function(zoneData, isNFZ) {

			var zoneCircle = new google.maps.Circle({
								    strokeColor: isNFZ?'#FCFC6F':'#38DEFF',
								    strokeOpacity: 0.8,
								    strokeWeight: 2,
								    fillColor: isNFZ?'#FFFF82':'#6EE7FF',
								    fillOpacity: 0.2,
								    map: $scope.mapInstance,
								    center: new google.maps.LatLng(zoneData.latitude, zoneData.longitude),
								    radius: zoneData.radius * 1000
							    });

			google.maps.event.addListener(zoneCircle, 'click', function(event) {
				$scope.infoWindow.setContent(zoneData.description);															
				$scope.mapInstance.panTo(event.latLng);
				$scope.infoWindow.open($scope.mapInstance, this);
			});

			$scope.circles.push(zoneCircle);
		}
	}]);
})();