var mainControllers = angular.module('mainControllers', ['ngAnimate']);

mainControllers.controller('PortalController',
    ['$http', '$location', 'Authentication', '$scope', '$rootScope', '$cookieStore', '$modal', '$window', 'toaster',
        function ($http, $location, Authentication, $scope, $rootScope, $cookieStore, $modal, $window, toaster) {
            $scope.user = Authentication.getAuthenticatedAccount();

            $scope.pop = function () {
                toaster.pop('success', 'Course successfully added!');
                $cookieStore.put('showToaster', false);
            }

            $rootScope.$on('courseAdded', function () {
                $cookieStore.put('showToaster', true);
            });

            $scope.$on('$viewContentLoaded', function () {
                var showToaster = $cookieStore.get('showToaster');
                if (!(showToaster === undefined) && showToaster == true)
                    $scope.pop();
            });

            var which_url = $scope.user.user_type == 'STUDENT' ? 'student_courses/' : 'courses/';

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
                console.log(course)
                document.location.href = "#main/" + course.pk;
            };

            //launches modal for creating a course
            $scope.foo_portal = function () {
                $modal.open({
                        templateUrl: 'partials/create_class.html'
                    }
                );

                // Hack to make modal appear... angular is fucking stupid
                window.location.href = "index.html#";
                window.location.href = "index.html#/portal";
            };

            /* Logout function */
            $scope.logout = function () {
                Authentication.logout();
            }
        }]);

mainControllers.controller('CMainController', ['$http', '$routeParams', 'Authentication',
    '$scope', '$rootScope', '$cookieStore', '$modal', '$window', 'fileUpload',
    function ($http, $routeParams, Authentication, $scope, $rootScope, $cookieStore, $modal, $window, $fileUpload) {

        $scope.course = $cookieStore.get('course');
        $scope.user = Authentication.getAuthenticatedAccount();
        var which_class = $routeParams.which_class;
        $scope.my_pk = which_class;

        $rootScope.$on('rosterUpdated', function (event, data) {
            $scope.students = data;
            $scope.apply();
        })

        $scope.import = function () {
            $modal.open({
                    templateUrl: 'partials/upload_form.html',
                    controller: function ($scope, $modalInstance, $rootScope) {
                        $scope.submit = function () {
                            $fileUpload.uploadFileToUrl($scope.myFile, Authentication.server_url + 'add_import/', $cookieStore.get('course').pk)
                            $modalInstance.dismiss('cancel');
                            $http.get(Authentication.server_url + 'roster/' + $cookieStore.get('course').pk).then(function (response) {
                                students = response.data;
                                $rootScope.$broadcast('rosterUpdated', students);
                            });
                        };

                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        }
                    }
                }
            );

            // Hack to make modal appear... angular is fucking stupid
            $window.history.back();
        };

        $scope.the_user = Authentication.getAuthenticatedAccount()['email'];

        $scope.is_current_assignment = function (num) {
            return $scope.which_assignment == num;
        }

        $scope.selectAssignment = function (id) {
            $scope.which_assignment = id;
        };

        $scope.$on('$viewContentLoaded', function () {
        });
        /* Get list of assignments */
        $http.get(Authentication.server_url + 'assignments/' + which_class).then(function (response) {
            $scope.assignments = response.data;
            $scope.which_assignment = $scope.assignments.length;
        });


        $http.get(Authentication.server_url + 'roster/' + $scope.course.pk).then(function (response) {
            $scope.students = response.data;
            //console.log(response.data)
        });


        $scope.hasProfile = function (student) {
            console.log(student);
            return true;
            //return student.profile_img != null;
        };

        /* Logout function */
        $scope.logout = function () {
            Authentication.logout();
        }
    }
])
;

mainControllers.controller('CredentialsController', ['$location', '$scope', 'Authentication', function ($location, $scope, Authentication) {
    activate();

    function activate() {
        if (Authentication.isAuthenticated()) {
            // TODO check if user is also in login
            //$location.url('/portal');
        }
    }

    $scope.register = function (formData) {
        Authentication.register(formData);
    }

    $scope.login = function (formData) {
        Authentication.login(formData)
    }

}]);


