'use strict';

var Pairs = angular.module('Pairs', []);

Pairs.controller('PairsCtrl', ['$scope', 'DBService', function ($scope, DBService) {

    $scope.mentors = [];
    $scope.mentees = [];
    $scope.allMentees = [];
    $scope.pairs = [];

    var getAll = function () {

        DBService.getAllList('mentor').then(function (data) {
            $scope.mentors = data;

            getMentees();
        });

    };

    var getMentees = function () {
        DBService.getAllList('mentee').then(function (data) {
            $scope.allMentees = data;
            $scope.mentees = $scope.allMentees.filter(function(item) {
                return !item.mentor;
            });
            getPairs();
        });
    };

    var getPairs = function () {
        $scope.pairs = $scope.mentors.map(function (item) {
            if (!item.mentees) return {};

            return {
                name: item.name + " " + item.surname,
                mentees: item.mentees.map(function (item) {
                    return getById(item);
                })
            };
        });
    };

    var getById = function(id){
        var res = "";
        $scope.allMentees.forEach(function (item) {
            if (item._id === id) {
                res = item.name + " " + item.surname;
            }
        });

        return res;
    };

    $scope.assign = function () {
        DBService.assignPair($scope.mentor._id, $scope.mentee._id);
        getAll();
    };

    getAll();

}]);
