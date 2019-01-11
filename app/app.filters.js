app.filter("reverse", function () {
  return function (items) {
    return items.slice().reverse();
  };
});

app.filter("underspace", function () {
  return function (input) {
    if (input) {
      return input.replace(/_/g, " ");
    }
  };
});