mainControllers.controller("AddCourseController", ['$scope', '$http', 'Authentication', '$rootScope',
    function ($scope, $http, Authentication, $rootScope) {
        $scope.the_user = Authentication.getAuthenticatedAccount();
        $scope.submitTheForm = function (formData) {
            var dataObject = {
                course_dept_and_id: $scope.myForm.course_dept + ' ' + $scope.myForm.course_id
                , course_name: $scope.myForm.course_name
                , course_professor: "INSTRUCTOR|" + $scope.the_user.email
            };

            var responsePromise = $http.post(Authentication.server_url + 'add_courses/', dataObject, {});
            responsePromise.success(function (dataFromServer, status, headers, config) {
                $rootScope.$broadcast('courseAdded');
                location.reload();
            });
            responsePromise.error(function (data, status, headers, config) {
                alert("Submitting form failed!");
                console.log(dataObject);
            });
        }
    }]);

mainControllers.controller("AddAssignmentController", ['$scope', '$http', '$routeParams', 'Authentication', '$cookieStore',
    function ($scope, $http, $routeParams, Authentication, $cookieStore) {
        $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
        $scope.course = "";

        $scope.submitTheForm = function (formData) {
            var dataObject = {

                course_fk: $routeParams.which_class
                , assignment_number: $scope.myForm.assignment_number
                , assignment_title: $scope.myForm.assignment_title
                , assignment_text: $scope.myForm.assignment_text

            };

            console.log(dataObject);


            var responsePromise = $http.post(Authentication.server_url + 'add_assignment/', dataObject, {});
            responsePromise.success(function (dataFromServer, status, headers, config) {
                console.log(dataFromServer.title);
                console.log(dataObject);
                alert("Assignment created!");
                window.location.href = '#main/' + $cookieStore.get('course').pk;
            });
            responsePromise.error(function (data, status, headers, config) {
                alert("Submitting form failed!");
                console.log(dataObject);
            });
        }
    }]);


mainControllers.controller('NavigationController', ['$location', '$scope', 'Authentication', '$rootScope', function ($location, $scope, Authentication, $rootScope) {
    activate();

    function activate() {
        if (Authentication.isAuthenticated()) {
            // TODO
            //$location.url('/portal');
        }
    }

    $rootScope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    }

    $scope.register = function (formData) {
        Authentication.register(formData);
    }

    $scope.login = function (formData) {
        Authentication.login(formData)
    }

    $scope.logout = function () {
        Authentication.logout();
    }

}]);

mainControllers.controller("AssignmentController", ['$scope', '$http', '$routeParams', 'Authentication', function ($scope, $http, $routeParams, Authentication) {
    $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
    $scope.course = "";

    $scope.items = [];

    $scope.add = function () {
        $scope.items.push({
            question: "",
            questionPlaceholder: "New Question",
            text: ""
        });
    };

    $scope.submitTheForm = function (formData) {
        var dataObject = {

            course_fk: $routeParams.which_class
            , assignment_number: $scope.myForm.assignment_number
            , assignment_title: $scope.myForm.assignment_title
            , assignment_text: $scope.myForm.assignment_text

        };


        console.log(dataObject);


        var responsePromise = $http.post('http://ec2-54-69-18-202.us-west-2.compute.amazonaws.com:8000/add_assignment/', dataObject, {});
        responsePromise.success(function (dataFromServer, status, headers, config) {
            console.log(dataFromServer.title);
            console.log(dataObject);
            alert("Assignment created!");
        });
        responsePromise.error(function (data, status, headers, config) {
            alert("Submitting form failed!");
            console.log(dataObject);
        });
    }
}]);

mainControllers.controller("AddQuestionController", ['$scope', '$http', '$routeParams', 'Authentication', function ($scope, $http, $routeParams, Authentication) {
    $scope.the_user = Authentication.getAuthenticatedAccount()['email'];

    $scope.submitTheForm = function (formData) {
        var dataObject = {

            course_fk: $routeParams.which_class
            , assignment_number: $scope.myForm.assignment_number
            , assignment_title: $scope.myForm.assignment_title
            , assignment_text: $scope.myForm.assignment_text

        };
        console.log(dataObject);
        var responsePromise = $http.post('http://ec2-54-69-18-202.us-west-2.compute.amazonaws.com:8000/add_question/', dataObject, {});
        responsePromise.success(function (dataFromServer, status, headers, config) {
            console.log(dataFromServer.title);
            console.log(dataObject);
            alert("Assignment created!");
        });
        responsePromise.error(function (data, status, headers, config) {
            alert("Submitting form failed!");
            console.log(dataObject);
        });
    }
}]);
