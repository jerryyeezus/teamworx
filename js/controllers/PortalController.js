/**
 * Created by yee on 3/1/15.
 */

mainControllers.controller('PortalController',
    ['$http', '$location', 'Authentication', '$scope',
        '$rootScope', '$cookieStore', '$modal', '$window', 'toaster', 'portal_service',
        function ($http, $location, Authentication, $scope, $rootScope,
                  $cookieStore, $modal, $window, toaster, portal_service) {

            $scope.updateProfile = function (which_field, data, user_type, user_email) {
                var dataObject = {};
                dataObject['which_field'] = which_field;
                dataObject['input'] = data;
                dataObject['type_and_email'] = user_type + '|' + user_email;
                $http.put(Authentication.server_url + 'register/', dataObject, {});
                Authentication.updateAuthenticatedAccount(which_field, data);
            };

            var which_url;
            $scope.$on('$viewContentLoaded', function () {
                $scope.user = Authentication.getAuthenticatedAccount();
                $cookieStore.put('user_email', $scope.user.email);
                which_url = $scope.user.user_type == 'STUDENT' ? 'student_courses/' : 'courses/';

                /* Get list of courses */
                $http.get(Authentication.server_url + which_url + $scope.user.email).then(function (response) {
                    var course_list = response.data;
                    course_list.forEach(function (course) {
                        course.prof = course.course_professor.split("|")[1];
                    });

                    $scope.course_list = course_list;
                });
            });

            portal_service.init($scope);

            $scope.$on(portal_service.dirty(), function () {
                $scope.course_list = portal_service.getCourses();
                toaster.pop('success', 'Course has been added!');
            });


            $scope.$on(portal_service.dirty(), function () {
                $scope.course_list = portal_service.getCourses();
                toaster.pop('success', 'Course has been deleted!');
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

