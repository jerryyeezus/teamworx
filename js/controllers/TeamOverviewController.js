mainControllers.controller('TeamOverviewController', ['$http', '$stateParams', 'Authentication',
    '$scope', '$rootScope', '$cookieStore',
    function ($http, $stateParams, Authentication, $scope, $rootScope, $cookieStore) {
        $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
        $scope.assignment = $cookieStore.get('assignment');
        $scope.user = Authentication.getAuthenticatedAccount();
        $scope.course = $cookieStore.get('course');
        $scope.myInterval = 1000;
        $scope.cycle = true;

    }]);
