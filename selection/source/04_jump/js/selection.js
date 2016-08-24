"use strict"

;(function showSelection(){
  var pOutput = document.getElementById("output")
  var selection = window.getSelection()
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

;(function selectWholeWordsWithHyphens(){
  var selection = window.getSelection()
  var _W = "\\s!-\\/:-@[-`{-~\\u00A0-¾—-⁊"
  // Regex designed to find a word+hyphen before the selected word.
  // Example: ad-|lib|
  // It finds the last chunk with no non-word characters (except for
  // ' and -) before the first selected character. 
  var startRegex = new RegExp("([^" + _W + "]+'?-?)+['-]$", "g")
  // Regex designed to find a hyphen+word after the selected word.
  // Example: |ad|-lib
  var endRegex = new RegExp("^['-]('?-?[^" + _W + "]+)+")
  // Edge case: check if the selection contains no word characters.
  // If so, then don't do anything to extend it.
  var edgeRegex = new RegExp("[^" + _W + "]")
  var nextWordRegex = new RegExp(
    "([^"+ _W +"])*"
  + "(["+ _W +"])+"
  + "(?=[^"+ _W +"])"
  )
  var wordEndRegex = new RegExp("[" + _W + "]|$")

  var range
    , container
    , selectionUpdated

  document.body.ondblclick = selectHyphenatedWords
  document.body.onkeydown = jumpToNextWord

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
    string = string.substring(offset)
    var result = endRegex.exec(string)

    if (result) {
      range.setEnd(container, offset + result[0].length)
      selectionUpdated = true
    }
  }

  function jumpToNextWord (event) {
    var rangeData

    if (!selection.rangeCount) {
      return
    } else if (!(range = selection.getRangeAt(0))) {
      return
    }

    switch (event.keyCode) {
      case 37: // Left
        rangeData = jumpLeft()
      break
      case 39: // Right
        rangeData = jumpRight()
    }

    if (!rangeData) {
      return
    }

    range.setStart(container, rangeData.startOffset)
    range.setEnd(container, rangeData.endOffset)

    switch (event.keyCode) {
      case 37: // Left
        // TODO
      break
      case 39: // Right
        extendSelectionForwardAfterHyphen(
          rangeData.string
        , rangeData.endOffset
        )
      break
    }

    selection.removeAllRanges()
    selection.addRange(range)
  }


  function jumpLeft() {
    // TODO
  }

  function jumpRight() {
    container = range.endContainer
    var startOffset = range.endOffset
    var string = container.textContent
    var result = nextWordRegex.exec(string.substring(startOffset))
    var endOffset
      , rangeData

    if (result) {
      startOffset += result[0].length

    } else {
      // TODO
      return
    }

    result = wordEndRegex.exec(string.substring(startOffset))
    endOffset = startOffset + result.index

    rangeData = {
      startOffset: startOffset
    , endOffset: endOffset
    , string: string
    }

    return rangeData
  }
})()