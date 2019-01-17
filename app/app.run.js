app.run(function (Auth, toaster, Analytics, $rootScope, $window, $transitions, $location) {

  /**
   * Is running on localhost
   */
  let isLocalhost = $location.host() === "localhost";

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
   * Before page transition event
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
   * After page transition event
   * Handle analytics page view
   */
  $transitions.onSuccess({}, function (transition) {
    if (!isLocalhost) {
      Analytics.trackPage($location.url(), transition.to().name);
    }
  });

  /**
   * Force SSL
   */
  if ($location.protocol() !== "https" && !isLocalhost) {
    $window.location.href = $location.absUrl().replace("http", "https");
  }
});
