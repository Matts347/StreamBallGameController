
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
//Launcher object to be used in JSON for game
function Launcher(side, angle, power, pucks) {
    this.side = side; //int value of 0 for left and 1 for right
    this.angle = angle;
    this.power = power;
    this.pucks = pucks;
}


leftOutput.innerHTML = "Left Launcher";
rightOutput.innerHTML = "Right Launcher";
angleOutput.innerHTML = angleSlider.value + " Degrees";
powerOutput.innerHTML = "Power: " + powerSlider.value;
leftPucks.value = 0;
rightPucks.value = 0;

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
    var right = new Launcher('1', angleSlider.value, powerSlider.value, leftPucks.value);
    var launches = [left, right];
    var launchJSON = JSON.stringify(launches);
    console.log(launchJSON);
    //JSON code
    title.innerHTML = "PRESSED  Angle: " + angleSlider.value + " Power: " + powerSlider.value + " Left Pucks: " + leftPucks.value + " Right Pucks: " + rightPucks.value;
    //maybe reset displayed values
};

function AllowNumbersOnly(e) {
    var charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        e.preventDefault();
    }
}

//function to send JSON data to game
function sendPucks() {
    var url = "www.ineedarealurl.com";//get from mike
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    };
    xhttp.open("POST", url, true);
    xhttp.send();
}