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
        $scope.isUploaded = ass_service.getIsUploaded();

        $rootScope.$on('rosterUpdated', function (event, mass) {
            $scope.students = mass
            ass_service.setIsUploaded(true);
            $scope.isUploaded = ass_service.getIsUploaded();
            console.log($scope.isUploaded);
            toaster.pop('success', 'Roster uploaded');
        });

        $scope.randomAssign = function () {
            var dataObject = {
                which_assignment: ass_service.getAssignmentpk()
            };
            var responsePromise = $http.post(Authentication.server_url + 'generate_teams/', dataObject, {});
            responsePromise.success(function () {
                $scope.updateGroup();
            });
            responsePromise.error(function (data) {
                console.log(data);
                console.log(dataObject);
            });
            toaster.pop('success', 'Random Groups Created');
        };

        $scope.$on(ass_service.dirty(), function () {
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

        $http.get(Authentication.server_url + 'roster/' + $scope.course.pk).then(function (response) {
            $scope.students = response.data;
            if ($scope.students != null) {
                $scope.isUploaded = true;
            }
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
            });
        });

        $scope.deleteCourse = function () {
            alert('ayyyy lmao');
        };

        $scope.is_current_assignment = function (num) {
            return ass_service.getWhichAssignment() == num;
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
            console.log(ass_service.getAssignmentpk());
            $http.get(Authentication.server_url + 'teams/' + ass_service.getAssignmentpk()).then(function (response) {
                $scope.teams = response.data;
            });
        };

        $scope.updateAssignment = function() {
            $http.get(Authentication.server_url + 'assignments/' + which_class).then(function (response) {
                $scope.assignments = response.data;
            });
        };
        $scope.updateQuestion = function() {
            $http.get(Authentication.server_url + 'questions/' + $stateParams.which_class).then(function (response) {
                $scope.questions = response.data;
            });
        };

        $scope.hasProfile = function (student) {
            return student.profile_img != null;
        };

        $scope.selectTeam = function(team) {
            $cookieStore.put('team', team);
            console.log(ass_service.getAssignmentpk());
            window.location.href = "#groupProfile/" + ass_service.getAssignmentpk();
        };
        /* Logout function */
        $scope.logout = function () {
            Authentication.logout();
        };
    }
])
;
