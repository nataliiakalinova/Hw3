var app = angular.module('App', [
    'ngRoute',
    'ngMaterial',
    'List',
    'Pairs',
    'AppServices'
]);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/mentor', {
                templateUrl: 'app/components/list/list.html',
                controller: 'ListCtrl'
            }).
            when('/mentee', {
                templateUrl: 'app/components/list/list.html',
                controller: 'ListCtrl'
            }).
            when('/pairs', {
                templateUrl: 'app/components/pairs/pairs.html',
                controller: 'PairsCtrl'
            }).
            otherwise({
                redirectTo: '/mentor'
            });
    }]);

app.config(['$mdThemingProvider', function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('grey');
}]);