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
  var range
    , container
    , selectionUpdated

  document.body.ondblclick = selectHyphenatedWords

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

  var nextWordRegex = /(?:[\s!-\/:-@[-`{-~\u00A0-¾—-⁊])+(?=[^\s!-\/:-@[-`{-~\u00A0-¾—-⁊])/
  var wordStartRegex = /[^\s!-\/:-@[-`{-~\u00A0-¾—-⁊]/
  var wordEndRegex = /(?:[\s!-\/:-@[-`{-~\u00A0-¾—-⁊])|$/

  document.body.onkeydown = jumpToNextWord

  function jumpToNextWord (event) {
    if (selection.toString === "") {
      return
    } else if (!(range = selection.getRangeAt(0))) {
      return
    }

    switch (event.keyCode) {
      case 37: // Left
        jumpLeft()
     // case 38: // Up
      break
      case 39: // Right
        jumpRight()
      //case 40: // Down
      break
      default:
        return
    }
  }

  function jumpLeft() {
    

  }

  function jumpRight() {
    container = range.endContainer
    var startOffset = range.endOffset
    var string = container.textContent
    var result = nextWordRegex.exec(string.substring(startOffset))
    var endOffset

    if (result) {
      startOffset += result[0].length

    } else {
      // There are no more words in this text node. Try the next.
      container = getNextTextNode(container, "mustBeSelectable")

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

    range.setStart(container, startOffset)
    range.setEnd(container, endOffset)

    extendSelectionForwardAfterHyphen(string, endOffset)

    selection.removeAllRanges()
    selection.addRange(range)
  }

  function getNextTextNode(node, mustBeSelectable) {
    var parent = node.parentNode
    var nextNode

    while (node = node.nextSibling) {
      if (node.textContent.search(/\S/) < 0) {         
      } else if (node.tagName !== "SCRIPT") {
        // The next child of current parent has non-empty content
        // but it might not be selectable
        
        nextNode = getFirstTextNode(node)

        if (nextNode) {
          return nextNode
        }
      }
    } 

    // If we get here, there were no more sibling nodes. Try the next
    // sibling of the parent, unless we've reached the last
    // selectable child of the body itself 
    if (parent !== document.body) {
      return getNextTextNode(parent, mustBeSelectable)
    }

    function getFirstTextNode(nextNode) {
      var childNodes = [].slice.call(nextNode.childNodes)

      if (!childNodes.length) {
        return nextNode
      }

      while (nextNode = childNodes.shift()) {
        if (nextNode.textContent.search(/\S/) < 0) {         
        } else if (nextNode.tagName !== "SCRIPT") {
          if (nextNode.nodeType === 3) {
            if (!mustBeSelectable 
              || elementIsSelectable(nextNode.parentNode)) {
              return nextNode
            }
          } else {
            nextNode = getFirstTextNode(nextNode)
            if (nextNode) {
              return nextNode
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
})()