/**
 * Created by thangnguyen on 3/2/15.
 */
mainControllers.controller('AddQuestionController',
    ['$http', '$location', 'Authentication', '$scope', '$rootScope', '$cookieStore',
        '$modal', '$window', 'toaster', '$modalInstance', '$stateParams', 'question_service',
        function ($http, $location, Authentication, $scope, $rootScope, $cookieStore,
                  $modal, $window, toaster, $modalInstance, $stateParams, question_service) {
            $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
            $http.get(Authentication.server_url + 'questions/' + $stateParams.which_class).then(function (response) {
                $scope.questions = response.data;
            });

            $scope.submitTheForm = function () {
                var dataObject = {
                    course_fk: $stateParams.which_class
                    , value: $scope.questions.length + 1
                    , text: $scope.myForm.text
                };
                console.log(dataObject);
                var responsePromise = $http.post(Authentication.server_url + 'questions/', dataObject, {});
                responsePromise.success(function () {
                    question_service.pushQuestions(dataObject);
                    question_service.setDirty();
                });
                responsePromise.error(function () {
                    alert("Submitting form failed!");
                    console.log(dataObject);
                })
                $modalInstance.dismiss('cancel');
            }
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            }

        }
    ])
;
