/**
 * Created by yee on 3/1/15.
 */


mainControllers.controller('EditProfileController',
    ['$http', '$location', 'Authentication', '$scope', '$rootScope', '$cookieStore', '$modal', '$window', 'toaster', '$modalInstance',
        function ($http, $location, Authentication, $scope, $rootScope, $cookieStore, $modal, $window, toaster, $modalInstance) {
            $scope.the_user = Authentication.getAuthenticatedAccount();
            $scope.submitTheForm = function (myForm) {
                var dataObject = {
                    name: myForm.profile_name,
                    email: myForm.profile_email,
                    biography: myForm.biography,
                    experience: myForm.experience,
                    skills: myForm.skills,
                    time_commitment: myForm.time_commitment,
                    location: myForm.location,
                    recommendation: myForm.recommendation
                };

                var responsePromise = $http.post(Authentication.server_url + 'profile/', dataObject, {});
                responsePromise.success(function () {
                    $scope.user = Authentication.getAuthenticatedAccount();
                    $http.get(Authentication.server_url + 'profile/' + $scope.user.email).then(function (response) {
                        var personalProfile = response.data;
                    });

                });
                responsePromise.error(function () {
                    alert("Submitting form failed!");
                    console.log(dataObject);
                });
                $modalInstance.dismiss('cancel');
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

        }]);

