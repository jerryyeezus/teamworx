var mainControllers = angular.module('mainControllers', ['ngAnimate']);

mainControllers.controller('AddAssignmentController',
    ['$http', '$location', 'Authentication', '$scope', '$rootScope', '$cookieStore',
        '$modal', '$window', 'toaster', '$modalInstance', '$stateParams', 'ass_service',
        function ($http, $location, Authentication, $scope, $rootScope, $cookieStore,
                  $modal, $window, toaster, $modalInstance, $stateParams, ass_service) {
            $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
            $scope.myForm = {
                'assignment_number': $cookieStore.get('assignments').length + 1
            };

            $scope.submit = function () {
                var dataObject = {
                    course_fk: $stateParams.which_class
                    , assignment_number: $scope.myForm.assignment_number
                    , assignment_title: $scope.myForm.assignment_title
                    , assignment_text: $scope.myForm.assignment_text
                };

                var responsePromise = $http.post(Authentication.server_url + 'add_assignment/', dataObject, {});
                responsePromise.success(function (dataFromServer, status, headers, config) {
                    ass_service.pushAssignment(dataObject);
                    ass_service.setAssignmentpk(dataFromServer.pk);
                    ass_service.setDirty();
                });
                responsePromise.error(function (data, status, headers, config) {
                    alert('bad')
                });
                $modalInstance.dismiss('cancel');
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            }
        }]);

mainControllers.controller('AddGroupController',
    ['$http', '$location', 'Authentication', '$scope', '$rootScope', '$cookieStore',
        '$modal', '$window', 'toaster', '$modalInstance', '$stateParams', 'group_service',
        function ($http, $location, Authentication, $scope, $rootScope, $cookieStore,
                  $modal, $window, toaster, $modalInstance, $stateParams , group_service) {
            $scope.the_user = Authentication.getAuthenticatedAccount();
            $scope.submitTheForm = function () {
                var dataObject = {
                    name: $scope.myForm.team_name,
                    description: $scope.myForm.team_description,
                    which_class: $scope.which_class,
                    which_assignment: $cookieStore.get('assignment_pk'),
                    owner: "INSTRUCTOR|" + $scope.the_user.email
                };

                var responsePromise = $http.post(Authentication.server_url + 'add_team/', dataObject, {});
                responsePromise.success(function () {
                    group_service.pushGroups(dataObject);
                    group_service.setDirty();
                });
                responsePromise.error(function () {
                    alert("Submitting form failed!");
                    console.log(dataObject);
                });
                $modalInstance.dismiss('cancel');
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            }
        }]);

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

