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
  var startRegex = new RegExp("([^" + _W + "]+'?-?)+['-]$", "g")
  var endRegex = new RegExp("^['-]('?-?[^" + _W + "]+)+")
  var edgeRegex = new RegExp("[^" + _W + "]")
  var nextWordRegex = new RegExp(
    "([^"+ _W +"])*"
  + "(["+ _W +"])+"
  + "(?=[^"+ _W +"])"
  )
  var wordStartRegex = new RegExp("[^" + _W + "]")
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
      // There are no more words in this text node. Try the next.
      container = getNextTextNode(container)

      if (container) {
        string = container.textContent
        result = wordStartRegex.exec(string)
        startOffset = result.index

      } else {
        // We're at the very end of the selectable text. There's
        // nothing more to select.
        return
      }
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

  function getNextTextNode(node) {
    var parentNode = node.parentNode
    var nextNode

    while (node = node.nextSibling) {
      if (node.textContent.search(/\S/) < 0) {         
      } else if (node.tagName !== "SCRIPT") {
        // The next child of current parent has non-empty content
        nextNode = getFirstTextNode(node)
        if (nextNode) {
          return nextNode
        }
      }
    } 

    // If we get here, there were no more sibling nodes. Try the
    // next sibling of the parent, unless we've reached the last
    // selectable child of the body itself.
    if (parentNode !== document.body) {
      return getNextTextNode(parentNode)
    }

    function getFirstTextNode(node) {
      var childNodes = [].slice.call(node.childNodes)

      if (!childNodes.length) {
        return node
      }

      while (node = childNodes.shift()) {
        if (node.textContent.search(/\S/) < 0) {         
        } else if (node.nodeType === 3) {
          if (elementIsSelectable(node.parentNode)) {
            return node
          }
        } else {
          return getFirstTextNode(node)
        }
      }
    }
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
      return style[key] !== "none"
    })

    return selectable
  }
})()