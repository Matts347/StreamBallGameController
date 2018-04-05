
var leftPowerSlider = document.getElementById("leftPowerSlider");
var rightPowerSlider = document.getElementById("rightPowerSlider");
var leftPowerOutput = document.getElementById("leftPowerDisplay");
var rightPowerOutput = document.getElementById("rightPowerDisplay");
var sendButton = document.getElementById("sendButton");
var title = document.getElementById("title");
var leftPucks = document.getElementById("leftLauncher");
var rightPucks = document.getElementById("rightLauncher");
var puckDisplay = document.getElementById("totalPucks");
var puckCount = 0; //this will be pulled from the player ID to know how many they actually have
var twitchAuth;
var logoURL;
//init variables
leftPowerOutput.innerHTML = "Power: " + leftPowerSlider.value;
rightPowerOutput.innerHTML = "Power: " + rightPowerSlider.value;
puckDisplay.innerHTML = "Pucks: " + puckCount;
leftPucks.value = 0;
rightPucks.value = 0;

$("#rightAngle").roundSlider({
    radius: 80,
    circleShape: "quarter-top-left",
    showTooltip: true,
    value: 45,
    min: 0,
    max: 90,
    tooltipFormat: "changeTooltipRight"
});

$("#leftAngle").roundSlider({
    radius: 80,
    circleShape: "quarter-top-right",
    showTooltip: true,
    value: -45,
    min: -90,
    max: 0,
    tooltipFormat: "changeTooltipRight"
});

var leftAngle = $("#leftAngle").data("roundSlider");
var rightAngle = $("#rightAngle").data("roundSlider");

function changeTooltipRight(e) {
    var val = e.value;
    return Math.abs(val) + '\xB0';
}

function sendUserInfo() {
    $.ajax({
        url: 'https://us-central1-twitchplaysballgame.cloudfunctions.net/wildUserAppears?channelId= ' + twitchAuth.channelId + '&playerId=' + twitchAuth.userId,
        contentType: 'application/json',
        type: 'POST',
        headers: {
            'x-extension-jwt': twitchAuth.token
        },
        data: {}
    }).done(function (response) {
        console.log(" -- SENT user info to backend -- "); // DEBUG
    }).fail(function () {
        console.log(" -- SENT user info to backend FAILED -- "); // DEBUG
    });
}

function getUserAvatarURL() {
    $.ajax({
        url: 'https://api.twitch.tv/kraken/users/' + twitchAuth.userId, //get user autherization to aquire userID, not opaqueUserID
        type: 'GET',
        dataType: 'json',
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID': 'pxa5la9qqsrqerq15fre01o89fmff0',
        }/*,*/
        //success: function (response) {
        //    console.log(response);
        //    logoURL = response.logo;
        //}
    }).done(function (response) {
        logoURL = response.logo;
        console.log("User Logo obtained: " + logoURL);
        }).fail(function () {
            console.log("getUserAvatarURL failed");
    });
    //var settings = {
    //    "async": true,
    //    "crossDomain": true,
    //    "url": "https://api.twitch.tv/kraken/users/74504819",
    //    "method": "GET",
    //    "headers": {
    //        "Accept": "application/vnd.twitchtv.v5+json",
    //        "Client-ID": "pxa5la9qqsrqerq15fre01o89fmff0",
    //        //"Cache-Control": "no-cache",
    //        //"Postman-Token": "074bc3cd-e003-42f3-9700-b6e05261ac84"
    //    }
    //}

    //$.ajax(settings).done(function (response) {
    //    console.log(response);
    //}).done(function (response) { }).fail(function () {console.log("FAILED") });
}

//get twitch auth values
window.Twitch.ext.onAuthorized(function (auth) {
    //console.log(auth.token);//debug
    twitchAuth = auth;
    window.Twitch.ext.listen("whisper-" + twitchAuth.userId, getUpdatedPuckCount);
    sendUserInfo();
    getUserAvatarURL();
    //window.Twitch.ext.unlisten("whisper-" + twitchAuth.userId, getUpdatedPuckCount);
});

//Display for Power Slider
leftPowerSlider.oninput = function () {
    leftPowerOutput.innerHTML = "Power: " + this.value;
};
rightPowerSlider.oninput = function () {
    rightPowerOutput.innerHTML = "Power: " + this.value;
};


function AllowNumbersOnly(e) {
    var charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        e.preventDefault();
    }
}

function getUpdatedPuckCount(target, type, msg) {  
    if (type === "application/json") {
        var msgJSON = JSON.parse(msg);
        puckCount = msgJSON.puckCount;
        puckDisplay.innerHTML = "Pucks: " + puckCount;
    }
}

//function to send JSON data to game
function sendPucks(json) {
    $.ajax({
        url: 'https://us-central1-twitchplaysballgame.cloudfunctions.net/queueLaunch?channelId= ' + twitchAuth.channelId + '&playerId=' + twitchAuth.userId,
        contentType: 'application/json',
        type: 'POST',
        headers: {
            'x-extension-jwt': twitchAuth.token
        },
        data: json
    }).done(function (response) {
        //window.Twitch.ext.listen("whisper-" + twitchAuth.userId, getUpdatedPuckCount(target, type, msg));
        //window.Twitch.ext.unlisten("whisper-" + twitchAuth.userId, getUpdatedPuckCount(target, type, msg));
        //decreasePucks();
    }).fail(function () {
        console.log("sendPucks failed");
    });
}

//window.Twitch.ext.listen("whisper-" + twitchAuth.userId, function (target, type, msg) {
//    if (type === "application/json") {
//        var msgJSON = JSON.parse(msg);
//    }
//    //pucks = puckCount;
//});

////place holder, will decrease the amount of pucks associated with the userID
function decreasePucks() {
    pucks -= leftPucks.value;
    pucks -= rightPucks.value;
    puckDisplay.innerHTML = 'Pucks: ' + pucks;
}

//Launcher object to be used in JSON for game
var Launcher = function (side, angle, power, pucks, avatarURL) {
    // generate unique Id
    var idLength = 9;
    var generatedId = "";
    var charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < idLength; i++) {
        generatedId += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }

    return {
        "avatarUrl": avatarURL,
        "id": generatedId, // include this so the backend can identify two separate launches that have identical parameters
        "opaqueUserId": twitchAuth.userId,
        "side": side, //int value of 0 for left and 1 for right
        "angle": angle,
        "power": power,
        "pucks": pucks,
        "timestamp": Date.now()
    };
};

$(document).ready(function() {
    $("#sendButton").unbind('click');
    $("#sendButton").bind('click', function() {
        //set all values to numbers
        var left = new Launcher(0, Math.abs(leftAngle.option("value")), leftPowerSlider.value, leftPucks.value, logoURL);
        var right = new Launcher(1, rightAngle.option("value"), rightPowerSlider.value, rightPucks.value, logoURL);
        var launches = new Array();
        if (left.pucks > 0) {
            launches.push(left);
        } 
        if (right.pucks > 0) {
            launches.push(right);
        }
        if (launches.length > 0) {
            var launchJSON = JSON.stringify(launches);
            sendPucks(launchJSON);
            console.log("sending the following json string: " + launchJSON); //DEBUG
        }
        //title.innerHTML = "PRESSED  Angle: " + Math.abs(leftAngle.value) + " " + rightAngle.Value + " Power: " + leftPowerSlider.value + " Left Pucks: " + leftPucks.value + " Right Pucks: " + rightPucks.value; //DEBUG
        //maybe reset displayed values
    });
});

