angular.module('BITSAAB').controller('alumniController', function($scope, $timeout, $document, $mdSidenav, $state, $log, userService) {
  this.busy = false;
  //$scope.currentUsers=[];
  this.users = [];
  this.viewProfile = function(username) {
    $document.scrollTopAnimated(0);
    $log.info("Show profile of  : " + username);
    if (userService.getUser().username == username) {
      $state.go('profile');
    }
    $state.go('viewProfile', {
      username: username
    });
  };
  this.loadMore=function(){
      this.next(true);
  };
  this.next = function(skip) {
    $log.info('next() called!');
    if (this.busy) return;
    this.busy = true;
    var model = {};
    if (!!$scope.search && !!$scope.search.first_name) {
      model.name = $scope.search.first_name;
    }
    if (!!$scope.search && !!$scope.search.branch) {
      model.branch = $scope.search.branch;
    }
    if (!!$scope.search && !!$scope.search.$) {
      model.any = $scope.search.$;
    }
    if (!Object.keys(model).length) {

    }
    model.skip = skip?0: $scope.currentUsers.length;
    var promise = userService.getUsers(model);
    promise.then(function(data) {
      $log.info(data);
      this.busy = false;
      if (data.hasOwnProperty('status')) {

      } else {
        for (var i = data.length; i--;) {
          data[i].color = $scope.randomColor();
          this.users.push(data[i]);
        }
        var temp = [];
        for (var i = this.users.length; i--;) {
          temp[this.users[i].id] = this.users[i];
        }
        this.users = [];
        for (var key in temp) {
          this.users.push(temp[key]);
        }
        this.users = this.users.sort(function(prev, next) {
          return prev.id - next.id;
        });
      }

    }.bind(this));
    promise.catch(function(data) {
      $log.warn(data);
      this.busy = false;
      promise.reject();
    }.bind(this));
    return promise;
  };

  this.next(true);

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
  $scope.loadBranches = function() {
    return $timeout(function() {
      $scope.branches = [
        'All',
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
  var COLORS = ['#ffebee', '#ffcdd2', '#ef9a9a', '#e57373', '#ef5350', '#f44336', '#e53935', '#d32f2f', '#c62828', '#b71c1c', '#ff8a80', '#ff5252', '#ff1744', '#d50000', '#f8bbd0', '#f48fb1', '#f06292', '#ec407a', '#e91e63', '#d81b60', '#c2185b', '#ad1457', '#880e4f', '#ff80ab', '#ff4081', '#f50057', '#c51162', '#e1bee7', '#ce93d8', '#ba68c8', '#ab47bc', '#9c27b0', '#8e24aa', '#7b1fa2', '#4a148c', '#ea80fc', '#e040fb', '#d500f9', '#aa00ff', '#ede7f6', '#d1c4e9', '#b39ddb', '#9575cd', '#7e57c2', '#673ab7', '#5e35b1', '#4527a0', '#311b92', '#b388ff', '#7c4dff', '#651fff', '#6200ea', '#c5cae9', '#9fa8da', '#7986cb', '#5c6bc0', '#3f51b5', '#3949ab', '#303f9f', '#283593', '#1a237e', '#8c9eff', '#536dfe', '#3d5afe', '#304ffe', '#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3', '#1e88e5', '#1976d2', '#1565c0', '#0d47a1', '#82b1ff', '#448aff', '#2979ff', '#2962ff', '#b3e5fc', '#81d4fa', '#4fc3f7', '#29b6f6', '#03a9f4', '#039be5', '#0288d1', '#0277bd', '#01579b', '#80d8ff', '#40c4ff', '#00b0ff', '#0091ea', '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00bcd4', '#00acc1', '#0097a7', '#00838f', '#006064', '#84ffff', '#18ffff', '#00e5ff', '#00b8d4', '#e0f2f1', '#b2dfdb', '#80cbc4', '#4db6ac', '#26a69a', '#009688', '#00897b', '#00796b', '#00695c', '#a7ffeb', '#64ffda', '#1de9b6', '#00bfa5', '#e8f5e9', '#c8e6c9', '#a5d6a7', '#81c784', '#66bb6a', '#4caf50', '#43a047', '#388e3c', '#2e7d32', '#1b5e20', '#b9f6ca', '#69f0ae', '#00e676', '#00c853', '#f1f8e9', '#dcedc8', '#c5e1a5', '#aed581', '#9ccc65', '#8bc34a', '#7cb342', '#689f38', '#558b2f', '#33691e', '#ccff90', '#b2ff59', '#76ff03', '#64dd17', '#f9fbe7', '#f0f4c3', '#e6ee9c', '#dce775', '#d4e157', '#cddc39', '#c0ca33', '#afb42b', '#9e9d24', '#827717', '#f4ff81', '#eeff41', '#c6ff00', '#aeea00', '#fffde7', '#fff9c4', '#fff59d', '#fff176', '#ffee58', '#ffeb3b', '#fdd835', '#fbc02d', '#f9a825', '#f57f17', '#ffff8d', '#ffff00', '#ffea00', '#ffd600', '#fff8e1', '#ffecb3', '#ffe082', '#ffd54f', '#ffca28', '#ffc107', '#ffb300', '#ffa000', '#ff8f00', '#ff6f00', '#ffe57f', '#ffd740', '#ffc400', '#ffab00', '#fff3e0', '#ffe0b2', '#ffcc80', '#ffb74d', '#ffa726', '#ff9800', '#fb8c00', '#f57c00', '#ef6c00', '#e65100', '#ffd180', '#ffab40', '#ff9100', '#ff6d00', '#fbe9e7', '#ffccbc', '#ffab91', '#ff8a65', '#ff7043', '#ff5722', '#f4511e', '#e64a19', '#d84315', '#bf360c', '#ff9e80', '#ff6e40', '#ff3d00', '#dd2c00', '#d7ccc8', '#bcaaa4', '#795548', '#d7ccc8', '#bcaaa4', '#8d6e63', '#eceff1', '#cfd8dc', '#b0bec5', '#90a4ae', '#78909c', '#607d8b', '#546e7a', '#cfd8dc', '#b0bec5', '#78909c'];
  $scope.randomColor = function() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }
  this.tiles = (function() {
    var tiles = [];
    for (var i = 0; i < 46; i++) {
      tiles.push({
        first_name: 'Vikash',
        last_name: 'Verma',
        designation: 'Developer',
        company: 'Mu Sigma',
        entry_year: '2010',
        city: 'Bengaluru',
        country: 'India',
        avatar_url: "vikash.png",
        batch: '2K10',
        branch: $scope.branches[i % 11],
        color: $scope.randomColor(),
        sidecolor: $scope.randomColor(),
        colspan: ((i + 1) % 2),
        rowspan: ((i + 1) % 2),
        title: i
      });
    }
    return tiles;
  })();

  function randomSpan() {
    var r = Math.random();
    if (r < 0.5) {
      return 1;
    } else {
      return 2;
    }
  }


});
