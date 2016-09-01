"use scrict"

;(function promises(){
  var output = document.querySelector("h1")
  var button = document.querySelector("button")
  var classes = ["red", "olive", "green", "teal", "blue", "purple"]

  var aSync = {
    value: 0

  , getNewValue: function getNewValue(callback) {
      var result = ++this.value
      var error = Math.random() < 0.1 ? "Forced error" : null

      setTimeout(function () {
        callback(error, result)
      }, Math.random() * 2000)
    }
  }

  var promise = new Promise(promiseFunction)

  button.onclick = update
  
  function promiseFunction(resolve, reject) {
    var value = aSync.getNewValue(showResult)

    function showResult (error, value) {
      if (error) {
        // If reject() is called when no reject function is defined
        // then certain browsers will display an error in the Console
        // to warn that errors are not being handled
        reject(Error(error))
      } else {
        resolve(value)
      }
    }
  }

  function update() {
    promise.then(showResult, showError)

    function showResult(value) {
      var className = classes.shift()
      classes.push(className)

      output.textContent = value
      output.className = className
    }

    function showError(error) {
      output.textContent = error
      output.className = ""
    }
  }
})()