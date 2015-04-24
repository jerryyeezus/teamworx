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
                    var dataObject = {};
                    dataObject['ass_fk'] = $cookieStore.get('assignment_pk');
                    dataObject['lo'] = 1;
                    dataObject['hi'] = 5;
                    dataObject['text'] = "How do you prefer Project " + $scope.myForm.project_name;
                    var responsePromise = $http.post(Authentication.server_url + 'questions/', dataObject, {});
                    responsePromise.success(function () {
                        $scope.updateQuestion();
                        add_question_service.setDirty();
                    });

                    responsePromise.error(function (a, b) {
                        alert("Submitting form failed!");
                        console.log(dataObject);
                        console.log(a);
                        console.log(b);
                    });
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
