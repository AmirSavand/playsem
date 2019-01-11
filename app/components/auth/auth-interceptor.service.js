app.factory("AuthInterceptor", function ($rootScope, $q) {

  /**
   * Automatically attach Authorization header
   *
   * @param config {object}
   * @returns {object}
   */
  function request(config) {
    let token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = "JWT " + token;
    }

    return config;
  }

  /**
   * Handler for http response
   *
   * @param response {object}
   * @return {object}
   */
  function responseError(response) {
    if (response.status === 403) {
      $rootScope.$broadcast("mr-player.Auth:unAuth");
    }
    return $q.reject(response);
  }

  return {
    request: request,
    responseError: responseError
  };
});
