
(function () {
  'use strict';

  angular
    .module('music.layout.controllers')
    .controller('LayoutController', LayoutController);

  LayoutController.$inject = ['$scope', '$rootScope', '$timeout', 'Genre', 'Snackbar'];

  function LayoutController($scope, $rootScope, $timeout, Genre, Snackbar) {
    // console.log(Genre)
    // console.log(Genre)
    var vm = this;
    vm.genre = [];
    $scope.add = false
    $scope.button_val = "ADD"
    $rootScope.template = '/static/frontend/templates/tracks.html'
    $rootScope.alltracksview = true

    
    $scope.changeToRootTracks = function(){
        console.log('mnbvca')
        $scope.changeToTracks()
        $rootScope.alltracksview = true
        $rootScope.activate(1);
    }

    $scope.changeToGenre = function(){
      $rootScope.template = '/static/frontend/templates/genres.html'
    }
    $scope.changeToTracks = function(){
      $rootScope.template = '/static/frontend/templates/tracks.html'
    }
    console.log($rootScope.alltracksview)

    $rootScope.$on('parent', function(event, data) {
        if(data['pass'] == 'tracklist'){
            // console.log(data['genre'])
            $scope.changeToTracks()
            // $scope.submitSearch(data['genre'])
            $rootScope.searchtxt = data['searchtxt']
            $timeout(function(){
                $rootScope.searchTracks(data['searchtxt'],1)
            }, 100)
            
        
    }
    });
    

    $scope.submitSearch = function(searchtxt){
        // console.log(searchtxt)
        if (searchtxt){
            $scope.changeToTracks()
            $rootScope.searchtxt = searchtxt
            // $scope.submitSearch(data['genre'])
            $timeout(function(){
                $rootScope.searchTracks(searchtxt,1)
            }, 100)


        }
    }
  }
})();