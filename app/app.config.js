app.config(function (ENV, cfpLoadingBarProvider, AnalyticsProvider, $qProvider, $locationProvider, $compileProvider,
                     $httpProvider) {
  $qProvider.errorOnUnhandledRejections(false);
  $locationProvider.hashPrefix("");
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|telto):/);
  $httpProvider.interceptors.push("AuthInterceptor");
  cfpLoadingBarProvider.latencyThreshold = 0;
  AnalyticsProvider.setAccount(ENV.GOOGLE_ANALYTICS_ID);
});
