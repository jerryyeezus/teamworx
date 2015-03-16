mainControllers.controller('DeleteCourseController',
    ['$http', '$location', 'Authentication', '$scope',
        '$rootScope', '$cookieStore', '$modal', '$window', 'toaster', '$modalInstance', 'portal_service',
        'delete_course_service',
        function ($http, $location, Authentication, $scope,
                  $rootScope, $cookieStore, $modal, $window, toaster, $modalInstance, portal_service, delete_course_service) {

            $scope.the_user = Authentication.getAuthenticatedAccount();
            $scope.user = Authentication.getAuthenticatedAccount();
            $scope.deleteCourse = $cookieStore.get('dragCourse');

            $scope.ok = function () {

                var dataObject = {pk : $scope.deleteCourse.pk};
                console.log(dataObject);
                var responsePromise = $http.put(Authentication.server_url + 'add_courses/', dataObject);
                responsePromise.success(function () {
                    /* Get list of courses */
                    $scope.user = Authentication.getAuthenticatedAccount();
                    $http.get(Authentication.server_url + 'courses/' + $scope.user.email).then(function (response) {
                        var course_list = response.data;
                        course_list.forEach(function (course) {
                            course.prof = course.course_professor.split("|")[1];
                        });
                        portal_service.setCourses(course_list);
                        delete_course_service.setDirty();
                    });

                });
                responsePromise.error(function () {
                    alert("Submitting form failed!");
                    console.log(dataObject);
                });
                $modalInstance.close();
                $modalInstance.dismiss('cancel');
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);
