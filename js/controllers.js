var mainControllers = angular.module('mainControllers', ['ngAnimate']);

mainControllers.controller('PortalController', ['$http', '$location', '$scope', 'Authentication', function ($http, $location, $scope, Authentication) {
  var server_url = 'http://ec2-54-69-18-202.us-west-2.compute.amazonaws.com:8000/';
  //server_url = 'http://localhost:8000/';
  $scope.the_user = Authentication.getAuthenticatedAccount()['email'];

  /* Get list of courses */
  $http.get(server_url + 'courses/' + $scope.the_user).then(function (response) {
    //$scope.course_list = response.data;
    var course_list = response.data;
    course_list.forEach(function(course) {
      course.prof = course.course_professor.split("|")[1];
    });

    $scope.course_list = course_list;
  });

  /* Logout function */
  $scope.logout = function() {
    Authentication.logout();
  }
}]);

mainControllers.controller('CMainController', ['$http', '$scope', '$routeParams', 'Authentication', function ($http, $scope, $routeParams, Authentication) {
  var server_url = 'http://ec2-54-69-18-202.us-west-2.compute.amazonaws.com:8000/';
  //server_url = 'http://localhost:8000/';
  var which_class = $routeParams.which_class;

  $scope.the_user = Authentication.getAuthenticatedAccount()['email'];

  /* Get list of courses */
  $http.get(server_url + 'assignments/' + which_class).then(function (response) {
    $scope.assignments = response.data;
  });

  /* Logout function */
  $scope.logout = function() {
    Authentication.logout();
  }
}]);

mainControllers.controller('CredentialsController', ['$location', '$scope', 'Authentication', function($location, $scope, Authentication) {
  activate();

  function activate() {
    if (Authentication.isAuthenticated()) {
      $location.url('/portal');
    }
  }

  $scope.register = function (formData) {
    Authentication.register(formData);
  }

  $scope.login = function(formData) {
    Authentication.login(formData)
  }

}]);


mainControllers.controller('NavigationController', ['$location', '$scope', 'Authentication', '$rootScope', function($location, $scope, Authentication, $rootScope) {
    activate();

    function activate() {
        if (Authentication.isAuthenticated()) {
            $location.url('/portal');
        }
    }

    $rootScope.isActive = function(viewLocation) {
        return viewLocation === $location.path();
    }

    $scope.register = function (formData) {
        Authentication.register(formData);
    }

    $scope.login = function(formData) {
        Authentication.login(formData)
    }

    $scope.logout = function() {
        Authentication.logout();
    }

}]);


