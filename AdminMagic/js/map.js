var app = angular.module('AngularGoogleMap', ['google-maps']);
app.controller('MapCtrl', ['$scope', function ($scope) {
        $scope.map = {
            center: {
                latitude: 4.710989,
                longitude: -74.072092
            },
            zoom: 12,
            markers: [],
            control: {},
            options: {
                scrollwheel: false
            }
        };
    }]);


