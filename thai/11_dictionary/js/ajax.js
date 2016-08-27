var AJAX

;(function ajax(){
  AJAX = {
    send: function send(url, callback, options) {
      var xhr = new XMLHttpRequest()
      var postDataString
      var headers
      var timeout

      typeof options !== "object" ? options = {} : null

      xhr.open('GET', url)

      if (postDataString = options.postDataString || null) {
        if (typeof postDataString !== "string") {
          postDataString = JSON.stringify(postDataString)
        }

        headers = options.headers
        switch (typeof headers) {
          case "object": // use as is
          break
          case "string":
            headers = { "Content-Type": headers }
          break
          default:         
            headers = { "Content-Type": "application/x-www-form-urlencoded" }
        }

        if (typeof headers === "object") {
          for (var key in headers) {
            xhr.setRequestHeader(key, headers[key])
          }
        }

      } else { // GET request
        postDataString = null
      }

      timeout = options.timeout // milliseconds
      isNaN(timeout) ? null : xhr.timeout = timeout // <0 => 0

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            // Timed out responseText = undefined
            callback(0, xhr.responseText)
          } else {
            callback(xhr.status)
          }
        }
      }

      xhr.send(postDataString)

      return xhr
    }
  }
})()
