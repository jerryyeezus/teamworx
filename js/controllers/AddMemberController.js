/**
 * Created by thangnguyen on 3/8/15.
 */

/**
 * Created by yee on 3/1/15.
 */

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
                    $scope.updateGroup();
                });
                responsePromise.error(function (data) {
                    console.log(data);
                    console.log(dataObject);
                });
                $modalInstance.dismiss('cancel');
                toaster.pop('success', 'Successfully Added');

            };

            //if ($cookieStore.get('team').members[$cookieStore.get('team').members.length - 1]
            //    == ('STUDENT|' + $cookieStore.get('user_email')))
            //    $scope.isOwner = true
            //else $scope.isOwner = false;
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            }
            $scope.updateGroup = function () {
                $http.get(Authentication.server_url + 'teams/' + ass_service.getAssignmentpk()).then(function (response) {
                    $scope.teams = response.data;
                });
            };
        }]);