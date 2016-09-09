"use strict"

;(function create_panel($, window){
  
  $.widget(
    "lxo.panel"

  , {
      options: {
        icon: 'data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="100" fill="#ccc"/></svg>'
      , html: "<div></div>"
      , className: "lxo-panel"
      }
    

    , _create: function panel_create () {
        this._modifyDOM() 
        this._setUserActions()  
      } 

    , _modifyDOM: function panel_modifyDOM () {
        var options = this.options
        var $parent = this.element
        this.$icon  = $("<img />")
                      .attr("src", options.icon)
                      .addClass("icon")
        this.$html  = $(options.html)

        this.$html.addClass(options.className)
             .append(this.$icon)
       
        $parent.append(this.$html)
      }
      
    , _setUserActions: function panel_setUserActions() {
        var self = this
        
        self.$icon.on("mouseup", treatClick)
        
        function treatClick(event) {
          self.$html.toggleClass("active")
        }       
      }
    }
  )
})(jQuery, window)



;(function ready(){
  var a = $("body").panel()
})()