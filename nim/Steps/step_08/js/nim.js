"use strict";

var matches = document.querySelectorAll(".matches img");
//console.log(matches);

for (var ii=0; ii<matches.length; ii++) {
  var match = matches[ii];

  match.onclick = function (event) {
    var match = event.target;
    match.classList.add("removed");
  };
}

function reset() {
  var matches = document.querySelectorAll(".matches img.removed");

  for (var ii=0; ii<matches.length; ii++) {
    var match = matches[ii];
    match.classList.remove("removed");
  }
}