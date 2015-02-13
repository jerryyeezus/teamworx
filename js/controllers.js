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
  $scope.my_pk = which_class;

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

mainControllers.controller("AddCourseController", ['$scope', '$http', 'Authentication', function($scope, $http, Authentication) {
    $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
    $scope.submitTheForm = function(formData) {
        var dataObject = {
            course_dept_and_id : $scope.myForm.course_dept + ' ' + $scope.myForm.course_id
            ,course_name  : $scope.myForm.course_name
            ,course_professor  : "INSTRUCTOR|" + $scope.the_user
        };

        var responsePromise = $http.post('http://ec2-54-69-18-202.us-west-2.compute.amazonaws.com:8000/add_courses/', dataObject, {});
        responsePromise.success(function(dataFromServer, status, headers, config) {
            console.log(dataFromServer.title);
            console.log(dataObject);
            alert("Course created!");
        });
        responsePromise.error(function(data, status, headers, config) {
            alert("Submitting form failed!");
            console.log(dataObject);
        });
    }
}]);

mainControllers.controller("AddAssignmentController", ['$scope', '$http',  '$routeParams', 'Authentication', function($scope, $http, $routeParams, Authentication) {
    $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
    $scope.course = "";

    $scope.submitTheForm = function(formData) {
        var dataObject = {

            course_fk : $routeParams.which_class
            ,assignment_number  : $scope.myForm.assignment_number
            ,assignment_title: $scope.myForm.assignment_title
            ,assignment_text: $scope.myForm.assignment_text

        };

        console.log(dataObject);


        var responsePromise = $http.post('http://ec2-54-69-18-202.us-west-2.compute.amazonaws.com:8000/add_assignment/', dataObject, {});
        responsePromise.success(function(dataFromServer, status, headers, config) {
            console.log(dataFromServer.title);
            console.log(dataObject);
            alert("Assignment created!");
        });
        responsePromise.error(function(data, status, headers, config) {
            alert("Submitting form failed!");
            console.log(dataObject);
        });
    }
}]);