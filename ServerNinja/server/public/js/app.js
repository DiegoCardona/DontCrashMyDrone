(function() {
	var app = angular.module('dcmdAdmin', ['socket-io']);

	// app.config(["$socketProvider", function ($socketProvider) {
 //      $socketProvider.setUrl("http://localhost:3000");
 //    }]);

	app.controller('adminController', ['$scope','socket',function($scope, socket) {
		// console.log("Hola")
		socket.emit("testConnection", "hola");

		socket.on("confirmedConnection", function (data){
			console.log("Hola " + data);
		})
	}]);
})();