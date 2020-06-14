(function() {
  const stroke1 = document
    .getElementById("number_stroke1")
    .getBoundingClientRect();
  document.getElementById("room-code1").style.width = "2rem";
  document.getElementById("room-code1").style.left =
    stroke1.left + stroke1.width / 2 + "px";
  document.getElementById("room-code1").style.top =
    stroke1.top - stroke1.height - 20 + "px";
  document.getElementById("room-code1").style.transform =
    "translate(-50%,-50%)";
  document.getElementById("room-code1").value = "";
  const stroke2 = document
    .getElementById("number_stroke2")
    .getBoundingClientRect();
  document.getElementById("room-code2").style.left =
    stroke2.left + stroke2.width / 2 + "px";
  document.getElementById("room-code2").style.top =
    stroke2.top - stroke2.height - 20 + "px";
  document.getElementById("room-code2").style.transform =
    "translate(-50%,-50%)";
  document.getElementById("room-code2").style.width = "2rem";
  document.getElementById("room-code2").value = "";
  const stroke3 = document
    .getElementById("number_stroke3")
    .getBoundingClientRect();
  document.getElementById("room-code3").style.left =
    stroke3.left + stroke3.width / 2 + "px";
  document.getElementById("room-code3").style.top =
    stroke3.top - stroke3.height - 20 + "px";
  document.getElementById("room-code3").style.transform =
    "translate(-50%,-50%)";
  document.getElementById("room-code3").style.width = "2rem";
  document.getElementById("room-code3").value = "";
  const stroke4 = document
    .getElementById("number_stroke4")
    .getBoundingClientRect();
  document.getElementById("room-code4").style.left =
    stroke4.left + stroke4.width / 2 + "px";
  document.getElementById("room-code4").style.top =
    stroke4.top - stroke4.height - 20 + "px";
  document.getElementById("room-code4").style.transform =
    "translate(-50%,-50%)";
  document.getElementById("room-code4").style.width = "2rem";
  document.getElementById("room-code4").value = "";
})();
