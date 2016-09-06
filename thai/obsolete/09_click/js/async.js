"use strict"

var ASYNC

;(function async(){
  ASYNC = {
    call: function call (methodName) {
      var method = this.methods[methodName]
      var args = [].slice.call(arguments)
      var callback = args.pop()
      var result
        , error
   
      if (typeof method === "function") {
        args.shift()

        if (typeof callback === "function") {
          // Simulate asynchronous call
          result = method.apply(this, args)

          if (result instanceof Error) {
            error = result
            result = null
          } else {
            error = null
          }

          setTimeout(function () {
            callback(error, result)
          }, Math.floor(Math.random() * 2000))

        } else {
          // Return result synchronously
          args.push(callback)
          return method.apply(this, args)
        }
      } else {
        error = new Error("Unknown method: " + methodName)
        if (typeof callback === "function") {
          callback(error)
        } else {
          return error
        }
      }
    }

  , methods: {
      /**
       * getWordSegmentation calls dico.getWordMap() for each string
       * in the map object, and returns an object defining the 
       * positions of the start and end of each word in each string.
       * @param  {object} map has the format
       *                    { <lang code>: [<string>, ... ], ... }
       * @return {[object]} { <lang code>: [
       *                      { text: <string>
       *                        , offsets: { starts: [<integer>, ...]
       *                                   , ends: [<integer>, ... ]
       *                                   }
       *                         }
       *                       , ...
       *                       ]
       *                     , ...
       *                     }
       */
      getWordSegmentation: function getWordSegmentation(map) {
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
              try {
                wordMap = dico.getWordMap(stringArray[ii], lang)
                langArray.push(wordMap)
              } catch (error) {
                result = error
                ii = 0
              }
            }
          })()
        }
      }
    }
  }
})()