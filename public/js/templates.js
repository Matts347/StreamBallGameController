(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['header'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "<div id=\"avatarContainer\">\r\n    <img id=\"avatarImg\" src=\""
    + alias2(alias1((depth0 != null ? depth0.avatarUrl : depth0), depth0))
    + "\" />\r\n</div>\r\n<div id=\"userNameContainer\">\r\n    <h1><span id=\"userName\">"
    + alias2(alias1((depth0 != null ? depth0.userName : depth0), depth0))
    + "</span></h1>\r\n    <h3>Pucks: <span id=\"totalPucks\">"
    + alias2(alias1((depth0 != null ? depth0.totalPucks : depth0), depth0))
    + "</span></h3>\r\n    <h3>Score: <span id=\"playerScore\">"
    + alias2(alias1((depth0 != null ? depth0.playerScore : depth0), depth0))
    + "</span></h3>\r\n</div>";
},"useData":true});
templates['launch'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"controlsContainer\">\r\n    <div id=\"leftLauncherController\">\r\n        <div id=\"launcherImgContainer\">\r\n            <img src=\"img/launcher_left.png\" id=\"leftAngleImg\" alt=\"Left launcher\">\r\n        </div>\r\n        <div class=\"angleDisplay\">\r\n            <p><span id=\"leftAngleDisplay\">Angle:</span></p>\r\n        </div>  \r\n        <div class=\"angleContainer\">\r\n            <input type=\"range\" min=\"0\" max=\"90\" value=\"45\" class=\"leftAngleSlider\" id=\"leftAngleSlider\">\r\n        </div>\r\n        <div class=\"powerDisplay\">\r\n            <p><span id=\"leftPowerDisplay\"></span></p>\r\n        </div>    \r\n        <div class=\"powerContainer\">\r\n            <input type=\"range\" min=\"0\" max=\"90\" value=\"45\" class=\"leftPowerSlider\" id=\"leftPowerSlider\">\r\n        </div>\r\n        <div class=\"puckNumber\">\r\n            <div id=\"launchTitle\"><h3>How many?<br/>(50 Max)</h3></div>\r\n            <input type=\"text\" id=\"leftLauncher\" class=\"leftLauncher\">\r\n        </div>    \r\n    </div>\r\n    <div id=\"rightLauncherController\">\r\n        <div id=\"launcherImgContainer\">\r\n            <img src=\"img/launcher_right.png\" id=\"rightAngleImg\" alt=\"Right launcher\">\r\n        </div>\r\n        <div class=\"angleDisplay\">\r\n            <p><span id=\"rightAngleDisplay\">Angle:</span></p>\r\n        </div>  \r\n        <div class=\"angleContainer\">\r\n            <input type=\"range\" min=\"0\" max=\"90\" value=\"45\" class=\"rightAngleSlider\" id=\"rightAngleSlider\">\r\n        </div>\r\n        <div class=\"powerDisplay\">\r\n            <p><span id=\"rightPowerDisplay\"></span></p>\r\n        </div>  \r\n        <div class=\"powerContainer\">\r\n            <input type=\"range\" min=\"1\" max=\"100\" value=\"50\" class=\"rightPowerSlider\" id=\"rightPowerSlider\">\r\n        </div>\r\n        <div class=\"puckNumber\">\r\n            <div id=\"launchTitle\"><h3>How many?<br/>(50 Max)</h3></div>\r\n            <input type=\"text\" id=\"rightLauncher\" class=\"rightLauncher\">\r\n        </div>      \r\n    </div>\r\n</div>\r\n<div class=\"sendButton\">\r\n    <button type=\"button\" class=\"block\" id=\"sendButton\">Launch</button>\r\n</div>\r\n<div class=\"errorMessage\">\r\n    <p><span id=\"error\"></span></p>\r\n</div>";
},"useData":true});
})();