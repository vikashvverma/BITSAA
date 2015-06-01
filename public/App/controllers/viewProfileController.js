angular.module('BITSAAB').controller('viewProfileController', function($rootScope, $scope, $stateParams, $mdSidenav, $mdToast, $log, $state, $document, $timeout, userService, ngNotify) {
  var username = $stateParams.username;
  if (username == userService.getUser().username) {
    $state.go('profile');
  }
  $log.info("Got username : " + username);
  $scope.viewOnly = true;
  $scope.personalViewMode = true;
  $scope.professionalViewMode = true;
  $scope.toggleViewMode = function(section) {};




  $scope.logout = function() {
    userService.logout();
    $scope.notify('You have been logged out!', 'success');
    $scope.toggleRight();
    $state.go('home');
  };
  $scope.user = {};
  var promise = userService.fetchUser({
    username: username
  });
  promise.then(function(data) {
    if (data.hasOwnProperty('status') && !data.status) {
      $state.go('home');
    }
    $scope.user = data;
    $scope.user.dob = new Date($scope.user.dob);
  });
  promise.catch(function(data) {
    $state.go('home');
    return [];
  });

  $scope.getUser = function() {
    return $scope.user;
  };

  $scope.scroll = function(id) {
    var top = 400;
    var duration = 1000;
    var offset = 102;
    var element = angular.element(document.getElementById(id));
    $document.scrollToElementAnimated(element, offset, duration)
  };


});
