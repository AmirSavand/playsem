app.config(function ($qProvider, $locationProvider, $compileProvider, $httpProvider, cfpLoadingBarProvider) {
  $qProvider.errorOnUnhandledRejections(false);
  $locationProvider.hashPrefix("");
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|telto):/);
  $httpProvider.interceptors.push("AuthInterceptor");
  cfpLoadingBarProvider.latencyThreshold = 0;
});
