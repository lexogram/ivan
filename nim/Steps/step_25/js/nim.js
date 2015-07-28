document.body.onclick = function (event) {
  event.target.classList.add("removed")
}

function reset() {
  var matches = document.querySelectorAll(".matches img.removed")

  for (var ii=0; ii<matches.length; ii++) {
    var match = matches[ii]
    match.classList.remove("removed")
  }
}