"use scrict"

;(function promises(){
  var output = document.querySelector("h1")
  var button = document.querySelector("button")
  var classes = ["red", "olive", "green", "teal", "blue", "purple"]
  var aSync = {
    value: 0

  , getNewValue: function getNewValue(callback) {
      var result = ++this.value
      setTimeout(function () {
        callback(result)
      }, Math.random() * 2000)
    }
  }

  button.onclick = update

  function update() {
    aSync.getNewValue(showResult)

    function showResult(value) {
      var className = classes.shift()
      classes.push(className)

      output.textContent = value
      output.className = className
    }
  }


})()