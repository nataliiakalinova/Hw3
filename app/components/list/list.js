'use strict';

var List = angular.module('List', []);


List.controller('ListCtrl', ['$scope', '$location', 'DBService', function ($scope, $location, DBService) {

    var path = $location.path(),

        type = (path.indexOf('mentor') !== -1) ? 'mentor' : 'mentee',

        getAll = function () {
           DBService.getAllList(type).then(function (data) {
               $scope.list = data;
           });
        };
    $scope.type = type.toUpperCase();
    $scope.isMentor = (type.indexOf('mentor')!== -1);

    getAll();

    $scope.createItem = function () {
        DBService.createListItem(type, $scope.person);
        $scope.person = {};
        getAll();
    };


    $scope.deleteItem = function (item) {
        DBService.removeListItem(type, item);
        getAll();
    };
}]);
