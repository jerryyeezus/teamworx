mainControllers.controller('DeleteTeamMemberController',
    ['$http', '$location', 'Authentication', '$scope',
        '$rootScope', '$cookieStore', '$modal', '$window', 'toaster', '$modalInstance', 'delete_team_member_service',
        'delete_group_service',
        function ($http, $location, Authentication, $scope,
                  $rootScope, $cookieStore, $modal, $window, toaster, $modalInstance, delete_team_member_service,
                  delete_group_service) {

            $scope.course = $cookieStore.get('course');
            $scope.dragStudent = delete_team_member_service.getDragStudent();
            $scope.dragTeam = delete_team_member_service.getDragTeam();
            $scope.delMemberFlag = delete_team_member_service.getDelMemberFlag();
            $scope.delTeamFlag = delete_team_member_service.getDelTeamFlag();
            $scope.dragStudentRosterFlag = delete_team_member_service.getDragStudentRosterFlag();

            console.log($scope.delMemberFlag);

            $scope.ok = function () {
                if(!$scope.dragStudentRosterFlag) {
                    if ($scope.delMemberFlag) {
                        var dataObject = {
                            which_student: $scope.dragStudent.user_type + '|' + $scope.dragStudent.email,
                            which_team: $scope.dragTeam.pk,
                            which_action: 'remove'
                        };
                        var responsePromise = $http.put(Authentication.server_url + 'add_team/', dataObject, {});
                        responsePromise.success(function () {
                            delete_team_member_service.setDirty();
                        });
                        responsePromise.error(function (data) {
                            console.log(data);
                            console.log(dataObject);
                        });

                        delete_team_member_service.setDelMemberFlag(false);
                    }

                    if ($scope.delTeamFlag) {
                        var dataObject = {
                            which_team: $scope.dragTeam.pk,
                            which_action: 'remove'
                        };
                        var responsePromise = $http.put(Authentication.server_url + 'team/', dataObject, {});
                        responsePromise.success(function () {
                            delete_group_service.setDirty();
                        });
                        responsePromise.error(function (data) {
                            console.log(data);
                            console.log(dataObject);
                        });
                        delete_team_member_service.setDelTeamFlag(false);
                    };
                };

                $modalInstance.close();
                $modalInstance.dismiss('cancel');
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);

