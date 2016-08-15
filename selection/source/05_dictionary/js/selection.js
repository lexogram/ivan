"use strict"

;(function selection(){
  var pOutput = document.getElementById("output")
  var pTranslation = document.getElementById("translation")
  var selection = window.getSelection()
  // RegExp to detect word boundaries but to allow ' and - in
  // the middle of words
  // 1. Match a whole range of non-word characters pairs possibly 
  //    including a ' or a - (found in the range !-/)
  var regex = "[\\s!-@\\[-`\\{-~]{2,}"
  //var regex = "[\\s!-/:-@\\[-`\\{-~]{2,}"
  // 2. Match a whole range of non-word characters, excluding ' and -,
  //    on their own
  regex += "|[\\s!-&\\(-,.-@\\[-`\\{-~]"

  // 3a. Match sequence of single-quotes or hyphens at the beginning
  var startRegex = new RegExp("^['-]+|" + regex, "g")
  // 3b. Match  end of the string if there is no other boundary first;
  //     ignore trailing apostrophe/quote marks
  var endRegex = new RegExp(regex + "|['-]*$")
  var offset = {}

  ;(function showSelection(){
    var output = "rangeCount: " + selection.rangeCount
    var range
    var text

    if (selection.anchorNode) {
      text = '"' + selection.anchorNode.textContent + '"'
      output += "<br />anchorNode: " + text

      output += "<br />anchorOffset: " + selection.anchorOffset

      text = '"' + selection.focusNode.textContent + '"'
      output += "<br />focusNode: " + text

      output += "<br />focusOffset: " + selection.focusOffset
    }

    if (selection.rangeCount) {
      range = selection.getRangeAt(0)

      text =  '"' + range.startContainer.textContent + '"'
      output += "<br />range.startContainer: " + text

      output += "<br />range.startOffset: " + range.startOffset

      text =  '"' + range.endContainer.textContent + '"'
      output += "<br />range.endContainer: " + text

      output += "<br />range.endOffset: " + range.endOffset

      text = '"' + range.toString() + '"'
      output += "<br />range.toString(): " + text
    }

    text = '"' + selection.toString() + '"'
    output += "<br />selection.toString(): " + text

    pOutput.innerHTML = output

    setTimeout(showSelection, 250)
  })()

  document.body.onmouseup = selectWholeWords

  function selectWholeWords(event) {
    if (event.detail === 3) {
      // Let triple-clicks take control of the selection
      return
    }

    if (selection.rangeCount) {
      var range = selection.getRangeAt(0)
      if (selection.collapseToEnd) {
        selection.collapseToEnd()
      }

      var offset = getStartOffset(range)
      range.setStart(range.startContainer, offset)     

      offset = getEndOffset(range)
      range.setEnd(range.endContainer, offset)

      selection.removeAllRanges()
      selection.addRange(range)

      showTranslation()
    }

    function getLang(element) {
      if (element.closest) {
        element = element.closest("[lang]")
      } else {
       element = element.parentNode.closest("[lang]") 
      }

      return element.lang
    }

    function getStartOffset(range) {
      var container = range.startContainer
      var offset = range.startOffset // SIC
      var lang = getLang(container)

      console.log("start", offset)

      switch (lang) {
        case "th":
        case "enx":
          return segmentWords(range)
        break
        default:
          return useStartRegex()
      }

      function segmentWords(range) {
        var wordArray = dico.splitIntoWords(container.textContent, lang)
        var stop = false
        var temp


          return wordArray.reduce(function (index, word) {
          if (stop || (temp = index + word.length) > offset) {
            stop = true
            return index
          } else {
            return temp
          }
        }, 0)
      }

      function useStartRegex() {
        var string = container.textContent 
        var adjust = 0
        var result
        string = string.substring(0, offset)

        while (result = startRegex.exec(string)) {
          offset = result.index
          adjust = result[0].length
        }

        return adjust ? offset + adjust : 0
      }
    }

    function getEndOffset(range) {
      var container = range.endContainer
      var offset = range.endOffset
      var lang = getLang(container)
      var startOffset = range.startOffset

      if (offset === startOffset
       && range.endContainer === range.startContainer) {
         offset += 1
      }

      console.log("end", offset)

      switch (lang) {
        case "th":
        case "enx":
          return segmentWords()
        break
        default:
          return useEndRegex()
      }

      function segmentWords() {
        var textContent = container.textContent
        var wordArray = dico.splitIntoWords(textContent, lang)

        var output
        output = wordArray.reduce(function (index, word) {
          if (index < offset) {
            return index += word.length
          } else {
            return index
          }
        }, 0)

        if (textContent.substring(startOffset, output) === " ") {
          output = startOffset
        }

        return output
      }

      function useEndRegex() {
        var string = container.textContent
        offset += string.substring(offset).search(endRegex)
        return offset
      }
    }
  }

  function showTranslation() {
    var word = selection.toString()
    var data = dico.getWordData(word, "th")
    var string = "<dl>"

    if (data) {
      for (var key in data) {
        string += "<dt>" + key + "</dt>"
        string += "<dd>" + data[key] + "</dd>"
      }

      string += "</dl>"
    }

    pTranslation.innerHTML = string
  }
})()