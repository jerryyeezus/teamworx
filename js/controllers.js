var mainControllers = angular.module('mainControllers', ['ngAnimate']);

mainControllers.controller('PortalController', ['$location', '$scope', 'Authentication', function ($location, $scope, Authentication) {
  $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
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

