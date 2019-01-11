app.controller("SignInController", function (API, Auth, $rootScope) {

  let vm = this;

  let constructor = function () {
    vm.form = {
      data: {},
      loading: false,
      error: false,
    };
  };

  vm.submit = function () {
    vm.form.loading = true;

    let payload = {
      username: vm.form.data.username,
      password: vm.form.data.password
    };

    API.post("auth/", payload, {}, function (data) {
      vm.form.loading = false;
      vm.form.error = false;
      Auth.setAuth(data.data.user, data.data.token);
      $rootScope.$broadcast("mr-player.SignInController:signIn");
    }, function () {
      vm.form.loading = false;
      vm.form.error = true;
    });
  };

  constructor();
});
