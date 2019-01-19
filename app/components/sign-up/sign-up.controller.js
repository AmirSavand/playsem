app.controller("SignUpController", function (Auth) {

  let vm = this;

  let constructor = function () {
    vm.form = {
      data: {},
      loading: false,
      errors: null,
    };
  };

  vm.submit = function () {
    vm.form.loading = true;
    Auth.signUp(vm.form.data.email, vm.form.data.username, vm.form.data.password, function (data) {
      vm.form.loading = false;
      vm.form.errors = null;
    }, function (data) {
      vm.form.loading = false;
      vm.form.errors = data.data;
    });
  };

  constructor();
});
