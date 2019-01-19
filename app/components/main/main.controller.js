app.controller("MainController", function (API, Auth, toaster, $scope, $state, $transitions) {

  let vm = this;

  let constructor = function () {

    /**
     * Get state for view
     */
    vm.state = $state;

    /**
     * User data (authenticated user)
     */
    vm.user = {};

    /**
     * List of parties user is a member of
     */
    vm.parties = JSON.parse(localStorage.getItem("parties"));

    /**
     * Selected party
     */
    vm.party = null;

    /**
     * Get user data
     */
    vm.user = Auth.getAuth();

    /**
     * Stop making API calls that require authentication
     */
    if (!Auth.isAuth()) {
      return;
    }

    /**
     * Get parties
     */
    getParties();
  };

  /**
   * Get list of parties user is a member of (API call)
   */
  let getParties = function () {
    let payload = {
      user: Auth.getAuth().id,
    };
    API.get("party-users/", {}, payload, function (data) {
      vm.parties = [];
      angular.forEach(data.data.results, function (partyUser) {
        vm.parties.push(partyUser.party);
      });
      localStorage.setItem("parties", JSON.stringify(vm.parties));
    }, function (data) {
      toaster.error("Erorr", "Couldn't get parties.");
      console.error(data.data);
    });
  };

  /**
   * Get party and add it to party list
   */
  let getParty = function (id) {
    API.get("parties/" + id + "/", {}, {}, function (data) {
      vm.parties.push(data.data);
      $state.go("party", {
        id: data.data.id,
        party: data.data
      });
    }, function (data) {
      if (data.code === 404) {
        toaster.error("Error", "This party doesn't exist.");
      } else {
        console.error(data.data);
        toaster.error("Error", "Failed to get party.", id);
      }
    });
  };

  /**
   * Check whether user is a member of selected/viewing party or just a guest.
   * @returns {boolean}
   */
  vm.isMemberOfParty = function () {
    if (vm.party) {
      for (let i in vm.parties) {
        if (vm.parties[i].id === vm.party.id) {
          return true;
        }
      }
    }
    return false;
  };

  /**
   * Join the viewing party.
   * @todo Don't get all parties again, just add it to the list.
   */
  vm.joinParty = function () {
    if (!vm.party || vm.party.loading) {
      return;
    }
    if (!Auth.isAuth()) {
      toaster.error("Sign In", "You must sign in to join parties.");
      $state.go("sign-in");
      return;
    }
    vm.party.loading = true;
    let payload = {
      party: vm.party.id
    };
    API.post("party-users/", payload, {}, function () {
      toaster.success("Joined Party", "You are now a member of this party.");
      vm.parties.push(vm.party);
    }, function (data) {
      toaster.error("Error", "Failed to join party.");
      console.error(data.data);
    });
    vm.party.loading = true;
  };

  /**
   * Sign out function for sidebar
   */
  vm.signOut = Auth.unAuth;

  /**
   * Authentication event to get user
   */
  $scope.$on("mr-player.Auth:setAuth", constructor);
  $scope.$on("mr-player.Auth:updateAuth", constructor);
  $scope.$on("mr-player.Auth:unAuth", constructor);

  /**
   * Response error event via AuthInterceptor.
   * Handles, invalid signature.
   */
  $scope.$on("mr-player.AuthInterceptor:responseError", function (event, args) {
    if (args.status === 401) {
      Auth.unAuth();
    }
  });

  /**
   * Sign in event. Upon sign in, go to dash.
   */
  $scope.$on("mr-player.Auth:signIn", function () {
    $state.go("dash");
  });

  /**
   * Party create event. Upon party creation, add it to list of parties.
   */
  $scope.$on("mr-player.DashController:createParty", function (event, id) {
    getParty(id);
  });

  /**
   * Party is loaded for the user.
   */
  $scope.$on("mr-player.PartyController:loadParty", function (event, party) {
    vm.party = party;
  });

  /**
   * User left the party view, it's no longer selected.
   */
  $transitions.onSuccess({}, function (transition) {
    if (transition.to().name !== "party") {
      vm.party = null;
    }
  });

  constructor();
});