mainControllers.controller('EditProfessorController',
    ['$http', '$location', 'Authentication', '$scope', '$rootScope', '$cookieStore', '$modal', '$window', 'toaster', '$modalInstance',
        function ($http, $location, Authentication, $scope, $rootScope, $cookieStore, $modal, $window, toaster, $modalInstance) {
            $scope.the_user = Authentication.getAuthenticatedAccount();
            $scope.submitTheForm = function (formData) {
                var dataObject = {
                    course_dept_and_id: formData.course_dept + ' ' + formData.course_id
                    , course_name: formData.course_name
                    , course_professor: "INSTRUCTOR|" + $scope.the_user.email
                };

                var responsePromise = $http.post(Authentication.server_url + 'add_courses/', dataObject, {});
                responsePromise.success(function (dataFromServer, status, headers, config) {
                    /* Get list of courses */
                    $scope.user = Authentication.getAuthenticatedAccount();
                    var which_url = $scope.user.user_type == 'STUDENT' ? 'student_courses/' : 'courses/';
                    $http.get(Authentication.server_url + which_url + $scope.user.email).then(function (response) {
                        var course_list = response.data;
                        course_list.forEach(function (course) {
                            course.prof = course.course_professor.split("|")[1];
                        });

                        $rootScope.$broadcast('courseAdded', course_list);
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

mainControllers.controller('CMainController', ['$http', '$stateParams', 'Authentication',
    '$scope', '$rootScope', '$cookieStore', '$modal', '$window', 'fileUpload', 'toaster', 'ass_service', 'group_service',
    function ($http, $stateParams, Authentication, $scope, $rootScope, $cookieStore,
              $modal, $window, $fileUpload, toaster, ass_service, group_service) {

        $scope.course = $cookieStore.get('course');
        $scope.user = Authentication.getAuthenticatedAccount();
        var which_class = $stateParams.which_class;
        $scope.my_pk = which_class;
        $scope.the_user = Authentication.getAuthenticatedAccount()['name'];

        ass_service.init($scope);
        group_service.init($scope);
        ass_service.setAssignmentpk(-1);
        ass_service.setWhichAssignment(-1);

        $rootScope.$on('rosterUpdated', function (event, mass) {
            $scope.students = mass;
            toaster.pop('success', 'Roster uploaded');
        });

        $scope.randomAssign = function () {
            var dataObject = {
                which_assignment: ass_service.getAssignmentpk()
            };
            var responsePromise = $http.post(Authentication.server_url + 'generate_teams/', dataObject, {});
            responsePromise.success(function () {
                alert("Teams created!");
            });
            responsePromise.error(function (data) {
                console.log(data)
                console.log(dataObject);
            });
            $scope.updateGroups();
            console.log('just updated groups');
        };

        $scope.$on(ass_service.dirty(), function () {
            $scope.assignments = ass_service.getAssignments();
            $scope.which_assignment = ass_service.getWhichAssignment();
            $scope.assignment_pk = ass_service.getAssignmentpk();
            toaster.pop('success', 'Assignment created!');
            $scope.updateGroups();
        });

        $scope.$on(group_service.dirty(), function () {
            toaster.pop('success', 'Group created!');
            $scope.updateGroups();
        });

        $http.get(Authentication.server_url + 'roster/' + $scope.course.pk).then(function (response) {
            $scope.students = response.data;
        });

        if (ass_service.getAssignmentpk() != -1) {
            $http.get(Authentication.server_url + 'teams/' + ass_service.getAssignmentpk()).then(function (response) {
                $scope.teams = response.data;
                console.log($cookieStore.get('assignment_pk'));
            });
        }
        $scope.deleteCourse = function () {
            alert('ayyyy lmao');
        };

        $scope.is_current_assignment = function (num) {
            return ass_service.getWhichAssignment() == num;
        };

        $scope.selectAssignment = function (id, pk) {
            ass_service.setWhichAssignment(id);
            $scope.which_assignment = id;
            ass_service.setAssignmentpk(pk);
            $scope.assignment_pk = pk;
            $scope.updateGroups();
        };

        $scope.updateGroups = function () {
            console.log(ass_service.getAssignmentpk());
            console.log(ass_service.getAssignmentpk() == '-1');
            if (ass_service.getAssignmentpk() != '-1') {
                $http.get(Authentication.server_url + 'teams/' + ass_service.getAssignmentpk()).then(function (response) {
                    $scope.teams = response.data;
                    console.log($cookieStore.get('assignment_pk'));
                });
            }
        };

        /* Get list of assignments */

        $http.get(Authentication.server_url + 'assignments/' + which_class).then(function (response) {
            $scope.assignments = response.data;
            // Index of assignment in assignments array
            ass_service.setAssignments(response.data);
            ass_service.setWhichAssignment($scope.assignments[$scope.assignments.length - 1].assignment_number);
            ass_service.setAssignmentpk($scope.assignments[ass_service.getWhichAssignment() - 1].pk);
        });


        $scope.updateQuestion = function() {
            console.log(document.location.href);
            window.location.href = "index.html#/question/" + $cookieStore.get('course').pk;
        };

        $scope.hasProfile = function (student) {
            return student.profile_img != null;
        };

        /* Logout function */
        $scope.logout = function () {
            Authentication.logout();
        };
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

mainControllers.controller('QuestionController', ['$http', '$stateParams', 'Authentication',
    '$scope', '$rootScope', '$cookieStore', '$modal', '$window', 'fileUpload', 'toaster',
    function ($http, $stateParams, Authentication, $scope, $rootScope, $cookieStore,
              $modal, $window, $fileUpload, toaster) {
        $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
        $scope.user = Authentication.getAuthenticatedAccount();
        $scope.course = $cookieStore.get('course');

        $http.get(Authentication.server_url + 'questions/' + $stateParams.which_class).then(function (response) {
            $scope.questions = response.data;
        });

        $rootScope.$on('QuestionCreated', function (event, mass) {
            toaster.pop('success', 'Questioncreated!')
        });
    }]);

mainControllers.controller('AddQuestionController',
    ['$http', '$location', 'Authentication', '$scope', '$rootScope', '$cookieStore',
        '$modal', '$window', 'toaster', '$modalInstance', '$stateParams',
        function ($http, $location, Authentication, $scope, $rootScope, $cookieStore,
                  $modal, $window, toaster, $modalInstance, $stateParams) {
            $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
            $scope.myForm = {
                'assignment_number': $cookieStore.get('assignments').length
            };

            $scope.submitTheForm = function () {
                var dataObject = {
                    course_fk: $stateParams.which_class
                    , value: $scope.myForm.value
                    , text: $scope.myForm.text
                };
                console.log(dataObject);
                var responsePromise = $http.post(Authentication.server_url + 'questions/', dataObject, {});
                responsePromise.success(function () {
                    $rootScope.$broadcast('QuestionCreated', dataObject);
                    location.reload();
                    $rootScope.$broadcast('tmp', dataObject);
                    window.location.href = '#question/' + $cookieStore.get('course').pk;
                });
                responsePromise.error(function () {
                    alert("Submitting form failed!");
                    console.log(dataObject);
                });
            }
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            }

        }
    ])
;