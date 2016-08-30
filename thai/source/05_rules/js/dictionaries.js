"use strict"

var dico = {}
var segment

;(function addDictionaries() {
  dico = {

    dictionaries: {
      enx: {
        " ": 0
      , "a": 0
      , "air": 0
      , "exposed": 0
      , "eye": 0
      , "for": 0
      , "forane": 0 // nonsense word for testing
      , "gold": 0
      , "he": 0
      , "in": 0
      , "is": 0    
      , "look": 0
      , "need": 0
      , "needle": 0
      , "old": 0
      , "or": 0
      , "pence": 0
      , "round": 0
      , "sea": 0
      , "silence": 0
      , "talk": 0
      , "the": 0
      , "these": 0
      , "to": 0
      , "tot": 0
      , "tup": 0
      , "tuppence": 0
      , "up": 0
      , "worth": 0
      }

    , th: {
        " ": {}
      , "​": {} // &#8203;
      , "กลม": {
          "pronunciation": "glohm-"
        , "translation": "round; circular"
        }
      , "งม" : {
          "pronunciation": "ngohm-"
        , "translation": "to grope; search; seek; fumble for"
        }
      , "ตา": {
          "pronunctiation": "dtaa-"
        , "translation": "eye; maternal grandfather"
        }
      , "ตาก": {
          "pronunctiation": "dtaak_"
        , "translation": "[is] exposed (e.g., to the sun)"
        }
      , "ตำ" : {
          "pronunciation": "dtam-"
        , "translation": "beat; pound an object; pulverize; to pierce; puncture; prick"
        }
      , "ตำลึง" : {
          "pronunciation": "dtam- leung-"
        , "translation": "ancient Thai monetary unit"
        }
      , "ทอง" : {
          "pronunciation": "thaawng-"
        , "translation": " gold"
        }
      , "นิ่ง" : {
          "pronunciation": "ning`"
        , "translation": "[is] still; immobile; silent; motionless; quiet"
        }
      , "พูด" : {
          "pronunciation": "phuut`"
        , "translation": " to speak; to talk; to say"
        }
      , "มหา" : {
          "pronunciation": "ma' haa´"
        , "translation": "great; omnipotent; large; many; much; maximal; paramount; exalted"
        }
      , "มหาสมุทร" : {
          "pronunciation": "ma' haa´ sa_ moot_"
        , "translation": "ocean"
        }
      ,"ลม": {
          "pronunciation": "lohm-"
        , "translation": "air; wind; storm"
        }
      , "สมุทร" : {
          "pronunciation": "sa_  moot_"
        , "translation": "ocean; sea"
        }
      , "สอง" : {
          "pronunciation": "saawng´"
        , "translation": "two"
        }
      , "เข็ม" : {
          "pronunciation": "khem´"
        , "translation": "clasp; brooch; safety pin; needle; sewing pin"
        }
      , "เบี้ย" : {
          "pronunciation": "biia`"
        , "translation": "a cowrie shell [formerly used as] money"
        }
      , "เสีย" : {
          "pronunciation": "siia´"
        , "translation": "to spend; use up; lose; give up; sacrifice; pay"
        }
      , "ใน" : {
          "pronunciation": "nai-"
        , "translation": "in; inside; within; amidst; into; on; at a particular time"
        }
      , "ไป" : {
          "pronunciation": "bpai-"
        , "translation": "to go; <subject> goes"
        }
      , "ไพ" : {
          "pronunciation": "phai-"
        , "translation": "a certain old coin equal in value to 1/32 baht"
        }
      }
    }

  , tries: {}

  , initialize: function createTries(){
      for (var languageCode in this.dictionaries) {
        this.tries[languageCode] = 
          this.createTrie(this.dictionaries[languageCode])
      }

      return this
    }

  , createTrie: function createTrie(languageMap) {
      var trie = {}
      var end = "$"
      var word
        , ii
        , length
        , chars
        , char
        , path
        , place


      for (word in languageMap) {
        chars = word.split("")
        path = trie
   
        for (ii = 0, length = word.length; ii < length; ii += 1 ) {
          char = chars[ii]
          place = path[char]
   
          if (!place) {
            place = {}
            path[char] = place
          }
          path = place
        }
        path[end] = true
      }

      return trie
    }

  , splitIntoWords: function splitIntoWords(string, languageCode) {
      var trie = this.tries[languageCode]
      var alternatives = []
      var path = trie
      var words = []
      var word = ""
      var found = false
      var char
        , next
        , alternative

      words.index = 0

      for (var ii = 0, total = string.length; ii < total ; ii += 1) {
        char = string[ii]
        next = path[char]

        if (next) { // { "$": 0, "a": { ... }. ...}          
          word += char

          if (next.$) {
            if (found) {
              // We've already added a shorter word to the list.
              // Push the list with the shorter word onto the
              // alternatives array and continue with the longer word
              alternative = words.slice(0)
              alternative.index = words.index
              alternatives.push(alternative)

              words.index -= words.pop().length // remove shorter word
            }
            // Add this whole word to the list
            words.push(word)
            words.index += word.length
            found = true
          }

          path = next

        } else if (found) {
          // !next, but we have a complete word already
          // This character could be the start of a new word
          word = char
          path = trie[char]
          if (!path) {
            // It's imposible to start a word with this letter
            backtrack("Initial letter absent: " + char)

          } else if (path.$) {
            // This is a one-letter word: found remains true
            words.push(word)
            words.index += word.length
            next = path

          } else {
            found = false
          }

        } else {
          // !next && !found: stop trying to complete this word
          backtrack("Word fragment: " + word)
        }
      }

      if (!next || !next.$) {
        backtrack("Fail – Unknown word: ", word)
      }

      return words

      function backtrack(reason) {
        console.log(reason)

        // Try the longest earlier alternative ...
        words = alternatives.pop()
        // ... if one exists ...
        if (!words) {
          console.log("Failed to segment")
          ii = total
          return
        }
        // ... and see if all the remaining characters cand be
        // segmented into words
        ii = words.index - 1
        path = trie
        word = ""
        found = false
      }
    }
  }.initialize()

segment = {
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

      function numerical(a, b) {
        return a - b
      }

      function removeDuplicates(value, index, array) {
        return array.indexOf(value) === index
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

        breakPoints.sort(numerical)
        breakPoints = breakPoints.filter(removeDuplicates)

        end = string.length
        ii = breakPoints.length
        while (ii--) {
          start = breakPoints[ii]
          breakPoints[ii] = string.slice(start, end)
          end = start
        }  

        return breakPoints
      }

      return splitIntoWords(string)
    }
  }
})()

console.log(dico.splitIntoWords(
  "งมเข็มในมหาสมุทร "
+ "พูดไปสองไพเบี้ย นิ่งเสียตำลึงทอง "
+ "ตากลม ตา​กลม"
, "th"
))
console.log(segment.th(
  "งมเข็มในมหาสมุทร "
+ "พูดไปสองไพเบี้ย นิ่งเสียตำลึงทอง "
+ "ตากลม ตา​กลม"
))