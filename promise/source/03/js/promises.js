"use scrict"

;(function promises(){
  var button = document.querySelector("button")
  var changeMe = document.getElementById("change-me")
  var meToo = document.getElementById("me-too")
  var values = ["changed", "altered", "modified", "refreshed"]

  button.onclick = function () {
    changeMe.textContent = cycle(values)
    meToo.textContent = cycle(values)
  }

  function cycle (array) {
    var value = array.shift()
    array.push(value)
    return value
  }
 
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      console.log(mutation.target.textContent)
    })  
  })

  observer.observe(document.body, { childList: true, subtree: true })

  var classes = (function () {
    var lines = [].slice.call(document.querySelectorAll("p"))
    var classes = {}

    for (var ii = 0, total = lines.length; ii < total; ii += 1) {
      classes[lines[ii].textContent] = 0
    }

    return classes
  })()

  var aSync = {
    classes: ["red", "olive", "green", "teal", "blue", "purple"]

  , getClass: function getClass(callback) {
      var error = Math.random() < 0.1 ? "Forced error" : null
      var className
      
      if (!error) {   
        className = this.classes.shift()
        this.classes.push(className)
      }

      setTimeout(function () {
        callback(error, className)
      }, Math.random() * 2000)
    }
  }
  
  function promiseFunction(resolve, reject) {
    var value = aSync.getClass(showResult)

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

  function setColour(event) {
    var target = event.target
    var content
      , colour
      , promise

    if (target.tagName !== "P") {
      return
    }

    content = target.textContent
    className = classes[content]

    if (typeof className === "string") {
      target.className = className     
    } else if (className instanceof Promise) {
      // Wait for the promise to be resolved
    } else {
      promise = classes[content] = new Promise(promiseFunction)
      promise.then(showResult, showError)
    }
    

    function showResult(value) {
      target.className = classes[content] = value
    }

    function showError(error) {
      target.textContent = error
    }
  }

  //document.body.onclick = setColour
})()