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

        $rootScope.$on('QuestionCreated', function (event, mass) {
            toaster.pop('success', 'Questioncreated!')
        });
    }]);

