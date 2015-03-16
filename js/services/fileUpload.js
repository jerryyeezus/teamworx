myApp.service('fileUpload', ['$http', '$rootScope', 'Authentication', function ($http, $rootScope, Authentication) {
    this.uploadFileToUrl = function (file, uploadUrl, pk, rootScope) {
        var fd = new FormData();
        fd.append('import_csv', file);
        fd.append('pk', pk);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function () {
                $http.get(Authentication.server_url + 'roster/' + pk).then(function (response) {
                    rootScope.$broadcast('rosterUpdated', response.data);
                })
            })
            .error(function () {
                rootScope.$broadcast('rosterUpdated', {'success': 'error'});
            });
    };
}]);
