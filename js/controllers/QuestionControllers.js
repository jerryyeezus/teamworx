/**
 *
 * Created by yee on 3/1/15.
 */

mainControllers.controller('QuestionController', ['$http', '$stateParams', 'Authentication',
    '$scope', '$rootScope', '$cookieStore', '$modal', '$window', 'fileUpload', 'toaster',
    function ($http, $stateParams, Authentication, $scope, $rootScope, $cookieStore,
              $modal, $window, $fileUpload, toaster) {
        $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
        $scope.user = Authentication.getAuthenticatedAccount();
        $scope.course = $cookieStore.get('course');

        $http.get(Authentication.server_url + 'questions/' + $stateParams.which_class).then(function (response) {
            $scope.questions = response.data;
        });
        $scope.answers = [];
        $scope.submit = function(myForm) {
            var dataObject = {
                course_fk: $stateParams.which_class,
                answer1: myForm.$scope.questions[0].text
            };

            var responsePromise = $http.post(Authentication.server_url + 'add_question/', dataObject, {});
            responsePromise.success(function (dataFromServer, status, headers, config) {
                ass_service.pushAssignment(dataObject);
                ass_service.setAssignmentpk(dataFromServer.pk);
                ass_service.setDirty();
            });
            responsePromise.error(function (data, status, headers, config) {
                alert('bad')
            });
            $modalInstance.dismiss('cancel');
        };
    }]);

