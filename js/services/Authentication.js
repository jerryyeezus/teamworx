myApp.factory('Authentication', function ($http, $cookies) {

    return {
        getAuthenticatedAccount: getAuthenticatedAccount,
        isAuthenticated: isAuthenticated,
        login: login,
        logout: logout,
        register: register,
        setAuthenticatedAccount: setAuthenticatedAccount,
        unauthenticate: unauthenticate,
        updateAuthenticatedAccount: updateAuthenticatedAccount,
        server_url: server_url
    };

    function getAuthenticatedAccount() {
        if (!$cookies.authenticatedAccount) {
            return;
        }

        return JSON.parse($cookies.authenticatedAccount);
    };

    function isAuthenticated() {
        return !!$cookies.authenticatedAccount;
    };

    function login(formData) {
        console.log(server_url);
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
    };

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
    };

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
    };

    function setAuthenticatedAccount(account) {
        $cookies.authenticatedAccount = JSON.stringify(account);
    };

    function updateAuthenticatedAccount(which_field, data) {
        var cpy = $cookies.authenticatedAccount;
        var account = JSON.parse(cpy);
        switch (which_field) {
            case 'bio':
                account.bio = data;
                $cookies.authenticatedAccount = JSON.stringify(account);
                break;
            case 'name':
                account.name = data;
                $cookies.authenticatedAccount = JSON.stringify(account);
                break;
            case 'linkedin':
                account.linkedin = data;
                $cookies.authenticatedAccount = JSON.stringify(account);
                break;
            case 'github':
                account.github = data;
                $cookies.authenticatedAccount = JSON.stringify(account);
                break;
            case 'skills_str':
                account.skills_str = data;
                $cookies.authenticatedAccount = JSON.stringify(account);
                break;
        }
    };

    function unauthenticate() {
        delete $cookies.authenticatedAccount;
    };
});
