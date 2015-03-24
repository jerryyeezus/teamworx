mainControllers.controller('AdminController', ['$http', '$stateParams', 'Authentication',
    '$scope', '$rootScope', '$cookieStore', '$modal', 'toaster',
    function ($http, $stateParams, Authentication, $scope, $rootScope, $cookieStore,
              $modal, toaster) {
        //$scope.the_user = Authentication.getAuthenticatedAccount()['email'];
        //$scope.assignment = $cookieStore.get('assignment');
        //$scope.user = Authentication.getAuthenticatedAccount();
        //$scope.course = $cookieStore.get('course');


        $scope.updateProfile = function (which_field, data, user_type, user_email) {
            var dataObject = {};
            dataObject['which_field'] = which_field;
            dataObject['which_team'] =$scope.team.pk;
            dataObject['which_action'] = 'update';
            dataObject['field_value'] = data;
            dataObject['which_student'] = user_type + '|' + user_email;
            console.log(dataObject);
            console.log('line 23');
            $http.put(Authentication.server_url + 'add_team/', dataObject, {});
            Authentication.updateAuthenticatedAccount(which_field, data);
        };

        $scope.hoverIn = function (team) {
            this.hovered = team;
        };

        $scope.hoverOut = function (team) {
            this.hovered = undefined;
        };

        $scope.enableLFM = function() {
            var dataObject = {};
            dataObject['which_field'] = 'lfm';
            dataObject['which_team'] = $scope.team.pk;
            dataObject['which_action'] = 'update';
            dataObject['field_value'] = true;
            dataObject['which_student'] = $scope.user.user_type + '|' + $scope.user.email;
            var responsePromise = $http.put(Authentication.server_url + 'add_team/', dataObject, {});
            responsePromise.success(function () {
            });
            responsePromise.error(function (data) {
                console.log(data);
                console.log(dataObject);
            });
            toaster.pop('success', 'Enable LFM');
        };

        $scope.disableLFM = function() {
            var dataObject = {};
            dataObject['which_field'] = 'lfm';
            dataObject['which_team'] = $scope.team.pk;
            dataObject['which_action'] = 'update';
            dataObject['field_value'] = false;
            dataObject['which_student'] = $scope.user.user_type + '|' + $scope.user.email;
            var responsePromise = $http.put(Authentication.server_url + 'add_team/', dataObject, {});
            responsePromise.success(function () {
            });
            responsePromise.error(function (data) {
                console.log(data);
                console.log(dataObject);
            });
            toaster.pop('success', 'Disable LFM');
        };
    }]);
