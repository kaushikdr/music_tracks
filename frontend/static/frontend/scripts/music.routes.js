(function () {
  'use strict';

  angular
    .module('music.routes')
    .config(config);

  config.$inject = ['$routeProvider'];

  /**
  * @name config
  * @desc Define valid application routes
  */
  function config($routeProvider) {
    $routeProvider.when('/', {
      // controller: 'LayoutController',
      // controllerAs: 'vm',
      templateUrl: '/static/frontend/templates/layout.html'
    }).otherwise('/');
  }
})();