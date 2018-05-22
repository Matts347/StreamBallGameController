$(document).ready(function () {
    var authFailTemplate = Handlebars.templates.authorize_fail;
    if (document.location.hash.length <= 0) {
        $("#content").html(authFailTemplate());
        return;
    }

    // break hash up into an object
    var hash = document.location.hash.substr(1);
    var hashDict = hash.split('&').reduce(function (result, item) {
        var parts = item.split('=');
        result[parts[0]] = parts[1];
        return result;
    }, {});

    // check for access_token
    if (hashDict["access_token"] !== undefined) {
        var token = hashDict["access_token"];
        var authTemplate = Handlebars.templates.authorize;
        $("#content").html(authTemplate({
            token: token
        }));
        var tokenField = document.getElementById("tokenField");
        var tokenFieldHidden = document.getElementById("tokenFieldHidden");
        $("#showTokenButton").unbind('click');
        $("#showTokenButton").bind('click', function() {
            if (tokenField.type === "password") {
                tokenField.type = "text";
            }
            else {
                tokenField.type = "password";
            }
        });
        $("#copyTokenButton").unbind('click');
        $("#copyTokenButton").bind('click', function() {
            var tempInput = document.createElement("input");
            document.body.appendChild(tempInput);
            tempInput.setAttribute("value", token);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
        });    
    }
    else {
        $("#content").html(authFailTemplate());
    }
});