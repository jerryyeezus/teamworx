/**
 *
 * Created by yee on 3/1/15.
 */

mainControllers.controller('QuestionController', ['$http', '$stateParams', 'Authentication',
    '$scope', '$rootScope', '$cookieStore', '$modal', '$window', 'fileUpload', 'toaster',
    'add_question_service', 'edit_question_service',
    function ($http, $stateParams, Authentication, $scope, $rootScope, $cookieStore,
              $modal, $window, $fileUpload, toaster, add_question_service, edit_question_service) {
        $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
        $scope.user = Authentication.getAuthenticatedAccount();
        $scope.course = $cookieStore.get('course');

        $http.get(Authentication.server_url + 'questions/' + $cookieStore.get('assignment_pk')).then(function (response) {
            $scope.questions = response.data;
        });

        $scope.showEditing = false;
        $scope.showAdding = false;

        $scope.startEditing = function (editQuestion) {
            $cookieStore.put('editQuestion', editQuestion);
            $scope.showEditing = true;
            $scope.showAdding = false;
        };

        $scope.startAdding = function() {
            $scope.showAdding = true;
            $scope.showEditing = false;
        };

        $scope.shouldShowEditing = function() {
            return  $scope.showEditing;
        };

        $scope.shouldShowAdding = function() {
            return  $scope.showAdding;
        };

        $scope.submitAddForm = function () {
            console.log('line 41 DO we get there');
            var dataObject = {
                ass_fk: $cookieStore.get('assignment_pk'),
                text: $scope.addFormText
            };

            console.log(dataObject);
            var responsePromise = $http.post(Authentication.server_url + 'questions/', dataObject, {});
            responsePromise.success(function () {
                $scope.updateQuestion();
                add_question_service.setDirty();
            });

            responsePromise.error(function () {
                alert("Submitting form failed!");
                console.log(dataObject);
            });
        };

        $scope.submitEditForm = function () {
            var dataObject = {
                pk: $cookieStore.get('editQuestion').pk,
                value: $scope.editFormText,
                which_action: 'update'
            };

            console.log(dataObject);
            var responsePromise = $http.put(Authentication.server_url + 'question/' + $cookieStore.get('editQuestion').pk, dataObject, {});
            responsePromise.success(function () {
                $scope.updateQuestion();
                edit_question_service.setDirty();
            });

            responsePromise.error(function () {
                alert("Submitting form failed!");
                console.log(dataObject);
            });
        };
        $scope.updateQuestion = function() {
            $http.get(Authentication.server_url + 'questions/' + $cookieStore.get('assignment_pk')).then(function (response) {
                $scope.questions = response.data;
            });
        }


        $scope.startCallback = function(event, ui, ques) {
            console.log('You started draggin: ');
            $cookieStore.put('dragQuestion', ques);
        };

        $scope.beforeDrop = function() {
            var dataObject = {
                pk: $cookieStore.get('editQuestion').pk,
                which_action: 'delete'
            };

            console.log(dataObject);
            var responsePromise = $http.put(Authentication.server_url + 'question/' + $cookieStore.get('dragQuestion').pk, dataObject, {});
            responsePromise.success(function () {
                $scope.updateQuestion();
                edit_question_service.setDirty();
            });

            responsePromise.error(function () {
                alert("Submitting form failed!");
                console.log(dataObject);
            });
        }

        $scope.cancel = function () {
            $scope.showEditing = false;
            $scope.showAdding = false;
        };
    }]);

