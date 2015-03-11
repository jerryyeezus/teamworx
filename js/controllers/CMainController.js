/**
 * Created by yee on 3/1/15.
 */

mainControllers.controller('CMainController', ['$http', '$stateParams', 'Authentication',
    '$scope', '$rootScope', '$cookieStore', '$modal', '$window', 'fileUpload', 'toaster', 'ass_service', 'group_service',
    'question_service',
    function ($http, $stateParams, Authentication, $scope, $rootScope, $cookieStore,
              $modal, $window, $fileUpload, toaster, ass_service, group_service, question_service) {

        $scope.course = $cookieStore.get('course');
        $scope.user = Authentication.getAuthenticatedAccount();
        var which_class = $stateParams.which_class;
        $scope.my_pk = which_class;
        $scope.the_user = Authentication.getAuthenticatedAccount()['name'];
        ass_service.init($scope);
        group_service.init($scope);
        question_service.init($scope);
        $scope.isUploaded = false;
        $scope.changeBackButton = false;

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
            $scope.students = mass
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

        $scope.$on(ass_service.dirty(), function () {
            $scope.teams = [];
            $scope.assignments = ass_service.getAssignments();
            $scope.which_assignment = ass_service.getWhichAssignment();
            $scope.assignment_pk = ass_service.getAssignmentpk();
            toaster.pop('success', 'Assignment created!');
            $scope.updateAssignment();
            $scope.updateGroup();
        });

        $scope.$on(group_service.dirty(), function () {
            toaster.pop('success', 'Group created!');
            $scope.updateGroup();
        });

        $scope.$on(question_service.dirty(), function () {
            toaster.pop('success', 'Question created!');
            $scope.updateQuestion();
        });

        $scope.$on(question_service.dirty(), function () {
            toaster.pop('success', 'Answer created!');
            $scope.updateAnswer();
        });

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
                }
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
                }
                console.log('ayyyyyyyy');
                console.log($scope.teams.length);
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


        }


        /* Logout function */
        $scope.logout = function () {
            Authentication.logout();
        };
    }
])
;
