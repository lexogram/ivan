"use strict"

// Inspired by http://not.siit.net/members/art/thaiwrap.js
// If Thai characters are not visible, try using Segoe UI Mono,
// Andale Mono, Courier or Courier New for the font.

var SEGMENTS

;(function addDictionaries() {
  SEGMENTS = {
    th: function thai(string) {
      // unambiguous words that are common, like prepositions
      var cw = "(เป็น|ใน|จะ|ไม่|และ|ได้|ให้|ความ|แล้ว|กับ|อยู่|หรือ|กัน|จาก|เขา|ต้อง|ด้วย|นั้น|ผู้|ซึ่ง|โดย|ใช้|ยัง|เข้า|ถึง|เพราะ|จึง|ไว้|ทั้ง|ถ้า|ส่วน|อื่น|สามารถ|ใหม่|ใช่|ใด|ช่วย|ใหญ่|เล็ก|ใส่|เท่า|ใกล้|ทั่ว|ฉบับ|ใต้|เร็ว|ไกล|เช้า|ซ้ำ|เนื่อง|ค้น)"
      // leading chars
      var lc = "[เ-ไ]"
      // final chars
      var fc = "[ฯะำฺๅๅๆ๎]"
      // thai chars
      var tc = "ก-ฺเ-๎" // not including numbers + ฿, ๏ or ๚๛
      var no = "๐-๙"
      var isThai = /[ก-ฺเ-๎]/
      var isNumber = /[๐-๙]/

      var regexes = [
        // characters that start a syllable
        new RegExp(lc, "g")
        // characters than end a syllable
      , new RegExp(fc, "g")
         // non-number followed by any Thai number
      , new RegExp("[^"+no+"](?=["+no+"])", "g")
         // Thai number followed by any non-number
      , new RegExp("["+no+"](?=[^"+no+"])", "g")
         // Thai character followed by a non-Thai character
      , new RegExp("["+tc+"](?=[^"+tc+"])", "g")
        // non-Thai character followed by Thai character
      , new RegExp("[^"+tc+"](?=["+tc+"])", "g")
        // any char followed by known word
      , new RegExp("."+cw+"", "g")
        // known word followed by any character
      , new RegExp(cw+"(.)", "g")
        // beginning of a space
      , /.\s/g
        // end of a space
      , /\s+./g
      ]

      var adjustments = [
        // characters that start a syllable
        0
        // characters that end a syllable
      , 1
        // non-number followed by any Thai number
      , 1
        // Thai number followed by any non-number
      , 1
        // Thai character followed by a non-Thai character
      , 1
        // non-Thai character followed by Thai character
      , 1
        // any char followed by known word
      , 1
        // known word followed by any character
      , true
        // spaces
      , 1
      , true
      ]

      function sortFunction(a, b) {
        return a - b
      }

      function splitIntoWords(string) {
        var breakPoints = [0]
        var total
          , ii
          , regex
          , adjust
          , result
          , split
          , start
          , end
          , isWord

        for (ii = 0, total = regexes.length; ii < total; ii++) {
          regex = regexes[ii]
          adjust = adjustments[ii]
          while (result = regex.exec(string)) {
            split = result.index + (adjust === true
                           ? result[0].length - 1
                           : adjust)
            breakPoints.push(split)
          }
        }

        breakPoints.sort(sortFunction)
        breakPoints = breakPoints.filter(removeDuplicates)

        function removeDuplicates(value, index, array) {
          return array.indexOf(value) === index
        }

        end = string.length
        ii = breakPoints.length
        while (ii--) {
          start = breakPoints[ii]
          breakPoints[ii] = string.slice(start, end)
          end = start
        }

        isWord = breakPoints.map(isThaiWord)

        function isThaiWord(value) {
          var isWord = value.search(isThai) + 1 // characters are +1
          if (!isWord) {
            isWord = 0 - (value.search(isNumber) + 1) // numbers are -1
          }
          return isWord
        }

        return { segments: breakPoints, isWord: isWord }
      }

      return splitIntoWords(string)
    }
  }
})()

//console.log(SEGMENTS.th("๒๓๔๕๖๗๘๙ งมเข็มในมหาสมุทร find a needle in a haystack พูดไปสองไพเบี้ย นิ่งเสียตำลึงทอง ตา​กลม ตากลม", "th"))