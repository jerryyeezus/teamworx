/**
 * Created by thangnguyen on 3/14/15.
 */
mainControllers.controller('ViewAssignmentTextController',
    ['$http', '$location', 'Authentication', '$scope', '$rootScope', '$cookieStore',
        '$modal', '$window', 'toaster', '$modalInstance', '$stateParams', 'ass_service',
        function ($http, $location, Authentication, $scope, $rootScope, $cookieStore,
                  $modal, $window, toaster, $modalInstance, $stateParams, ass_service) {
            $scope.the_user = Authentication.getAuthenticatedAccount()['email'];
            $scope.assignment = $cookieStore.get('assignment');
            var asdf = $scope.assignment;
            console.log($scope.assignment.assignment_text);
            $modalInstance.dismiss('cancel');
            //$scope.submit = function () {
            //    ass_service.assInvalidate();
            //    var dataObject = {
            //        course_fk: $stateParams.which_class
            //        , assignment_number: $scope.myForm.assignment_number
            //        , assignment_title: $scope.myForm.assignment_title
            //        , assignment_text: $scope.myForm.assignment_text
            //    };
            //
            //    var responsePromise = $http.post(Authentication.server_url + 'add_assignment/', dataObject, {});
            //    responsePromise.success(function (dataFromServer, status, headers, config) {
            //        ass_service.pushAssignment(dataObject);
            //        ass_service.setAssignmentpk(dataFromServer.pk);
            //        ass_service.setDirty();
            //    });
            //    responsePromise.error(function (data, status, headers, config) {
            //        alert('bad')
            //    });
            //    $modalInstance.dismiss('cancel');
            //};
            //
            //$scope.cancel = function () {
            //    $modalInstance.dismiss('cancel');
            //}
        }]);
