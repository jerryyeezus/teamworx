mainControllers.controller('ViewRequestController', ['$http', '$stateParams', 'Authentication',
    '$scope', '$rootScope', '$cookieStore', '$modal', '$window', 'fileUpload', 'toaster', 'ass_service',
    'accept_team_service', 'request_team_service', 'deny_team_service',
    function ($http, $stateParams, Authentication, $scope, $rootScope, $cookieStore,
              $modal, $window, $fileUpload, toaster, ass_service, accept_team_service,
              request_team_service, deny_team_service) {
        $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
        $scope.user = Authentication.getAuthenticatedAccount();
        $scope.course = $cookieStore.get('course');
        $scope.team = $cookieStore.get('team');


        $http.get(Authentication.server_url + 'requests/' + $scope.team.pk).then(function (response) {
            $scope.requesters = response.data;
        });

        $scope.denyJoinRequest = function() {
            $scope.showRequestButton = false;
        };

        $scope.sendJoinRequest = function() {

            var dataObject = {};


            dataObject['team'] = $scope.team.pk;
            dataObject['requester'] = 'STUDENT|' + $scope.user.email;
            console.log(dataObject);

            var responsePromise = $http.post(Authentication.server_url + 'add_request/', dataObject, {});
            responsePromise.success(function () {
                request_team_service.setDirty();
            });
            responsePromise.error(function (data) {
                console.log(data);
                console.log(dataObject);
            });
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
                accept_team_service.setDirty();
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
        };

        $scope.isMember = false;
        console.log($scope.team.members);
        console.log('line 104');

        var i = 0;
        for (; i < $scope.team.members.length; i++) {
            if('STUDENT|' + $cookieStore.get('user_email') == $scope.team.members[i]) {
                $scope.isMember = true;
                console.log( $scope.isMember);
                console.log('line 104');
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

