# Nim #

Tutorial for creating a game of [Nim](https://ru.wikipedia.org/wiki/Ним_(игра))

## Steps

  1. HTML: Create a web page on your computer
  2. GIT: Create a repository
  3. HTML: Add an image of a match to your page
  4. GIT: Push changes to your repository
  5. HTML: Add 16 images of matches, arranged in 4 rows
  6. CSS: Arrange the images in a V shape
  7. JS + CSS: Dim an image when it is clicked
  8. JS + HTML: Reset button
  9. JS: Reset + game over alert
  99. HTML + CSS: Create full game layout (and dim/hide inactive elements)
    * Body
    * Background
    * Start new game
    * *Start new game against computer*
    * *Computer starts new game*
    * *Do you want to start again? \[Continue playing\] \[Start new game\]*
    * Player 1~~'s turn~~
    * Player 2~~'s turn~~
    * *Player X wins*
    * *Instructions*
    * *Button to hide instructions*
    * *Language menu*
  11.
    * JS: (Dis)activate "Start new game" button
    * JS: Show whose turn it is: Player 1 | Player 2
  12.
    * JS: Clean up code
    * HTML: Simplify attributes and classes
    * JS: Force player to remove a match before clicking `Done`
  13.
    * JS: Prevent user from clicking on 2 different rows
    * JS: No reaction if user clicks on a removed match
  14. JS: Show "Player X wins" when last match is taken (alert)
  15. HTML + JSS: Show "Player X wins" as an overlay
  16. Play against computer part 1
    * HTML: Computer start again buttons
      * Start new game against computer
      * Computer starts new game
    * CSS: Arrange new buttons
    * JS: Show names of players in player list and in winner display
  17. Play against computer part 2
    * JS: Computer makes random choice
  18. Play against computer part 3
    * JS: Introduction to testing
    * JS: Artificial intelligence – computer makes best choice
  19. CSS + JS
    * No :hover on matches in rows where you can't remove a match
    * Matches fade out when removed by computer
    * JS: No need to click `Done` when you take the last match
  20. ALL: Show rules

Extra steps:
 - ALL: Start again confirmation
 - ALL: Choose language
 - JS:  Allow undo
 - JS:  Drag to select matches
 - JS:  Automatically apply `Done` if you take all matches in a row
 - ALL: Make accessible
 - HTML + CSS: Adapt for iPhone, iPad, Android, ... devices
