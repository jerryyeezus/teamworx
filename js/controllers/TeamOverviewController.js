mainControllers.controller('TeamOverviewController', ['$http', '$stateParams', 'Authentication',
    '$scope', '$rootScope', '$cookieStore', '$modal',
    function ($http, $stateParams, Authentication, $scope, $rootScope, $cookieStore,
              $modal) {
        $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
        $scope.assignment = $cookieStore.get('assignment');
        $scope.user = Authentication.getAuthenticatedAccount();
        $scope.course = $cookieStore.get('course');


    }]);
