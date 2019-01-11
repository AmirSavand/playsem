/**
 * API service
 */
app.service("API", function ($http, ENV) {

  let service = {};

  let methods = ["post", "get", "put", "delete"];

  let headers = {
    "Accept": "application/json",
    "Content-Type": "application/json"
  };

  let apiUrl = ENV.API;

  /**
   * @param {string} method
   * @param {string} endpoint
   * @param {object|null} payload
   * @param {object|null} params
   * @param {function} success
   * @param {function} fail
   */
  let http = function (method, endpoint, payload, params, success, fail) {
    return $http({
      url: apiUrl + endpoint,
      headers: headers,
      method: method,
      data: payload,
      params: params
    }).then(success, fail);
  };

  angular.forEach(methods, function (method) {
    service[method] = function (endpoint, payload, params, success, fail) {
      return http(method, endpoint, payload, params, success, fail);
    };
  });

  return service;
});
