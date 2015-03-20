mainControllers.controller('PendingRequestController', ['$http', '$stateParams', 'Authentication',
    '$scope', '$rootScope', '$cookieStore', '$modal',
    function ($http, $stateParams, Authentication, $scope, $rootScope, $cookieStore,
              $modal) {
            $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
            $scope.assignment = $cookieStore.get('assignment');
            $scope.user = Authentication.getAuthenticatedAccount();
            $scope.course = $cookieStore.get('course');

            $scope.startDragTeam = function(event, ui, dragGroup) {
                $cookieStore.put('deleteTeam', true);
                $cookieStore.put('deleteMember', false);
                $cookieStore.put('dragTeam', dragGroup);
            };

            $scope.isOwner = true;

            $scope.addRemoveMember = function(event, ui, mem) {
                $cookieStore.put('deleteMember', mem);
                $cookieStore.put('delMem', true);
            };

            $scope.addRemoveRequester = function(event, ui, mem) {
                $cookieStore.put('currentRequester', mem);
                $cookieStore.put('deleteRequester', true);
            };

            $scope.acceptRequester = function() {
                var modalInstance = $modal.open({
                    templateUrl: 'partials/add_requester.html',
                    controller: 'AddRequesterController'
                });
                return modalInstance.result;
            };

            $scope.denyRequester = function() {
                var modalInstance = $modal.open({
                    templateUrl: 'partials/delete_requester.html',
                    controller: 'DeleteRequesterController'
                });
                return modalInstance.result;
            };

        }]);
