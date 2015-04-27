mainControllers.controller('CredentialsController', ['$location', '$scope', 'Authentication', function ($location, $scope, Authentication) {
    activate();
    $scope.formData = {
        'the_email': 'thang@gatech.edu',
        'password': 'pass',
        'user_type': 'STUDENT'
    };

    $scope.clearData = function (which) {
        $scope.formData[which] = '';
    };

    function activate() {
        if (Authentication.isAuthenticated()) {
            // TODO check if user is also in login
            //$location.url('/portal');
        }
    };

    $scope.register = function (formData2) {
        Authentication.register(formData2);
    };

    $scope.login = function (formData) {
        Authentication.login(formData)
    };
}]);
