/*
License for roundSlider
Copyright (c) 2015-2018, Soundar
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: 
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
*/

//Launcher object to be used in JSON for game
var Launch = function (side, angle, power, pucks) {
    var userInfo = TwitchUserManager.getUserInfo();
    var twitchAuth = TwitchUserManager.getAuth();
    var logo = userInfo.logo;
    var userId = userInfo._id;
    var displayName = userInfo.display_name;

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

// TwitchUserManager manages Twitch auth and pubsub
var TwitchUserManager = (function(){
    // private members
    var twitchAuth;
    var payload;
    var userInfo;
    var newUser = true;
    var currentPuckCount;

    var sendUserInfo = function(){
        $.ajax({
            url: 'https://us-central1-twitchplaysballgame.cloudfunctions.net/wildUserAppears?channelId=' + twitchAuth.channelId + '&playerId=' + payload.user_id + '&opaqueUserId=' + payload.opaque_user_id,
            type: 'GET',
            headers: {
                'x-extension-jwt': twitchAuth.token
            }
        }).done(function (response) {
            currentPuckCount = response.puckCount;
            TemplateManager.LoadHeaderTemplate(undefined, undefined, response.puckCount, response.points);
        });
    };

    var requestUserInfo = function(trueUserId) {
        $.ajax({
            url: 'https://api.twitch.tv/kraken/users/' + trueUserId, //get user autherization to aquire userID, not opaqueUserID
            type: 'GET',
            dataType: 'json',
            headers: {
                'Accept': 'application/vnd.twitchtv.v5+json',
                'Client-ID': 'y4jq5ejqgodi64cueqvjdip2ekfg0r',
            }
        }).done(function (response) {
            TemplateManager.LoadHeaderTemplate(response.display_name, response.logo, undefined, undefined);
            userInfo = response;
        });
    }

    return {
        // public members
        getPuckCount: function() {
            return currentPuckCount;
        },
        setPuckCount: function(puckCount) {
            // TODO validate puckCount is int
            currentPuckCount = puckCount;
        },
        getUserInfo: function() {
            return userInfo;
        },
        getAuth: function(){
            return twitchAuth;
        },
        setAuth: function(auth){
            twitchAuth = auth;
            var parts = auth.token.split(".");
            payload = JSON.parse(window.atob(parts[1]));
        
            if (newUser === true) {
                sendUserInfo();
                newUser = false;
            }
        
            if (payload.user_id) {
                // user has granted
                requestUserInfo(payload.user_id);
            }
            else {
                // user has not granted permission, request it
                window.Twitch.ext.actions.requestIdShare();
            }
            
            window.Twitch.ext.listen("whisper-" + twitchAuth.userId, function (target, type, msg) {
                if (type === "application/json") {
                    var msgJSON = JSON.parse(msg);
                    var puckCount;
                    var points;
        
                    if (msgJSON.puckCount !== undefined) {
                        puckCount = msgJSON.puckCount;
                        TwitchUserManager.setPuckCount(puckCount);
                    }
        
                    if (msgJSON.points !== undefined) {
                        points = msgJSON.points;
                    }
        
                    TemplateManager.LoadHeaderTemplate(undefined, undefined, puckCount, points);
                }
            });
        }
    };
})();

// TemplateManager manages view templates
var TemplateManager = (function(){


    //disable launch button after click for a few seconds
    var disableSendButton = function(sendButton) {
        var disabledSeconds = 5;
        sendButton.disabled = true;
        if (sendButton.disabled === true) {
            var disabledTimer = setInterval(function () {
                sendButton.textContent = 'Queuing Launch ' + disabledSeconds;
                disabledSeconds--;
                if (disabledSeconds <= 0) {
                    clearInterval(disabledTimer);
                }
            }, 1000);
        };
        setTimeout(function () {
            sendButton.disabled = false;
            if (sendButton.disabled === false) {
                sendButton.textContent = 'Launch';
            }
        }, 6000);
    };

    var initLauncherAngleCntl = function(side) {
        var imgId;
        var sliderId;
        var displayId;
        var directionMultiplier;
        if (side === 0) {
            imgId = "#leftAngleImg";
            sliderId = "leftAngleSlider";
            displayId = "#leftAngleDisplay";
            directionMultiplier = -1;
        }
        else {
            imgId = "#rightAngleImg";
            sliderId = "rightAngleSlider";
            displayId = "#rightAngleDisplay";            
            directionMultiplier = 1;
        }

        var sliderChangeHandler = function() {
            var newVal = $("#" + sliderId).val();
            var value = newVal * directionMultiplier;
            $(imgId).css("transform", "rotate(" + value + "deg)");
            $(imgId).css("-ms-transform", "rotate(" + value + "deg)");
            $(imgId).css("-webkit-transform", "rotate(" + value + "deg)");

            $(displayId).html("Angle: " + newVal);
        };

        // $(sliderId).bind("input", sliderChangeHandler);
        // $(sliderId).bind("change", sliderChangeHandler);
        var sliderElement = document.getElementById(sliderId);
        sliderElement.addEventListener("input", sliderChangeHandler);
        sliderElement.addEventListener("change", sliderChangeHandler);

        sliderChangeHandler();
    }

    return {
        LoadLaunchTemplate: function() {
            var launchTemplate = Handlebars.templates.launch;
            $("#main").html(launchTemplate());
            
            var leftPowerSlider = document.getElementById("leftPowerSlider");
            var rightPowerSlider = document.getElementById("rightPowerSlider");
            var leftPowerOutput = document.getElementById("leftPowerDisplay");
            var rightPowerOutput = document.getElementById("rightPowerDisplay");
            var sendButton = document.getElementById("sendButton");
            var leftPucks = document.getElementById("leftLauncher");
            var rightPucks = document.getElementById("rightLauncher");
            var leftAngleSlider = document.getElementById("leftAngleSlider");
            var rightAngleSlider = document.getElementById("rightAngleSlider");
        
            //init variables
            leftPowerOutput.innerHTML = "Power: " + leftPowerSlider.value;
            rightPowerOutput.innerHTML = "Power: " + rightPowerSlider.value;
            leftPucks.value = 0;
            rightPucks.value = 0;
        
            initLauncherAngleCntl(0);
            initLauncherAngleCntl(1);
            
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
                var totalPucksLaunched = parseInt(leftPucks.value) + parseInt(rightPucks.value);
                var currentPuckCount = TwitchUserManager.getPuckCount();
                try {
                    if (totalPucksLaunched > currentPuckCount) {
                        throw "Not enough pucks to complete launch. Please change total amount to " + currentPuckCount + " pucks or less.";
                    }
                    else if (leftPucks.value > 50 && rightPucks.value > 50) {
                        throw "Both Launchers values are greater than 50 pucks.";
                    }
                    else if (leftPucks.value > 50) {
                        throw "Left Launcher value is greater than 50 pucks.";
                    }
                    else if (rightPucks.value > 50) {
                        throw "Right Launcher value is greater than 50 pucks.";
                    }
                    else if (rightPucks.value == 0 && leftPucks.value == 0) {
                        throw "Please enter pucks to launch. Both amounts are currently 0.";
                    }
                    else if (TwitchUserManager.getUserInfo() === undefined) {
                        throw "Unable to obtain user info. To play, please allow this extension to know your User ID on Twitch by clicking the \"Grant Permissions\" button below.";
                    }
                    else {
                        var left = new Launch(0, leftAngleSlider.value, leftPowerSlider.value, leftPucks.value);
                        var right = new Launch(1, rightAngleSlider.value, rightPowerSlider.value, rightPucks.value);
                        var launches = new Array();
                        if (left.pucks > 0) {
                            launches.push(left);
                        }
                        if (right.pucks > 0) {
                            launches.push(right);
                        }
                        if (launches.length > 0) {
                            EBSManager.sendLaunches(launches);
                            disableSendButton(sendButton);
                        }

                        document.getElementById("error").innerHTML = ""; //remove error
                    }
                }
                catch (err) {
                    document.getElementById("error").innerHTML = err;
                }
            });                
        },
        LoadHeaderTemplate: function(userName, avatarUrl, totalPucks, points) {
            // if username, totalpucks, or points were given as undefined values, and
            // the header has been loaded already, just grab the value that was already
            // loaded previously. That way this function can be used to just update a
            // single value instead of having to provide all three at once.

            if (userName === undefined && $("#userName").length) {
                userName = $("#userName").text();
            }

            if (avatarUrl === undefined && $("#avatarImg").length) {
                avatarUrl = $("#avatarImg").prop('src');
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
                avatarUrl: avatarUrl,
                totalPucks: totalPucks,
                playerScore: points
            }));
        },
    };
})();

// EBSManager manages access to the Stream Pucks backend service.
var EBSManager = (function(){
    return {
        sendLaunches: function(launches) {
            var twitchAuth = TwitchUserManager.getAuth();

            if (twitchAuth === undefined) {
                return;
            }

            $.ajax({
                url: 'https://us-central1-twitchplaysballgame.cloudfunctions.net/queueLaunch?channelId=' + twitchAuth.channelId + '&playerId=' + twitchAuth.userId,
                contentType: 'application/json',
                type: 'POST',
                headers: {
                    'x-extension-jwt': twitchAuth.token
                },
                data: JSON.stringify(launches)
            }).done(function (response) {
                // noop
            });
        }
    };
})();

//Right angles slider normally displays a negative value. This allows the correct value to be displayed
function changeTooltipRight(e) {
    var val = e.value;
    return Math.abs(val) + '\xB0';
}

function AllowNumbersOnly(e) {
    var charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        e.preventDefault();
    }
}

$(document).ready(function () {
    TemplateManager.LoadLaunchTemplate();
});

//get twitch auth values
window.Twitch.ext.onAuthorized(TwitchUserManager.setAuth);


