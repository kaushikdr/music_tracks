(function () {
  'use strict';

    angular
        .module('music', [
          'music.routes',
          'music.config',
          'music.genre', 
          'music.snackbar',
          'music.layout',
          'music.tracks',
          'music.search',
          'music.pager'
        ]);


    angular
        .module('music.routes', ['ngRoute']);

    angular
        .module('music.config', []);
})();
