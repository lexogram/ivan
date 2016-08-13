"use strict"

;(function selection(){
  var pOutput = document.getElementById("output")

  var selection = window.getSelection()

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
})()