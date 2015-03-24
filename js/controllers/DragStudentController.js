mainControllers.controller('DragStudentController',
    ['$http', '$location', 'Authentication', '$scope',
        '$rootScope', '$cookieStore', '$modal', '$window', 'toaster', '$modalInstance', 'drag_student_service',
        function ($http, $location, Authentication, $scope,
                  $rootScope, $cookieStore, $modal, $window, toaster, $modalInstance, drag_student_service) {



            $scope.dragStudent = drag_student_service.getDragStudent();
            $scope.dropTeam = drag_student_service.getDropTeam();
            $scope.dragTeam = drag_student_service.getDragTeam();
            $scope.sameTeamFlag = drag_student_service.getSameTeamFlag();
            $scope.course = $cookieStore.get('course');


            $scope.ok = function () {
                if (!$scope.sameTeamFlag) {
                    var dataObject = {
                        which_student: $scope.dragStudent.user_type + '|' + $scope.dragStudent.email,
                        which_team: $scope.dragTeam.pk,
                        which_action: 'remove'
                    };
                    var responsePromise = $http.put(Authentication.server_url + 'add_team/', dataObject, {});
                    responsePromise.success(function () {
                    });
                    responsePromise.error(function (data) {
                        console.log(data);
                        console.log(dataObject);
                    });


                    var dataObject = {
                        which_student: $scope.dragStudent.user_type + '|' + $scope.dragStudent.email,
                        which_team: $scope.dropTeam.pk,
                        which_action: 'add'
                    };
                    var responsePromise = $http.put(Authentication.server_url + 'add_team/', dataObject, {});
                    responsePromise.success(function () {
                        drag_student_service.setDirty();
                    });
                    responsePromise.error(function (data) {
                        console.log(data);
                        console.log(dataObject);
                    });
                }

                $modalInstance.close();
                $modalInstance.dismiss('cancel');
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);

