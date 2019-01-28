app.controller("PartyController", function (API, youtubeEmbedUtils, toaster, $scope, $state, $stateParams, $rootScope) {

  let vm = this;

  let interval;

  let constructor = function () {

    vm.songForm = {
      data: {},
    };

    /**
     * Get party key from URL
     */
    vm.id = $stateParams.id;

    /**
     * Get party data from state params (cache)
     */
    vm.party = $stateParams.party;

    /**
     * List of songs of this party
     */
    vm.songs = [];

    /**
     * Current song of party playing
     */
    vm.song = null;

    /**
     * There's no id in URL, return to dash
     */
    if (!vm.id) {
      $state.go("dash");
      return;
    }

    /**
     * Main players
     */
    vm.player = {
      youtube: null,
      soundcloud: null,
    };

    /**
     * There's no party cache, get it via API
     */
    if (!vm.party) {
      getParty();
    } else {
      $rootScope.$broadcast("mr-player.PartyController:loadParty", vm.party);
    }

    /**
     * Get party songs
     */
    getPartySongs();

    /**
     * Start refreshing party songs every 60 seconds
     */
    interval = $interval(function () {
      getPartySongs();
    }, 60000);
  };

  /**
   * Get party with id (API call)
   */
  let getParty = function () {
    API.get("parties/" + vm.id + "/", null, null, function (data) {
      vm.party = data.data;
      $rootScope.$broadcast("mr-player.PartyController:loadParty", vm.party);
    }, function (data) {
      if (data.status === 404) {
        toaster.error("Error", "Party '" + vm.id + "' doesn't exist.");
        console.error(data.data);
      } else {
        toaster.error("Error", "Failed to get party.");
        console.error(data.data);
      }
      $state.go("dash");
    });
  };

  /**
   * Get songs of party (API call)
   */
  let getPartySongs = function () {
    let payload = {
      party: vm.id
    };
    API.get("songs/", null, payload, function (data) {
      vm.songs = [];
      vm.songs = data.data.results;
    }, function (data) {
      if (data.status !== 404) {
        toaster.error("Error", "Couldn't get party songs.");
        console.error(data.data);
      }
  /**
   * Find song index based on ID
   * Not using indexOf because songs are reset when refreshed
   *
   * @param {object} song
   * @returns {number}
   */
  let getSongIndex = function (song) {
    let index = -1;
    angular.forEach(vm.songs, function (song, i) {
      if (song.id === vm.song.id) {
        index = i;
      }
    });
    return index;
  };

  /**
   * Retrieve song image URL
   *
   * @param song {object}
   * @returns {string|null}
   */
  vm.getSongImage = function (song) {
    if (song.player === 0) {
      return "https://i.ytimg.com/vi/" + youtubeEmbedUtils.getIdFromURL(song.source) + "/mqdefault.jpg";
    }
  };


  /**
   * Play song (store variable and pass to player)
   * If no song is given, play the next (if it was the last, start over)
   */
  vm.play = function (song) {
    if (!vm.player.youtube || song === vm.song) {
      return;
    }
    if (song) {
      vm.song = song;
    } else {
      /**
       * Find song index
       */
      let nextIndex = getSongIndex(vm.song) + 1;
      if (nextIndex >= vm.songs.length) {
        nextIndex = 0;
      }
      vm.song = vm.songs[nextIndex];
    }
    if (vm.song) {
      // It's a YouTube video, play it
      if (vm.song.player === 0) {
        vm.player.youtube.loadVideoById(youtubeEmbedUtils.getIdFromURL(vm.song.source));
      }
      // It's a SoundCloud video, skip it
      else if (vm.song.player === 1) {
        vm.play();
        // vm.player.soundcloud.load(vm.song.source, {auto_play: true});
      }
    }
  };

  vm.addSong = function () {
    let payload = {
      party: vm.party.id,
      source: vm.songForm.data.source,
    };

    API.post("songs/", payload, null, function (data) {
      vm.songs.push(data.data);
      toaster.info("Added", "Added \"" + data.data.name + "\" to the party.");
    }, function (data) {
      if (data.data.error) {
        toaster.error("Error", data.data.error);
      } else if (data.data.source) {
        toaster.error("Error", data.data.source[0]);
      } else {
        toaster.error("Error", "Failed to add song to party.");
      }
      console.error(data.data);
    });

    vm.songForm.data = {};
  };

  /**
   * Remove a song from the party (API call)
   * @todo Don't get all songs again, just remove the one form the list
   */
  vm.removeSong = function (song) {
    /**
     * Stop if song is loading or user did not confirm delete
     */
    if (song.loading || !confirm("Are you sure you want to remove this song from the party?")) {
      return;
    }
    song.loading = true;
    API.delete("songs/" + song.id + "/", null, null, function () {
      getPartySongs();
      toaster.info("Removed", "Song removed from the party.");
    }, function (data) {
      song.loading = false;
      toaster.error("Error", "Failed to remove song from the party.");
      console.error(data.data);
    });
  };

  /**
   * Change party name
   */
  vm.renameParty = function () {
    if (vm.party.loading) {
      return;
    }

    // Prompt party name
    let newName = prompt("Rename party:", vm.party.name);

    // Check if name is actually changed
    if (newName === vm.party.name) {
      return;
    }

    /**
     * API call to update party
     */
    vm.party.loading = true;
    let payload = {
      title: newName,
    };
    API.put("parties/" + vm.id + "/", payload, null, function (data) {
      vm.party = Object.assign(vm.party, data.data);
      $rootScope.$broadcast("mr-player.PartyController:updateParty", vm.party);
      toaster.info("Updated", "Party renamed to \"" + vm.party.name + "\".");
    }, function (data) {
      vm.party.loading = false;
      toaster.error("Error", "Failed to get party.");
      console.error(data.data);
    });
  };

  constructor();

  /**
   * YouTube player ready
   */
  $scope.$on("youtube.player.ready", function (event, player) {
    vm.player.youtube = player;
  });

  /**
   * YouTube player ended
   */
  $scope.$on("youtube.player.ended", function (event, player) {
    vm.play();
  });

  /**
   * DOM element is removed from the page, cancel interval
   */
  $scope.$on("$destroy", function (event) {
    $interval.cancel(interval);
  });
});
