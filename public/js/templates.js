(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['about'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"aboutContainer\">\r\n	<p>Stream Pucks is a pinball-like game that streamers and viewers play together.</p>\r\n	<p>This extension is how you interact with the game. If the game is currently being streamed, you can click on the Launch tab to set up a launch. You should see a left and right launcher with controls. Set the angle, power, and how many pucks you want to launch for each launcher. Click Launch to queue your launch in the game being streamed. After a few seconds you should see your launch appear in the game's launch queue.</p>\r\n	<p>Have any feedback? Have an issue? <a href=\"https://discord.gg/rsRVFGs\">Join our discord</a> and let us know!</p>\r\n	<p>Are you a streamer and want to play Stream Pucks on your channel? The game itself can be downloaded at <a href=\"https://streamgenie.tv/\">https://streamgenie.tv/</a>. It will give you instructions for how to connect your twitch channel and install this extension.</p>\r\n	<p>Created by <a href=\"https://streamgenie.tv/\">Stream Genie</a>.</p>\r\n</div>";
},"useData":true});
templates['authorize'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<!-- intentionally left blank -->";
},"useData":true});
templates['authorize_fail'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<h1>Log in failed</h1>";
},"useData":true});
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
    return "<div id=\"controlsContainer\">\r\n    <div id=\"leftLauncherController\">\r\n        <div id=\"launcherImgContainer\">\r\n            <img src=\"img/launcher_left.png\" id=\"leftAngleImg\" alt=\"Left launcher\">\r\n        </div>\r\n        <div class=\"angleDisplay\">\r\n            <p><span id=\"leftAngleDisplay\">Angle:</span></p>\r\n        </div>  \r\n        <div class=\"angleContainer\">\r\n            <input type=\"range\" min=\"0\" max=\"90\" value=\"45\" class=\"leftAngleSlider\" id=\"leftAngleSlider\">\r\n        </div>\r\n        <div class=\"powerDisplay\">\r\n            <p><span id=\"leftPowerDisplay\"></span></p>\r\n        </div>    \r\n        <div class=\"powerContainer\">\r\n            <input type=\"range\" min=\"1\" max=\"100\" value=\"50\" class=\"leftPowerSlider\" id=\"leftPowerSlider\">\r\n        </div>\r\n        <div class=\"puckNumber\">\r\n            <div id=\"launchTitle\"><h3>How many?<br/>(50 Max)</h3></div>\r\n            <input type=\"text\" id=\"leftLauncher\" class=\"leftLauncher\">\r\n        </div>    \r\n    </div>\r\n    <div id=\"rightLauncherController\">\r\n        <div id=\"launcherImgContainer\">\r\n            <img src=\"img/launcher_right.png\" id=\"rightAngleImg\" alt=\"Right launcher\">\r\n        </div>\r\n        <div class=\"angleDisplay\">\r\n            <p><span id=\"rightAngleDisplay\">Angle:</span></p>\r\n        </div>  \r\n        <div class=\"angleContainer\">\r\n            <input type=\"range\" min=\"0\" max=\"90\" value=\"45\" class=\"rightAngleSlider\" id=\"rightAngleSlider\">\r\n        </div>\r\n        <div class=\"powerDisplay\">\r\n            <p><span id=\"rightPowerDisplay\"></span></p>\r\n        </div>  \r\n        <div class=\"powerContainer\">\r\n            <input type=\"range\" min=\"1\" max=\"100\" value=\"50\" class=\"rightPowerSlider\" id=\"rightPowerSlider\">\r\n        </div>\r\n        <div class=\"puckNumber\">\r\n            <div id=\"launchTitle\"><h3>How many?<br/>(50 Max)</h3></div>\r\n            <input type=\"text\" id=\"rightLauncher\" class=\"rightLauncher\">\r\n        </div>      \r\n    </div>\r\n</div>\r\n<div class=\"sendButton\">\r\n    <button type=\"button\" class=\"block\" id=\"sendButton\">Launch</button>\r\n</div>\r\n<div class=\"errorMessage\">\r\n    <p><span id=\"error\"></span></p>\r\n</div>";
},"useData":true});
templates['store'] = template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "        <div class=\"item\">\r\n            <div id=\"trailImgContainer\">\r\n                <img id=\"trailImg\" src=\"../img/"
    + alias2(alias1((depth0 != null ? depth0.id : depth0), depth0))
    + ".png\" />\r\n                <div id=\"purchaseButtonContainer\">\r\n                    <button class=\"purchaseButton\" id=\""
    + alias2(alias1((depth0 != null ? depth0.id : depth0), depth0))
    + "\" name=\"inactivated\">Purchase</button>\r\n                </div>\r\n            </div>\r\n            <div id=\"trailDescriptionContainer\">\r\n                <h2>"
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "</h2>\r\n                <p>"
    + alias2(alias1((depth0 != null ? depth0.description : depth0), depth0))
    + "</p>\r\n                <p>Cost: "
    + alias2(alias1((depth0 != null ? depth0.cost : depth0), depth0))
    + " points</p>\r\n                <div id=\"errorMessage\">\r\n                    <p><span id=\"error "
    + alias2(alias1((depth0 != null ? depth0.id : depth0), depth0))
    + "\"></span></p>\r\n                </div>\r\n            </div>\r\n\r\n        </div>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"storeContainer\">\r\n    <div class=\"items\">\r\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\r\n</div>\r\n";
},"useData":true});
templates['tabs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"tabsContainer\">\r\n	<div class=\"active\" id=\"launchTab\">Launch</div>\r\n	<div id=\"storeTab\">Store</div>\r\n	<div id=\"aboutTab\">About</div>\r\n</div>";
},"useData":true});
})();