"use strict"

;(function create_panel($, window){
  
  $.widget(
    "lxo.panel"

  , {
      options: {
        icon: 'data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="100" fill="#ccc"/></svg>'
      , iconSize: 48
      , html: "<div></div>"
      , className: "lxo-panel"
      , rank: 0
      }
    

    , _create: function panel_create () {
        this._modifyDOM() 
      } 

    , _modifyDOM: function panel_modifyDOM () {
        var options  = this.options
        var $panel   = this.element
        this.offset  = (options.iconSize + options.spacing)
                     * options.rank
                     + options.spacing
        this.$icon   = $("<img />")
                       .attr("src", options.icon)
                       .addClass("icon")
                       .offset({left: this.offset})

        $panel.addClass(options.className)
              .addClass(options.class)
              .append(this.$icon)
      }
    }
  )
})(jQuery, window)



;(function create_panelset($, window){
  
  $.widget(
    "lxo.panelset"

  , {
      options: {
        panels: [{}]
      , className: "lxo-panels"
      , spacing: 12
      }

    , panels: []
    
    , _create: function panelset_create () {
        this._modifyDOM() 
        this._setUserActions()  
      } 

    , _modifyDOM: function panelset_modifyDOM () {
        var panelOptions
        var $panel
        var panels  = this.options.panels
        var $panels = this.$panels = $("<div></div>")
                                     .addClass(this.options.className)
        this.element.append($panels)

        for (var ii = 0, total = panels.length; ii < total; ii ++) {
          $panel = $("<div></div>")
          panelOptions = panels[ii]
          panelOptions.rank = ii
          panelOptions.spacing = this.options.spacing
          $panel.panel(panelOptions)
          $panels.append($panel)

          this.panels.push($panel)
        }
      }
      
    , _setUserActions: function panelset_setUserActions() {
        var self = this
        var panels = this.panels
        var total = panels.length

        for (var ii = 0; ii < total; ii += 1) {
          addAction(panels[ii])
          
          function addAction(panel){
            var $panel = panel.data("lxo-panel")
            var $element = $panel.element
            var $icon = $panel.$icon
            var $other

            $panel.$icon.on("mouseup", function() {
              for (var ii = 0; ii < total; ii += 1) {
                $other = panels[ii].data("lxo-panel")
                
                if ($other.element !== $panel.element) {
                  toggleActive($other, false)
                }
              }

              toggleActive($panel, !$panel.element.hasClass("active"))
            })
          }

          function toggleActive($panel, makeActive) {
            if (makeActive) {
              $panel.element.addClass("active")
              // $panel.$icon.offset({ left: $panel.options.spacing })
            } else {
              $panel.element.removeClass("active")
              // $panel.$icon.offset({ left: $panel.offset })
            }
          }
        }       
      }
    }
  )
})(jQuery, window)




