var SERVER

;(function server(){
  SERVER = {
    initialize: function initialize() {
      return this
    }

  , call: function call (methodName) {
      var method = this[methodName]
      var callback

      if (typeof method === "function") {
        arguments = [].slice.call(arguments)
        arguments.shift()

        callback = arguments.pop()
        if (typeof callback === "function") {
          result = method.apply(this, arguments)

          setTimeout(function () {
            callback(result)
          }, Math.floor(Math.random() * 2000))

        } else {
          arguments.push(callback)
          return method.apply(this, arguments)
        }
        
      }
    }
  , getWordArray: function get(string, languageCode) {
      var segments = []
      var isWord = []

      if (SEGMENTS && SEGMENTS[languageCode]) {
        return SEGMENTS[languageCode](string)
      }

      segments = string.split(/\b/)
      isWord = segments.map(function (value) {
        return value.search(/\w/) + 1
      })

      return { segments: segments, isWord: isWord }
    }
  }.initialize()
})()



console.log(SERVER.getWordArray("๒๓๔๕๖๗๘๙ งมเข็มในมหาสมุทร find a needle in a haystack พูดไปสองไพเบี้ย นิ่งเสียตำลึงทอง ตา​กลม ตากลม", "th"))