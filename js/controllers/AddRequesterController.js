mainControllers.controller('AddRequesterController',
    ['$http', '$location', 'Authentication', '$scope',
        '$rootScope', '$cookieStore', '$modal', '$window', 'toaster', '$modalInstance', 'add_requester_service',
        function ($http, $location, Authentication, $scope,
                  $rootScope, $cookieStore, $modal, $window, toaster, $modalInstance, add_requester_service) {


            $scope.requester = add_requester_service.getCurrentRequester();
            $scope.team = add_requester_service.getMyTeam();
            $scope.req = [];

            $scope.updateRequester = function() {
                $http.get(Authentication.server_url + 'requests/' + $scope.team.pk).then(function (response) {
                    $scope.requesters = response.data;
                });
            };

            $scope.ok = function () {

                $http.get(Authentication.server_url + 'requests/' + $scope.team.pk).then(function (response) {
                    $scope.requesters = response.data;
                    $scope.requesters.forEach( function(req) {
                        if ($scope.requester.user_type + '|' + $scope.requester.email == req.requester) {
                            $scope.req = req;
                            var dataObject1 = {which_request: $scope.req.pk};

                            console.log(dataObject1);
                            var responsePromise = $http.put(Authentication.server_url + 'add_request/', dataObject1);
                            responsePromise.success(function () {
                                $scope.updateRequester();
                            });
                            responsePromise.error(function () {
                                console.log(dataObject);
                            });
                        };
                    });
                });

                var dataObject = {
                    which_student: $scope.requester.user_type +'|' + $scope.requester.email,
                    which_team : $scope.team.pk,
                    which_action :'add'
                };

                var responsePromise = $http.put(Authentication.server_url + 'add_team/', dataObject, {});
                responsePromise.success(function () {
                    add_requester_service.setDirty();
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
