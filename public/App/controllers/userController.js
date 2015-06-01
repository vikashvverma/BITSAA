angular.module('BITSAAB').controller('userController', function ($rootScope, $scope, $mdSidenav, $log, $timeout, $document, $mdToast,$mdDialog, $state, $stateParams, userService,ngNotify) {
  $scope.activationCode = $stateParams.activationCode;
  $scope.primaryEmail=$stateParams.primaryEmail;
  $scope.showLoginForm=true;

  if($scope.activationCode && $scope.primaryEmail){
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if(re.test($scope.primaryEmail)){
      $scope.showPasswordReset=true;
      $scope.selectedIndex=1;
    }
  }

  $scope.sendResetLink=function(form){
      var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      if (re.test(form.resetEmail.$modelValue)) {
          $rootScope.showLoader = true;
          $scope.isResetting=true;
          var promise=userService.sendResetLink({primaryEmail:form.resetEmail.$modelValue});
          promise.then(function(data){
              $rootScope.showLoader = false;
              if(data.status){
                  $scope.showLoginForm=true;
                  //$scope.selectedIndex=1;
                  $scope.notify(data.info,'info');
              }else{
                $scope.notify(data.info);
              }

          });
          promise.catch(function(data){
              $rootScope.showLoader = false;
              $scope.notify(data.info);
          });
      } else {
          $scope.notify("Invalid email address!");
      }
  };
  $scope.resetPassword=function(form){
    if(!form.new_password.$modelValue){
      $scope.notify('Please enter password!');
      return;
    }
    if(!(form.new_password.$modelValue.length>0 && form.c_new_password.$modelValue==form.new_password.$modelValue)){
      $scope.notify('Password must match!');
      return;
    }
    $rootScope.showLoader = true;
    var promise=userService.resetPassword({'token':$scope.activationCode,'primaryEmail':$scope.primaryEmail,'password':form.new_password.$modelValue});
    promise.then(function(data){
      $rootScope.showLoader = false;
      $log.info(data);
      $scope.showLoginForm=true;
        $scope.showPasswordReset=false;
      if(data.status){
        $scope.notify(data.info,'info');
      }else{
        $scope.notify(data.info);
      }
    });
    promise.catch(function(data){
      $rootScope.showLoader = false;
      $log.warn(data);
      $scope.notify(data.info);
    });
  };
  $scope.toggleLoginForm=function(){
    $scope.showLoginForm=!$scope.showLoginForm;
  };


  $scope.activate=function(activationCode){
    if(activationCode){
         $rootScope.showLoader = true;
        var promise = userService.activateAccount({
          token: activationCode
        });
        promise.then(function(data){
           $rootScope.showLoader = false;
          if(data && data.status){
            $scope.notify('Account Activated!','success');
            if(userService.getUser().token && userService.getUser().username){
              $state.go('profile');
            }else{
              $scope.selectedIndex=1;
              $scope.notify('You can login now!','success');
            }
            //$state.go('profile');
          }else{
            $scope.showActivationPrompt();
            $scope.notify('Wrong Activation Code or Activation Code has expired!');
          }
        });
        promise.catch(function(data){
          $rootScope.showLoader = false;
          $scope.showActivationPrompt();
          $scope.notify('Wrong Activation Code or Activation Code has expired!');
        });
    }
  };

  $scope.showActivationPrompt=function(){
    $mdDialog.show({
      controller:function($scope,$mdDialog){
        $scope.activateAccount=function(activationCode){
          if(!activationCode){
            $mdToast.show({
              template: '<md-toast class="md-toast error">Enter Activation Code!</md-toast>',
              hideDelay: 3000,
              position: 'bottom right'
            });
          }else{
            $mdDialog.hide(activationCode);
          }
        };
        $scope.cancel=function()  {
          $mdDialog.cancel();
        };
      },
      templateUrl:'./App/views/activate-account.html'
    })
      .then(function(activationCode){
        $scope.activate(activationCode);
      },function(){
        $scope.notify('Check your account for Activation Link!');
      });
  };

  if(!$scope.primaryEmail)
  $scope.activate($scope.activationCode);


  $scope.user = {
    gender: 'M'
  };
  $scope.profile = {
  };
  $scope.profile.avatar = '';
  $scope.uploading = false;
  $scope.$on('fileSelected', function (event, data) {
    $scope.$apply(function () {
      $scope.profile.avatar = data.file;
    });
  });
  $scope.$on('sizeExceeded', function (event, data) {
    $scope.notify('Image Size Exceeded!');
  });
  $scope.selectAvatar = function () {
    //angular.element('#avatar').triggerHandler('click');
    $('#avatar').trigger('click');
  };
  $scope.signin = function (form) {
    if (!form.$error.required) {
      var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      if (re.test(form.usernameEmail.$modelValue)) {
        var key = 'primaryEmail';
      } else {
        var key = 'username';
      }
      var obj = {
      };
      $rootScope.showLoader = true;
      obj[key] = form.usernameEmail.$modelValue;
      obj['password'] = form.password.$modelValue;
      var promise = userService.login(obj);
      promise.then(function (data) {
        $rootScope.showLoader = false;
        if(data.username){
          $state.go('profile');
        }else if(data.hasOwnProperty('status')){
          $scope.notify(data.info);
        }else if (!data) {
          $scope.notify('Invalid credentials!');
          return;
        }
        console.log(data);
        // $state.go('home');
      });
      promise.catch (function (err) {
        $rootScope.showLoader = false;
        $scope.notify('Invalid credentials!');
      });
    } else {
      $scope.notify('All fields are necessary!');
    }
  };
  var signinTimeout;
  $scope.$watch('usernameEmail', function (newUsernameEmail) {
    if (newUsernameEmail && newUsernameEmail.length < 4) {
      $scope.usernameEmailExists = true;
      return;
    }
    if (signinTimeout) $timeout.cancel(signinTimeout);
    signinTimeout = $timeout(function () {
      $scope.usernameEmailExists = undefined;
      var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      if (re.test($scope.usernameEmail)) {
        var key = 'primaryEmail';
      } else {
        key = 'username';
      }
      userService.userExists({
        key: $scope.usernameEmail
      }).then(function (data) {
        console.log(data);
        if (data) {
          $scope.usernameEmailExists = data.exists;
        }
      }, function (data) {
        console.log(data);
      });
    }, 1000);
  });
  var passwordTimeout;
  $scope.$watch('password', function (newPassword) {
    if (newPassword && newPassword.length < 4) {
      $scope.passwordExists = true;
      return;
    }
    if (passwordTimeout) $timeout.cancel(passwordTimeout);
    passwordTimeout = $timeout(function () {
      $scope.passwordExists = undefined;
      userService.userExists({
        'password': $scope.password
      }).then(function (data) {
        console.log(data);
        if (data) {
          $scope.passwordExists = data.exists;
        }
      }, function (data) {
        console.log(data);
      });
    }, 1000);
  });
  var timeout;
  $scope.$watch('user.username', function (newUserName) {
    if (newUserName && newUserName.length < 4) {
      $scope.usernameExists = true;
      return;
    }
    if (timeout) $timeout.cancel(timeout);
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
    if (emailTimeout) $timeout.cancel(emailTimeout);
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
  var validate = function () {
    var valid = false;
  };
  $scope.register = function (form) {
    if (!form.$error.required) {
      if ($scope.user.password !== $scope.user.cPassword) {
        $scope.notify('Password doesn\'t match!');
      } else if ($scope.emailExists === true) {
        $scope.notify('Email already registered!');
      } else if ($scope.usernameExists === true) {
        $scope.notify('Username already registered!');
      } else if (!$scope.profile.avatar) {
        $scope.notify('Select a Profile Picture!');
      } else {
        $scope.uploading = true;
        $rootScope.showLoader = true;
        $document.scrollTopAnimated(0);
        var promise = userService.registerUser($scope.user, $scope.profile.avatar);
        console.log(promise);
        promise.then(function (data) {
          $scope.uploading = false;
          $rootScope.showLoader = false;
          console.log(data);
          if (!data) {
            $scope.notify('User already registered!');
          } else if (data.status) {
            $scope.showActivationPrompt();
            $scope.notify('Check your email for Activation Code!','success');
          } else {
            $scope.notify('We are expriencing problem with email authentication, please try again later!', 'info');
          }
        });
        promise.catch (function (data) {
          $rootScope.showLoader = false;
          $scope.uploading = false;
          console.log(data);
          $scope.notify(data.info);
        });
        // promise.success(function(data){
        //   console.log(data.data);
        // });
        //
        // promise.error(function(data){
        //   console.log(data.data);
        // });
      }
    } else {
      $scope.notify('All fields are necessary!');
    }
  };
  $scope.notify = function (message, type) {

    if (type == 'info' || type=='success') {
      ngNotify.set(message, {
            theme: 'pure',
            position: 'bottom',
            duration: 3000,
            type: 'info',
            sticky: false
        });
//      $mdToast.show({
//        template: '<md-toast class="md-toast success">' + message + '</md-toast>',
//        hideDelay: 3000,
//        position: 'bottom right'
//      });
    } else {
      ngNotify.set(message, {
              theme: 'pure',
              position: 'bottom',
              duration: 3000,
              type: 'error',
              sticky: false
          });
//      $mdToast.show({
//        template: '<md-toast class="md-toast error">' + message + '</md-toast>',
//        hideDelay: 3000,
//        position: 'bottom right'
//      });
    }
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
});
