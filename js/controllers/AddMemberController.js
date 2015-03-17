mainControllers.controller('AddMemberController',
    ['$http', '$location', 'Authentication', '$scope', '$rootScope', '$cookieStore',
        '$modal', '$window', 'toaster', '$modalInstance', '$stateParams', 'ass_service',
        function ($http, $location, Authentication, $scope, $rootScope, $cookieStore,
                  $modal, $window, toaster, $modalInstance, $stateParams, ass_service) {
            $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
            $scope.user = Authentication.getAuthenticatedAccount();
            $scope.course = $cookieStore.get('course');
            $scope.team = $cookieStore.get('team');


            $scope.submitTheForm= function(myForm) {

                var dataObject = {
                    which_student: 'STUDENT|' + myForm.member_email,
                    which_team : $scope.team.pk,
                    which_action :'add'
                };
                var responsePromise = $http.put(Authentication.server_url + 'add_team/', dataObject, {});
                responsePromise.success(function () {
                });
                responsePromise.error(function (data) {
                    console.log(data);
                    console.log(dataObject);
                });
                $modalInstance.dismiss('cancel');

            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);