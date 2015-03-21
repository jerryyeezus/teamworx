mainControllers.controller('CMainController', ['$http', '$stateParams', 'Authentication',
    '$scope', '$rootScope', '$cookieStore', '$modal', '$window', 'fileUpload', 'toaster', 'ass_service', 'group_service',
    'question_service', 'drag_student_service', 'delete_team_member_service','add_question_service', 'edit_question_service',
    'answer_service', 'delete_group_service', 'add_requester_service','delete_requester_service',
    function ($http, $stateParams, Authentication, $scope, $rootScope, $cookieStore,
              $modal, $window, $fileUpload, toaster, ass_service, group_service, question_service, drag_student_service,
              delete_team_member_service, add_question_service, edit_question_service, answer_service, delete_group_service,
              add_requester_service, delete_requester_service) {

        $scope.course = $cookieStore.get('course');
        $scope.user = Authentication.getAuthenticatedAccount();
        $scope.isProfessor = ($scope.user.user_type == 'INSTRUCTOR');
        $scope.isStudent = ($scope.user.user_type == 'STUDENT');
        var which_class = $stateParams.which_class;
        $scope.my_pk = which_class;
        $scope.the_user = Authentication.getAuthenticatedAccount()['name'];
        ass_service.init($scope);
        answer_service.init($scope);
        group_service.init($scope);
        question_service.init($scope);
        drag_student_service.init($scope);
        delete_team_member_service.init($scope);
        add_question_service.init($scope);
        edit_question_service.init($scope);
        delete_group_service.init($scope);
        add_requester_service.init($scope);
        delete_requester_service.init($scope);

        $scope.isUploaded = false;
        $scope.changeBackButton = false;
        $scope.isCollapsed = true;
        $scope.students = [];
        var student_map = {};

        /* Get list of assignments */
        $http.get(Authentication.server_url + 'assignments/' + which_class).then(function (response) {
            $scope.assignments = response.data;
            if ($scope.assignments.length > 0) {
                $scope.assignment = $scope.assignments[$scope.assignments.length - 1];
            };

            if($cookieStore.get('assignment') != undefined) {
                $scope.assignment = $cookieStore.get('assignment');
            };

            // Index of assignment in assignments array
            ass_service.setAssignments(response.data);
            ass_service.setWhichAssignment($scope.assignments.length);
            ass_service.setAssignmentpk($scope.assignments[ass_service.getWhichAssignment() - 1].pk);
            $scope.which_assignment = ass_service.getWhichAssignment();

            $http.get(Authentication.server_url + 'roster/' + $scope.course.pk).then(function (response) {
                $scope.students = response.data;
                if ($scope.students.length > 0) {
                    $scope.isUploaded = true;
                }
                for (var i = 0; i < response.data.length; i++) {
                    student_map[response.data[i].user_type + '|' + response.data[i].email] = i;
                }

                $scope.students.forEach(function(student) {
                    student['lfg'] = false;
                    $http.get(Authentication.server_url + 'add_lfg/' + $scope.assignment.pk).then(function(response) {
                        $scope.lfgList = response.data;
                        $scope.lfgList.forEach(function(lfg) {
                            if(lfg.user_fk == student.user_type + '|' + student.email) {
                                student['lfg'] = true;
                            };
                        });
                    });
                });
            });


            $http.get(Authentication.server_url + 'teams/' + ass_service.getAssignmentpk()).then(function (response) {
                $scope.teams = response.data;
                for (var i = 0; i < $scope.teams.length; i++) {
                    for (var j = 0; j < $scope.teams[i].members.length; j++) {
                        var member = $scope.teams[i].members[j];
                        $scope.teams[i].members[j] = $scope.students[student_map[member]];
                    }
                };
                $scope.haveGroup = false;
                $scope.teams.forEach(function (team) {
                    team.members.forEach(function(mem) {
                        if (mem.email == $scope.user.email) {
                            $scope.haveGroup = true;
                            $cookieStore.put('myTeam', team);
                            $scope.team = $cookieStore.get('myTeam');
                        };
                    });
                });

                if ($scope.assignments.length > 0) {
                    $scope.assignment = $scope.assignments[$scope.assignments.length - 1];
                };

                if($cookieStore.get('assignment') != undefined) {
                    $scope.assignment = $cookieStore.get('assignment');
                };

                $http.get(Authentication.server_url + 'roster/' + $scope.course.pk).then(function (response) {
                    $scope.students = response.data;
                    $scope.students.forEach(function(student) {
                        student['lfg'] = false;
                        $http.get(Authentication.server_url + 'add_lfg/' + $scope.assignment.pk).then(function(response) {
                            $scope.lfgList = response.data;
                            $scope.lfgList.forEach(function(lfg) {
                                if(lfg.user_fk == student.user_type + '|' + student.email) {
                                    student['lfg'] = true;
                                };
                            });
                        });
                    });
                });
                $scope.isInterested = false;
                if ($scope.haveGroup) {
                    $scope.requestersList = [];
                    $scope.requestersEmailList = [];
                    $scope.currentStudents = $scope.students;
                    $http.get(Authentication.server_url + 'requests/' + $scope.team.pk).then(function (response) {
                        $scope.requestersEmailList = response.data;
                        if ($scope.requestersEmailList.length > 0) {
                            $scope.isInterested = true;
                        };
                        $scope.requestersEmailList.forEach(function (req) {
                            $scope.currentStudents.forEach(function (student) {
                                if (req.requester == student.user_type + '|' + student.email) {
                                    if ($scope.requestersList.indexOf(student) < 0) {
                                        $scope.requestersList.push(student);
                                    };
                                };
                            });
                        });
                    });
                };
            });
        });





        $rootScope.$on('rosterUpdated', function (event, mass) {
            $scope.students = mass
            toaster.pop('success', 'Roster uploaded');
        });



        $scope.$on('ass_invalidate', function () {
            $scope.teams = [];
        });

        $scope.$on(answer_service.dirty(), function () {
            toaster.pop('success', 'Answers successfully submitted!');
        });

        $scope.$on(add_question_service.dirty(), function () {
            toaster.pop('success', 'Question Added');
        });

        $scope.$on(edit_question_service.dirty(), function () {
            toaster.pop('success', 'Question Edited');
        });
        $scope.$on(ass_service.dirty(), function () {
            $scope.teams = [];
            $scope.assignments = ass_service.getAssignments();
            $scope.which_assignment = ass_service.getWhichAssignment();
            $scope.assignment_pk = ass_service.getAssignmentpk();
            toaster.pop('success', 'Assignment created!');
            $scope.updateAssignment();
            $scope.updateGroup();
        });

        $scope.$on(drag_student_service.dirty(), function() {
            toaster.pop('success', 'Student Moved');
            $scope.updateGroup();
        });

        $scope.$on(delete_team_member_service.dirty(), function() {
            toaster.pop('success', 'Student Removed');
            $scope.updateGroup();
        });

        $scope.$on(add_requester_service.dirty(), function() {
            toaster.pop('success', 'Member Added');
            $scope.updateGroup();
        });

        $scope.$on(delete_requester_service.dirty(), function() {
            toaster.pop('success', 'Member Denied');
            $scope.updateGroup();
        });

        $scope.$on(delete_group_service.dirty(), function() {
            toaster.pop('success', 'Group Deleted');
            $scope.updateGroup();
        });

        $scope.$on(group_service.dirty(), function () {
            toaster.pop('success', 'Group Created!');
            $scope.updateGroup();
        });

        $scope.$on(question_service.dirty(), function () {
            toaster.pop('success', 'Question Created!');
            $scope.updateQuestion();
        });

        $scope.$on(question_service.dirty(), function () {
            toaster.pop('success', 'Answer Created!');
            $scope.updateAnswer();
        });

        $scope.randomAssign = function () {
            $scope.teams = [];
            var dataObject = {
                which_assignment: ass_service.getAssignmentpk()
            };
            var responsePromise = $http.post(Authentication.server_url + 'generate_teams/', dataObject, {});
            responsePromise.success(function () {
                $scope.updateGroup();
                toaster.pop('success', 'Random Groups Created');
            });
            responsePromise.error(function (data) {
            });
        };

        $scope.tabSelect = function (which_tab) {
            switch (which_tab) {
                case 'TEAM':
                    toaster.pop('alert', 'team tab selected');
                    break;
                case 'TEAM.ADMIN':
                    toaster.pop('alert', 'team.admin tab selected');
                    break;
            }

        };

        this.hovered = undefined;

        $scope.deleteCourse = function () {
            alert('ayyyy lmao');
        };

        $scope.is_current_assignment = function (num) {
            return ass_service.getWhichAssignment() == num;
        };

        $scope.divClass = function (team) {
            if (team == this.hovered) {
                return 'groupProfileHover';
            } else {
                return 'groupProfile';
            }
        };

        $scope.hoverIn = function (team) {
            this.hovered = team;
        };

        $scope.hoverOut = function (team) {
            this.hovered = undefined;
        };

        $scope.selectAssignment = function (id, pk, ass) {
            ass_service.setWhichAssignment(id);
            $scope.which_assignment = id;
            ass_service.setAssignmentpk(pk);
            $scope.assignment_pk = pk;
            ass_service.setAssignment(ass);
            $scope.assignment = ass;
            $scope.updateGroup();
        };

        $scope.updateGroup = function () {
            $scope.teams = [];
            $http.get(Authentication.server_url + 'teams/' + ass_service.getAssignmentpk()).then(function (response) {
                $scope.teams = response.data;
                for (var i = 0; i < $scope.teams.length; i++) {
                    for (var j = 0; j < $scope.teams[i].members.length; j++) {
                        var member = $scope.teams[i].members[j];
                        $scope.teams[i].members[j] = $scope.students[student_map[member]];
                    }
                };

                $scope.haveGroup = false;
                $scope.teams.forEach(function (team) {
                    team.members.forEach(function(mem) {
                        if (mem.email == $scope.user.email) {
                            $scope.haveGroup = true;
                            $cookieStore.put('myTeam', team);
                            $scope.team = $cookieStore.get('myTeam');
                        };
                    });
                });
                $scope.isInterested = false;
                if ($scope.haveGroup) {
                    $scope.requestersList = [];
                    $scope.currentStudents = $scope.students;
                    $http.get(Authentication.server_url + 'requests/' + $scope.team.pk).then(function (response) {
                        $scope.requestersEmailList = response.data;
                        if ($scope.requestersEmailList.length > 0) {
                            $scope.isInterested = true;
                        };
                        $scope.requestersEmailList.forEach(function (req) {
                            $scope.currentStudents.forEach(function (student) {
                                if (req.requester == student.user_type + '|' + student.email) {
                                    if ($scope.requestersList.indexOf(student) < 0) {
                                        $scope.requestersList.push(student);
                                    };
                                };
                            });
                        });
                    });
                };

            });
        };

        $scope.updateAssignment = function () {
            $http.get(Authentication.server_url + 'assignments/' + which_class).then(function (response) {
                $scope.assignments = response.data;
            });
        };
        $scope.updateQuestion = function () {
            $http.get(Authentication.server_url + 'questions/' + $stateParams.which_class).then(function (response) {
                $scope.questions = response.data;
            });
        };

        $scope.updateAnswer = function () {
            $http.get(Authentication.server_url + 'answers/' + $stateParams.which_class).then(function (response) {
                $scope.questions = response.data;
            });
        };

        $scope.startCallback = function(event, ui, stu) {
            console.log('You started draggin: ');
            $cookieStore.put('dragStudentRoster', true);
            $cookieStore.put('dragStudent', stu);
            $cookieStore.put('deleteMember', false);
            $cookieStore.put('deleteTeam', false);
            $cookieStore.put('haveGroup', false);
            $scope.teams.forEach(function (team) {
                team.members.forEach(function(mem) {
                    if (mem.email == $cookieStore.get('dragStudent').email) {
                        $cookieStore.put('haveGroup', true);
                        $cookieStore.put('dragTeam', team);
                    };
                });
            });
        };


        $scope.isOwner = true;
        $scope.enableLFG = function() {
            var dataObject = {};
            $scope.lfg = [];
            $scope.isLFG = true;
            $http.get(Authentication.server_url + 'add_lfg/' + $scope.assignment.pk).then(function(response) {
                $scope.lfgList = response.data;
                $scope.lfgList.forEach(function(lfg) {
                    if(lfg.user_fk == $scope.user.user_type + '|' + $scope.user.email) {
                        $scope.lfg = lfg;
                        $scope.isLFG = false;
                        toaster.pop('Enable LFG');
                    };
                });
                if ($scope.isLFG) {
                    dataObject['ass_fk'] = $scope.assignment.pk;
                    dataObject['user_fk'] = $scope.user.user_type + '|' + $scope.user.email;

                    var responsePromise = $http.post(Authentication.server_url + 'add_lfg/', dataObject, {});
                    responsePromise.success(function () {
                        toaster.pop('success', 'Enable LFG');
                    });
                    responsePromise.error(function (data) {
                        console.log(data);
                        console.log(dataObject);
                    });
                };
            });
        };

        $scope.disableLFG = function() {
            var dataObject = {};
            $scope.lfg = [];
            $scope.isLFG = false;
            $http.get(Authentication.server_url + 'add_lfg/' + $scope.assignment.pk).then(function(response) {
                $scope.lfgList = response.data;
                $scope.lfgList.forEach(function(lfg) {
                    if(lfg.user_fk == $scope.user.user_type + '|' + $scope.user.email) {
                        $scope.lfg = lfg;
                        $scope.isLFG = true;
                    };
                });
                if ($scope.isLFG) {
                    dataObject['pk'] = $scope.lfg.pk;

                    var responsePromise = $http.put(Authentication.server_url + 'put_lfg/', dataObject, {});
                    responsePromise.success(function () {
                        toaster.pop('success', 'Disable LFG');
                    });
                    responsePromise.error(function (data) {
                        console.log(data);
                        console.log(dataObject);
                    });
                    $scope.isLFG = false;
                };
            });
        };

        /* Logout function */
        $scope.logout = function () {
            Authentication.logout();
        };
    }
]);
