mainControllers.controller('StudentProfileController', ['$http', '$stateParams', 'Authentication',
    '$scope', '$rootScope', '$cookieStore',
    function ($http, $stateParams, Authentication, $scope, $rootScope, $cookieStore) {
        $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
        $scope.user = Authentication.getAuthenticatedAccount();
        $scope.course = $cookieStore.get('course');
        $scope.assignment = $cookieStore.get('assignment');
        $scope.team = $cookieStore.get('team');
        $scope.current_student = $cookieStore.get('current_student');
        $scope.current_member = $cookieStore.get('current_member');
        $scope.selectStudent = function (stud) {
            $cookieStore.put('current_student', stud);
            $scope.current_student = stud;
            $cookieStore.put('current_member', stud);
            $scope.current_member = stud;
        };
    }]);
