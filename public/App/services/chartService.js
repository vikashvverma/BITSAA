angular.module('BITSAAB').factory('chartService', function($rootScope, $http, $q, $log, localStorageService,userService) {
  var chart = {};
  return {
    setChartData:function(data){
      chart=data;
    },
    getChartData:function(){
      return chart;
    },
    getStatistics:function(){
      return $http({
        method:'POST',
        url:'/statistics',
        data:{token:userService.getUser().token}
      }).then(function(data){
        chart=data.data;
        return data.data;
      },function(data){
        $q.reject(data.data);
      });
    },
    getTheme: function(name) {
      var theme = {};
      theme.getUnicia = function() {
        // Load the fonts
        Highcharts.createElement('link', {
          href: '//fonts.googleapis.com/css?family=Unica+One',
          rel: 'stylesheet',
          type: 'text/css'
        }, null, document.getElementsByTagName('head')[0]);

        Highcharts.theme = {
          colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
            "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"
          ],
          chart: {
            backgroundColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 1,
                y2: 1
              },
              stops: [
                [0, '#2a2a2b'],
                [1, '#3e3e40']
              ]
            },
            style: {
              fontFamily: "'Unica One', sans-serif"
            },
            plotBorderColor: '#606063'
          },
          title: {
            style: {
              color: '#E0E0E3',
              textTransform: 'uppercase',
              fontSize: '20px'
            }
          },
          subtitle: {
            style: {
              color: '#E0E0E3',
              textTransform: 'uppercase'
            }
          },
          xAxis: {
            gridLineColor: '#707073',
            labels: {
              style: {
                color: '#E0E0E3'
              }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            title: {
              style: {
                color: '#A0A0A3'

              }
            }
          },
          yAxis: {
            gridLineColor: '#707073',
            labels: {
              style: {
                color: '#E0E0E3'
              }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            tickWidth: 1,
            title: {
              style: {
                color: '#A0A0A3'
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            style: {
              color: '#F0F0F0'
            }
          },
          plotOptions: {
            series: {
              dataLabels: {
                color: '#B0B0B3'
              },
              marker: {
                lineColor: '#333'
              }
            },
            boxplot: {
              fillColor: '#505053'
            },
            candlestick: {
              lineColor: 'white'
            },
            errorbar: {
              color: 'white'
            }
          },
          legend: {
            itemStyle: {
              color: '#E0E0E3'
            },
            itemHoverStyle: {
              color: '#FFF'
            },
            itemHiddenStyle: {
              color: '#606063'
            }
          },
          credits: {
            style: {
              color: '#666'
            }
          },
          labels: {
            style: {
              color: '#707073'
            }
          },

          drilldown: {
            activeAxisLabelStyle: {
              color: '#F0F0F3'
            },
            activeDataLabelStyle: {
              color: '#F0F0F3'
            }
          },

          navigation: {
            buttonOptions: {
              symbolStroke: '#DDDDDD',
              theme: {
                fill: '#505053'
              }
            }
          },

          // scroll charts
          rangeSelector: {
            buttonTheme: {
              fill: '#505053',
              stroke: '#000000',
              style: {
                color: '#CCC'
              },
              states: {
                hover: {
                  fill: '#707073',
                  stroke: '#000000',
                  style: {
                    color: 'white'
                  }
                },
                select: {
                  fill: '#000003',
                  stroke: '#000000',
                  style: {
                    color: 'white'
                  }
                }
              }
            },
            inputBoxBorderColor: '#505053',
            inputStyle: {
              backgroundColor: '#333',
              color: 'silver'
            },
            labelStyle: {
              color: 'silver'
            }
          },

          navigator: {
            handles: {
              backgroundColor: '#666',
              borderColor: '#AAA'
            },
            outlineColor: '#CCC',
            maskFill: 'rgba(255,255,255,0.1)',
            series: {
              color: '#7798BF',
              lineColor: '#A6C7ED'
            },
            xAxis: {
              gridLineColor: '#505053'
            }
          },

          scrollbar: {
            barBackgroundColor: '#808083',
            barBorderColor: '#808083',
            buttonArrowColor: '#CCC',
            buttonBackgroundColor: '#606063',
            buttonBorderColor: '#606063',
            rifleColor: '#FFF',
            trackBackgroundColor: '#404043',
            trackBorderColor: '#404043'
          },

          // special colors for some of the
          legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
          background2: '#505053',
          dataLabelsColor: '#B0B0B3',
          textColor: '#C0C0C0',
          contrastTextColor: '#F0F0F3',
          maskColor: 'rgba(255,255,255,0.3)'
        };
        return Highcharts.theme;
      };
      theme.getSignika = function() {
        // Load the fonts
        Highcharts.createElement('link', {
          href: '//fonts.googleapis.com/css?family=Signika:400,700',
          rel: 'stylesheet',
          type: 'text/css'
        }, null, document.getElementsByTagName('head')[0]);

        // Add the background image to the container
        Highcharts.wrap(Highcharts.Chart.prototype, 'getContainer', function(proceed) {
          proceed.call(this);
          this.container.style.background = 'url(http://www.highcharts.com/samples/graphics/sand.png)';
        });


        Highcharts.theme = {
          colors: ["#f45b5b", "#8085e9", "#8d4654", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
            "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"
          ],
          chart: {
            backgroundColor: null,
            style: {
              fontFamily: "Signika, serif"
            }
          },
          title: {
            style: {
              color: 'black',
              fontSize: '16px',
              fontWeight: 'bold'
            }
          },
          subtitle: {
            style: {
              color: 'black'
            }
          },
          tooltip: {
            borderWidth: 0
          },
          legend: {
            itemStyle: {
              fontWeight: 'bold',
              fontSize: '13px'
            }
          },
          xAxis: {
            labels: {
              style: {
                color: '#6e6e70'
              }
            }
          },
          yAxis: {
            labels: {
              style: {
                color: '#6e6e70'
              }
            }
          },
          plotOptions: {
            series: {
              shadow: true
            },
            candlestick: {
              lineColor: '#404048'
            },
            map: {
              shadow: false
            }
          },

          // Highstock specific
          navigator: {
            xAxis: {
              gridLineColor: '#D0D0D8'
            }
          },
          rangeSelector: {
            buttonTheme: {
              fill: 'white',
              stroke: '#C0C0C8',
              'stroke-width': 1,
              states: {
                select: {
                  fill: '#D0D0D8'
                }
              }
            }
          },
          scrollbar: {
            trackBorderColor: '#C0C0C8'
          },

          // General
          background2: '#E0E0E8'

        };
        return Highcharts.theme;
      };
      theme.getLight = function() {
        // Load the fonts
        Highcharts.createElement('link', {
          href: '//fonts.googleapis.com/css?family=Dosis:400,600',
          rel: 'stylesheet',
          type: 'text/css',
					class:'theme',
        }, null, document.getElementsByTagName('head')[0]);

        Highcharts.theme = {
          colors: ["#7cb5ec", "#f7a35c", "#90ee7e", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
            "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"
          ],
          chart: {
            backgroundColor: null,
            style: {
              fontFamily: "Dosis, sans-serif"
            }
          },
          title: {
            style: {
              fontSize: '16px',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }
          },
          tooltip: {
            borderWidth: 0,
            backgroundColor: 'rgba(219,219,216,0.8)',
            shadow: false
          },
          legend: {
            itemStyle: {
              fontWeight: 'bold',
              fontSize: '13px'
            }
          },
          xAxis: {
            gridLineWidth: 1,
            labels: {
              style: {
                fontSize: '12px'
              }
            }
          },
          yAxis: {
            minorTickInterval: 'auto',
            title: {
              style: {
                textTransform: 'uppercase'
              }
            },
            labels: {
              style: {
                fontSize: '12px'
              }
            }
          },
          plotOptions: {
            candlestick: {
              lineColor: '#404048'
            }
          },


          // General
          background2: '#F0F0EA'

        };
        return Highcharts.theme;
      };
      return theme['get' + name];
    },
    getChart: function(type, data) {
      var plotOptions = {};
      plotOptions[type] = {
        dataLabels: {
          enabled: true
        },
        marker: {
          radius: 4,
          lineColor: '#666666',
          lineWidth: 1
        }
      };

      var options = {
        chart: {
          type: type
        },
        title: {
          text: 'Branch Wise Distribution'
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: ['MECH', 'ELECT', 'PROD', 'METAL', 'CHEM', 'CIVIL',
            'ECE', 'MINING', 'CSE', 'IT', 'OTHERS'
          ]
        },
        yAxis: {
          title: {
            text: 'Number of Alumni'
          },
          labels: {
            formatter: function() {
              return this.value + '';
            }
          }
        },
        tooltip: {
          crosshairs: true,
          shared: true,
          headerFormat: '<small><h3>{point.key}</h3></small><table>',
          pointFormat: '<tr><td style="color: {series.color}">  : </td>' +
            '<td style="text-align: right"><b>{point.y} </b></td></tr>',
          footerFormat: '</table>'
        },
        plotOptions: plotOptions,
        series: [{
          name: 'BRANCH',
          data: data || [54, 12, 14, 15, 54, 84, 54, 12, 52, 65, 0]
        }]
      };
      return options;
    },
    getPie: function(data) {
      var options={
        chart: {
          type: 'pie',
          options3d: {
            enabled: true,
            alpha: 45
          }
        },
        title: {
          text: 'Branch Wise Distribution'
        },
        subtitle: {
          text: ''
        },
        tooltip: {
          //crosshairs: true,
          shared: true,
          headerFormat: '<small><h3>{point.key}</h3></small><table>',
          pointFormat: '<tr><td style="color: {series.color}">  : </td>' +
            '<td style="text-align: right"><b>{point.y} </b></td></tr>',
          footerFormat: '</table>'
        },
        plotOptions: {
          pie: {
            innerSize: 50,
            depth: 45,
            showInLegend: true
          }
        },
        series: [{
          name: 'Branch',
          data: data
        }]
      };
			return options;
    }
  }
});
