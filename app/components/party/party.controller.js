app.controller("PartyController", function (API, youtubeEmbedUtils, toaster,
                                            $scope, $state, $stateParams, $rootScope, $window, $interval) {

  let vm = this;

  let interval;

  let cacheKey;

  let constructor = function () {

    vm.songForm = {
      data: {},
    };

    /**
     * Get party key from URL
     */
    vm.id = $stateParams.id;

    /**
     * Cache key for localStorage
     */
    cacheKey = "party-" + vm.id;

    /**
     * Party object (will get from param (cache) or API)
     */
    vm.party = null;

    /**
     * List of party categories with key as index (back-end IDs)
     */
    vm.categories = [];

    /**
     * List of categories with songs of this party
     */
    vm.songCategories = {};

    /**
     * List of songs of this party
     */
    vm.songs = [];

    /**
     * Current song of party playing
     */
    vm.song = null;

    /**
     * Scrolled from top of the page
     */
    vm.scrolled = false;

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
    if (!$stateParams.party) {
      getParty();
    } else {
      vm.party = $stateParams.party;
      generateCategories();
      $rootScope.$broadcast("mr-player.PartyController:loadParty", vm.party);
    }

    /**
     * Get party songs
     */
    getPartySongs(true);

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
      generateCategories();
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
   * @param {boolean} cache
   */
  let getPartySongs = function (cache) {
    /**
     * Try to load songs of this party from localStorage if requesting cache version.
     */
    if (cache && localStorage.hasOwnProperty(cacheKey)) {
      vm.songs = JSON.parse(localStorage.getItem(cacheKey));
      return;
    }
    /**
     * No cache from localStorage, continue with the $http
     */
    let payload = {
      party: vm.id
    };
    API.get("songs/", null, payload, function (data) {
      vm.songs = data.data.results;
      // Update localStorage for cache
      localStorage.setItem(cacheKey, JSON.stringify(data.data.results));
    }, function (data) {
      if (data.status !== 404) {
        toaster.error("Error", "Couldn't get party songs.");
        console.error(data.data);
      }
    }, cache);
  };

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
   * Create an array of party categories with ID as index
   * Should be called when vm.party is created or modified
   */
  let generateCategories = function () {
    // Reset categories
    vm.categories = [];
    // Store categories
    angular.forEach(vm.party.categories, function (category) {
      vm.categories[category.id] = category;
    });
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

  /**
   * Add a new song to the party (via input)
   */
  vm.addSong = function () {
    let payload = {
      party: vm.party.id,
      source: vm.songForm.data.source,
    };
    API.post("songs/", payload, null, function (data) {
      vm.songs.push(data.data);
      toaster.info("Added", "Added \"" + data.data.name + "\" to the party.");
      localStorage.setItem(cacheKey, JSON.stringify(vm.songs));
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
   */
  vm.removeSong = function (song) {
    /**
     * Stop if song is loading or user did not confirm remove
     */
    if (song.loading || !confirm("Are you sure you want to remove this song from the party?")) {
      return;
    }
    song.loading = true;
    API.delete("songs/" + song.id + "/", null, null, function () {
      toaster.info("Removed", "Song removed from the party.");
      vm.songs.splice(vm.songs.indexOf(song), 1);
      localStorage.setItem(cacheKey, JSON.stringify(vm.songs));
    }, function (data) {
      delete song.loading;
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

    // Check if name is actually changed and clicked "Done"
    if (!newName || newName === vm.party.name) {
      return;
    }

    vm.party.loading = true;

    const payload = {
      title: newName,
    };

    // Rename party
    API.put("parties/" + vm.id + "/", payload, null, function (data) {
      vm.party = Object.assign(vm.party, data.data);
      generateCategories();
      $rootScope.$broadcast("mr-player.PartyController:updateParty", vm.party);
      toaster.info("Updated", "Party renamed to \"" + vm.party.name + "\".");
    }, function (data) {
      vm.party.loading = false;
      toaster.error("Error", "Failed to rename party.");
      console.error(data.data);
    });
  };

  /**
   * @todo Remove party
   */
  vm.removeParty = function () {
    toaster.info("Coming soon", "Deleting party is not implemented yet.");
  };

  /**
   * Add category to this party
   */
  vm.addCategory = function () {
    const payload = {
      party: vm.party.id,
      name: prompt("Enter category name:"),
    };

    // Check if entered category name and clicked "Done"
    if (!payload.name) {
      return;
    }

    // Create category
    API.post("party-categories/", payload, null, function (data) {
      // Add category to party
      vm.party.categories.push(data.data);
      generateCategories();
      toaster.info("Added", "Added \"" + data.data.name + "\" category to the party.");
    }, function (data) {
      if (data.data.non_field_errors) {
        toaster.error("Error", data.data.non_field_errors[0]);
      } else if (data.data.name) {
        toaster.error("Category name error", data.data.name[0]);
      } else {
        toaster.error("Error", "Failed to create category.");
        console.log(data.data);
      }
    });
  };

  /**
   * Remove party category
   * @param {object} category
   */
  vm.removeCategory = function (category) {
    if (category.loading) {
      return;
    }

    // Confirm delete
    if (!confirm("Are you sure you want to delete category: \"" + category.name + "\"?")) {
      return;
    }

    category.loading = true;

    // Remove category
    API.delete("party-categories/" + category.id + "/", null, null, function () {
      // Remove category from list and regenerate vm.categories
      vm.party.categories.splice(vm.party.categories.indexOf(category), 1);
      generateCategories();
      // Move all songs of that category to Other (uncategorized)
      angular.forEach(vm.songs, function (song) {
        if (song.category === category.id) {
          song.category = null;
        }
      });
      // Update songs in local storage
      localStorage.setItem(cacheKey, JSON.stringify(vm.songs));
    }, function (data) {
      category.loading = false;
      toaster.error("Error", "Failed to delete category.");
      console.log(data.data);
    });
  };

  /**
   * Rename category
   * @param {object} category
   */
  vm.renameCategory = function (category) {
    if (category.loading) {
      return;
    }

    // Prompt category name
    let newName = prompt("Rename category:", category.name);

    // Check if name is actually changed and clicked "Done"
    if (!newName || newName === category.name) {
      return;
    }

    category.loading = true;

    const payload = {
      party: vm.party.id,
      name: newName,
    };

    // Rename category
    API.put("party-categories/" + category.id + "/", payload, null, function (data) {
      vm.categories[data.data.id] = data.data;
      $rootScope.$broadcast("mr-player.PartyController:renameCategory", category);
      toaster.info("Updated", "Category renamed to \"" + data.data.name + "\".");
    }, function (data) {
      category.loading = false;
      if (data.data.non_field_errors) {
        toaster.error("Error", data.data.non_field_errors[0]);
      } else {
        toaster.error("Error", "Failed to rename category.");
      }
      console.error(data.data);
    });
  };

  constructor();

  /**
   * YouTube player ready event
   */
  $scope.$on("youtube.player.ready", function (event, player) {
    vm.player.youtube = player;
  });

  /**
   * YouTube player ended event
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

  /**
   * Scroll event. Minimize the player when scrolled down.
   */
  angular.element($window).on("scroll", function () {
    // Get player height
    let playerHeight = angular.element(".player").height();
    // Is page scrolled
    let scrolled = angular.element($window).scrollTop() > playerHeight;
    // Did the value change
    if (scrolled !== vm.scrolled) {
      // Set the value and update view
      $scope.$apply(function () {
        vm.scrolled = scrolled;
      });
      // Is page scrolled
      if (scrolled) {
        // Set its height so the page doesn't instantly collapse and keep its not-scrolled form
        angular.element(".player-wrapper").css("min-height", playerHeight);
      }
    }
  });

  /**
   * Resize event. Update the min-height property of player wrapper.
   */
  angular.element($window).on("resize", function () {
    angular.element(".player-wrapper").css("min-height", angular.element(".player").height());
  });
});
