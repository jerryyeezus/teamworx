var myApp = angular.module('myApp', [
    'mainControllers',
    'ngCookies',
    'ui.bootstrap',
    'toaster',
    'ui.router',
    'xeditable',
    'ngDragDrop'
]);

// flag
var DEBUG = false;
var server_url = 'http://ec2-54-69-18-202.us-west-2.compute.amazonaws.com:8000/';
if (DEBUG)
    server_url = 'http://localhost:8000/';

myApp.run(function (editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

myApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

myApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    var home = {
            name: 'home',
            url: '/login',
            templateUrl: 'partials/login.html',
            controller: 'CredentialsController',
            onExit: ['$state', function ($state) {
                $(".wrapper").addClass("zout")
            }],
            onEnter: ['$state', function ($state) {
                $(".wrapper").removeClass("zout")
            }]
        },
        portal = {
            name: 'portal',
            url: '/portal',
            templateUrl: 'partials/portal.html',
            controller: 'PortalController',
            onEnter: ['$state', function ($state) {
                $(".wrapper").addClass("zout")
            }]
        }, main = {
            name: 'main',
            url: '/main/:which_class',
            templateUrl: 'partials/main.html',
            controller: 'CMainController',
            reloadOnSearch: false, // TODO not sure what this does but..
            onExit: ['$state', function ($state) {
                $(".wrapper").removeClass("move")
            }],
            onEnter: ['$state', function ($state) {
                $(".wrapper").removeClass('zout');
                $(".wrapper").addClass("move")
            }]
        }, question = {
            name: 'main.question',
            url: '/question/:which_class',
            templateUrl: 'partials/question.html',
            controller: 'QuestionController'
        },view_request = {
            name: 'main.view_request',
            url: '/view_request/:which_assignment',
            templateUrl: 'partials/view_request.html',
            controller: 'ViewRequestController'
        }, groupProfile = {
            name: 'main.groupProfile',
            url: '/groupProfile/:team_pk',
            templateUrl: 'partials/groupProfile.html',
            controller: 'GroupProfileController'
        }, studentProfile = {
            name: 'main.studentProfile',
            url: '/studentProfile',
            templateUrl: 'partials/studentProfile.html',
            controller: 'StudentProfileController'
        }, team_overview = {
            name: 'main.team_overview',
            url: '/team_overview/:which_assignment',
            templateUrl: 'partials/team_overview.html',
            controller: 'TeamOverviewController'
        }, admin = {
            name: 'main.admin',
            url: '/admin/:which_assignment',
            templateUrl: 'partials/admin.html',
            controller: 'AdminController'
        }, pending_request = {
            name: 'main.pending_request',
            url: '/pending_request/:which_assignment',
            templateUrl: 'partials/pending_request.html',
            controller: 'PendingRequestController'
        }, register = {
            name: 'register',
            url: '/register',
            templateUrl: 'partials/register.html',
            controller: 'CredentialsController'
        }, create_class = {
            name: 'portal.create_class',
            url: '/portal/create_class',
            onEnter: ['$stateParams', '$state', '$modal', function ($stateParams, $state, $modal) {
                $modal.open({
                    templateUrl: 'partials/add_class.html',
                    controller: 'AddCourseController'
                }).result.finally(function () {
                        $state.go('^');
                    });
            }]
        }, delete_class = {
            name: 'portal.delete_class',
            url: '/portal/delete_class',
            onEnter: ['$stateParams', '$state', '$modal', function ($stateParams, $state, $modal) {
                $modal.open({
                    templateUrl: 'partials/delete_class.html',
                    controller: 'DeleteCourseController'
                }).result.finally(function () {
                        $state.go('^');
                    });
            }]
        }, add_assignment = {
            name: 'main.add_assignment',
            url: '/add_assignment/:which_class',
            onEnter: ['$stateParams', '$state', '$modal', function ($stateParams, $state, $modal) {
                $modal.open({
                    templateUrl: 'partials/add_assignment.html',
                    controller: 'AddAssignmentController'
                }).result.finally(function () {
                        $state.go('^');
                    });
            }]
        }, add_project = {
            name: 'main.add_project',
            url: '/add_assignment/:which_assignment',
            onEnter: ['$stateParams', '$state', '$modal', function ($stateParams, $state, $modal) {
                $modal.open({
                    templateUrl: 'partials/add_project.html',
                    controller: 'AddProjectController'
                }).result.finally(function () {
                        $state.go('^');
                    });
            }]
        }, add_group = {
            name: 'main.add_group',
            url: '/add_group/:which_assignment',
            onEnter: ['$stateParams', '$state', '$modal', function ($stateParams, $state, $modal) {
                $modal.open({
                    templateUrl: 'partials/add_group.html',
                    controller: 'AddGroupController'
                }).result.finally(function () {
                        $state.go('^');
                    });
            }]
        }, drag_student = {
            name: 'main.drag_student',
            url: '/drag_student/:which_assignment',
            onEnter: ['$stateParams', '$state', '$modal', function ($stateParams, $state, $modal) {
                $modal.open({
                    templateUrl: 'partials/drag_student.html',
                    controller: 'DragStudentController'
                }).result.finally(function () {
                        $state.go('^');
                    });
            }]
        }, add_requester = {
            name: 'main.add_requester',
            url: '/add_requester/:which_assignment',
            onEnter: ['$stateParams', '$state', '$modal', function ($stateParams, $state, $modal) {
                $modal.open({
                    templateUrl: 'partials/add_requester.html',
                    controller: 'AddRequesterController'
                }).result.finally(function () {
                        $state.go('^');
                    });
            }]
        }, delete_team_member = {
            name: 'main.delete_team_member',
            url: '/delete_team_member/:which_class',
            onEnter: ['$stateParams', '$state', '$modal', function ($stateParams, $state, $modal) {
                $modal.open({
                    templateUrl: 'partials/delete_team_member.html',
                    controller: 'DeleteTeamMemberController'
                }).result.finally(function () {
                        $state.go('^');
                    });
            }]
        }, delete_requester = {
            name: 'main.delete_requester',
            url: '/delete_requester/:which_assignment',
            onEnter: ['$stateParams', '$state', '$modal', function ($stateParams, $state, $modal) {
                $modal.open({
                    templateUrl: 'partials/delete_requester.html',
                    controller: 'DeleteRequesterController'
                }).result.finally(function () {
                        $state.go('^');
                    });
            }]
        }, view_assignment_text = {
            name: 'main.view_assignment_text',
            url: '/view_assignment_text/:which_assignment',
            onEnter: ['$stateParams', '$state', '$modal', function ($stateParams, $state, $modal) {
                $modal.open({
                    templateUrl: 'partials/view_assignment_text.html',
                    controller: 'ViewAssignmentTextController'
                }).result.finally(function () {
                        $state.go('^');
                    });
            }]
        }, view_notification = {
            name: 'main.view_notification',
            url: '/view_notification/:which_class',
            onEnter: ['$stateParams', '$state', '$modal', function ($stateParams, $state, $modal) {
                $modal.open({
                    templateUrl: 'partials/view_notification.html',
                    controller: 'ViewNotificationController'
                }).result.finally(function () {
                        $state.go('^');
                    });
            }]
        }, answer_question = {
            name: 'main.answer_question',
            url: '/answer_question/:which_ass',
            templateUrl: 'partials/answer_question.html',
            controller: 'AnswerQuestionController'
        }, import_roster = {
            name: 'main.import_roster',
            onEnter: ['$stateParams', '$state', '$modal', function ($stateParams, $state, $modal) {
                $modal.open({
                    templateUrl: 'partials/upload_form.html',
                    controller: 'UploadController'
                }).result.finally(function () {
                        $state.go('^');
                    });
            }]
        };


    $stateProvider.state(home);
    var main_state = $stateProvider.state(main)
    main_state.state(import_roster);
    main_state.state(add_assignment);
    main_state.state(add_group);
    main_state.state(groupProfile);
    main_state.state(studentProfile);
    main_state.state(question);
    main_state.state(answer_question);
    main_state.state(drag_student);
    main_state.state(delete_team_member);
    main_state.state(view_request);
    main_state.state(view_assignment_text);
    main_state.state(add_requester);
    main_state.state(delete_requester);
    main_state.state(view_notification);
    main_state.state(pending_request);
    main_state.state(team_overview);
    main_state.state(admin);
    main_state.state(add_project)
    $stateProvider.state(register);

    var portal_state = $stateProvider.state(portal)
    portal_state.state(create_class);
    portal_state.state(delete_class);

    $urlRouterProvider.otherwise('/login');

}]);

myApp.directive('customPopover', function () {
    return {
        restrict: 'A',
        //template: '<span></span>',
        link: function (scope, el, attrs) {
            $(el).popover({
                trigger: 'hover',
                html: true,
                title: attrs.popoverTitle,
                content: attrs.popoverHtml,
                placement: attrs.popoverPlacement
            });
        }
    }
});

myApp.filter('capitalize', function () {
    return function (input, all) {
        return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }) : '';
    }
});
var mainControllers = angular.module('mainControllers', ['ngAnimate']);
