/**
 * Created by thangnguyen on 3/13/15.
 */
/**
 * Created by thangnguyen on 3/13/15.
 */
/**
 * Created by thangnguyen on 3/11/15.
 */
mainControllers.controller('DeleteTeamMemberController',
    ['$http', '$location', 'Authentication', '$scope',
        '$rootScope', '$cookieStore', '$modal', '$window', 'toaster', '$modalInstance', 'delete_team_member_service',
        function ($http, $location, Authentication, $scope,
                  $rootScope, $cookieStore, $modal, $window, toaster, $modalInstance, delete_team_member_service) {
            $scope.dragStudent = $cookieStore.get('dragStudent');
            $scope.dragTeam = $cookieStore.get('dragTeam');
            $scope.course = $cookieStore.get('course');

            $scope.ok = function () {

                var dataObject = {
                    which_student: $scope.dragStudent.user_type + '|' + $scope.dragStudent.email,
                    which_team : $scope.dragTeam.pk,
                    which_action :'remove'
                };
                var responsePromise = $http.put(Authentication.server_url + 'add_team/', dataObject, {});
                    responsePromise.success(function () {
                    delete_team_member_service.setDirty();
                });
                responsePromise.error(function (data) {
                    console.log(data);
                    console.log(dataObject);
                });

                $modalInstance.close();
                $modalInstance.dismiss('cancel');
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);
