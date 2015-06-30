var AppServices = angular.module('AppServices', []);

AppServices.factory('DBService', ['$http', function ($http) {
    return {
        getAllList: function (type) {
            return $http.get('api/' + type + 's').then(function (response) {
                return response.data;
            });
        }
        ,
        removeListItem: function (type, item) {
            $http.delete('/api/'+type+'/' + item._id);
        },
        createListItem: function (type, person) {
            $http.post('/api/'+type+'s', person);
        },
        assignPair: function (mentorId, menteeId) {
            $http.put('api/mentor/'+mentorId, {menteeId: menteeId});
        }

    }
}]);