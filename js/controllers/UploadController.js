mainControllers.controller('UploadController',
    ['$http', '$location', 'Authentication', '$scope', '$rootScope', '$cookieStore',
        '$modal', '$window', 'toaster', '$modalInstance', 'fileUpload',
        function ($http, $location, Authentication, $scope, $rootScope, $cookieStore,
                  $modal, $window, toaster, $modalInstance, $fileUpload) {

            $scope.submit = function () {
                $fileUpload.uploadFileToUrl($scope.myFile,
                    Authentication.server_url + 'add_import/', $cookieStore.get('course').pk, $rootScope);
                $modalInstance.dismiss('cancel');
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            }
        }]);
