var twitchAuth;
var userInfo;
var newUser = true;
var payload;

//Right angles slider normally displays a negative value. This allows the correct value to be displayed
function changeTooltipRight(e) {
    var val = e.value;
    return Math.abs(val) + '\xB0';
}

function sendUserInfo() {
    $.ajax({
        url: 'https://us-central1-twitchplaysballgame.cloudfunctions.net/wildUserAppears?channelId=' + twitchAuth.channelId + '&playerId=' + payload.user_id + '&opaqueUserId=' + payload.opaque_user_id,
        type: 'GET',
        headers: {
            'x-extension-jwt': twitchAuth.token
        }
    }).done(function (response) {
        console.log(" -- SENT user info to backend -- "); // DEBUG
        console.log(response);
        LoadHeaderTemplate(undefined, response.puckCount, response.points);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(" -- SENT user info to backend FAILED -- "); // DEBUG
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
    });
}

function getUserInfo(trueUserId) {
    $.ajax({
        url: 'https://api.twitch.tv/kraken/users/' + trueUserId, //get user autherization to aquire userID, not opaqueUserID
        type: 'GET',
        dataType: 'json',
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID': 'pxa5la9qqsrqerq15fre01o89fmff0',
        }
    }).done(function (response) {
        LoadHeaderTemplate(response.display_name, undefined, undefined);
        console.log(response); //debug
        }).fail(function () {
            console.log("getUserInfo failed");
    });
}

function AllowNumbersOnly(e) {
    var charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        e.preventDefault();
    }
}

//function getUpdatedPuckCount(target, type, msg) {  
//    if (type === "application/json") {
//        var msgJSON = JSON.parse(msg);
//        puckCount = msgJSON.puckCount;
//        puckDisplay.innerHTML = "Pucks: " + puckCount;
//    }
//}

//function to send JSON data to game
function sendPucks(json) {
    $.ajax({
        url: 'https://us-central1-twitchplaysballgame.cloudfunctions.net/queueLaunch?channelId=' + twitchAuth.channelId + '&playerId=' + twitchAuth.userId,
        contentType: 'application/json',
        type: 'POST',
        headers: {
            'x-extension-jwt': twitchAuth.token
        },
        data: json
    }).done(function (response) {
        //window.Twitch.ext.listen("whisper-" + twitchAuth.userId, getUpdatedPuckCount);
        //window.Twitch.ext.unlisten("whisper-" + twitchAuth.userId, getUpdatedPuckCount(target, type, msg));
        console.log("sendPucks succeeded");
    }).fail(function () {
        console.log("sendPucks failed");
    });
}

//disable launch button after click for a few seconds
function disableButton() {
    var disabledSeconds = 5;
    sendButton.disabled = true;
    if (sendButton.disabled === true) {
        console.log('Button Disabled');
        //sendButton.textContent = 'Launching in ' + disabledSeconds;
        var disabledTimer = setInterval(function () {
            sendButton.textContent = 'Launching in ' + disabledSeconds;
            disabledSeconds--;
            if (disabledSeconds <= 0) {
                clearInterval(disabledTimer);
            }
        }, 1000);
    };
    setTimeout(function () {
        sendButton.disabled = false;
        if (sendButton.disabled === false) {
            sendButton.textContent = 'Fire Button';
        }
    }, 6000);
    //window.Twitch.ext.listen("whisper-" + twitchAuth.userId, getUpdatedPuckCount);
}

//Launcher object to be used in JSON for game
var Launcher = function (side, angle, power, pucks) {
    // generate unique Id
    var idLength = 9;
    var generatedId = "";
    var charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < idLength; i++) {
        generatedId += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }

    return {
        "avatarUrl": userInfo.logo,
        "id": generatedId, // include this so the backend can identify two separate launches that have identical parameters
        "opaqueUserId": twitchAuth.userId,
        "userId": userInfo._id,
        "side": side, //int value of 0 for left and 1 for right
        "angle": angle,
        "power": power,
        "pucks": pucks,
        "timestamp": Date.now(),
        "displayName": userInfo.display_name
    };
};

function LoadLoadingTemplate() {
    var loadingTemplate = Handlebars.templates.loading;
    $("#main").html(loadingTemplate());
}

