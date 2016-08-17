"use strict"

// Tweak to make a double-click select words with hyphens
// 
// As of 2016-0816, None of the major Mac browser selects whole words
// with hyphens, like "ad-lib". This tweak fixes the hypen issue.
// 
// Note: Firefox 48.0 doesn't automatically select whole words with 
// apostrophes like "doesn't". This tweak also fixes that.

;(function selectWholeWordsWithHyphens(){
  var pOutput = document.getElementById("output")
  var selection = window.getSelection()
  // Regex designed to find a word+hyphen before the selected word.
  // Example: ad-|lib|
  // It finds the last chunk with no non-word characters (except for
  // ' and -) before the first selected character. 
  var startRegex = /(?:\w+['-]*)+['-](?:\w+(?:['-]\w+)*|$)*/g
  // Regex designed to find a hyphen+word after the selected word.
  // Example: |ad|-lib
  var endRegex = /^[\w']*['-]\w+('?-?\w+)*/
  // Edge case: to check if the selection contains no word
  // characters. If so, then don't do anything to extend it.
  var edgeRegex = /\w/
  
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

  document.body.ondblclick = selectHyphenatedWords

  function selectHyphenatedWords(event) {
    if (!selection.rangeCount) {
      return
    }
    var range = selection.getRangeAt(0)
    var container = range.startContainer
    var string = container.textContent
    var selectionUpdated = false

    if (string.substring(range.startOffset, range.endOffset)
              .search(edgeRegex) < 0) {
      // There are no word characters selected
      return
    }

    extendSelectionBackBeforeHypen(string, range.startOffset)
    extendSelectionForwardAfterHyphen(string, range.endOffset)

    if (selectionUpdated) {
      selection.removeAllRanges()
      selection.addRange(range)
    }

    function extendSelectionBackBeforeHypen(string, offset) {
      var lastIndex = 0
      var result
        , index
      string = string.substring(0, offset)

      while (result = startRegex.exec(string)) {
        index = result.index
        lastIndex = startRegex.lastIndex
      }

      if (lastIndex === offset) {
        range.setStart(container, index)
        selectionUpdated = true
      }
    }

    function extendSelectionForwardAfterHyphen(string, offset) { 
      if (!offset) {
        return
      }

      string = string.substring(offset)
      var result = endRegex.exec(string)

      if (result) {
        range.setEnd(container, offset + result[0].length)
        selectionUpdated = true
      }
    }
  }
})()