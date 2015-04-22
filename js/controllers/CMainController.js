mainControllers.controller('CMainController', ['$http', '$stateParams', 'Authentication',
    '$scope', '$rootScope', '$cookieStore', '$modal', '$window', 'fileUpload', 'toaster', 'ass_service',
    'group_service', 'drag_student_service', 'delete_team_member_service','add_question_service',
    'edit_question_service', 'answer_service', 'delete_group_service', 'add_requester_service',
    'delete_requester_service', 'add_project_service',
    function ($http, $stateParams, Authentication, $scope, $rootScope, $cookieStore,
              $modal, $window, $fileUpload, toaster, ass_service, group_service, drag_student_service,
              delete_team_member_service, add_question_service, edit_question_service, answer_service,
              delete_group_service, add_requester_service, delete_requester_service, add_project_service) {

        //User and course information from login page and portal
        $scope.course = $cookieStore.get('course');
        $scope.user = Authentication.getAuthenticatedAccount();
        $scope.isProfessor = ($scope.user.user_type == 'INSTRUCTOR');
        console.log($scope.isProfessor);
        $scope.isStudent = ($scope.user.user_type == 'STUDENT');
        var which_class = $stateParams.which_class;
        $scope.my_pk = which_class;
        $scope.the_user = Authentication.getAuthenticatedAccount()['name'];

        //Initialize services
        ass_service.init($scope);
        answer_service.init($scope);
        group_service.init($scope);
        drag_student_service.init($scope);
        delete_team_member_service.init($scope);
        add_question_service.init($scope);
        edit_question_service.init($scope);
        delete_group_service.init($scope);
        add_requester_service.init($scope);
        delete_requester_service.init($scope);
        add_project_service.init($scope);

        //Switch controllers, pop toasters and update view
        $rootScope.$on('rosterUpdated', function (event, mass) {
            $scope.students = mass;
            toaster.pop('success', 'Roster uploaded');
        });

        $scope.$on('ass_invalidate', function () {
            $scope.teams = [];
        });

        $scope.$on(answer_service.dirty(), function () {
            toaster.pop('success', 'Answers submitted!');
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

        $scope.$on(add_project_service.dirty(), function() {
           toaster.pop('success', 'Project created');
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

        //Instant variables
        $scope.isUploaded = false;
        $scope.isCollapsed = true;
        $scope.showCourseReview = true;
        $scope.showUIView = false;
        $scope.students = [];
        var student_map = {};

        /* Get list of assignments */
        $http.get(Authentication.server_url + 'assignments/' + which_class).then(function (response) {
            $scope.assignments = response.data;
            if ($scope.assignments.length > 0) {
                $scope.assignment = $scope.assignments[$scope.assignments.length - 1];
            };

            $scope.assignment = ass_service.getAssignment();
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
                    if ($scope.assignment.pk != undefined) {
                        $http.get(Authentication.server_url + 'add_lfg/' + $scope.assignment.pk).then(function (response) {
                            $scope.lfgList = response.data;
                            $scope.lfgList.forEach(function (lfg) {
                                if (lfg.user_fk == student.user_type + '|' + student.email) {
                                    student['lfg'] = true;
                                };
                            });
                        });
                    };
                });

                if ($scope.students.length > 0) {
                    $scope.isUploaded = true;
                };
                for (var i = 0; i < response.data.length; i++) {
                    student_map[response.data[i].user_type + '|' + response.data[i].email] = i;
                };


                $scope.beforeDrop = function(event, ui, dropTeam) {
                    $scope.dropTeam = dropTeam;
                    $scope.sameTeamFlag = false;
                    $scope.dropTeam.members.forEach(function (mem) {
                        if (mem.email == $scope.dragStudent.email) {
                            $scope.sameTeamFlag = true;
                        }
                    });

                    drag_student_service.setDragStudent($scope.dragStudent);
                    drag_student_service.setDropTeam($scope.dropTeam);
                    drag_student_service.setDragTeam($scope.dragTeam);
                    drag_student_service.setSameTeamFlag($scope.sameTeamFlag);

                    var modalInstance = $modal.open({
                        templateUrl: 'partials/drag_student.html',
                        controller: 'DragStudentController'
                    });
                    return modalInstance.result;
                };


            });


            $http.get(Authentication.server_url + 'teams/' + ass_service.getAssignmentpk()).then(function (response) {
                $scope.teams = response.data;
                for (var i = 0; i < $scope.teams.length; i++) {
                    for (var j = 0; j < $scope.teams[i].members.length; j++) {
                        var member = $scope.teams[i].members[j];
                        $scope.teams[i].members[j] = $scope.students[student_map[member]];
                    }
                };
                $scope.haveGroupFlag = false;
                if ($scope.teams.length > 0) {
                    $scope.teams.forEach(function (team) {
                        if (team.members.length > 0) {
                            team.members.forEach(function (mem) {
                                if (mem != undefined && mem.email == $scope.user.email) {
                                    $scope.haveGroupFlag = true;
                                    $scope.myTeam = team;
                                    $scope.team = $scope.myTeam;
                                };
                            });
                        };
                    });
                };

                if ($scope.assignments.length > 0) {
                    $scope.assignment = $scope.assignments[$scope.assignments.length - 1];
                    ass_service.setAssignment($scope.assignment);
                };

                $scope.assignment = ass_service.getAssignment();

                $scope.isInterested = false;
                if ($scope.haveGroupFlag) {
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

                console.log($scope.teams + 'line 229');
            });
        });


        //Pass the key value of the current assignment to back end to randomly assign group
        $scope.randomAssign = function () {
            $scope.teams = [];
            console.log("Do we get here");
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

        //Pop toaster to inform user what the current tab is
        $scope.tabSelect = function (which_tab) {
            switch (which_tab) {
                case 'TEAM':
                    break;
                case 'TEAM.ADMIN':
                    break;
            }

        };

        this.hovered = undefined;

        //Check current assignment
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

        //Select Assignment in the navigation bar
        $scope.selectAssignment = function (id, pk, ass) {
            ass_service.setWhichAssignment(id);
            $scope.which_assignment = id;
            ass_service.setAssignmentpk(pk);
            $scope.assignment_pk = pk;
            ass_service.setAssignment(ass);
            $scope.assignment = ass;
            $scope.updateGroup();
        };

        $scope.hoverIn = function (team) {
            this.hovered = team;
        };

        $scope.hoverOut = function (team) {
            this.hovered = undefined;
        };


        //Select team in course overview
        $scope.selectTeam = function (team) {
            $scope.showUIViewContent();
            $scope.team = team;
            group_service.setGroup(team);
        };

        //Select student in student's roster
        $scope.selectStudent = function (stud) {
            $scope.showUIViewContent();
            $scope.current_student = stud;
            $scope.current_member = stud;
        };


        //Select member in course overview
        $scope.selectMember = function (member) {
            $scope.showUIViewContent();
            $scope.current_member = member;
        };


        //Update group after adding/removing member, requester or clicking on a new assignment
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

                $scope.haveGroupFlag = false;
                $scope.teams.forEach(function (team) {
                    if (team.members.length > 0) {
                        team.members.forEach(function (mem) {
                            if (mem != undefined && mem.email == $scope.user.email) {
                                $scope.haveGroupFlag = true;
                                $scope.myTeam = team;
                                $scope.team = $scope.myTeam;
                            };
                        });
                    };
                });
                $scope.isInterested = false;
                if ($scope.haveGroupFlag) {
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

        //Update Assignment after adding a new assignment
        $scope.updateAssignment = function () {
            $http.get(Authentication.server_url + 'assignments/' + which_class).then(function (response) {
                $scope.assignments = response.data;
            });
        };

        //Update list of questions after adding/editing/deleting questions
        $scope.updateQuestion = function () {
            $http.get(Authentication.server_url + 'questions/' + $stateParams.which_class).then(function (response) {
                $scope.questions = response.data;
            });
        };

        //Update list of answers after adding/editing/deleting answers
        $scope.updateAnswer = function () {
            $http.get(Authentication.server_url + 'answers/' + $stateParams.which_class).then(function (response) {
                $scope.questions = response.data;
            });
        };

        //Drag a student from student's roster
        $scope.startCallback = function(event, ui, stu) {
            $scope.dragStudentRosterFlag = true;
            $scope.dragStudent = stu;
            $scope.deleteMemberFlag = false;
            $scope.deleteTeamFlag = false;
            $scope.haveGroupFlag = false;
            $scope.teams.forEach(function (team) {
                team.members.forEach(function(mem) {
                    if (mem.email == $scope.dragStudent.email) {
                        $scope.haveGroupFlag = true;
                        $scope.dragTeam = team;
                    };
                });
            });
        };

        //We haven't implemented isOwner yet. This should be true for only the team leader
        $scope.isOwner = true;

        //Function to enable LFG
        $scope.enableLFG = function() {
            var dataObject = {};
            $scope.lfg = [];
            $scope.isLFG = true;
            $http.get(Authentication.server_url + 'add_lfg/' + ass_service.getAssignment().pk).then(function(response) {
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

        //Function to disable LFG
        $scope.disableLFG = function() {
            var dataObject = {};
            $scope.lfg = [];
            $scope.isLFG = false;
            $http.get(Authentication.server_url + 'add_lfg/' + ass_service.getAssignment().pk).then(function(response) {
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


        $scope.hasProfile = function (student) {
            return student.profile_img != null;
        };

        $scope.showGroup = function () {
            var i = 0;
            for (; i < $scope.teams.length; i++) {
                var j = 0;
                if ($scope.teams[i].members.length > 0) {
                    for (; j < $scope.teams[i].members.length; j++) {
                        if ($scope.user.email == $scope.teams[i].members[j].email) {
                            $scope.user_team_pk = $scope.team[i].pk;
                            $scope.team = $scope.teams[i];
                        }
                    }
                }
            }
        };


        //Drag and Drop Team Member in Course Overview
        $scope.delMemberFlag = false;
        $scope.delTeamFlag = false;

        $scope.startDragMemberInTeam = function(event, ui, stu, dragTeam) {
            $scope.dragStudentRosterFlag = false;
            $scope.dragStudent = stu;
            $scope.dragTeam = dragTeam;
            $scope.delTeamFlag = false;
            $scope.delMemberFlag = true;
        };

        $scope.deleteDragTeamOrMember  = function() {
            delete_team_member_service.setDragStudent($scope.dragStudent);
            delete_team_member_service.setDragTeam($scope.dragTeam);
            delete_team_member_service.setDelMemberFlag($scope.delMemberFlag);
            delete_team_member_service.setDelTeamFlag($scope.delTeamFlag);
            delete_team_member_service.setDragStudentRosterFlag($scope.dragStudentRosterFlag);

            var modalInstance = $modal.open({
                templateUrl: 'partials/delete_team_member.html',
                controller: 'DeleteTeamMemberController'
            });
            return modalInstance.result;
        };

        $scope.viewAssText = function() {

        };

        $scope.addRemoveMember = function(event, ui, mem) {
            $scope.deleteMember = mem;
            $scope.delMemberFlag = true;
        };

        $scope.denyRequester = function() {
            var modalInstance = $modal.open({
                templateUrl: 'partials/delete_requester.html',
                controller: 'DeleteRequesterController'
            });
            return modalInstance.result;
        };

        $scope.removeMember = function(event, ui, mem) {
            $scope.currentRequester = mem;
            $scope.delMemberFlag = true;
            $scope.deleteRequesterFlag = false;
        };

        $scope.addRemoveRequester = function(event, ui, mem) {
            $scope.currentRequester = mem;
            $scope.deleteRequesterFlag = true;
            $scope.delMemberFlag = false;
        };

        $scope.acceptRequester = function() {
            add_requester_service.setCurrentRequester($scope.currentRequester);
            add_requester_service.setDeleteRequesterFlag($scope.deleteRequesterFlag);
            add_requester_service.setMyTeam($scope.myTeam);

            var modalInstance = $modal.open({
                templateUrl: 'partials/add_requester.html',
                controller: 'AddRequesterController'
            });
            return modalInstance.result;
        };

        $scope.denyRequester = function() {
            delete_requester_service.setCurrentRequester($scope.currentRequester);
            delete_requester_service.setDelMemberFlag($scope.delMemberFlag);
            delete_requester_service.setDeleteRequesterFlag($scope.deleteRequesterFlag);
            delete_requester_service.setMyTeam($scope.myTeam);

            var modalInstance = $modal.open({
                templateUrl: 'partials/delete_requester.html',
                controller: 'DeleteRequesterController'
            });
            return modalInstance.result;
        };

        $scope.showCourseContent = function() {
            $scope.showCourseReview = true;
            $scope.showUIView = false;
        };

        $scope.showUIViewContent = function() {
            $scope.showCourseReview = false;
            $scope.showUIView = true;
        };

        var dataObject = {};

        dataObject['user'] = $scope.user;
        dataObject['which_assignment']  = $cookieStore.get('assignment_pk');
        console.log(dataObject);

        $http.post(Authentication.server_url + 'recommend_team/', dataObject).then(function(response) {
            $scope.recommendTeams  = response.data;
            console.log($scope.recommendTeams);
            console.log('line 607');
        });


        $http.post(Authentication.server_url + 'recommend_student/', dataObject).then(function(response) {
            $scope.recommendStudents = response.data;
        });

        /* Logout function */
        $scope.logout = function () {
            Authentication.logout();
        };
    }]);
