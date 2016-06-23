(function(){
  'use strict';

  angular
    .module('music.tracks', [
    	'music.genre.services',
      	'music.tracks.controllers'
      
    ]);

  angular
    .module('music.tracks.services', []);
  angular
    .module('music.tracks.controllers', ['ngFileUpload']);
 

})();