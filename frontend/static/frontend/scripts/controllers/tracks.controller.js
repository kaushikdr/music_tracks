
(function () {
  'use strict';

  angular
    .module('music.tracks.controllers')
    .controller('TrackController', TrackController);

  TrackController.$inject = ["$scope", "$rootScope", "$timeout","Upload", "Tracks", "Search","Snackbar"];


  function TrackController($scope, $rootScope, $timeout, Upload, Tracks, Search,Snackbar) {
    $scope.alltracks = true
    $scope.trackform = false
    $scope.singletrack = false
    $scope.add_track = false
    $scope.track_button_val = "Add New Track";
    $scope.edit_track=false
    // console.log($rootScope.alltracksview)

    // $scope.allTracks = true

    // $rootScope.$on('trackslist', function(event, data) {
    //   console.log(data)
    //     if(data['pass'] == 'show'){
    //         // console.log(data['genre'])
    //         $scope.tracks = data['data']
    //         // $scope.template = '/static/frontend/templates/alltracks.html'
    //     // console.log($scope.template)
    //     initial = false
    // }
    // });
    $rootScope.searchTracks = function(searchtxt, page){
        Search.get(page, searchtxt).then(searchSuccessFn, searchErrorFn);

      function searchSuccessFn(data, status, headers, config) {
        // $scope.tracks = data.data;
        
        $rootScope.tracks = data.data;
        console.log($rootScope.tracks)
        

      }

      function searchErrorFn(data, status, headers, config) {
        Snackbar.error(data.error);
        // console.log(data)
      }
    }



    


    

    $rootScope.activate = function(page){
      Tracks.all(page).then(postsSuccessFn, postsErrorFn);

      // $scope.$on('post.created', function (event, post) {
      //   tr.tracks.unshift(post);
      // });

      // $scope.$on('post.created.error', function () {
      //   tr.tracks.shift();
      // });


      function postsSuccessFn(data, status, headers, config) {
        $rootScope.tracks = data.data;
        console.log($scope.tracks)
      }

      function postsErrorFn(data, status, headers, config) {
        Snackbar.error(data.error);
      }
    }
    if ($rootScope.alltracksview==true){
      $rootScope.activate(1);
    }



    $scope.searchPage = function(page){
      if ($rootScope.alltracksview==true){
        $rootScope.activate(page);
      }else{
        $rootScope.searchTracks($rootScope.searchtxt, page)
      }
      // console.log($rootScope.alltracksview)
      // console.log()
      // console.log(page)
    }




    $scope.addTrack = function(){
      console.log('HAHAHAH');      
      if($scope.trackform==false)
      {
          // $scope.track_button_val = "Cancel"
          // $scope.
          $scope.alltracks = false;
          $scope.trackform=true;
      }
      else
      {
      // {   $scope.track_button_val = "Add New Track"
          $scope.trackform=false;
          $scope.alltracks=true;
          
      }
      $('#trackgen').select2({width: '100%', placeholder: "Select genres",});

    }
    $scope.singleTrack = function(index){
      // console.log(index)
      // console.log($scope.tracks.data.track_list[index])
      console.log($rootScope.tracks.data.track_list[index])
      var single = $rootScope.tracks.data.track_list[index]
      $scope.alltracks = false;
      // $scope.optionsel = true;
      $scope.track_title_raw = single.title_raw
      $scope.track_id = single.id
      $scope.genre = single.genre
      // $timeout(function(){
      $scope.single_audio = single.audio
          // }, 3000)
      
      $scope.single_rating = single.rating
      $scope.single_empty_rating = single.empty_rates
      $scope.single_title = single.title
      $scope.singletrack = true;
      $("#musicId").load()        
    }
    $scope.backToTracks = function(){
      $scope.singletrack = false;
      $scope.alltracks = true;

    }
    $scope.update_track = {}
    $scope.editTrack = function(){
      // Track.get(track_id).then
      // console.log(track_id)

      if($scope.edit_track==false)
      {
          // $scope.track_button_val = "Cancel"
          // $scope.
          // $scope.alltracks = false;

          $scope.edit_track=true;


          

          var genre_data = []
          for (var d = 0; d < $scope.genre.length; d++) {
            var item = $scope.genre[d];
            genre_data.push({id:item.id, text:item.title})
          }

          // $("#edittrackgen").select2('data', genre_data);
          var genre_data = []
          // // for 
          
          var $element = $('#edittrackgen').select2({width: '100%'});
          for (var d = 0; d < $scope.genre.length; d++) {
            var item = $scope.genre[d];
            genre_data.push(item.id)
          }

          $timeout(function() {
                  $element.val(genre_data);
              });
          $timeout(function() {
                  $element.trigger("change");
              });

          // var $rating_selected = $('#edittrackrating').select2({width: '100%'});
          // $scope.single_rating
          $timeout(function(){
            $('#edittrackrating').select2().val($scope.single_rating.length.toString()).trigger("change");
          })
          // console.log($scope.single_audio)
          // console.log($scope.track_title_raw)
          // if 
          // $scope.update_track.audio = $scope.single_audio
          $scope.update_track.title = $scope.track_title_raw
          
      }
      else
      {
      // {   $scope.track_button_val = "Add New Track"
          // $scope.trackform=false;
          $scope.edit_track=false;
          // $scope.genre = []
          
      }
      
      





    }
    $scope.updateTrack = function(){
      // var gen = $scope.genres['data'][index];
      // console.log(index)
      console.log($scope.update_track)
      // .title_copy = "asa"
      // Tracks.update($scope.track_id, $scope.update_track).then(genreUpdateSuccessFn, genreUpdateErrorFn);
      // function genreUpdateSuccessFn(data, status, headers, config) {
      //   console.log(data)
      Upload.upload({
        url: '/soundtrack/track/1/'+$scope.track_id +'/',
        headers: {'Content-Type':'multipart/form-data' },

        data: {
          file: $scope.update_track.audio,
          'title': $scope.update_track.title,
          'genre': $scope.update_track.genre.join(),
          'rating': $scope.update_track.rating}
      }).then(genreSuccessFn, genreErrorFn);
      function genreSuccessFn(data, status, headers, config) {
        console.log(data.data)
        if (data['data']['status'] == 'success'){
          
                $scope.edit_track=false;
                var single = data.data.data
                $scope.alltracks = false;
                // $scope.optionsel = true;
                $scope.track_title_raw = single.title_raw
                $scope.track_id = single.id
                $scope.genre = single.genre
                // $timeout(function(){
                $scope.single_audio = single.audio
                    // }, 3000)
                
                $scope.single_rating = single.rating
                $scope.single_empty_rating = single.empty_rates
                $scope.single_title = single.title
                $scope.singletrack = true;

                $("#musicId").load()   
        }
        // console.log(data)
        // vm.genre = data.data;
      }

      function genreErrorFn(data, status, headers, config) {

        Snackbar.error(data.error);
      }


        // if (data['data']['status'] == 'success'){
        //   // $scope.genres.data.push(data['data']['data']);
        //   $scope.genres['data'][index].title = gen.title_copy;
        //   $scope.genres['data'][index].flag = false;
        // }
        // // console.log(data)
        // // vm.genre = data.data;
      // }

      function genreUpdateErrorFn(data, status, headers, config) {

        Snackbar.error(data.error);
      }
    }

    $scope.submitTrack = function(){
      // console.log($scope.new_track.file)
      console.log($scope.new_track)
      // console.log($scope.new_track.music)
      // var file_data = $('#newMusic').prop('files')
      // var form_data = new FormData();
      // form_data.append("audio", file_data)
      // form_data.append("title", $scope.new_track.title)
      // form_data.append("genre", $scope.new_track.genre)
      // form_data.append("rating", $scope.new_track.rating)
      // console.log(form_data)
      // Tracks.create(form_data).then(genreSuccessFn, genreErrorFn);
      Upload.upload({
        url: '/soundtrack/track/',
        headers: {'Content-Type':'multipart/form-data' },

        data: {
          file: $scope.new_track.audio,
          'title': $scope.new_track.title,
          'genre': $scope.new_track.genre.join(),
          'rating': $scope.new_track.rating}
      }).then(genreSuccessFn, genreErrorFn);
      function genreSuccessFn(data, status, headers, config) {
        
        if (data['data']['status'] == 'success'){
          $rootScope.tracks.data.track_list.unshift(data['data']['data']);
          $scope.trackform=false;
          $scope.alltracks=true;
        }
        // console.log(data)
        // vm.genre = data.data;
      }

      function genreErrorFn(data, status, headers, config) {

        Snackbar.error(data.error);
      }

      
    }

    // $scope.tracks = {}
    // $scope.submitForm = function() {
    //   // $scope.$apply()
    //   console.log($scope.genre.title)
      // Tracks.create($scope.genre.title).then(genreSuccessFn, genreErrorFn);
      // function genreSuccessFn(data, status, headers, config) {
        
      //   if (data['data']['status'] == 'success'){
      //     $scope.vm.genre.data.push(data['data']['data']);
      //   }
      //   // console.log(data)
      //   // vm.genre = data.data;
      // }

      // function genreErrorFn(data, status, headers, config) {

      //   Snackbar.error(data.error);
      // }
    // }
    // $scope.editGenre = function(genre){
    //   console.log(genre)
    //   // $scope.
    // }
  }
})();