;(function create_translation_widget(){

  $.widget(
    "lxo.translator"

  , {
      options: {
        panels: [{}]
      , classes: {

        }
      , spacing: 12
      }

    , $syncScroll: 0
    , $disclosure: 0
    , $original: 0
    , $tranlation: 0
    , $goSource: 0
    , $hr: 0
    
    , _create: function panelset_create () {
        this._modifyDOM() 
        this._setUserActions()  
      } 

    , _modifyDOM: function panelset_modifyDOM () {
        var $parent = this.element
        var $element

        this.$syncScroll  = ($("<input type='checkbox'>")
                           .attr("id", "sync-scroll")
                           .attr("checked", "true"))
        this.$disclosure  = $("<input type='checkbox'>")
                           .attr("id", "toggle-translation")
        this.$original    = $("<p></p>")
        this.$translation = $("<p></p>")                      
        this.$goSource    = $("<button type='button'></button>")
        this.$hr          = $("<hr />")

        $parent.addClass("collapsed")

        $element = $("<div></div>")
                   .attr("id", "original")
                   .append(this.$original)

        $parent.append($element)
               .append(this.$syncScroll)
               .append($("<label></label>")
                       .attr("for", "sync-scroll"))

        $element = $("<div></div>")
                   .attr("id", "translation")
                   .append(this.$disclosure)
                   .append($("<label></label>")
                           .attr("for", "toggle-translation"))
                   .append(this.$translation)
                   .append(this.$goSource)
        $parent.append($element)
               .append(this.$hr)

      }
          
    , _setUserActions: function panelset_setUserActions() {
        var self = this
        var $parent = this.element
        var $syncScroll = this.$syncScroll
        var $original = this.$original
        var $translation = this.$translation
        var $hr = this.$hr

        var minHeight = $original.outerHeight()
        var maxHeight = 160 // to be reset when window height changes
        var availableHeight = getAvailableHeight()

        this.$syncScroll.change(function () {
          toggleSyncScroll()
        })

        this.$disclosure.change(function () {
          if ($(this).is(':checked')) {
            $parent.removeClass("collapsed")
            setTranslationHeight()
          } else {
            $parent.addClass("collapsed")
            adjustHeights()
          }

          function setTranslationHeight() {
            var originalHeight = $original.outerHeight()
            var fullHeight = getFullHeight($translation[0])
            if (originalHeight !== getFullHeight($original[0])) {
              fullHeight = Math.min(fullHeight, originalHeight)
            }

            if (originalHeight + fullHeight > availableHeight)  {
              fullHeight = availableHeight / 2
              $original.outerHeight(fullHeight)
            }

            prepareFullHeight($translation)
            $translation.outerHeight(fullHeight)
          }

          function adjustHeights() {
            var originalHeight = $original.outerHeight()
            var fullHeight = getFullHeight($original[0])

            $translation.height(0)

            if (originalHeight > fullHeight) {
              $original.outerHeight(fullHeight)
            }
          }
        })

        $hr.on("mousedown", startDrag)

        toggleSyncScroll()

        function toggleSyncScroll() {
          if ($syncScroll.is(':checked')) {
            $original.on("scroll", syncScroll)
            syncScroll()
          } else {
            $original.off("scroll", syncScroll)
          }
        }

        function syncScroll() {
          var master = $original[0]
          var slave = $translation[0] 
          var maxScroll = master.scrollHeight - master.clientHeight
          var ratio = master.scrollTop / maxScroll
          maxScroll = slave.scrollHeight - slave.clientHeight
          slave.scrollTop = ratio * maxScroll  
        }

        function startDrag(event) {
          var body = document.body
          var collapsed = $parent.hasClass("collapsed")
          var startY = event.clientY

          var originalStartHeight = $original.outerHeight()
          var originalFullHeight = getFullHeight($original[0])

          var translationStartHeight = $translation.outerHeight()
          var translationFullHeight = getFullHeight($translation[0])

          var tallOriginal = translationFullHeight<originalFullHeight
          var breakDelta = tallOriginal
               ? (translationFullHeight - translationStartHeight) * 2
               : (originalFullHeight - originalStartHeight) * 2
          var maxDelta = 
                translationFullHeight - translationStartHeight
              + originalFullHeight - originalStartHeight
          var minDelta = minHeight - originalStartHeight
          var maxDrag = maxHeight - $parent.outerHeight()

          body.addEventListener("mousemove", drag, false)
          body.addEventListener("mouseup", stopDrag, false)
          $(body).css("cursor", "row-resize")

          function drag(event) {
            var deltaY = Math.min(event.clientY - startY, maxDrag)
            var deltaO
              , deltaT

            if (collapsed) {
              deltaY = Math.max(deltaY, minDelta)

              if (deltaY + originalStartHeight > originalFullHeight) {
                prepareFullHeight($original)
                deltaY =  originalFullHeight - originalStartHeight
              }

            } else {
              deltaY = Math.max(deltaY, minDelta * 2)

              if (deltaY < breakDelta) {
                deltaO = deltaT = deltaY / 2

              } else if (deltaY < maxDelta) {
                if (tallOriginal) {
                  deltaT = breakDelta / 2
                  deltaO = deltaY - deltaT
                  prepareFullHeight($translation)
                } else {
                  deltaO = breakDelta / 2
                  deltaT = deltaY - deltaO
                  prepareFullHeight($original)
                }

              } else {
                prepareFullHeight($original)
                prepareFullHeight($translation)

                if (tallOriginal) {
                  deltaT = breakDelta / 2
                  deltaO = maxDelta - deltaT
                } else {
                  deltaO = breakDelta / 2
                  deltaT = maxDelta - deltaO
                }
                deltaY = maxDelta
              }

              $original.outerHeight(originalStartHeight + deltaO)
              $translation.outerHeight(originalStartHeight + deltaT)
            }
          }

          function stopDrag(event) {
            body.removeEventListener("mousemove", drag, false)
            body.removeEventListener("mouseup", stopDrag, false)
            $(body).css("cursor", "default")
          }
        }

        function getFullHeight(element) {
          var height
          var restore = element.style.height
          var scrollTop = element.scrollTop

          element.style.height = "auto"
          height = element.offsetHeight
          if (restore) {
            element.style.height = restore
          } else {
            element.style.removeProperty("height")
          }

          element.scrollTop = scrollTop
          
          return height
        }

        function prepareFullHeight($element, height) {
          $element.css("overflow-y", "hidden")
          setTimeout(function () {
            $element[0].style.removeProperty("overflow-y")
          }, 1)
        }

        function getAvailableHeight() {
          var padding = $parent.outerHeight()
          padding -= $original.outerHeight()
          padding -= $translation.outerHeight()

          return maxHeight - padding
        }
      }
    }
  )

})()


/*
TODO
x Set height of $parent when disclosure is toggled
x Adjust height of original as width changes on disclosure
x Set initial height of translation to match original
x Set minimum height
x Set maximum height so that panel icons aren't hidden
  x Shorten original if maximum size is reached

- Add auto-maximize and auto-minimize buttons
- Remember height settings after drag so that toggling disclosure twice when height is maximum does not lose data

- Adjust top of panels when translation is resized

- Adjust both panels and translator when window height is changed
- Adjust height of translator as page width is changed
  - Reduce if widened (panel height will increase)
  - Increase to initial value as window becomes narrower
- Adjust height as text is changed
  - Remember max height and do not go beyond that

- Allow user to change font size, but limit pixel size
- DON'T GET LOST IN INTERFACE: ADD FEATURES
 */



;(function ready(){
  $("body").panelset({
    panels: [ 
      { icon: "img/settings.png" 
      , class: "red"
      }
    , { icon: "img/google.png" 
      , class: "green"
      }
    , { icon: "img/wiktionary.png" 
      , class: "blue"
      }
    ]}
  )

  $(document.querySelector("#selection")).translator()
})()