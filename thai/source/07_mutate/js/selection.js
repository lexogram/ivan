"use strict"

;(function selection(){
  var observer = new MutationObserver(checkForAlteredTextNodes)
  var wordsMap = { th: {}, enx: {} }

  observer.observe(document.body, { 
    childList: true
  , attributes: true
  , subtree: true
  })

  function getLang(node) {
    var lang = ""
    var element = node

    while (!element.closest) {
      element = element.parentNode
    }

    element = element.closest("[lang]")

    if (element) {
      lang = element.getAttribute("lang")
    }

    return lang
  }

  function elementIsSelectable(element) {
    var prefixes = [
      "-webkit-"
    , "-khtml-"
    , "-moz-"
    , "-ms-"
    , ""
    ]
    var style = window.getComputedStyle(element)

    var selectable = prefixes.every(function check(key) {
      key += "user-select"
      return style.getPropertyValue(key) !== "none"
    })

    return selectable
  }

  function checkForAlteredTextNodes(mutations) {
    var newTextMap = {} // { <lang>: [<string>, ...], ...}
    var newTextFound = false

    mutations.forEach(populateNewTextArray)
  
    if (newTextFound) {
      ASYNC.call("getWordSegmentation", newTextMap, updateWordsMap)
    }

    function populateNewTextArray(mutation) {
      var filter = {
        acceptNode: function(node) {
          var text = node.data
          var lang
            , map
            , langArray

          if (! /^\s*$/.test(text)) {
            lang = getLang(node)       
            if (map = wordsMap[lang]){
              if (elementIsSelectable(node.parentNode)) {
                if (!map[text]) {
                  if (!(langArray = newTextMap[lang])) {
                    langArray = []
                    newTextMap[lang] = langArray
                  }

                  langArray.push(text)
                  map[text] = true
                  newTextFound = true
                }
              }
            }
          }
        }
      }
      var walker = document.createTreeWalker(
        mutation.target
      , NodeFilter.SHOW_TEXT
      , filter
      )

      while (walker.nextNode()) {
        // Action occurs in filter.acceptNode       
      }      
    }
  }

  /**
   * updateWordsMap is triggered by a callback from the ASYNC call to
   * getWordSegmentation. For each language and each text key, it
   * replaces the existing `true` entry with the `offsets` array for
   * the word boundaries in the given string.
   * @param  {Error | null}  error   
   * @param  {null | object} result 
   *                         { <lang>: [
   *                              { "text": <string>
   *                              , "offsets": {
   *                                   "starts" <array of integers>
   *                                 , "ends" <array of integers>
   *                                 }
   *                               }
   *                             , ...
   *                             ]
   *                           , ...
   *                           }
   */
  function updateWordsMap(error, result) {
    if (error) {
      return console.log(error) // TODO
    }

    var lang
      , langArray
      , langMap
      , ii
      , textData

    for (lang in result) {
      langMap = wordsMap[lang]
      langArray = result[lang]

      ii = langArray.length
      while (ii--) {
        textData = langArray[ii]
        langMap[textData.text] = textData.offsets
      }
    }

    console.log(JSON.stringify(wordsMap))
  }
})()