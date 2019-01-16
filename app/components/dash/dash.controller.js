app.controller("DashController", function (Auth, API, toaster, $rootScope) {

  let vm = this;

  let constructor = function () {

    vm.user = Auth.getAuth();

    vm.createForm = {
      data: {},
      loading: false,
    };
  };

  vm.create = function () {
    vm.createForm.loading = true;
    let payload = {
      title: vm.createForm.data.title
    };
    API.post("parties/", payload, {}, function (data) {
      $rootScope.$broadcast("mr-player.DashController:createParty", data.data.id);
    }, function (data) {
      toaster.error("Error", "Failed to create party.");
      console.error(data.data);
    });
  };

  constructor();
});
