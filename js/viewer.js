
var angleSlider = document.getElementById("angleSlider");
var powerSlider = document.getElementById("powerSlider");
var angleOutput = document.getElementById("angleDisplay");
var powerOutput = document.getElementById("powerDisplay");
var sendButton = document.getElementById("sendButton");
var title = document.getElementById("title");
var leftPucks = document.getElementById("leftLauncher");
var rightPucks = document.getElementById("rightLauncher");
var leftOutput = document.getElementById("leftDisplay");
var rightOutput = document.getElementById("rightDisplay");
var puckDisplay = document.getElementById("totalPucks");
var puckCount = 0; //this will be pulled from the player ID to know how many they actually have
var twitchAuth;

//init variables
leftOutput.innerHTML = "Left Launcher";
rightOutput.innerHTML = "Right Launcher";
angleOutput.innerHTML = angleSlider.value + " Degrees";
powerOutput.innerHTML = "Power: " + powerSlider.value;
puckDisplay.innerHTML = "Pucks: " + puckCount;
leftPucks.value = 0;
rightPucks.value = 0;

//get twitch auth values
window.Twitch.ext.onAuthorized(function (auth) {
    //console.log(auth.token);//debug
    twitchAuth = auth;
    window.Twitch.ext.listen("whisper-" + twitchAuth.userId, getUpdatedPuckCount(target, type, msg));
    window.Twitch.ext.unlisten("whisper-" + twitchAuth.userId, getUpdatedPuckCount(target, type, msg));
});


//Display for Angle Slider
angleSlider.oninput = function () {
    if (this.value === '1') {
        angleOutput.innerHTML = this.value + " Degree";
    }
    else {
        angleOutput.innerHTML = this.value + " Degrees";
    }
};

//Display for Power Slider
powerSlider.oninput = function () {
    powerOutput.innerHTML = "Power: " + this.value;
};

//Function to launch when the Fire button is pressed
sendButton.onclick = function () {
    var left = new Launcher('0', angleSlider.value, powerSlider.value, leftPucks.value);
    var right = new Launcher('1', angleSlider.value, powerSlider.value, rightPucks.value);
    var launches = [left, right];
    var launchJSON = JSON.stringify(launches);
    sendPucks(launchJSON);
    console.log("sending the following json string: " + launchJSON); //DEBUG
    title.innerHTML = "PRESSED  Angle: " + angleSlider.value + " Power: " + powerSlider.value + " Left Pucks: " + leftPucks.value + " Right Pucks: " + rightPucks.value; //DEBUG
    //maybe reset displayed values
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
        puckCount = msgJSON.pucks;
        puckDisplay.innerHTML = "Pucks: " + puckCount;
    }
}

//function to send JSON data to game
function sendPucks(json) {
    $.ajax({
        url: 'https://us-central1-twitchplaysballgame.cloudfunctions.net/queueLaunch',
        contentType: 'application/json',
        type: 'POST',
        headers: {
            'x-extension-jwt': twitchAuth.token,
        },
        data: json
    }).done(function (response) {
        window.Twitch.ext.listen("whisper-" + twitchAuth.userId, getUpdatedPuckCount(target, type, msg));
        window.Twitch.ext.unlisten("whisper-" + twitchAuth.userId, getUpdatedPuckCount(target, type, msg));
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
//function decreasePucks() {
//    pucks -= leftPucks.value;
//    pucks -= rightPucks.value;
//    puckDisplay.innerHTML = 'Pucks: ' + pucks;
//}

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
        "id": generatedId, // include this so the backend can identify two separate launches that have identical parameters
        "side": side, //int value of 0 for left and 1 for right
        "angle": angle,
        "power": power,
        "pucks": pucks,
        "timestamp": Date.now()
    };
}