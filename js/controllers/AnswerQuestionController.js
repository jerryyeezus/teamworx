/**
 * Created by thangnguyen on 3/2/15.
 */
mainControllers.controller('AnswerQuestionController',
    ['$http', '$location', 'Authentication', '$scope', '$cookieStore',
        '$window', 'toaster', '$stateParams', 'question_service', 'ass_service',
        function ($http, $location, Authentication, $scope, $cookieStore,
                  $window, toaster, $stateParams, question_service, ass_service) {
            $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
            $scope.num_stars = 5;

            $http.get(Authentication.server_url + 'questions/' + $cookieStore.get('assignment_pk')).then(function (response) {
                $scope.questions = response.data;
                for (var i = 0; i < response.data.length; i++) {
                    $scope.questions[i].answer = 0; // TODO
                }
            });

            //$http.get(Authentication.server_url + 'answers/' + $cookieStore.get('assignment_pk')).then(function (response) {
            //    $scope.answers = response.data;
            //});

            $scope.hoveringOver = function (value) {
                $scope.overStar = value;
                $scope.percent = 100 * (value / $scope.num_stars);
            };

            $scope.submit = function (answers) {
                var i = 0;
                for (; i < answers.length; i++) {
                    var dataObj = {
                        question_fk: answers[0].pk,
                        user_fk: 'STUDENT|' + $scope.the_user,
                        value: answers[i].answer == undefined ? 0 : answers[i].answer,
                        weight: 1 // TODO
                    };

                    var promise = $http.post(Authentication.server_url + 'answer/', dataObj);
                    promise.success(function () {
                        // TODO toaster, go back to main screen
                        alert('good. TODO service')
                    });
                    promise.error(function(a,b,c,d) {
                        console.log(a)
                        console.log(b)
                        console.log(c)
                    })
                }
            };
        }]);



