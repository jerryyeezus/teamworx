mainControllers.controller('StudentProfileController', ['$http', '$stateParams', 'Authentication',
    '$scope', '$rootScope', '$cookieStore',
    function ($http, $stateParams, Authentication, $scope, $rootScope, $cookieStore) {
        $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
        $scope.user = Authentication.getAuthenticatedAccount();
        $scope.course = $cookieStore.get('course');
        $scope.assignment = $cookieStore.get('assignment');
        $scope.team = $cookieStore.get('team');
        $scope.student = $cookieStore.get('student');
        $scope.member = $cookieStore.get('member');
    }]);
