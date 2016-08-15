"use strict"

;(function selection(){
  var pOutput = document.getElementById("output")
  var selection = window.getSelection()
  // RegExp to detect word boundaries but to allow ' and - in
  // the middle of words
  // 1. Match a whole range of non-word characters pairs possibly 
  //    including a ' or a - (found in the range !-/)
  var regex = "[\\s!-@\\[-`\\{-~]{2,}"
  // 2. Match a whole range of non-word characters, excluding ' and -,
  //    on their own
  regex += "|[\\s!-&\\(-,.-@\\[-`\\{-~]"

  // 3a. Match sequence of single-quotes or hyphens at the beginning
  var startRegex = new RegExp("^['-]+|" + regex, "g")
  // 3b. Match  end of the string if there is no other boundary first;
  //     ignore trailing apostrophe/quote marks
  var endRegex = new RegExp(regex + "|['-]*$")

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

      var container = range.startContainer
      var string = container.textContent 
      var offset=searchBackwards(
        string
      , range.startOffset
      , startRegex
      )
      range.setStart(container, offset)     

      container = range.endContainer
      string = container.textContent
      offset = range.endOffset
      offset += string.substring(offset).search(endRegex)
      range.setEnd(container, offset)

      selection.removeAllRanges()
      selection.addRange(range)
    }

    function searchBackwards(string, offset, regex) {
      var adjust = 0
      var result
      string = string.substring(0, offset)

      while (result = regex.exec(string)) {
        offset = result.index
        adjust = result[0].length
      }

      return adjust ? offset + adjust : 0
    }
  }
})()