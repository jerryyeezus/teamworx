/**
 * Created by thangnguyen on 3/2/15.
 */
mainControllers.controller('GroupProfileController', ['$http', '$stateParams', 'Authentication',
    '$scope', '$rootScope', '$cookieStore', '$modal', '$window', 'fileUpload', 'toaster', 'ass_service',
    function ($http, $stateParams, Authentication, $scope, $rootScope, $cookieStore,
              $modal, $window, $fileUpload, toaster, ass_service) {
        $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
        $scope.user = Authentication.getAuthenticatedAccount();
        $scope.course = $cookieStore.get('course');
        $scope.team = $cookieStore.get('team');
        console.log($scope.team.pk + 'line 12');


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

        $http.get(Authentication.server_url + 'requests/' + $scope.team.pk).then(function (response) {
            $scope.requesters = response.data;
        });


        $scope.sendJoinRequest = function() {

            var dataObject = {};


            dataObject['team'] = $scope.team.pk;
            dataObject['requester'] = 'STUDENT|' + $scope.user.email;
            console.log(dataObject);

            var responsePromise = $http.post(Authentication.server_url + 'add_request/', dataObject, {});
            responsePromise.success(function () {
                $scope.updateGroup();
            });
            responsePromise.error(function (data) {
                console.log(data);
                console.log(dataObject);
            });
            toaster.pop('success', 'Requested');

        };

        $scope.acceptRequest = function(req) {

            var dataObject = {
                which_student: req.requester,
                which_team : $scope.team.pk,
                which_action :'add'
            };

            console.log(dataObject);
            var responsePromise = $http.put(Authentication.server_url + 'add_team/', dataObject, {});
            responsePromise.success(function () {
                $scope.updateGroup();
            });
            responsePromise.error(function (data) {
                console.log(data);
                console.log(dataObject);
            });


            var dataObject1 = {which_request : req.pk};

            console.log(dataObject1);
            var responsePromise = $http.put(Authentication.server_url + 'add_request/', dataObject1);
            responsePromise.success(function () {
                $scope.updateGroup();

            });
            responsePromise.error(function (data, status, headers, config) {
                alert("Submitting form failed!");
                console.log(dataObject);
            });

            toaster.pop('success', 'Accepted');
        };

        console.log($cookieStore.get('team').members[$cookieStore.get('team').members.length - 1].email + 'line 50');
        console.log($cookieStore.get('user_email') + 'line 51');
        if ($cookieStore.get('team').members[$cookieStore.get('team').members.length - 1].email
            == $cookieStore.get('user_email')) {
            $scope.isOwner = true;
            console.log($scope.isOwner + 'line 55');
            } else {$scope.isOwner = false;}


        $scope.isMember = false;
        var i = 0;
        for (; i < $scope.team.members.length; i++) {
            if($cookieStore.get('user_email') == $scope.team.members[i].email) {
                $scope.isMember = true;
            }
        }
        if ($scope.user.user_type == 'INSTRUCTOR') {
            $scope.isMember = true;
        }

        $scope.selectMember = function(member) {
            $cookieStore.put('member', member);
        }
        $scope.updateGroup = function () {
            $http.get(Authentication.server_url + 'teams/' + ass_service.getAssignmentpk()).then(function (response) {
                $scope.teams = response.data;
            });
        };
    }]);

