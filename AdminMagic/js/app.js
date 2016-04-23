(function() {
	var app = angular.module('dcmdAdmin', ['btford.socket-io']);

	app.factory('ServerSocket', function (socketFactory) {

		var ServerIOSocket = io.connect('http://localhost:3000');
		ServerSocket = socketFactory({
			ioSocket : ServerIOSocket
		});

		return ServerSocket;
	});

	app.controller('adminController', ['$scope','ServerSocket',function($scope, ServerSocket) {
		// console.log("Hola")
		$scope.$on("socket:error", function(ev, data){
			console.log("Event: " + ev);
			console.log("Data: " + data);
		});
	}]);
})();