/**
 * Created by thangnguyen on 3/6/15.
 */
/**
 * Created by thangnguyen on 3/5/15.
 */
/**
 * Created by yee on 3/1/15.
 */


mainControllers.controller('DeleteCourseController',
    ['$http', '$location', 'Authentication', '$scope',
        '$rootScope', '$cookieStore', '$modal', '$window', 'toaster', '$modalInstance', 'portal_service',
        function ($http, $location, Authentication, $scope,
                  $rootScope, $cookieStore, $modal, $window, toaster, $modalInstance, portal_service) {

            $scope.the_user = Authentication.getAuthenticatedAccount();
            $scope.user = Authentication.getAuthenticatedAccount();
            $scope.pk = 2;

            $scope.submitTheForm = function (formData) {
                $http.get(Authentication.server_url + 'courses/'+ $scope.user.email).then(function (response) {
                    var course_list = response.data;
                    $scope.course_list = course_list;
                });

                var course;
                for (course in $scope.course_list) {
                    if (course.course_dept_and_id == (formData.course_dept + ' ' + formData.course_id)) {
                        $scope.pk = course.pk;
                    }
                }

                var dataObject = {
                    pk: "2"
                    //pk: $scope.pk
                };

                //var responsePromise = $http.delete(Authentication.server_url + 'add_courses/', dataObject);
                var responsePromise = $http.delete(Authentication.server_url + 'add_courses/', dataObject);
                responsePromise.success(function () {
                    /* Get list of courses */
                    $scope.user = Authentication.getAuthenticatedAccount();
                    $http.get(Authentication.server_url + 'courses/' + $scope.user.email).then(function (response) {
                        var course_list = response.data;
                        course_list.forEach(function (course) {
                            course.prof = course.course_professor.split("|")[1];
                        });

                        portal_service.setCourses(course_list);
                        portal_service.setDirty();
                        //$rootScope.$broadcast('courseAdded', course_list);
                    });

                });
                responsePromise.error(function (data, status, headers, config) {
                    alert("Submitting form failed!");
                    console.log(dataObject);
                });
                $modalInstance.dismiss('cancel');
                //$window.location.href = '#/portal';
            };

            $scope.cancel = function () {
                //$window.location.href = '#/portal';
                $modalInstance.dismiss('cancel');
            };

        }]);
