var myApp = angular.module('myApp', [
    'ngRoute',
    'mainControllers',
    'ngCookies'
]);


myApp.factory('Authentication', function ($http, $cookies){
    var server_url = 'http://ec2-54-69-18-202.us-west-2.compute.amazonaws.com:8000/';

    return {
        getAuthenticatedAccount: getAuthenticatedAccount,
        isAuthenticated: isAuthenticated,
        login: login,
        logout: logout,
        register: register,
        setAuthenticatedAccount: setAuthenticatedAccount,
        unauthenticate: unauthenticate
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

            window.location = '/teamworx/index.html#/portal';
            alert('Success! Logged in')
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

            window.location = '/teamworx/index.html#/';
        }

        function logoutErrorFn(data, status, headers, config) {
            alert('Epic failure!');
        }
    }

    function register(formData) {
        $http.post(server_url + 'register/', {
            email: formData.the_email,
            user_type: formData.user_type,
            password: formData.password,
            confirm_password: formData.confirm_password
        }).then(registerSuccessFn, registerErrorFn);

        function registerSuccessFn(data, status, headers, config) {
            // Login after we register
            login(formData);
        }

        function registerErrorFn(data, status, headers, config) {
            alert('Register failed!')
        }
    }

    function setAuthenticatedAccount(account) {
        $cookies.authenticatedAccount = JSON.stringify(account);
    }

    function unauthenticate() {
        delete $cookies.authenticatedAccount;
    }
});

myApp.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
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
        .when('/register', {
            templateUrl: 'partials/register.html',
            controller: 'CredentialsController'
        })
        .otherwise({
            redirectTo: '/login'
    });
}]);
