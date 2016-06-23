(function () {
  'use strict';

  angular
    .module('music.genre.services')
    .factory('Genre', Genre);

  Genre.$inject = ['$http'];

  function Genre($http) {
    var Genre = {
      all: all,
      create: create,
      get: get,
      update: update
    };

    return Genre;

    function all() {
      return $http.get('/soundtrack/genre/');
    }

    function create(content) {
      return $http.post('/soundtrack/genre/', {
        title: content
      });
    }

    function get(genre_id) {
      return $http.get('/soundtrack/genre/' + genre_id+'/');
    }

    function update(genre_id, content) {
      return $http.post('/soundtrack/genre/' + genre_id+'/', {
        title: content
      });
    }

  }
})();