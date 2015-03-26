mainControllers.controller('AddProjectController',
    ['$http', '$location', 'Authentication', '$scope', '$rootScope', '$cookieStore',
        '$modal', '$window', 'toaster', '$modalInstance', '$stateParams', 'ass_service', 'add_project_service',
        function ($http, $location, Authentication, $scope, $rootScope, $cookieStore,
                  $modal, $window, toaster, $modalInstance, $stateParams, ass_service, add_project_service) {
            $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
            $http.get(Authentication.server_url + 'add_project' + ass_service.getAssignment.pk).success(function(response) {
                $scope.projects = response;
                $scope.myForm = {
                    'project_number': $scope.projects.length + 1
                };
            });

            $scope.submit = function () {
                var dataObject = {};
                dataObject['ass_fk'] = ass_service.getAssignment.pk;
                dataObject['project_number'] = $scope.myForm.project_number;
                dataObject['project_title'] = $scope.myForm.project_title;
                dataObject['project_text'] = $scope.myForm.project_text;


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
