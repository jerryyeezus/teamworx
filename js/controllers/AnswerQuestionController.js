/**
 * Created by thangnguyen on 3/2/15.
 */
mainControllers.controller('AnswerQuestionController',
    ['$http', '$location', 'Authentication', '$scope', '$cookieStore',
        '$window', 'toaster', '$stateParams', 'question_service',
        function ($http, $location, Authentication, $scope, $cookieStore,
                  $window, toaster, $stateParams, question_service) {
            $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
            $http.get(Authentication.server_url + 'questions/' + $cookieStore.get('assignment').assignment_pk).then(function (response) {
                $scope.questions = response.data;
                for (var i = 0; i < response.data.length; i++) {
                    $scope.questions[i].answer = 0;
                }
            });

            $http.get(Authentication.server_url + 'answers/' + $stateParams.which_ass).then(function (response) {
                $scope.answers = response.data;
            });
            $scope.num_stars = 5;

            $scope.hoveringOver = function(value) {
                $scope.overStar = value;
                $scope.percent = 100 * (value / $scope.num_stars);
            };

            $scope.submit = function(answers) {
                console.log(answers);
            }
        }
    ])
;
