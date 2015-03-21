mainControllers.controller('ViewNotificationController',
    ['$http', '$location', 'Authentication', '$scope', '$rootScope', '$cookieStore',
        '$modal', '$window', 'toaster', '$modalInstance',
        function ($http, $location, Authentication, $scope, $rootScope, $cookieStore,
                  $modal, $window, toaster, $modalInstance) {
        $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
        $scope.user = Authentication.getAuthenticatedAccount();
        $scope.course = $cookieStore.get('course');
        $scope.notificationList = [];
        $scope.allNotifications = [];
        $http.get(Authentication.server_url + 'notifications/').then(function(response) {
            $scope.allNotifications = response;
            $scope.allNotifications.data.forEach(function (notification) {
                if (notification.to_user == $scope.user.user_type + '|' + $scope.user.email) {
                        $scope.notificationList.push(notification);
                };
            });
        });
        $modalInstance.dismiss('cancel');
    }]);
