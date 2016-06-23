(function () {
  'use strict';

  angular
    .module('music.search.services')
    .factory('Search', Search);

  Search.$inject = ['$http'];

  function Search($http) {
    var Search = {
      get: get
    };

    return Search;

    function get(page, search_str) {
      return $http.get('/soundtrack/search/'+page+'/?qry_str=' + search_str);
    }

  }
})();