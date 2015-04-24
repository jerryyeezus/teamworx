mainControllers.controller('TeamOverviewController', ['$http', '$stateParams', 'Authentication',
    '$scope', '$rootScope', '$cookieStore',
    function ($http, $stateParams, Authentication, $scope, $rootScope, $cookieStore) {
        $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
        $scope.assignment = $cookieStore.get('assignment');
        $scope.user = Authentication.getAuthenticatedAccount();
        $scope.course = $cookieStore.get('course');
        $scope.myInterval = 1000;

        $http.get(Authentication.server_url + 'teams/' + $cookieStore.get('assignment_pk')).then(function (response) {
            $scope.teams = response.data;
            if ($scope.teams.length > 0) {
                $scope.teams.forEach(function (team) {
                    if (team.members.length > 0) {
                        team.members.forEach(function (mem) {
                            if (mem != undefined && mem.email == $scope.user.email) {
                                $scope.haveGroupFlag = true;
                                $scope.myTeam = team;
                                $scope.team = $scope.myTeam;
                            };
                        });
                    };
                });
            };
        });

    }]);
