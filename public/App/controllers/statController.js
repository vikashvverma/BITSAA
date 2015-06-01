angular.module('BITSAAB').controller('statisticsController', function($scope, $timeout, $mdSidenav, $log, chartService) {

  this.themes = ['Default', 'Unicia', 'Signika', 'Light'];
  this.types = ['Line', 'Spline', 'Area', 'Areaspline', 'Column', 'Bar'];
  this.data = chartService.getChartData();
  var names = ['MECH', 'ELECT', 'PROD', 'METAL', 'CHEM', 'CIVIL',
    'ECE', 'MINING', 'CSE', 'IT', 'OTHERS'
  ];
  var getName = function(key) {

    if (key.indexOf('Computer') == 0) return 'CSE';
    if (key.indexOf('Electronics') == 0) return 'ECE';
    if (key.indexOf('Information') == 0) return 'IT';
    for (var i = names.length; i--;) {
      if (key.toUpperCase().indexOf(names[i]) == 0) {
        return names[i];
      }
    }
  };
  var temp = {};
  for (var key in this.data) {
    temp[getName(key)] = this.data[key]
  };
  var data = [];
  for (var i = 0; i < 11; i++) {
    data.push([names[i], temp[names[i]]])
  }
  this.loadThemes = function() {
    return $timeout(function() {
      this.themes = this.themes;
    }.bind(this), 500);
  };

  this.loadTypes = function() {
    return $timeout(function() {
      this.types = this.types;
    }.bind(this), 500);
  };

  this.reDraw = function() {
    this.drawLineChart($scope.theme, $scope.type);
  };

  this.drawLineChart = function(theme, type) {
    var style = chartService.getTheme(theme);
    var options = chartService.getChart(type.toLowerCase(), data);
    //Highcharts.setOptions(style?style():{});
    $('#linechart').highcharts(options);
    $('#linechart text').last().remove();
  };
  this.drawLineChart('default', 'column');
  this.drawPieChart = function(theme) {
    // var data = [
    //   ['Mechanical', 8],
    //   ['Electrical', 3],
    //   ['Production', 1],
    //   ['Metal', 6],
    //   ['Chemical', 8],
    //   ['Civil', 4],
    //   ['ECE', 4],
    //   ['Mining', 10],
    //   ['CSE', 4],
    //   ['IT', 1],
    //   ['Others', 1]
    // ];
    var style = chartService.getTheme('Unicia');
    //Highcharts.setOptions(style?style():{});
    $('#piechart').highcharts(chartService.getPie(data));
    $('#piechart text').last().remove();
  };
  this.drawPieChart();

});
