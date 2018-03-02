
var slider = document.getElementById("angleSlider");
var output = document.getElementById("display");
output.innerHTML = slider.value;

slider.oninput = function () {
    output.innerText = this.value;
}