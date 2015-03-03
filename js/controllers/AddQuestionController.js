/**
 * Created by thangnguyen on 3/2/15.
 */
mainControllers.controller('AddQuestionController',
    ['$http', '$location', 'Authentication', '$scope', '$rootScope', '$cookieStore',
        '$modal', '$window', 'toaster', '$modalInstance', '$stateParams',
        function ($http, $location, Authentication, $scope, $rootScope, $cookieStore,
                  $modal, $window, toaster, $modalInstance, $stateParams) {
            $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
            $scope.myForm = {
                'assignment_number': $cookieStore.get('assignments').length
            };

            $scope.submitTheForm = function () {
                var dataObject = {
                    course_fk: $stateParams.which_class
                    , value: $scope.myForm.value
                    , text: $scope.myForm.text
                };
                console.log(dataObject);
                var responsePromise = $http.post(Authentication.server_url + 'questions/', dataObject, {});
                responsePromise.success(function () {
                    $rootScope.$broadcast('QuestionCreated', dataObject);
                    location.reload();
                    $rootScope.$broadcast('tmp', dataObject);
                    window.location.href = '#question/' + $cookieStore.get('course').pk;
                });
                responsePromise.error(function () {
                    alert("Submitting form failed!");
                    console.log(dataObject);
                });
            }
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            }

        }
    ])
;
