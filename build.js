var RequireJs = require('requirejs');
var build = {
  baseUrl: ".",
  name: "index",
  out: "basbosa-config-min.js"
}
RequireJs.optimize(build, function(buildResponse) {
  console.log(buildResponse);
});