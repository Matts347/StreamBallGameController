(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['header'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "<p><span id=\"userName\">"
    + alias2(alias1((depth0 != null ? depth0.userName : depth0), depth0))
    + "</span></p>\r\n<p><span id=\"totalPucks\">Pucks: "
    + alias2(alias1((depth0 != null ? depth0.totalPucks : depth0), depth0))
    + "</span></p>\r\n<p><span id=\"playerScore\">Score: "
    + alias2(alias1((depth0 != null ? depth0.playerScore : depth0), depth0))
    + "</span></p>";
},"useData":true});
templates['launch'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"powerContainer\">\r\n    <input type=\"range\" min=\"1\" max=\"100\" value=\"50\" class=\"leftPowerSlider\" id=\"leftPowerSlider\">\r\n    <input type=\"range\" min=\"1\" max=\"100\" value=\"50\" class=\"rightPowerSlider\" id=\"rightPowerSlider\">\r\n</div>\r\n<div class=\"powerDisplay\">\r\n    <p><span id=\"leftPowerDisplay\"></span></p>\r\n    <p><span id=\"rightPowerDisplay\"></span></p>\r\n</div>\r\n<div class=\"slider\">\r\n    <input id=\"leftAngle\" />\r\n    <input id=\"rightAngle\" />\r\n</div>\r\n<div class=\"puckNumber\">\r\n    <input type=\"text\" id=\"leftLauncher\" class=\"leftLauncher\" onkeypress=\"return AllowNumbersOnly(event)\">\r\n    <input type=\"text\" id=\"rightLauncher\" class=\"rightLauncher\" onkeypress=\"return AllowNumbersOnly(event)\">\r\n</div>\r\n<div class=\"sendButton\">\r\n    <button type=\"button\" class=\"block\" id=\"sendButton\">Fire Pucks</button>\r\n</div>";
},"useData":true});
templates['loading'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<p>Loading...</p>";
},"useData":true});
templates['navigation'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "";
},"useData":true});
})();