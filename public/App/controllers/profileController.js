angular.module('BITSAAB').controller('profileController', function($rootScope,$scope, $mdSidenav,$mdToast, $log, $state, $document,$timeout, userService,ngNotify) {

  $scope.user=userService.getUser();
  $scope.user.dob=new Date($scope.user.dob);
  $scope.personalViewMode=true;
  $scope.professionalViewMode=true;
  $scope.usernameViewMode=true;
  $scope.primaryEmailViewMode=true;
  $scope.passwordViewMode=true;
  $scope.username=$scope.user.username;
  $scope.primaryEmail=$scope.user.primaryEmail;

  $scope.toggleViewMode=function(section){
    $scope.user=userService.getUser();
    $scope.user.dob=new Date($scope.user.dob);
    $scope[section]=!$scope[section];
  };
  $scope.changePassword=function(form){

    if(!form.$error.required){
          if(form.$invalid){
            return $scope.notify('Password should be at least 6 character long!','warn')
          }
          if(form.new_password.$modelValue!==form.c_new_password.$modelValue){
            return $scope.notify('Password doesn\'t match!','error');
          }
          $document.scrollTopAnimated(0);
          $rootScope.showLoader=true;
          var obj={};
          obj.username=$scope.user.username;
          obj.token=$scope.user.token;
          obj.password=form.password.$modelValue;
          obj.new_password=form.new_password.$modelValue;

          var promise=userService.changePassword(obj);
          promise.then(function(data){
            $scope.scroll('loginInformation');
            $rootScope.showLoader=false;
            if(data.status){
              $scope.notify(data.info,'success');
            }else{
              $scope.notify(data.info,'info');
            }
            $scope.toggleViewMode('passwordViewMode');
          });
          promise.catch(function(data){
            $scope.scroll('loginInformation');
            $rootScope.showLoader=false;
            $scope.toggleViewMode('passwordViewMode');
            $scope.notify(data.info,'error');
          });
    }else{
      $scope.notify('All fields are necessary!','error');
    }
  };
  $scope.updateKey=function(key){
    //$document.scrollTopAnimated(0);
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if(key=='primaryEmail' && !re.test($scope.user.primaryEmail)){
      return $scope.notify("Invalid email address!",'error');
    }
    if($scope[key]==$scope.user[key]){
      $scope.notify("Changes saved!",'info');
      $scope.toggleViewMode(key+"ViewMode");
    }else if(key=='username' && $scope.user.username.length<4){
      $scope.notify("Minimum 4 characters required for username!",'error');
    }else{
      $document.scrollTopAnimated(0);
      $rootScope.showLoader=true;
      var obj={};
      obj[key]=$scope[key];
      obj.token=$scope.user.token;
      obj['new_'+key]=$scope.user[key];
      obj.key=key;

      var promise=userService.updateLoginInfo(obj);
      promise.then(function(data){
        $scope.scroll('loginInformation');
        $rootScope.showLoader=false;
            if(data.status){
              $scope.notify(data.info,'success');
              userService.setUser($scope.user);
            }else{
              $scope.user[key]=$scope[key];
              userService.setUser($scope.user);
              $scope.notify(data.info,'info');
            }
            $scope.toggleViewMode(key+"ViewMode");
      });
      promise.catch(function(data){
        $scope.scroll('loginInformation');
        $scope.user[key]=$scope[key];
        userService.setUser($scope.user);
        $rootScope.showLoader=false;
        $scope.toggleViewMode(key+"ViewMode");
        $scope.notify(data.info,'error');
      });
    }
  };
  $scope.updateInfo=function(form,section){
//    if(!form.$dirty){
//      $scope.notify('Profile updated successfully!','info');
//      return $scope.toggleViewMode('personalViewMode');
//    }
    //

    if(!form.$error.required){
          $document.scrollTopAnimated(0);
          $rootScope.showLoader=true;
          var promise=userService.updateUserInfo($scope.user);
          promise.then(function(data){
            $scope.scroll(section.split('ViewMode')[0]+"Information");
            $rootScope.showLoader=false;
            if(data.status){
              $scope.notify(data.info,'info');
            }else{
              $scope.notify(data.info,'info');
            }
            $scope.toggleViewMode(section);
          });
          promise.catch(function(data){
            $scope.scroll(section.split('ViewMode')[0]+"Information");
            $rootScope.showLoader=false;
            $scope.toggleViewMode(section);
            $scope.notify(data.info,'warn');
          });
    }else{
      $scope.notify('All fields are necessary!','error');
    }
  };

  $scope.logout=function(){
    userService.logout();
    $scope.notify('You have been logged out!','success');
    $scope.toggleRight();
    $state.go('home');
  };

  $scope.getUser = function() {
    return userService.getUser();
  };
  $scope.toggleRight = function() {
    $mdSidenav('right').toggle()
      .then(function() {
        $log.debug('toggle RIGHT is done');
      });
  };
  $scope.close = function() {
    $mdSidenav('right').close()
      .then(function() {
        $log.debug('close RIGHT is done');
      });
  };
  $scope.scroll = function(id) {
    var top = 400;
    var duration = 1000;
    var offset = 102;
    var element = angular.element(document.getElementById(id));
    $document.scrollToElementAnimated(element, offset, duration)
  };
  $scope.notify = function (message, type) {
    ngNotify.set(message, {
            theme: 'pastel',
            position: 'bottom',
            duration: 3000,
            type: type,
            sticky: false
        });
  };
    $scope.loadYears = function () {
    $scope.years = [
    ];
    return $timeout(function () {
      $scope.years = [
      ];
      for (i = new Date().getFullYear(); i > 1948; i--) {
        $scope.years.push(i);
      }
    }, 300);
  };
  $scope.loadBranches = function () {
    $scope.branches = [
    ];
    return $timeout(function () {
      $scope.branches = [
        'Mechanical Engineering',
        'Electrical Engineering',
        'Production Engineering',
        'Metallurgical Engineering',
        'Chemical Engineering',
        'Civil Engineering',
        'Electronics & Communication Engineering',
        'Mining Engineering',
        'Computer Science & Engineering',
        'Information Technology',
        'Others'
      ];
    }, 300);
  };
  var timeout;
  $scope.$watch('user.username', function (newUserName) {
    if (newUserName && newUserName.length < 4) {
      $scope.usernameExists = true;
      return;
    }
    if (timeout || $scope.username==$scope.user.username) $timeout.cancel(timeout);
    timeout = $timeout(function () {
      $scope.usernameExists = undefined;
      userService.userExists({
        'username': $scope.user.username
      }).then(function (data) {
        console.log(data);
        if (data) {
          $scope.usernameExists = data.exists;
        }
      }, function (data) {
        console.log(data);
      });
    }, 1000);
  });
  var emailTimeout;
  $scope.$watch('user.primaryEmail', function (newEmail) {
    if (emailTimeout || ($scope.primaryEmail==$scope.user.primaryEmail)) $timeout.cancel(emailTimeout);
    emailTimeout = $timeout(function () {
      $scope.emailExists = undefined;
      userService.userExists({
        'primaryEmail': $scope.user.primaryEmail
      }).then(function (data) {
        console.log(data);
        if (data) {
          $scope.emailExists = data.exists;
        }
      }, function (data) {
        console.log(data);
      });
    }, 1000);
  });

});
