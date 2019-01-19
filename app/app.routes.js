app.config(function ($stateProvider, $urlRouterProvider) {

  /**
   * App routing states.
   *
   * State auth:
   *  false: Access if user is not authenticated.
   *  true: Access if user is authenticated.
   *  null: Access if user is or is not authenticated.
   */
  let states = {
    "sign-in": {
      url: "/sign-in/",
      controller: "SignInController",
      templateUrl: "sign-in/sign-in.view.html",
      auth: false,
    },
    "sign-up": {
      url: "/sign-up/",
      controller: "SignUpController",
      templateUrl: "sign-up/sign-up.view.html",
      auth: false,
    },
    "dash": {
      url: "/",
      controller: "DashController",
      templateUrl: "dash/dash.view.html",
    },
    "party": {
      url: "/:id/",
      controller: "PartyController",
      templateUrl: "party/party.view.html",
      params: {
        party: null,
      },
    },
  };

  angular.forEach(states, function (state, name) {
    state.controllerAs = "vm";
    state.templateUrl = "app/components/" + state.templateUrl;
    $stateProvider.state(name, state);
  });

  $urlRouterProvider.otherwise("/");
});
