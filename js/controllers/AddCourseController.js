/**
 * Created by yee on 3/1/15.
 */


mainControllers.controller('AddCourseController',
    ['$http', '$location', 'Authentication', '$scope',
        '$rootScope', '$cookieStore', '$modal', '$window', 'toaster', '$modalInstance', 'portal_service',
        function ($http, $location, Authentication, $scope,
                  $rootScope, $cookieStore, $modal, $window, toaster, $modalInstance, portal_service) {

            $scope.the_user = Authentication.getAuthenticatedAccount();
            $scope.submitTheForm = function (formData) {
                var dataObject = {
                    course_dept_and_id: formData.course_dept + ' ' + formData.course_id
                    , course_name: formData.course_name
                    , course_professor: "INSTRUCTOR|" + $scope.the_user.email
                };

                var responsePromise = $http.post(Authentication.server_url + 'add_courses/', dataObject, {});
                responsePromise.success(function () {
                    /* Get list of courses */
                    $scope.user = Authentication.getAuthenticatedAccount();
                    var which_url = $scope.user.user_type == 'STUDENT' ? 'student_courses/' : 'courses/';
                    $http.get(Authentication.server_url + which_url + $scope.user.email).then(function (response) {
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
                });
                $modalInstance.dismiss('cancel');
                //$window.location.href = '#/portal';
            };

            $scope.cancel = function () {
                //$window.location.href = '#/portal';
                $modalInstance.dismiss('cancel');
            };

        }]);
