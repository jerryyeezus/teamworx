mainControllers.controller('ViewAssignmentTextController',
    ['$http', '$location', 'Authentication', '$scope', '$rootScope', '$cookieStore',
        '$modal', '$window', 'toaster', '$modalInstance', '$stateParams', 'ass_service',
        function ($http, $location, Authentication, $scope, $rootScope, $cookieStore,
                  $modal, $window, toaster, $modalInstance, $stateParams, ass_service) {
            $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
            $scope.assignment = $cookieStore.get('assignment');
            console.log($scope.assignment.assignment_text);
            $modalInstance.dismiss('cancel');
        }]);
