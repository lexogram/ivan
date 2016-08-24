"use strict"

;(function showSelection(){
  // code omitted for clarity
})()


;(function selectWholeWordsWithHyphens(){
  var selection = window.getSelection()
  // Regex designed to find a word+hyphen before the selected word.
  // Example: ad-|lib|
  // It finds the last chunk with no non-word characters (except for
  // ' and -) before the first selected character. 
  var startRegex = /(\w+'?-?)+-$/g
  // Regex designed to find a hyphen+word after the selected word.
  // Example: |ad|-lib
  var endRegex = /^-('?-?\w+)+/
  // Edge case: check if the selection contains no word characters.
  // If so, then don't do anything to extend it.
  var edgeRegex = /\w/

  var range
    , container
    , selectionUpdated

  document.body.ondblclick = selectHyphenatedWords

  function selectHyphenatedWords(event) {
    if (!selection.rangeCount) {
      return
    }
    
    selectionUpdated = false
    range = selection.getRangeAt(0)
    container = range.startContainer
    var string = container.textContent

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
})()