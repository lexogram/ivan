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
      , open: "up"
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
              .addClass(options.open)
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
              $panel.$icon.offset({ left: $panel.options.spacing })
            } else {
              $panel.element.removeClass("active")
              $panel.$icon.offset({ left: $panel.offset })

              // HACK to reset the top or bottom correctly
              if ($panel.element.hasClass("down"))
              setTimeout(function () {
                $panel.element.removeClass("down")
                setTimeout(function () {
                  $panel.element.addClass("down")
                }, 15)
              }, 1000)
            }
          }
        }       
      }
    }
  )
})(jQuery, window)



;(function ready(){
  var a = $("body").panelset({
    panels: [ 
      { icon: "img/settings.png" 
      , class: "red"
      , open: "down"
      }
    , { icon: "img/google.png" 
      , class: "green"
      , open: "down"
      }
    , { icon: "img/wiktionary.png" 
      , class: "blue"
      , open: "down"
      }
    ]}
  )
})()