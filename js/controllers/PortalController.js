/**
 * Created by yee on 3/1/15.
 */

mainControllers.controller('PortalController',
    ['$http', '$location', 'Authentication', '$scope',
        '$rootScope', '$cookieStore', '$modal', '$window', 'toaster', 'portal_service',
        function ($http, $location, Authentication, $scope, $rootScope,
                  $cookieStore, $modal, $window, toaster, portal_service) {

            $scope.user = Authentication.getAuthenticatedAccount();

            var which_url = $scope.user.user_type == 'STUDENT' ? 'student_courses/' : 'courses/';

            portal_service.init($scope);

            $scope.$on(portal_service.dirty(), function () {
                $scope.course_list = portal_service.getCourses();
                toaster.pop('success', 'Course has been added!');
            });


            /* Get list of courses */
            $http.get(Authentication.server_url + which_url + $scope.user.email).then(function (response) {
                var course_list = response.data;
                course_list.forEach(function (course) {
                    course.prof = course.course_professor.split("|")[1];
                });

                $scope.course_list = course_list;
            });

            $scope.selectCourse = function (course) {
                $cookieStore.put('course', course);
                document.location.href = "#main/" + course.pk;
            };

            /* Logout function */
            $scope.logout = function () {
                Authentication.logout();
            };
        }]);

