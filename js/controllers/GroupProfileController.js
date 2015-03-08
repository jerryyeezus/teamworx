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
        $scope.requesters = ["peter@gatech.edu", "joe@gatech.edu"];
        $scope.sendGroupRequest = function(requester) {
            var dataObject = {
                email: requester,
                team_pk: $scope.team.pk
            };
            var responsePromise = $http.post(Authentication.server_url + 'group_request/', dataObject, {});
            responsePromise.success(function () {
            });
            responsePromise.error(function (data) {
                console.log(data);
                console.log(dataObject);
            });
            toaster.pop('success', 'Successfully Requested');
        };

        $scope.acceptRequest = function(requester) {
            var dataObject = {
                email: requester,
                team_pk: $scope.team.pk
            };
            var responsePromise = $http.post(Authentication.server_url + 'group_accept/', dataObject, {});
            responsePromise.success(function () {
                $scope.updateGroup();
            });
            responsePromise.error(function (data) {
                console.log(data);
                console.log(dataObject);
            });
            toaster.pop('success', 'Successfully Accepted');
        };

        console.log($scope.team.members[$scope.team.members.length-1]);
        console.log(('STUDENT|' + $cookieStore.get('user_email')));

        if ($cookieStore.get('team').members[$cookieStore.get('team').members.length - 1]
            == ('STUDENT|' + $cookieStore.get('user_email')))
            $scope.isOwner = true

        else $scope.isOwner = false;


        $scope.isMember = false;
        var i = 0;
        for (; i < $scope.team.members.length; i++) {
            if($cookieStore.get('user_email') == $scope.team.members[i].email) {
                $scope.isMember = true;
            }
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

