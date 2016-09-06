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

          if (result instanceof Error) {
            error = result
            result = null
          } else {
            error = null
          }

          setTimeout(function () {
            callback(error, result)
          }, 2000 + Math.floor(Math.random() * 2000))

        } else {
          arguments.push(callback)
          return method.apply(this, arguments)
        }
        
      }
    }

  , getWordSegmentation: function getWordSegmentation(map) {
      // <map> { <lang>: [<string>, ... ], ... }
      
      var result = {}
      var lang

      for (lang in map) {
        treatLanguage(lang)
      }

      return result

      function treatLanguage(lang) {
        var stringArray = map[lang]
        var langArray = result[lang]

        if (!langArray) {
          langArray = []
          result[lang] = langArray
        }

        ;(function treatStrings() {
          var ii = stringArray.length
          var wordMap

          while (ii--) {
            wordMap = dico.getWordMap(stringArray[ii], lang)
            langArray.push(wordMap)
          }
        })()
      }
    }
  }.initialize()
})()



// console.log(SERVER.getWordArray("๒๓๔๕๖๗๘๙ งมเข็มในมหาสมุทร find a needle in a haystack พูดไปสองไพเบี้ย นิ่งเสียตำลึงทอง ตา​กลม ตากลม", "th"))