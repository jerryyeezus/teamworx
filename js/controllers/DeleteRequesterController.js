/**
 * Created by thangnguyen on 3/17/15.
 */
mainControllers.controller('DeleteRequesterController',
    ['$http', '$location', 'Authentication', '$scope',
        '$rootScope', '$cookieStore', '$modal', '$window', 'toaster', '$modalInstance', 'delete_team_member_service',
        'delete_requester_service',
        function ($http, $location, Authentication, $scope,
                  $rootScope, $cookieStore, $modal, $window, toaster, $modalInstance, delete_team_member_service,
                  delete_group_service, delete_requester_service) {
            $scope.requester = $cookieStore.get('currentRequester');
            $scope.deleteMember = $cookieStore.get('deleteMember');
            $scope.team = $cookieStore.get('myTeam');

            $scope.delMember = $cookieStore.get('deleteMember');
            $scope.delRequester = $cookieStore.get('deleteRequester');

            $scope.ok = function () {

                if ($cookieStore.get('deleteRequester')) {
                    $http.get(Authentication.server_url + 'requests/' + $scope.team.pk).then(function (response) {
                        $scope.requesters = response.data;
                        $scope.requesters.forEach( function(req) {
                            if ($scope.requester.user_type + '|' + $scope.requester.email == req.requester) {
                                $scope.req = req;
                            };
                        });
                        var dataObject1 = {which_request : $scope.req.pk};

                        console.log(dataObject1);
                        var responsePromise = $http.put(Authentication.server_url + 'add_request/', dataObject1);
                        responsePromise.success(function () {
                            delete_team_member_service.setDirty();
                        });
                        responsePromise.error(function () {
                            console.log(dataObject);
                        });
                    });
                    ($cookieStore.put('deleteRequester', false));
                };


                if ($cookieStore.get('delMem')) {
                    var dataObject = {
                        which_student: $scope.deleteMember.user_type + '|' + $scope.deleteMember.email,
                        which_team: $scope.team.pk,
                        which_action: 'remove'
                    };
                    var responsePromise = $http.put(Authentication.server_url + 'add_team/', dataObject, {});
                    responsePromise.success(function () {
                        delete_team_member_service.setDirty();
                    });
                    responsePromise.error(function (data) {
                        console.log(data);
                        console.log(dataObject);
                    });
                    ($cookieStore.put('delMem', false));
                };




                $modalInstance.close();
                $modalInstance.dismiss('cancel');
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);

