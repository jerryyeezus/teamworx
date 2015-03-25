mainControllers.controller('DeleteRequesterController',
    ['$http', '$location', 'Authentication', '$scope', '$rootScope', '$cookieStore', '$modal', '$window', 'toaster',
        '$modalInstance', 'delete_team_member_service', 'delete_requester_service',
        function ($http, $location, Authentication, $scope,
                  $rootScope, $cookieStore, $modal, $window, toaster, $modalInstance, delete_team_member_service,
                  delete_requester_service) {
            $scope.user = Authentication.getAuthenticatedAccount();
            $scope.requester = delete_requester_service.getCurrentRequester();
            $scope.team = delete_requester_service.getMyTeam();
            $scope.delMemberFlag = delete_requester_service.getDelMemberFlag();
            $scope.deleteRequesterFlag = delete_requester_service.getDeleteRequesterFlag();


            console.log($scope.deleteRequesterFlag);
            $scope.myForm = {};
            $scope.ok = function (myForm) {

                if ($scope.deleteRequesterFlag) {
                    $http.get(Authentication.server_url + 'requests/' + $scope.team.pk).then(function (response) {
                        $scope.requesters = response.data;
                        $scope.requesters.forEach( function(req) {
                            if ($scope.requester.user_type + '|' + $scope.requester.email == req.requester) {
                                $scope.req = req;
                                var dataObject1 = {which_request : $scope.req.pk};

                                console.log(dataObject1);
                                var responsePromise = $http.put(Authentication.server_url + 'add_request/', dataObject1);
                                responsePromise.success(function () {
                                });
                                responsePromise.error(function () {
                                    console.log(dataObject);
                                });
                            };
                        });

                    });

                    delete_requester_service.setDeleteRequesterFlag(false);

                    var dataObject = {};
                    dataObject['message'] = $scope.myForm.delReq;
                    dataObject['from_user'] = $scope.user.user_type + '|' +$scope.user.email;
                    dataObject['to_user'] = $scope.requester.user_type + '|' + $scope.requester.email;
                    var responsePromise = $http.post(Authentication.server_url + 'notifications/', dataObject, {});
                    responsePromise.success( function() {
                        delete_team_member_service.setDirty();
                    })
                    responsePromise.error(function() {
                        console.log(dataObject);
                    })
                };


                if ($scope.delMemberFlag) {
                    var dataObject = {
                        which_student: $scope.requester.user_type + '|' + $scope.requester.email,
                        which_team: $scope.team.pk,
                        which_action: 'remove'
                    };
                    var responsePromise = $http.put(Authentication.server_url + 'add_team/', dataObject, {});
                    responsePromise.success(function () {
                    });
                    responsePromise.error(function (data) {
                        console.log(data);
                        console.log(dataObject);
                    });
                    ($cookieStore.put('delMem', false));

                    var dataObject = {};
                    dataObject['message'] = $scope.myForm.delMem;
                    dataObject['from_user'] = $scope.user.user_type + '|' +$scope.user.email;
                    dataObject['to_user'] = $scope.requester.user_type + '|' + $scope.requester.email;
                    var responsePromise = $http.post(Authentication.server_url + 'notifications/', dataObject, {});
                    responsePromise.success( function() {
                        delete_team_member_service.setDirty();
                    })
                    responsePromise.error(function() {
                        console.log(dataObject);
                    })
                };

                $modalInstance.close();
                $modalInstance.dismiss('cancel');
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);

