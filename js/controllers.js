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
                document.location.href = "#main/" + course.pk;
            };

            //launches modal for creating a course
            $scope.foo_portal = function () {
                $modal.open({
                    templateUrl: 'partials/create_class.html',
                    controller: function ($scope, $http, Authentication, $rootScope, $modalInstance) {
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

                        $scope.submit = function () {
                        };

                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        }

                    }
                });
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
    '$scope', '$rootScope', '$cookieStore', '$modal', '$window', 'fileUpload', '$route', 'toaster',
    function ($http, $routeParams, Authentication, $scope, $rootScope, $cookieStore,
              $modal, $window, $fileUpload, $route, toaster) {

        $scope.course = $cookieStore.get('course');
        $scope.user = Authentication.getAuthenticatedAccount();
        var which_class = $routeParams.which_class;
        $scope.my_pk = which_class;
        $scope.the_user = Authentication.getAuthenticatedAccount()['name'];

        $rootScope.$on('rosterUpdated', function (event, mass) {
            $cookieStore.put('rosterUpdated', mass.success);
            location.reload();
        });

        // TODO ass
        $rootScope.$on('assCreated', function(event, mass) {
            $cookieStore.put('assCreated', mass);
            location.reload();
        });

        $http.get(Authentication.server_url + 'roster/' + $scope.course.pk).then(function (response) {
            $scope.students = response.data;
        });

        $rootScope.$on('tmp', function(event,mass) {
            $scope.selectAssignment(mass.assignment_number);
        })

        $scope.$on('$viewContentLoaded', function () {
            if ($cookieStore.get('rosterUpdated') == 'success') {
                toaster.pop('success', 'Student roster uploaded!');
            }
            else if ($cookieStore.get('rosterUpdated') == 'fail') {
                toaster.pop('error', 'Upload failed!');
            }
            var assCreated = $cookieStore.get('assCreated');
            if (assCreated) {
                $scope.selectAssignment(assCreated.assignment_number);
                toaster.pop('success', 'Assignment created!')
                $cookieStore.put('assCreated', false);
            }

            $cookieStore.put('rosterUpdated', 'none');
        });

        $scope.deleteCourse = function() {
            alert('ayyyy lmao');
        }

        $scope.import = function () {
            $modal.open({
                    templateUrl: 'partials/upload_form.html',
                    controller: function ($scope, $modalInstance, $rootScope) {
                        $scope.submit = function () {
                            $fileUpload.uploadFileToUrl($scope.myFile,
                                Authentication.server_url + 'add_import/', $cookieStore.get('course').pk)
                            $modalInstance.dismiss('cancel');
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

        //controller for creating a new group
        $scope.addGroup = function () {
            $modal.open({
                templateUrl: 'partials/add_group.html',
                controller: function ($scope, $http, Authentication, $rootScope, $modalInstance) {
                    /*
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

                    $scope.submit = function () {
                    };
                    */
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    }

                }
            });
            // Hack to make modal appear... angular is fucking stupid
            $window.history.back();
        };


        $scope.is_current_assignment = function (num) {
            return $scope.assignments[$scope.which_assignment].assignment_number == num;
        }

        $scope.selectAssignment = function (id) {
            $scope.which_assignment = id;
        };

        /* Get list of assignments */
        $http.get(Authentication.server_url + 'assignments/' + which_class).then(function (response) {
            $scope.assignments = response.data;

            // Index of assignment in assignments array
            $scope.which_assignment = $scope.assignments.length - 1; // TODO shouldn't this be -1

            $cookieStore.put('assignments', response.data);
        });

        $scope.hasProfile = function (student) {
            return student.profile_img != null;
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
    $scope.formData = {
        'the_email': 'you@gatech.edu',
        'password': 'pass',
        'user_type': 'INSTRUCTOR'
    }

    $scope.clearData = function (which) {
        $scope.formData[which] = '';
    };

    function activate() {
        if (Authentication.isAuthenticated()) {
            // TODO check if user is also in login
            //$location.url('/portal');
        }
    }

    $scope.register = function (formData2) {
        Authentication.register(formData2);
    }

    $scope.login = function (formData) {
        Authentication.login(formData)
    }

}]);


mainControllers.controller("AddAssignmentController",
    ['$scope', '$http', '$routeParams', 'Authentication', '$cookieStore', '$rootScope',
    function ($scope, $http, $routeParams, Authentication, $cookieStore, $rootScope) {
        $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
        $scope.course = "";
        $scope.myForm = {
            'assignment_number': $cookieStore.get('assignments').length + 1
        };

        $scope.submitTheForm = function (formData) {
            // TODO how the hell does this work? myForm should be formData??
            var dataObject = {
                course_fk: $routeParams.which_class
                , assignment_number: $scope.myForm.assignment_number
                , assignment_title: $scope.myForm.assignment_title
                , assignment_text: $scope.myForm.assignment_text
            };

            var responsePromise = $http.post(Authentication.server_url + 'add_assignment/', dataObject, {});
            responsePromise.success(function (dataFromServer, status, headers, config) {
                //$rootScope.$broadcast('assCreated', dataObject); // TODO when modal is done
                $rootScope.$broadcast('tmp', dataObject);
                window.location.href = '#main/' + $cookieStore.get('course').pk;
            });
            responsePromise.error(function (data, status, headers, config) {
                console.log(data)
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


        var responsePromise = $http.post(Authentication.server_url + 'add_assignment/', dataObject, {});
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
        var responsePromise = $http.post(Authentication.server_url +'add_question/', dataObject, {});
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
