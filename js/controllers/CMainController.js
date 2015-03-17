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
        //$scope.isProfessor = ($scope.user.user_type == 'INSTRUCTOR');
        $scope.isProfessor = true;
        $scope.isStudent = ($scope.user.user_type == 'STUDENT');
        $scope.assignment = $cookieStore.get('assignment');
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

        $http.get(Authentication.server_url + 'roster/' + $scope.course.pk).then(function (response) {
            $scope.students = response.data;
            if ($scope.students.length > 0) {
                $scope.isUploaded = true;
            }
            for (var i = 0; i < response.data.length; i++) {
                student_map[response.data[i].user_type + '|' + response.data[i].email] = i;
            }
        });

        var student_map = {};

        $rootScope.$on('rosterUpdated', function (event, mass) {
            $scope.students = mass;
            toaster.pop('success', 'Roster uploaded');
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

        $scope.$on('ass_invalidate', function () {
            $scope.teams = [];
        });

        $scope.$on(answer_service.dirty(), function () {
            toaster.pop('success', 'Answers successfully submitted!');
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
            toaster.pop('success', 'Student Dragged/Dropped');
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

        /* Get list of assignments */
        $http.get(Authentication.server_url + 'assignments/' + which_class).then(function (response) {
            $scope.assignments = response.data;
            // Index of assignment in assignments array
            ass_service.setAssignments(response.data);
            ass_service.setWhichAssignment($scope.assignments.length);
            ass_service.setAssignmentpk($scope.assignments[ass_service.getWhichAssignment() - 1].pk);
            $scope.which_assignment = ass_service.getWhichAssignment();

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

                $http.get(Authentication.server_url + 'roster/' + $scope.course.pk).then(function (response) {
                    $scope.students = response.data;
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
                                        console.log('Do we ever get here');
                                        console.log(student.email);
                                    };
                                };
                            });
                        });
                    });
                };
            });
        });

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
                console.log('ayyyyyyyy');
                console.log($scope.teams.length);
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
                            console.log('Do we ever get here');
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
                                        console.log('Do we ever get here');
                                        console.log(student.email);
                                    }
                                }
                                ;
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

        $scope.hasProfile = function (student) {
            return student.profile_img != null;
        };

        $scope.selectTeam = function (team) {

            $cookieStore.put('team', team);
            group_service.setGroup(team);
            $scope.changeBackButton = true;
        };

        $scope.selectStudent = function (stud) {
            $cookieStore.put('student', stud);
            $scope.changeBackButton = true;
        }

        $scope.selectMember = function (member) {
            $cookieStore.put('member', member);
            $scope.changeBackButton = true;
        }

        $scope.portalBack = function () {
            $scope.changeBackButton = false;
        }

        $scope.showGroup = function () {
            $scope.changeBackButton = true;
            var i = 0;
            for (; i < $scope.teams.length; i++) {
                var j = 0;
                if ($scope.teams[i].members.length > 0) {
                    for (; j < $scope.teams[i].members.length; j++) {
                        if ($cookieStore.get('user_email') == $scope.teams[i].members[j].email) {
                            $cookieStore.put('user_team_pk', $scope.teams[i].pk);
                            $cookieStore.put('team', $scope.teams[i]);
                        }
                    }
                }
            }
        };

        $scope.startCallback = function(event, ui, stu) {
            console.log('You started draggin: ');
            $cookieStore.put('dragStudent', stu)
            $cookieStore.put('haveGroup', false);
            $scope.teams.forEach(function (team) {
                team.members.forEach(function(mem) {
                    if (mem.email == $cookieStore.get('dragStudent').email) {
                        $cookieStore.put('haveGroup', true);
                        $cookieStore.put('dragTeam', team);
                    };
                });
            });


            console.log(stu.email);
            $cookieStore.put('deleteTeam', false);
            $cookieStore.put('deleteMember', true);
        };

        $cookieStore.put('deleteMember', false);
        $cookieStore.put('deleteTeam', false);

        $scope.startDragMemberInTeam = function(event, ui, stu, dragTeam) {
            console.log('You started draggin: ');
            $cookieStore.put('dragStudent', stu);
            $cookieStore.put('dragTeam', dragTeam);
            $cookieStore.put('deleteTeam', false);
            $cookieStore.put('deleteMember', true);
            console.log(stu.email);
        };


        $http.get(Authentication.server_url + 'roster/' + $scope.course.pk).then(function (response) {
            $scope.students = response.data;
            if ($scope.students.length > 0) {
                $scope.isUploaded = true;
            };
            for (var i = 0; i < response.data.length; i++) {
                student_map[response.data[i].user_type + '|' + response.data[i].email] = i;
            };


            $scope.beforeDrop = function(event, ui, dropTeam) {
                console.log($cookieStore.get('dragStudent').name);
                $cookieStore.put('dropTeam', dropTeam);
                console.log($cookieStore.get('dropTeam').name);
                console.log('line 246');
                $cookieStore.put('sameTeam', false);
                $cookieStore.get('dropTeam').members.forEach(function (mem) {
                    if (mem.email == $cookieStore.get('dragStudent').email) {
                        $cookieStore.put('sameTeam', true);
                    }
                });
                console.log($cookieStore.get('sameTeam'));
                console.log('It should return false');
                var modalInstance = $modal.open({
                    templateUrl: 'partials/drag_student.html',
                    controller: 'DragStudentController'
                });
                return modalInstance.result;

            };

        });

        $scope.deleteDragTeamOrMember  = function() {
            var modalInstance = $modal.open({
                templateUrl: 'partials/delete_team_member.html',
                controller: 'DeleteTeamMemberController'
            });
            return modalInstance.result;
        };

        $scope.viewAssText = function() {

        };

        $scope.startDragTeam = function(event, ui, dragGroup) {
            $cookieStore.put('deleteTeam', true);
            $cookieStore.put('deleteMember', false);
            $cookieStore.put('dragTeam', dragGroup);
        };

        $scope.isOwner = true;

        $scope.addRemoveMember = function(event, ui, mem) {
            $cookieStore.put('deleteMember', mem);
            $cookieStore.put('delMem', true);
        };

        $scope.addRemoveRequester = function(event, ui, mem) {
            $cookieStore.put('currentRequester', mem);
            $cookieStore.put('deleteRequester', true);
        };

        $scope.acceptRequester = function() {
            var modalInstance = $modal.open({
                templateUrl: 'partials/add_requester.html',
                controller: 'AddRequesterController'
            });
            return modalInstance.result;
        };

        $scope.denyRequester = function() {
            var modalInstance = $modal.open({
                templateUrl: 'partials/delete_requester.html',
                controller: 'DeleteRequesterController'
            });
            return modalInstance.result;
        };

        $scope.enableLFG = function() {
            var dataObject = {};
            dataObject['ass_pk'] = $scope.assignment.pk;
            dataObject['user']= $scope.user.user_type + '|' +$scope.user.email;
            dataObject['value'] = true;
            var responsePromise = $http.put(Authentication.server_url + 'add_lfg', dataObject, {});
            responsePromise.success(function () {
                toaster.pop('success', 'Enable LFG');
            });
            responsePromise.error(function (data) {
                console.log(data);
                console.log(dataObject);
            });
        };

        $scope.disableLFG = function() {
            var dataObject = {};
            dataObject['ass_pk'] = $scope.assignment.pk;
            dataObject['user']= $scope.user.user_type + '|' +$scope.user.email;
            dataObject['value'] = false;
            var responsePromise = $http.put(Authentication.server_url + 'add_lfg', dataObject, {});
            responsePromise.success(function () {
                toaster.pop('success', 'Disable LFG');
            });
            responsePromise.error(function (data) {
                console.log(data);
                console.log(dataObject);
            });
        };

        /* Logout function */
        $scope.logout = function () {
            Authentication.logout();
        };
    }
])
;
