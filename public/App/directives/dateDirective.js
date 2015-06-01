angular.module('BITSAAB.Directive').directive('bitCalendar', function() {
  var animate = function(scope, element, attrs) {
     scope.some="sss";
    jQuery(scope.calendarContention || '.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 90, // Creates a dropdown of 15 years to control year
      container: 'body',
      min: new Date(1940, 01, 01),
      max: true,
      onSet: function() {
        var dob=jQuery(scope.calendarContention || '.datepicker').val();
        scope.$parent.user.dob=new Date(dob);
        $(scope.calendarContention || '.datepicker').next().trigger('click');
      }
    });
  };
  return {
    restrict: 'EA',
    replace: false,
    scope: {
      calendarId: '@',
      calendarContention: '@',
      ngModel: '='
    },
    link: animate,
  }
})
