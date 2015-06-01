angular.module('BITSAAB.Directive')
  .directive('fileUpload', function() {
    return {
      scope: true,
      link: function(scope, el, attrs) {
        el.bind('change', function(event) {
          var files = event.target.files;
          if(!files.length)
            return;
          if(files[0].size>100000){
            scope.$emit('sizeExceeded',{size:files[0].size});
            angular.element(el).val('');
            return;
          }
          var img = document.createElement("img");
          img.src = window.URL.createObjectURL(files[0]);
          img.onload = function() {
            window.URL.revokeObjectURL(this.src);
          }
          document.getElementById('avatar_thumbnail').innerHTML="";
          document.getElementById('avatar_thumbnail').appendChild(img);
          scope.$emit('fileSelected', {
            file: files[0]
          });
        });
      }
    }
  })
