mainControllers.controller('AddGroupController',
    ['$http', '$location', 'Authentication', '$scope', '$rootScope', '$cookieStore',
        '$modal', '$window', 'toaster', '$modalInstance', '$stateParams', 'group_service',
        function ($http, $location, Authentication, $scope, $rootScope, $cookieStore,
                  $modal, $window, toaster, $modalInstance, $stateParams , group_service) {
            $scope.the_user = Authentication.getAuthenticatedAccount();
            $scope.submitTheForm = function () {
                var dataObject = {
                    name: $scope.myForm.team_name,
                    description: $scope.myForm.team_description,
                    which_class: $scope.which_class,
                    which_assignment: $cookieStore.get('assignment_pk'),
                    members:[$scope.the_user.email],
                    owner: "STUDENT|" + $scope.the_user.email
                };

                var responsePromise = $http.post(Authentication.server_url + 'add_team/', dataObject, {});
                responsePromise.success(function () {
                    group_service.pushGroups(dataObject);
                    group_service.setDirty();
                });
                responsePromise.error(function () {
                    alert("Submitting form failed!");
                });
                $modalInstance.dismiss('cancel');
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            }
        }]);
