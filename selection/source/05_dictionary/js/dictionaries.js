"use strict"

var dictionaries = {}
var tries = {}

;(function addDictionaries() {
  dictionaries.und = {
    "a": 0
  , "all": 0
  , "an": 0
  , "ant": 0
  , "antler": 0
  , "antlers": 0
  , "at": 0
  , "deer": 0
  , "deer's": 0
  , "ether": 0
  , "her": 0
  , "here": 0
  , "i": 0  
  , "in": 0
  , "is": 0
  , "mall": 0
  , "on": 0
  , "she": 0
  , "the": 0
  , "there": 0
  , "tiny": 0
  , "ton": 0
  }

  dictionaries.th = {
   "งม" : {
      "pronunciation": "ngohm-"
    , "translation": "to grope; search; seek; fumble for"
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
    , "translation": " in; inside; within; amidst; into; on; at a particular time"
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

  ;(function createTries(){
    for (var languageCode in dictionaries) {
      tries[languageCode] = createTrie(dictionaries[languageCode])
    }
  })()

  function createTrie(languageMap) {
    var trie = {}
    var end = "$"
    var word
      , ii
      , length
      , last
      , chars
      , char
      , path
      , place


    for (word in languageMap) {
      chars = word.split("")
      path = trie
 
      for (ii = 0, length = word.length, last = length - 1;
        ii < length; ii += 1 ) {

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

  //splitIntoWords("herethereisanantonadeer'santler", "en")
  splitIntoWords("พูดไปสองไพเบี้ย", "th")

  function splitIntoWords(string, languageCode) {
    var trie = tries[languageCode]
    var possibleWords = []
    var possibleLengths = []
    var fails = []

    findPossibleWords(string, 0)

    function findPossibleWords(string, skip) {
      var path = trie
      var words = []
      var word = ""
      var found = false
      var skipped = false
      var char
        , next
        , temp

      words.index = 0

      for (var ii = skip, total = string.length; ii < total ; ii += 1) {
        char = string[ii]
        next = path[char]

        if (next) { // { "$": 0, "a": { ... }. ...}          
          word += char
          if (next.$) {
            if (found) {
              // We've already got a shorter word list
              temp = words.slice(0)
              temp.index = words.index
              possibleWords.push(temp)
              words.index -= words.pop().length
            }
            words.push(word)
            words.index += word.length
            found = true
          }
          path = next

        } else if (found) {
          // This could be the start of a new word
          word = char
          path = trie[char]
          if (!path) {
            // It's imposible to start a word with this letter
            backtrack("Initial letter absent: " + char)

          } else if (path.$) {
            words.push(word)
            words.index += word.length
          } else {
            found = false
          }
        } else {
          // !next: stop looking
          backtrack("Word fragment: " + word)
        }
      }

      if (!skipped && (!next || !next.$)) {
        backtrack("Unknown word: ", word)
      }

      console.log(words)
      console.log(possibleWords)

      function backtrack(reason) {
        console.log(reason)

        fails.push(words)
        words = possibleWords.pop()
        if (!words) {
          skipped = true
          ii = total
          console.log("Skipping first " + (skip + 1) + " letters: " + string.substring(0, skip + 1))
          return findPossibleWords(string, skip + 1)
        }

        ii = words.index - 1
        path = trie
        word = ""
        found = false
      }
    }
  }
})()
