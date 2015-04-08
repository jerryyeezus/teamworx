mainControllers.controller('AddProjectController',
    ['$http', '$location', 'Authentication', '$scope', '$rootScope', '$cookieStore',
        '$modal', '$window', 'toaster', '$modalInstance', '$stateParams', 'ass_service', 'add_project_service',
        function ($http, $location, Authentication, $scope, $rootScope, $cookieStore,
                  $modal, $window, toaster, $modalInstance, $stateParams, ass_service, add_project_service) {
            $scope.the_user = Authentication.getAuthenticatedAccount()['email'];

            $scope.submit = function () {
                var dataObject = {};
                dataObject['ass_fk'] = $cookieStore.get('assignment_pk');
                dataObject['description'] = $scope.myForm.project_description;
                dataObject['name'] = $scope.myForm.project_name;

                console.log(dataObject);
                var responsePromise = $http.post(Authentication.server_url + 'add_project/', dataObject, {});
                responsePromise.success(function () {
                    add_project_service.setDirty();
                });
                responsePromise.error(function () {
                    alert('bad')
                });
                $modalInstance.dismiss('cancel');
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);
