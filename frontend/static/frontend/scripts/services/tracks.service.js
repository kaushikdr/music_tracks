(function () {
  'use strict';

  angular
    .module('music.genre.services')
    .factory('Tracks', Tracks);

  Tracks.$inject = ['$http'];

  function Tracks($http) {
    var Tracks = {
      all: all,
      create: create,
      get: get,
      update: update
    };

    return Tracks;

    function all(page) {
      return $http.get('/soundtrack/track/'+page+'/');
    }

    function create(content) {
      console.log(content.audio)
      return $http.post('/soundtrack/track/', {
        audio: content.audio,
        title: content.title,
        genre: content.genre,
        rating: content.rating

      });
    }

    function get(track_id, page) {
      return $http.get('/soundtrack/track/' + track_id+'/'+page+'/');
    }

    function update(track_id, content) {
      return $http.post('/soundtrack/track/1/' + track_id+'/', {
        content
      });
    }

  }
})();