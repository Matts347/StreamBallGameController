
var angleSlider = document.getElementById("angleSlider");
var powerSlider = document.getElementById("powerSlider");
var angleOutput = document.getElementById("angleDisplay");
var powerOutput = document.getElementById("powerDisplay");
var sendButton = document.getElementById("sendButton");
var title = document.getElementById("title");
angleOutput.innerHTML = angleSlider.value + " Degrees";
powerOutput.innerHTML = "Power: " + powerSlider.value;

angleSlider.oninput = function () {
    if (this.value === '1') {
        angleOutput.innerHTML = this.value + " Degree";
    }
    else {
        angleOutput.innerHTML = this.value + " Degrees";
    }
};

powerSlider.oninput = function () {
    powerOutput.innerHTML = "Power: " + this.value;
}

sendButton.onclick = function () {
    title.innerHTML = "PRESSED\nAngle: " + angleSlider.value + "\nPower: " + powerSlider.value;
}