mainControllers.controller('AdminController', ['$http', '$state', '$stateParams', 'Authentication',
    '$scope', '$rootScope', '$cookieStore', '$modal', 'toaster',
    function ($http, $state, $stateParams, Authentication, $scope, $rootScope, $cookieStore,
              $modal, toaster) {

        $scope.updateProfile = function (which_field, data, user_type, user_email) {
            var dataObject = {};
            dataObject['which_field'] = which_field;
            dataObject['which_team'] =$scope.team.pk;
            dataObject['which_action'] = 'update';
            dataObject['field_value'] = data;
            dataObject['which_student'] = user_type + '|' + user_email;
            console.log(dataObject);
            console.log('line 23');
            $http.put(Authentication.server_url + 'add_team/', dataObject, {});
            Authentication.updateAuthenticatedAccount(which_field, data);
        };


        $http.get(Authentication.server_url + 'projects/' + $cookieStore.get('assignment_pk')).then (function(response) {
            $scope.projects = response.data;
            $scope.possibleProjects = [];
            $scope.projects.forEach(function(project) {
                var flag = false;
                $scope.myTeam.project_pref.forEach(function(pro) {
                    if (pro.pk == project.pk) {
                        flag = true;
                    }
                })
                if (!flag) {
                    $scope.possibleProjects.push(project);
                }
            });
            console.log($scope.possibleProjects);
        });


        $scope.addPref = function(project) {
            var dataObject = {};
            dataObject['which_project'] = project.pk;
            dataObject['which_team'] = $scope.myTeam.pk;
            $http.put(Authentication.server_url + 'add_project_pref/', dataObject, {}).then(function() {
                console.log("Do we get here");
                $scope.myTeam.project_pref.push(project);
                var newPossibleProjects = [];
                $scope.possibleProjects.forEach(function(p) {
                    if (p.pk != project.pk) {
                        newPossibleProjects.push(p);
                    }
                });
                $scope.possibleProjects = newPossibleProjects;
            }
        )};

        $scope.hoverIn = function (team) {
            this.hovered = team;
        };

        $scope.hoverOut = function (team) {
            this.hovered = undefined;
        };

        $scope.enableLFM = function() {
            var dataObject = {};
            dataObject['which_field'] = 'lfm';
            dataObject['which_team'] = $scope.team.pk;
            dataObject['which_action'] = 'update';
            dataObject['field_value'] = true;
            dataObject['which_student'] = $scope.user.user_type + '|' + $scope.user.email;
            var responsePromise = $http.put(Authentication.server_url + 'add_team/', dataObject, {});
            responsePromise.success(function () {
                toaster.pop('success', 'Enable LFM');
            });
            responsePromise.error(function (data) {
            });

        };

        $scope.disableLFM = function() {
            var dataObject = {};
            dataObject['which_field'] = 'lfm';
            dataObject['which_team'] = $scope.team.pk;
            dataObject['which_action'] = 'update';
            dataObject['field_value'] = false;
            dataObject['which_student'] = $scope.user.user_type + '|' + $scope.user.email;
            var responsePromise = $http.put(Authentication.server_url + 'add_team/', dataObject, {});
            responsePromise.success(function () {
                toaster.pop('success', 'Disable LFM');
            });
            responsePromise.error(function (data) {
            });

        };
    }]);
