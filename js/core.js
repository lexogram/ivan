/** CORE JS
*
* This script improves navigation from section to section, if the user
* has JavaScript enabled:
*
* - Two navigation arrows appear in the toolbar < >
* - The current section name is highlighted in the menu bar on the
*   left
*/

;(function domLoaded() {

// TODO: Intercept "#overlay-..." links(?)
// TODO: Stabilize scrollTop when a disclosure triangle is toggled

  var sectionIds = getSectionIds()
  var sectionDefault = sectionIds.length - 1 // last is in fact first
  var sectionIndex = getSectionIndex()
  var nav = document.querySelector("header .nav")
  var navButtons = getNavButtonMap()
  var menuItems = getNavMenuItemMap()
  nav.classList.add("active")

  window.addEventListener("hashchange", hashHasChanged, false);

  refreshView()

  function getSectionIds() {
    var sections = [].slice.call(document.querySelectorAll("section"))
    var sectionIds = sections.map(function (section) {
      return section.id
    })
    return sectionIds
  }

  function getSectionIndex() {
    var hash = window.location.hash
    var index = sectionDefault

    if (hash) {
      index = Math.max(0, sectionIds.indexOf(hash.substring(1)))
    }

    return index
  }

  function getNavButtonMap() {
    var next = nav.querySelector("[href='#next']")
    var back = nav.querySelector("[href='#back']")

    back.onclick = next.onclick = navigate

    return {
      back: back
    , next: next
    }
  }

  function getNavMenuItemMap() {
    var itemMap = {}
    var link
    var menuItems = document.querySelectorAll(".sidebar li")
    menuItems = [].slice.call(menuItems)

    menuItems.forEach(function (menuItem) {
      hash = menuItem.querySelector("a").href
      hash = hash.substring(hash.lastIndexOf("#") + 1)
      itemMap[hash] = menuItem
    })

    return itemMap
  }

  function hashHasChanged() {
    var hash = window.location.hash.substring(1)
    var index = sectionIds.indexOf(hash)

    if (index === sectionIndex || index < 0) {
      return
    }

    sectionIndex = index
    refreshView()
  }

  function navigate(event) {
    var link = event.currentTarget.href // #back | #next | custom
    link = link.substring(link.lastIndexOf("#"))

    event.preventDefault() // don't update location.hash

    switch (link) {
      case "#back":
        if (sectionIndex && sectionIndex !== sectionDefault) {
          // not on default section
          sectionIndex -= 1
        } else {
          // on default section or section 0
          sectionIndex = sectionDefault
        }
      break
      case "#next":
        if (sectionIndex === sectionDefault) {
          // on default section
          sectionIndex = 0
        } else {
          sectionIndex = Math.min(sectionDefault - 1, sectionIndex + 1)
        }
      break
      default:
        return    
    }

    refreshView()

    setTimeout(function () {
      window.location.hash = "#" + sectionIds[sectionIndex]
    }, 1)
  }
  function refreshView() {
    setNavButtonStates()
    highlightMenuItem()
  }

  function setNavButtonStates() {
    navButtons.back.classList.remove("disabled")
    navButtons.next.classList.remove("disabled")

    if (sectionIndex === sectionDefault) {
      navButtons.back.classList.add("disabled")
    } else if (sectionIndex === sectionDefault - 1) {
      navButtons.next.classList.add("disabled")
    }
  }

  function highlightMenuItem() {
    var hash = sectionIds[sectionIndex]
    var key
      , menuItem

    for (key in menuItems) {
      menuItem = menuItems[key]
      if (key === hash) {
        menuItem.classList.add("target")
      } else {
        menuItem.classList.remove("target")
      }
    }
  }
})()
