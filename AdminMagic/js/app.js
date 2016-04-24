(function() {
	var app = angular.module('dcmdAdmin', ['socket-io','google-maps','ngAnimate','ui.bootstrap','ngFileUpload']);

	// app.config(["$socketProvider", function ($socketProvider) {
 //      $socketProvider.setUrl("http://localhost:3000");
 //    }]);

	app.controller('AdminController', ['$scope','socket','$uibModal',function($scope, socket,$uibModal) {

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
		$scope.nfzArray = [];
		$scope.wazArray = [];
		$scope.alertOpen = false;

		$scope.infoWindow = new google.maps.InfoWindow({
			content: "",
			maxWidth: 150
		});

		socket.on("connection", function(data) {
			console.log(data);
			$scope.nfzArray = data.NFZ;
			$scope.wazArray = data.WAZ;
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

		socket.on("alert", function(alertData) {
			console.log(alertData);
			
			if(!$scope.alertOpen) {
				openAlert(alertData.title, alertData.description);
			}
		});

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

		var UploadModalController = function($scope, $uibModalInstance, Upload) {
			$scope.positiveClick = function() {
				if($scope.uploadFile) {
					$scope.uploadFile = Upload.upload({
						url:'http://localhost/DontCrashMyDrone/AdminMagic/abc.js',
						data:{file:$scope.uploadFile}
					});
				}
				else {
					console.log("No has seleccionado nada");
				}
				// file.upload = Upload.upload({
			 //      url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
			 //      data: {username: $scope.username, file: file},
			 //    });
			};
			$scope.negativeClick = function() {
				$uibModalInstance.close();
			}
		};

		$scope.createIntegration = function() {
			var messageModal = $uibModal.open({
				templateUrl: './uploadFile.html',
				controller: UploadModalController,
				backdrop: 'static'
			});
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
				createCircle(nfz, true);
			});
			$scope.wazArray.forEach(function(waz) {
				createCircle(waz, false);
			});
		};

		var createClickHandler = function() {
			$scope.mapInstance.addListener('click',function(data) {
				console.log(data.latLng.lat() + "," + data.latLng.lng());
				openMessage(data.latLng.lat(),data.latLng.lng());
			})
		};

		var InputModalController = function($scope, $uibModalInstance, latitude, longitude) {
			$scope.latitude = latitude;
			$scope.longitude = longitude;
			$scope.radius = 1000;

			$scope.positiveClick = function() {
				var nfz = {
					id:"jalopezmo", 
					nfz:{
						latitude: $scope.latitude,
						longitude: $scope.longitude,
						radius: $scope.radius,
						description: "Zona de vuelo restringido"
					}
				};

				socket.emit('nfzMap',nfz);
				$scope.$$prevSibling.scopeCreateCircle(nfz.nfz, true);
				$uibModalInstance.close();
			};
			$scope.negativeClick = function() {
				$uibModalInstance.close();
			}
		};

		var openMessage = function(lat, lng) {
			var messageModal = $uibModal.open({
				templateUrl: './genericModal.html',
				controller: InputModalController,
				backdrop: 'static',
				resolve: {
					latitude: function() {
						return lat;
					},
					longitude: function() {
						return lng;
					}
				}
			});
		};

		var AlertModalController = function($scope, $uibModalInstance, title, message) {
			$scope.modalTitle = title;
			$scope.modalMessage = message;

			$scope.positiveClick = function() {
				$uibModalInstance.close();
				$scope.$$prevSibling.alertOpen = false;
			};
		};

		var openAlert = function(title, message) {
			$scope.alertOpen = true;
			var alertModal = $uibModal.open({
				templateUrl: './alertModal.html',
				controller: AlertModalController,
				backdrop: 'static',
				resolve: {
					title: function() {
						return title;
					},
					message: function() {
						return message;
					}
				}
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
				$scope.infoWindow.setContent("Drone: " + droneData.id);															
				$scope.mapInstance.panTo(event.latLng);
				$scope.infoWindow.open($scope.mapInstance, this);
			});

			$scope.markers.push(marker);
		}

		$scope.scopeCreateCircle = function(zoneData, isNFZ) {
			createCircle(zoneData, isNFZ);
		};

		var createCircle = function(zoneData, isNFZ) {

			var zoneCircle = new google.maps.Circle({
								    strokeColor: isNFZ?'#ff8080':'#38DEFF',
								    strokeOpacity: 0.8,
								    strokeWeight: 2,
								    fillColor: isNFZ?'#ffb3b3':'#6EE7FF',
								    fillOpacity: 0.2,
								    map: $scope.mapInstance,
								    center: new google.maps.LatLng(parseFloat(zoneData.latitude), parseFloat(zoneData.longitude)),
								    radius: parseFloat(zoneData.radius)
							    });

			google.maps.event.addListener(zoneCircle, 'click', function(event) {
				$scope.infoWindow.setContent(zoneData.description);															
				$scope.infoWindow.setPosition(event.latLng);
				$scope.mapInstance.panTo(event.latLng);
				$scope.infoWindow.open($scope.mapInstance, this);
			});

			$scope.circles.push(zoneCircle);
		}
	}]);
})();