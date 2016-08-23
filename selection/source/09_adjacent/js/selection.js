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

// Tweak to make a double-click select words with hyphens
// 
// As of 2016-0816, None of the major Mac browser selects whole words
// with hyphens, like "ad-lib". This tweak fixes the hypen issue.
// 
// Note: Firefox 48.0 doesn't automatically select whole words with 
// apostrophes like "doesn't". This tweak also fixes that.

;(function selectWholeWordsWithHyphens(){
  var selection = window.getSelection()
  // Regex designed to find a word+hyphen before the selected word.
  // Example: ad-|lib|
  // It finds the last chunk with no non-word characters (except for
  // ' and -) before the first selected character. 
  var startRegex = /([^\s!-\/:-@[-`{-~\u00A0-¾—-⁊]+'?-?)+['-]$/g
  // Regex designed to find a hyphen+word after the selected word.
  // Example: |ad|-lib
  var endRegex = /^['-]('?-?[^\s!-\/:-@[-`{-~\u00A0-¾—-⁊]+)+/
  // Edge case: check if the selection contains no word characters.
  // If so, then don't do anything to extend it.
  var edgeRegex = /[^\s!-\/:-@[-`{-~\u00A0-¾—-⁊]/
  
  var lastWordRegex = /([^\s!-\/:-@[-`{-~\u00A0-¾—-⁊])+/g
  var nextWordRegex = /(?:[\s!-\/:-@[-`{-~\u00A0-¾—-⁊])+(?=[^\s!-\/:-@[-`{-~\u00A0-¾—-⁊])/
  var wordStartRegex = /[^\s!-\/:-@[-`{-~\u00A0-¾—-⁊]/
  var wordEndRegex = /(?:[\s!-\/:-@[-`{-~\u00A0-¾—-⁊])|$/

  var range
    , container
    , selectionUpdated

  document.body.ondblclick = selectHyphenatedWords
  document.body.onkeydown = jumpToNextWord

  function selectHyphenatedWords(event) {
    if (!selection.rangeCount) {
      return
    }
    range = selection.getRangeAt(0)
    selectionUpdated = false
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
      scrollIntoView(range)
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

    if (selection.toString === "") {
      return
    } else if (!(range = selection.getRangeAt(0))) {
      return
    }

    switch (event.keyCode) {
      case 37: // Left
        rangeData = jumpLeft()
     // case 38: // Up
      break
      case 39: // Right
        rangeData = jumpRight()
      //case 40: // Down
      break
      default:
        return
    }

    if (!rangeData) {
      return
    }

    range.setStart(rangeData.container, rangeData.startOffset)
    range.setEnd(rangeData.container, rangeData.endOffset)

    switch (event.keyCode) {
      case 37: // Left
        extendSelectionBackBeforeHypen(
          rangeData.string
        , rangeData.startOffset
        )
     // case 38: // Up
      break
      case 39: // Right
        extendSelectionForwardAfterHyphen(
          rangeData.string
        , rangeData.endOffset
        )
      //case 40: // Down
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
      // There are no more words in this text node. Try the next.
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
      container: container
    , startOffset: startOffset
    , endOffset: endOffset
    , string: string
    }

    return rangeData
  }

  function getAdjacentTextNode(node, whichSibling, endMethod) {
    var parent = node.parentNode
    var adjacentNode

    while (node = node[whichSibling]) {
      if (node.textContent.search(/\S/) < 0) {         
      } else if (node.tagName !== "SCRIPT") {
        // The next child of current parent has non-empty content
        // but it might not be selectable
        
        adjacentNode = getEndNode(node, endMethod)

        if (adjacentNode) {
          return adjacentNode
        }
      }
    } 

    // If we get here, there were no more sibling nodes. Try the next
    // sibling of the parent, unless we've reached the last
    // selectable child of the body itself 
    if (parent !== document.body) {
      return getAdjacentTextNode(parent, whichSibling, endMethod)
    }

    function getEndNode(node, endMethod) {
      var childNodes = [].slice.call(node.childNodes)

      if (!childNodes.length) {
        return node
      }

      while (node = childNodes[endMethod]()) {
        if (node.textContent.search(/\S/) < 0) {         
        } else if (node.tagName !== "SCRIPT") {
          if (node.nodeType === 3) {
            if (elementIsSelectable(node.parentNode)) {
              return node
            }
          } else {
            node = getEndNode(node, endMethod)
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

  /**
   * scrollIntoView only works on non-nested elements. It is
   * hard-coded to scroll the body to show the selection.
   * @param  {Range object} range
   * TODO: In nested scrollable elements, ensure all parents are 
   *       in view before setting the scrollTop of the lowest-level
   *       scrollable element.
   */
  function scrollIntoView(range) {
    if (!range.getBoundingClientRect) {
      return
    }
    
    var viewHeight = document.documentElement.clientHeight
    var selectionRect = range.getBoundingClientRect()

    if (selectionRect.top < 0) {
      document.body.scrollTop += selectionRect.top
    } else if (selectionRect.bottom > viewHeight) {
      document.body.scrollTop += selectionRect.bottom - viewHeight
    }
  }
})()