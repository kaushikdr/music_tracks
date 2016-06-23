
(function () {
  'use strict';

  angular
    .module('music.genre.controllers')
    .controller('GenreController', GenreController);

  GenreController.$inject = ['$scope', '$rootScope', 'Genre', 'Snackbar'];

  function GenreController($scope, $rootScope, Genre, Snackbar) {
    // console.log(Genre)
    // console.log(Genre)
    // alert
    // var vm = this;
    // vm.genre = [];
    $scope.add = false
    $scope.button_val = "ADD"
    activate();
     // $scope.genres = {}

    function activate() {
      Genre.all().then(postsSuccessFn, postsErrorFn);

      // $scope.$on('post.created', function (event, post) {
      //   genre.unshift(post);
      // });

      // $scope.$on('post.created.error', function () {
      //   vm.genre.shift();
      // });
     

      function postsSuccessFn(data, status, headers, config) {
        $scope.genres = data.data;
        $scope.genre_list = $scope.genres
        console.log($scope.genres)

      }

      function postsErrorFn(data, status, headers, config) {
        Snackbar.error(data.error);
      }
    }
    $scope.addGenre = function(){
      console.log('HAHAHAH');      
      if($scope.add==false)
      {
          $scope.button_val = "CLOSE"
          $scope.add=true;
      }
      else
      {   $scope.button_val = "ADD"
          $scope.add=false;
      }
    }
    $scope.genre = {}
    $scope.submitForm = function() {
      // $scope.$apply()
      console.log($scope.genre.title)
      Genre.create($scope.genre.title).then(genreSuccessFn, genreErrorFn);
      function genreSuccessFn(data, status, headers, config) {
        
        if (data['data']['status'] == 'success'){
          $scope.genres.data.unshift(data['data']['data']);
        }
        // console.log(data)
        // vm.genre = data.data;
      }

      function genreErrorFn(data, status, headers, config) {

        Snackbar.error(data.error);
      }
    
    }
    $scope.editGenre = function(genre_id){
        console.log(genre_id)
    }
    $scope.searchByGenre = function(genre_title) {
      // console.log(genre_title)
      $rootScope.alltracksview = false
      $rootScope.$broadcast('parent', {'pass':'tracklist', 'searchtxt':genre_title})

    }
    $scope.genreUpdate = function(index){
      var gen = $scope.genres['data'][index];
      console.log(index)
      // console.log($scope.genres['data'][index])
      // .title_copy = "asa"
      Genre.update(gen.id, gen.title_copy).then(genreUpdateSuccessFn, genreUpdateErrorFn);
      function genreUpdateSuccessFn(data, status, headers, config) {
        console.log(data)
        if (data['data']['status'] == 'success'){
          // $scope.genres.data.push(data['data']['data']);
          $scope.genres['data'][index].title = gen.title_copy;
          $scope.genres['data'][index].flag = false;
        }
        // console.log(data)
        // vm.genre = data.data;
      }

      function genreUpdateErrorFn(data, status, headers, config) {

        Snackbar.error(data.error);
      }
    }
  }
})();