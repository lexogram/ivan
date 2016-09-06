"use strict"

var dico
var segment

;(function addDictionaries() {
  dico = {

    dictionaries: {
      enx: {
        " ": 0
      , "a": 0
      , "air": 0
      , "be": 0
      , "can": 0
      , "cannot": 0
      , "elect": 0
      , "elected": 0
      , "ere": 0
      , "exposed": 0
      , "eye": 0
      , "for": 0
      , "gold": 0
      , "he": 0
      , "here": 0
      , "hew": 0
      , "in": 0
      , "is": 0    
      , "look": 0
      , "need": 0
      , "needle": 0
      , "not": 0
      , "old": 0
      , "or": 0
      , "pence": 0
      , "ran": 0
      , "round": 0
      , "sea": 0
      , "select": 0
      , "selected": 0
      , "she": 0
      , "silence": 0
      , "talk": 0
      , "the": 0
   // , "these": 0
      , "to": 0
   // , "tot": 0
      , "tup": 0
      , "tuppence": 0
      , "up": 0
      , "word": 0
      , "words": 0
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
        // New words
      , "คำ": {
          "pronunciation": "kham-"
        , "translation": "term; discourse; a mouthful or bite; morsel [numerical classifier for a word, an answer to a question, a spoonful of food]"
        }
      , "เหล่า": {
          "pronunciation": "lao_"
        , "translation": "[numerical classifier for groups of items]; a group [of items or things]"
        }
      , "นี้": {
          "pronunciation": "nee'"
        , "translation": "this; these; [is] now"
        }
      , "ไม่": {
          "pronunciation": "mai`"
        , "translation": "not; no; [auxiliary verb] does not; has not; is not; [negator particle]"
        }
      , "สามารถ": {
          "pronunciation": "saa´ maat`"
        , "translation": "capable; able; to have the ability to; can; a Thai given name"
        }
      , "เลือก": {
          "pronunciation": "leuuak`"
        , "translation": "to select or choose; elect; pick"
        }
      , "ได้": {
          "pronunciation": "dai`"
        , "translation": "can; to be able; is able; am able; may; might [auxiliary of potential, denoting possbility, ability, or permission]; to receive; to obtain; acquire; get; have got; to pick out; to choose; to pass [a test or an exam]"
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

      if (!trie) {
        return
      }

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
        // console.log(reason)

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

  , getWordMap: function getWordMap(string, languageCode) {
      var segments = this.splitIntoWords(string, languageCode)
      var regex = /[^\s!-\/:-@[-`{-~\u00A0-¾—-⁊\u200b]/
      var offsets

      if (!segments) {
        // Split unknown language into words by ASCII word boundaries
        segments = string.split(/\b/)
      }

      offsets = getOffsets()

      return { 
        text: string
   // , segments: segments
      , offsets: offsets
      }

      function getOffsets() {
        var starts = []
        var ends = []
        var total = segments.length
        var index = 0
        var ii
          , segment
          , length
        
        for (ii = 0; ii < total; ii += 1) {
          segment = segments[ii]

          if (regex.test(segment)) {
            // This segment contains word characters
            starts.push(index)
            index += segment.length
            ends.push(index)
          } else {
            // This segment is punctuation or whitespace
            index += segment.length
          }
        }

        return { starts: starts, ends: ends }
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
        var segments = [0]
        var total
          , ii
          , regex
          , adjust
          , result
          , split
          , start
          , end
          , isWord
          , offsets

        for (ii = 0, total = regexes.length; ii < total; ii++) {
          regex = regexes[ii]
          adjust = adjustments[ii]
          while (result = regex.exec(string)) {
            split = result.index + (adjust === true
                           ? result[0].length - 1
                           : adjust)
            segments.push(split)
          }
        }

        segments.sort(numerical)
        segments = segments.filter(removeDuplicates)

        end = string.length
        ii = segments.length
        while (ii--) {
          start = segments[ii]
          segments[ii] = string.slice(start, end)
          end = start
        }

        isWord = segments.map(isThaiWord)
        offsets = getOffsets()

        return { 
          text: string
        , segments: segments
        , isWord: isWord
        , offsets: offsets
        }

        function isThaiWord(value) {
          var isWord = value.search(isThai) + 1 // characters are +1
          if (!isWord) {
            isWord = 0 - (value.search(isNumber) + 1) // numbers are -1
          }
          return isWord
        }

        function getOffsets() {
          var starts = []
          var ends = []
          var total = segments.length
          var index = 0
          var ii
            , segment
            , length
          
          for (ii = 0; ii < total; ii += 1) {
            segment = segments[ii]

            if (isWord[ii]) {
              starts.push(index)
              index += segment.length
              ends.push(index)
            } else {
              index += segment.length
            }
          }

          return { starts: starts, ends: ends }
        }
      }

      return splitIntoWords(string)
    }
  }
})()