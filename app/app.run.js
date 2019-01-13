app.run(function (Auth, toaster, $rootScope, $window, $transitions, $location) {

  /**
   * YouTube player config
   * https://developers.google.com/youtube/player_parameters#Parameters
   */
  $rootScope.youtubeConfig = {
    autoplay: 1,
    iv_load_policy: 0,
    widget_referrer: $window.location.origin,
  };


  /**
   * Initial storage
   */
  if (!localStorage.getItem("parties")) {
    localStorage.setItem("parties", "[]");
  }

  /**
   * Handle state authentication access
   */
  $transitions.onBefore({}, function (transition) {
    /**
     * State requires authentication and user is not authenticated.
     */
    if (transition.to().auth === true && !Auth.isAuth()) {
      toaster.error("No Access", "You must sign in to access this page.");
      return transition.router.stateService.target("sign-in");
    }
    /**
     * State requires no authentication and user is authenticated.
     */
    if (transition.to().auth === false && Auth.isAuth()) {
      return transition.router.stateService.target("dash");
    }
  });

  /**
   * Force SSL
   */
  if ($location.protocol() !== "https" && $location.host() !== "localhost") {
    $window.location.href = $location.absUrl().replace("http", "https");
  }
});
