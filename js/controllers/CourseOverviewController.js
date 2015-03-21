mainControllers.controller('CourseOverviewController', ['$http', '$stateParams', 'Authentication',
    '$scope', '$rootScope', '$cookieStore', '$modal',
    function ($http, $stateParams, Authentication, $scope, $rootScope, $cookieStore,
              $modal) {
        $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
        $scope.assignment = $cookieStore.get('assignment');
        $scope.user = Authentication.getAuthenticatedAccount();
        $scope.course = $cookieStore.get('course');

        var which_class = $scope.course.pk;
        var student_map = {};

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
            $cookieStore.put('member', stud);
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
        $cookieStore.put('deleteMember', false);
        $cookieStore.put('deleteTeam', false);

        $scope.startDragMemberInTeam = function(event, ui, stu, dragTeam) {
            console.log('You started draggin: ');
            $cookieStore.put('dragStudentRoster', false);
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
    }]);
