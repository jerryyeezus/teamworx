var myApp = angular.module('myApp', [
    'ngRoute',
    'mainControllers',
    'ngCookies',
    'ui.bootstrap',
    'toaster'
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

myApp.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function (file, uploadUrl, pk) {
        var fd = new FormData();
        fd.append('import_csv', file);
        fd.append('pk', pk);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function () {
                alert("Student Roster Uploaded!");
            })
            .error(function () {
                alert('Error uploading!')
            });
    }
}]);

myApp.factory('Authentication', function ($http, $cookies) {

    return {
        getAuthenticatedAccount: getAuthenticatedAccount,
        isAuthenticated: isAuthenticated,
        login: login,
        logout: logout,
        register: register,
        setAuthenticatedAccount: setAuthenticatedAccount,
        unauthenticate: unauthenticate,
        server_url: server_url
    }

    function getAuthenticatedAccount() {
        if (!$cookies.authenticatedAccount) {
            return;
        }

        return JSON.parse($cookies.authenticatedAccount);
    }

    function isAuthenticated() {
        return !!$cookies.authenticatedAccount;
    }

    function login(formData) {
        return $http.post(server_url + 'login/', {
            email: formData.the_email, password: formData.password, user_type: formData.user_type
        }).then(loginSuccessFn, loginErrorFn);

        function loginSuccessFn(data, status, headers, config) {
            setAuthenticatedAccount(data.data);

            window.location = 'index.html#/portal';
        }

        function loginErrorFn(data, status, headers, config) {
            alert('Error: Couldn\'t log in');
        }
    }

    function logout() {
        return $http.post(server_url + 'logout/')
            .then(logoutSuccessFn, logoutErrorFn);

        function logoutSuccessFn(data, status, headers, config) {
            unauthenticate();

            window.location = 'index.html#/';
        }

        function logoutErrorFn(data, status, headers, config) {
            alert('Epic failure!');
        }
    }

    function register(formData2) {
        console.log(formData2);
        $http.post(server_url + 'register/', {
            name: formData2.the_name,
            skills_str: '',
            email: formData2.the_email,
            user_type: formData2.user_type,
            password: formData2.password,
            confirm_password: formData2.confirm_password
        }).then(registerSuccessFn, registerErrorFn);

        function registerSuccessFn(data, status, headers, config) {
            // Login after we register
            login(formData2);
        }

        function registerErrorFn(data, status, headers, config) {
            alert('Register failed!\nError: ' + data['data']['status']);
            console.log(data['data']['message']);
        }
    }

    function setAuthenticatedAccount(account) {
        $cookies.authenticatedAccount = JSON.stringify(account);
    }

    function unauthenticate() {
        delete $cookies.authenticatedAccount;
    }
});

myApp.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $routeProvider.
        when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'CredentialsController'
        })
        .when('/portal', {
            templateUrl: 'partials/portal.html',
            controller: 'PortalController'
        })
        .when('/main/:which_class', {
            templateUrl: 'partials/main.html',
            controller: 'CMainController'
        })
        .when('/register', {
            templateUrl: 'partials/register.html',
            controller: 'CredentialsController'
        })
        //.when('/create_class', {
        //    templateUrl: 'partials/create_class.html',
        //    controller: 'AddCourseController'
        //})

        .when('/add_assignment/:which_class', {
            templateUrl: 'partials/add_assignment.html',
            controller: 'AddAssignmentController'
        })

        .when('/import', {
            templateUrl: 'modalContainer',
            controller: 'UploadController'
        })

        .when('/assignment/:which_class', {
            templateUrl: 'partials/assignment.html',
            controller: 'AssignmentController'
        })


        .when('/add_question', {
            templateUrl: 'partials/add_question.html',
            controller: 'AddQuestionController'
        })

        .otherwise({
            redirectTo: '/login'
        });
}]);
