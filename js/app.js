var myApp = angular.module('myApp', [
    'mainControllers',
    'ngCookies',
    'ui.bootstrap',
    'toaster',
    'ui.router'
]);

// flag
var DEBUG = false;
var server_url = 'http://ec2-54-69-18-202.us-west-2.compute.amazonaws.com:8000/';
if (DEBUG)
    server_url = 'http://localhost:8000/';

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
            onExit: ['$state', function($state) {
                $(".wrapper").addClass("zout")
            }],
            onEnter: ['$state', function($state) {
                $(".wrapper").removeClass("zout")
            }]
        },
        portal = {
            name: 'portal',
            url: '/portal',
            templateUrl: 'partials/portal.html',
            controller: 'PortalController',
            onEnter: ['$state', function($state) {
                $(".wrapper").addClass("zout")
            }]
        }, main = {
            name: 'main',
            url: '/main/:which_class',
            templateUrl: 'partials/main.html',
            controller: 'CMainController',
            reloadOnSearch: false, // TODO not sure what this does but..
            onExit: ['$state', function($state) {
                $(".wrapper").removeClass("move")
            }],
            onEnter: ['$state', function($state) {
                $(".wrapper").removeClass('zout');
                $(".wrapper").addClass("move")
            }]
        }, question = {
            name: 'question',
            url: '/question/:which_class',
            templateUrl: 'partials/question.html',
            controller: 'QuestionController'
        }, groupProfile = {
            name: 'groupProfile',
            url: '/groupProfile/:assignmentpk',
            templateUrl: 'partials/groupProfile.html',
            controller: 'GroupProfileController'
        }, studentProfile = {
            name: 'studentProfile',
            url: '/studentProfile/:assignmentpk',
            templateUrl: 'partials/studentProfile.html',
            controller: 'StudentProfileController'
        },register = {
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
        }, edit_professor_profile = {
            name: 'portal.edit_professor_profile',
            url: '/portal/edit_professor_profile',
            onEnter: ['$stateParams', '$state', '$modal', function ($stateParams, $state, $modal) {
                $modal.open({
                    templateUrl: 'partials/edit_professor_profile.html',
                    controller: 'EditProfessorController'
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
        },add_group = {
            name: 'main.add_group',
            url: '/add_group/:which_class',
            onEnter: ['$stateParams', '$state', '$modal', function ($stateParams, $state, $modal) {
                $modal.open({
                    templateUrl: 'partials/add_group.html',
                    controller: 'AddGroupController'
                }).result.finally(function () {
                        $state.go('^');
                    });
            }]
        }, add_question = {
            name: 'question.add_question',
            url: '/add_question/:which_class',
            onEnter: ['$stateParams', '$state', '$modal', function ($stateParams, $state, $modal) {
                $modal.open({
                    templateUrl: 'partials/add_question.html',
                    controller: 'AddQuestionController'
                }).result.finally(function () {
                        $state.go('^');
                    });
            }]
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
    $stateProvider.state(register);

    var portal_state = $stateProvider.state(portal)
    portal_state.state(create_class);
    portal_state.state(edit_professor_profile);

    var question_state = $stateProvider.state(question)
    question_state.state(add_question);

    var groupProfile_state = $stateProvider.state(groupProfile);
    //Add more later on
    var studentProfile_state = $stateProvider.state(studentProfile);
    //Add more later on

    $urlRouterProvider.otherwise('/login');

}]);

var mainControllers = angular.module('mainControllers', ['ngAnimate']);
