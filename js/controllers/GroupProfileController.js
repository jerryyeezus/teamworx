mainControllers.controller('GroupProfileController', ['$http', '$stateParams', 'Authentication',
    '$scope', '$rootScope', '$cookieStore', '$modal', '$window', 'fileUpload', 'toaster', 'ass_service',
    'group_service',
    function ($http, $stateParams, Authentication, $scope, $rootScope, $cookieStore,
              $modal, $window, $fileUpload, toaster, ass_service, group_service) {
        $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
        $scope.user = Authentication.getAuthenticatedAccount();
        $scope.course = $cookieStore.get('course');
        $scope.team = group_service.getGroup();
        console.log($scope.team);
        $scope.isLFM = $scope.team.lfm;

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

        $scope.isRequest = false;
        $http.get(Authentication.server_url + 'requests/' + $scope.team.pk).then(function (response) {
            $scope.requesters = response.data;
            $scope.requesters.forEach( function(req) {
              if ($scope.user.user_type + '|' + $scope.user.email == req.requester) {
                  $scope.isRequest = true;
              };
            });
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
            });
            responsePromise.error(function () {
                alert("Submitting form failed!");
                console.log(dataObject);
            });
        };

        $scope.isMember = false;

        $scope.team.members.forEach(function (mem) {
            if (mem.email == $scope.user.email) {
                $scope.isMember = true;
            }
        });

        if ($scope.user.user_type == 'INSTRUCTOR') {
            $scope.isMember = false;
        };

        $scope.selectMember = function(member) {
            $scope.member = member;
        };

        $scope.updateGroup = function () {
            $http.get(Authentication.server_url + 'teams/' + ass_service.getAssignmentpk()).then(function (response) {
                $scope.teams = response.data;
            });
        };

        $scope.hoverIn = function() {
            this.hoverEdit = true;
        };

        $scope.hoverOut = function() {
            this.hoverEdit = false;
        };

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

        $scope.myInterval = 1000;
        $scope.cycle = true;

    }]);

