/**
 * Created by thangnguyen on 3/2/15.
 */
mainControllers.controller('GroupProfileController', ['$http', '$stateParams', 'Authentication',
    '$scope', '$rootScope', '$cookieStore', '$modal', '$window', 'fileUpload', 'toaster', 'ass_service',
    function ($http, $stateParams, Authentication, $scope, $rootScope, $cookieStore,
              $modal, $window, $fileUpload, toaster, ass_service) {
        $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
        $scope.user = Authentication.getAuthenticatedAccount();
        $scope.course = $cookieStore.get('course');
        $scope.assignment = $cookieStore.get('assignment');
        $scope.team = $cookieStore.get('team');
        $scope.selectStudent = function(member) {
            $cookieStore.put('member', member);
            console.log($scope.assignment_pk);
            window.location.href = "#studentProfile";
        }
    }]);