function LoadHeaderTemplate(userName, totalPucks, points) {
    // if username, totalpucks, or points were given as undefined values, and
    // the header has been loaded already, just grab the value that was already
    // loaded previously. That way this function can be used to just update a
    // single value instead of having to provide all three at once.

    if (userName === undefined && $("#userName").length) {
        userName = $("#userName").text();
    }

    if (totalPucks === undefined && $("#totalPucks").length) {
        totalPucks = $("#totalPucks").text();
    }
    
    if (points === undefined && $("#playerScore").length) {
        points = $("#playerScore").text();
    }    

    var headerTemplate = Handlebars.templates.header;
    $("#header").html(headerTemplate({
        userName: userName,
        totalPucks: totalPucks,
        playerScore: points
    }));
}

function LoadLaunchTemplate() {
    var launchTemplate = Handlebars.templates.launch;
    $("#main").html(launchTemplate());

    var leftPowerSlider = document.getElementById("leftPowerSlider");
    var rightPowerSlider = document.getElementById("rightPowerSlider");
    var leftPowerOutput = document.getElementById("leftPowerDisplay");
    var rightPowerOutput = document.getElementById("rightPowerDisplay");
    var sendButton = document.getElementById("sendButton");
    var leftPucks = document.getElementById("leftLauncher");
    var rightPucks = document.getElementById("rightLauncher");

    //init variables
    leftPowerOutput.innerHTML = "Power: " + leftPowerSlider.value;
    rightPowerOutput.innerHTML = "Power: " + rightPowerSlider.value;
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

    
    //Display for Power Slider
    leftPowerSlider.oninput = function () {
        leftPowerOutput.innerHTML = "Power: " + this.value;
    };
    rightPowerSlider.oninput = function () {
        rightPowerOutput.innerHTML = "Power: " + this.value;
    };

    $("#sendButton").unbind('click');
    $("#sendButton").bind('click', function() {
        //set all values to numbers
        var left = new Launcher(0, Math.abs(leftAngle.option("value")), leftPowerSlider.value, leftPucks.value);
        var right = new Launcher(1, rightAngle.option("value"), rightPowerSlider.value, rightPucks.value);
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
        disableButton();
    });
}

$(document).ready(function () {
    LoadLaunchTemplate();
});
//window.Twitch.ext.onContext(function (context, contextFields) {
//    if (newUser === true && context.mode === "viewer") {
//        sendUserInfo();
//        newUser = false;
//    }
//    console.log(context); //DEBUG
//    console.log(contextFields); //DEBUG
//    console.log(newUser); //DEBUG
//});

//get twitch auth values
window.Twitch.ext.onAuthorized(function (auth) {
    console.log("auth");
    console.log(auth);//debug
    twitchAuth = auth;
    var parts = auth.token.split(".");
    payload = JSON.parse(window.atob(parts[1]));
    console.log(payload); //debug
    //sends userinfo if it's a new user
    console.log(newUser)
    if (newUser === true) {
        sendUserInfo();
        newUser = false;
    }

    if (payload.user_id) {
        // user has granted
        getUserInfo(payload.user_id);
    }
    else {
        window.Twitch.ext.actions.requestIdShare();
    }
    console.log("listening on the following channel: whisper-" + twitchAuth.userId); //DEBUG
    window.Twitch.ext.listen("whisper-" + twitchAuth.userId, function (target, type, msg) {
        //console.log(target);
        //console.log(type);
        //console.log(msg);
        if (type === "application/json") {
            var msgJSON = JSON.parse(msg);
            var puckCount;
            var points;

            if (msgJSON.puckCount !== undefined) {
                puckCount = msgJSON.puckCount;
            }

            if (msgJSON.points !== undefined) {
                points = msgJSON.points;
            }

            LoadHeaderTemplate(undefined, puckCount, points);
        }
    });
    // window.Twitch.ext.listen("broadcast", function (target, type, msg) {
    //     console.log("----- broadcast worked -----");
    // });
    //window.Twitch.ext.unlisten("whisper-" + twitchAuth.userId, getUpdatedPuckCount);
});


