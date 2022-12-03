exports.getDet = function () {
  let today = new Date();
  let options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  return today.toLocaleDateString('in-IN', options);
};
exports.getDey = function () {
  let today = new Date();
  let options = { weekday: 'long', day: 'numeric', month: 'long' };
  return today.toLocaleDateString('in-IN', options);
};
