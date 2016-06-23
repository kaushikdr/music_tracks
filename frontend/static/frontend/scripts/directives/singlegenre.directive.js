
(function () {
  'use strict';

  angular
    .module('music.genre.directives', [])
    .directive('singlegenre', singlegenre);

  function singlegenre() {
    var directive = {
      restrict: 'E',
      scope: {
        singlegenre: '='
      },
      templateUrl: '/static/templates/posts/singlegenre.html'
    };

    return directive;
  }
})();