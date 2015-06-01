angular.module('BITSAAB',['ngMaterial','ui.router','BITSAAB.Directive','duScroll','LocalStorageModule','ngAnimate','ngNotify','ngTouch','infinite-scroll'])
.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  '$mdThemingProvider',
  'localStorageServiceProvider',
  function($stateProvider,$urlRouterProvider,$locationProvider,$mdThemingProvider,localStorageServiceProvider){
    localStorageServiceProvider
    .setPrefix('bitsaa')
    //.setStorageType('sessionStorage')
    .setNotify(true, true);

    $urlRouterProvider.otherwise('/Home');
    $stateProvider
    .state('home', {
      url: '/Home',
      templateUrl: './App/views/home.html',
      controller:'mainController',
      controllerAs:'vm'
    }).state('updates', {
      url: '/Updates',
      templateUrl: './App/views/updates.html',
      controller:'updateController',
      controllerAs:'update',
      resolve:{
          loggedInUser:function($location,$q,userService,$state){
              var promise = userService.getLoggedInUser();
              promise.then(function(data){
                 if( !data || !data.hasOwnProperty('username') || !data.username){
                     $state.go('login');
                 }
              });
              return promise;
          }
      }
    }).state('alumni', {
      url: '/Alumni',
      templateUrl: './App/views/alumni.html',
      controller:'alumniController',
      controllerAs:'vm',
      resolve:{
          loggedInUser:function($location,$q,userService,$state){
              var promise = userService.getLoggedInUser();
              promise.then(function(data){
                 if( !data || !data.hasOwnProperty('username') || !data.username){
                     $state.go('login');
                 }
              });
              return promise;
          }
      }
    }).state('statistics', {
      url: '/Statistics',
      templateUrl: './App/views/statistics.html',
      controller:'statisticsController',
      controllerAs:'vm',
      resolve:{
          loggedInUser:function($location,$q,chartService,$state){
              var promise = chartService.getStatistics();
              promise.then(function(data){
                 if( !data ){
                     $state.go('login')
                 }
              });
              return promise;
          }
      }
    }).state('login', {
      url: '/Login/:activationCode/:primaryEmail',
      templateUrl: './App/views/login.html',
      resolve:{
          loggedInUser:function($location,$q,userService,$state){
              var promise = userService.getLoggedInUser();
              promise.then(function(data){
                 if( data && data.hasOwnProperty('username') && data.username){
                     $state.go('profile');
                 }
              });
              return promise;
          }
      }
    }).state('profile', {
      url: '/Profile',
      templateUrl: './App/views/profile.html',
      controller:'profileController',
      resolve:{
          loggedInUser:function($location,$q,userService,$state){
              var promise = userService.getLoggedInUser();
              promise.then(function(data){
                 if( !data || !data.hasOwnProperty('username') || !data.username){
                     $state.go('login');
                 }
              });
              return promise;
          }
      }
    }).state('viewProfile', {
      url: '/ViewProfile/:username',
      templateUrl: './App/views/viewProfile.html',
      controller:'viewProfileController',
      resolve:{
          loggedInUser:function($location,$q,userService,$state){
              var promise = userService.getLoggedInUser();
              promise.then(function(data){
                 if( !data || !data.hasOwnProperty('username') || !data.username || !data.token){
                     $state.go('login');
                 }
              });
              return promise;
          }
      }
    });

    $mdThemingProvider.theme('altTheme')
    .primaryPalette('purple');

    $mdThemingProvider.theme('bitsaaTheme')
    .primaryPalette('blue')
    .accentPalette('purple')
    .warnPalette('indigo');

    $locationProvider.html5Mode(true);

  }])
  .run(function($rootScope,$location,$log,localStorageService,userService){
    var user=localStorageService.get('user');
    if(user && user.username && user.token){
      userService.setUser(user);
      var promise=userService.getLoggedInUser();
      promise.then(function(data){
        $log.info(data);
        if(!data ||  !data.token || !data.username){
          userService.setUser({});
        }
      });
      promise.catch(function(data){
        $log.warn(data);
        userService.setUser({});
      });
    }

    $rootScope.$on('$routeChangeStart',function(evt,next,current){
      $rootScope.showLoader=true;
      console.log('Route Change Started!');
    });
    $rootScope.$on('$routeChangeStart',function(evt,next,current){
      $rootScope.showLoader=false;
      console.log('Route Change Completed!');
    });

  });


  angular.module("BITSAAB.Directive",[]);
