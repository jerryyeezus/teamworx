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
        //$cookieStore.put('requesters',[]);
        $scope.requesters = $cookieStore.get('requesters');

        $scope.sendJoinRequest = function() {
            var newrequest;
            newrequest = [$cookieStore.get('user_email'), $scope.team.pk];
            if ($scope.requesters.indexOf(newrequest) == -1) {
                $scope.requesters.push(newrequest);
            }
            $cookieStore.put('requesters', $scope.requesters);
            toaster.pop('success', 'Successfully Request');
        };

        $scope.acceptRequest = function(requester) {
            $scope.requesters = $cookieStore.get('requesters');
            var index = $scope.requesters.indexOf(requester);
            console.log(index + 'line 29');

            if (index > -1) {
                $scope.requesters.splice(index,1);
            }
            var dataObject = {
                which_student: 'STUDENT|' + requester[0],
                which_team : $scope.team.pk,
                which_action :'add'
            };
            var responsePromise = $http.put(Authentication.server_url + 'add_team/', dataObject, {});
            responsePromise.success(function () {
                $scope.updateGroup();
            });
            responsePromise.error(function (data) {
                console.log(data);
                console.log(dataObject);
            });
            toaster.pop('success', 'Successfully Accepted');
        };

        if ($cookieStore.get('team').members[$cookieStore.get('team').members.length - 1].email
            == $cookieStore.get('user_email'))
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

