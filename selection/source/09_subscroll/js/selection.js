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
  var lastWordRegex = new RegExp("([^"+ _W +"])+", "g")
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

    scrollIntoView(range)
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
        extendSelectionBackBeforeHypen(
          rangeData.string
        , rangeData.startOffset
        )
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
    scrollIntoView(range)
  }

  function jumpLeft() {
    container = range.endContainer
    var string = container.textContent
    var result = getPreviousWord(string, range.startOffset)
    var startOffset
      , endOffset
      , rangeData

    if (!result) {
      // There are no more words in this text node. Try the previous.
      container = getAdjacentTextNode(
        container
      , "previousSibling"
      , "pop"
      )

      if (container) {
        string = container.textContent
        result = getPreviousWord(string, string.length)

      } else {
        // We're at the very beginning of the selectable text. There's
        // nothing earlier to select.
        return
      }
    }

    startOffset = result.index
    endOffset = startOffset + result[0].length

    rangeData = {
      container: container
    , startOffset: startOffset
    , endOffset: endOffset
    , string: string
    }

    return rangeData

    function getPreviousWord(string, offset) {
      string = string.substring(0, offset)
      var result
        , temp

      while (temp = lastWordRegex.exec(string)) {
        result = temp
      }

      return result
    }
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
      container = getAdjacentTextNode(
        container
      , "nextSibling"
      , "shift"
      )

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

  function getAdjacentTextNode(node, whichSibling, arrayMethod) {
    // <whichSibling> will be "previousSibling" or "nextSibling"
    // <arrayMethod> will be "pop" or "shift"

    var parent = node.parentNode
    var adjacentNode

    while (node = node[whichSibling]) {
      if (node.textContent.search(/\S/) < 0) {         
      } else if (node.tagName !== "SCRIPT") {
        // The adjacent child of current parent has non-empty
        // content but it might not be selectable
        
        adjacentNode = getEndNode(node, arrayMethod)

        if (adjacentNode) {
          return adjacentNode
        }
      }
    } 

    // If we get here, there were no more sibling nodes. Try the 
    // adjacent sibling of the parent, unless we've reached the
    // farthest selectable child of the body itself 
    if (parent !== document.body) {
      return getAdjacentTextNode(parent, whichSibling, arrayMethod)
    }

    function getEndNode(node, arrayMethod) {
      var childNodes = [].slice.call(node.childNodes)

      if (!childNodes.length) {
        return node
      }

      while (node = childNodes[arrayMethod]()) {
        if (node.textContent.search(/\S/) < 0) {         
        } else if (node.tagName !== "SCRIPT") {
          if (node.nodeType === 3) {
            if (elementIsSelectable(node.parentNode)) {
              return node
            }
          } else {
            node = getEndNode(node, arrayMethod)
            if (node) {
              return node
            }
          }
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

  function scrollIntoView(range) {
    if (!range.getBoundingClientRect) {
      return
    }
    
    var rect = range.getBoundingClientRect()
    var parentNode = range.startContainer.parentNode
    scrollChildIntoView(parentNode, rect.top, rect.bottom)
  }

  function scrollChildIntoView(parentNode, top, bottom) {
    var parentRect = parentNode.getBoundingClientRect()
    var topAdjust = parentRect.top - top
    var adjust = parentRect.bottom - bottom

    if (topAdjust > 0) {
      adjust = topAdjust
      parentNode.scrollTop -= adjust

    } else if (adjust < 0) {
      adjust = Math.max(adjust, topAdjust)
      parentNode.scrollTop -= adjust
    } else {
      adjust = 0
    }

    parentNode = parentNode.parentNode
    top += adjust
    bottom += adjust
    if (parentNode !== document.body) {
      scrollChildIntoView(parentNode, top, bottom)
    } else {
      scrollWindow(top, bottom)
    }
  }

  function scrollWindow(top, bottom) {
    var viewHeight = document.documentElement.clientHeight

    if (top < 0) {
      document.body.scrollTop += top
      document.documentElement.scrollTop += top
    } else if (bottom > viewHeight) {
      document.body.scrollTop += bottom - viewHeight
      document.documentElement.scrollTop += bottom
                                          - viewHeight
    }
  }
})()