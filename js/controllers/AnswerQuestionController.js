/**
 * Created by thangnguyen on 3/2/15.
 */
mainControllers.controller('AnswerQuestionController',
    ['$http', '$location', 'Authentication', '$scope', '$cookieStore',
        '$window', 'toaster', '$stateParams', 'question_service', 'ass_service', '$state', 'answer_service',
        function ($http, $location, Authentication, $scope, $cookieStore,
                  $window, toaster, $stateParams, question_service, ass_service, $state, answer_service) {
            $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
            $scope.num_stars = 5;

            $http.get(Authentication.server_url + 'questions/' + $cookieStore.get('assignment_pk'))
                .then(function (response) {
                    $scope.questions = response.data;
                    var i = 0;
                    for (; i < response.data.length; i++) {
                        var tmp = response.data[i];

                        // Nested request
                        $http.get(Authentication.server_url + 'answer/' + response.data[i].pk + '/' + $scope.the_user)
                            .then(function (answer_resp) {
                                tmp.answer = answer_resp.data[0].value;
                                tmp.weight = answer_resp.data[0].weight;
                            });

                        $scope.questions[i] = tmp;
                    }
                });


            $scope.hoveringOver = function (value) {
                $scope.overStar = value;
                $scope.percent = 100 * (value / $scope.num_stars);
            };

            $scope.submit = function (answers) {
                var i = 0, callbacks = 0;
                for (; i < answers.length; i++) {
                    var dataObj = {
                        question_fk: answers[0].pk,
                        user_fk: 'STUDENT|' + $scope.the_user,
                        value: answers[i].answer == undefined ? 0 : answers[i].answer,
                        weight: 1 // TODO
                    };

                    var promise = $http.put(Authentication.server_url + 'answer/', dataObj);
                    promise.success(function () {
                        callbacks++;
                        if (callbacks >= answers.length) {
                            answer_service.setDirty();
                            $state.go('^');
                        }
                    });
                    promise.error(function (a, b, c, d) {
                        console.log(a)
                        console.log(b)
                        console.log(c)
                    })
                }
            };
        }]);



