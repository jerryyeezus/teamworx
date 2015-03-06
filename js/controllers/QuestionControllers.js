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
            console.log($scope.questions[1].text+ ' line 20');
            console.log($scope.questions[1] + ' line 21');
            var question1 = $scope.questions[1].text;
            console.log(myForm.question1+ ' line 22');
            //var i = 1;
            //for (; i <= $scope.questions.length; i++) {
            //    console.log(i + 'line 21');
            //    console.log($scope.questions.length + 'line 22');
            //    console.log(myForm.value + 'line 23');
            //    $scope.answers = $scope.answers.push(myForm.value);
            //}

            var dataObject = {
                course_fk: $stateParams.which_class,
                answer1: myForm.$scope.questions[0].text
                //answer1: formData.question1,
                //answer2: myForm.question2,
                //answer3: myForm.question3,
                //answer4: myForm.question4,
                //answer5: myForm.question5,
                //answer6: myForm.question6,
                //answer7: myForm.question7,
                //answer8: myForm.question8,
                //answer9: myForm.question9,
                //answer10: myForm.question10
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

