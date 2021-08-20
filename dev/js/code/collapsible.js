/****************************************************************
 * CODE collapsible
 ****************************************************************/

!(function ($, document, window, undefined) {

  /**
   * Plugin name
   */
  var _pluginName = 'collapsible';

  /**
   * @param $element Element Wrapping container div
   * @param options Options passed to public functions
   * @return collapsible_plugin
   */
  var collapsible_plugin = function ($element, options) {

    // Scope it
    var self = this;
    self.$element = $element;

    // Set default options
    var defaults = {
      jsAnimation: false, // Open and close animation by JS, if false provide custom css to handle the .collapsible--is-open state
      jsSlideSpeed: 200, // Speed of jsAnimation slideDown and slideOp
      openOnHover: false, // Open Parents on mouseOver and close on mouseLeave
      closeOnMouseleave: false, // Close all Parents when mouse leaves the Wrapper
      closeSiblings: false, // Close sibling Parents when opening a Parent - value must be a screen width! When >= screenwidth, Parents will close
      closeAll: false // Close all other Parents in wrapper when opening a Parent
    };

    // Get options from element data
    var dataOptions = self.$element.data('collapsible-wrapper');

    // Merge data options with default options
    self.options = $.extend({}, defaults, dataOptions);

    if ($.code.debug) {
      console.log('Init collapsible:', self.$element, self.options);
    }

    // Start the collapsible
    self.init();
  };

  /**
   * Init
   *
   * @return void
   * @access public
   */
  collapsible_plugin.prototype.init = function () {
    var self = this;

    // Catch custom events on Parents [data-collapsible-parent] and on the element itself
    self.$element.on({
      'collapsibleOpen': function (event) {
        self.open($(event.target));
      },
      'collapsibleClose': function (event) {
        self.close($(event.target));
      }
    }).on({
      'collapsibleOpen': function (event) {
        self.open($(event.target));
      },
      'collapsibleClose': function (event) {
        self.close($(event.target));
      }
    }, '[data-collapsible-parent]');

    // Catch click on Triggers [data-collapsible-trigger]
    self.$element.on({
      click: function (event) {
        event.stopPropagation();

        var $parent = $(this).closest('[data-collapsible-parent]');

        // If Parent is closed - open it
        if (!$parent.hasClass('collapsible--is-open')) {

          event.preventDefault();
          $parent.trigger('collapsibleOpen');

        } else {

          // Else if Parent is not a link, close it
          var $trigger = $(this);
          if (!$trigger.is('a')) {
            $parent.trigger('collapsibleClose');
          }
          // Else follow the link
        }
      }
    }, '[data-collapsible-trigger]').not('[data-collapsible-wrapper] [data-collapsible-trigger]');

    // Catch click on Trigger Icon [data-collapsible-trigger-icon]
    self.$element.on({
      click: function (event) {
        event.stopPropagation();
        event.preventDefault();

        var $parent = $(this).closest('[data-collapsible-parent]');

        // If Parent is closed - open it
        if (!$parent.hasClass('collapsible--is-open')) { // Self.open( $parent );
          $parent.trigger('collapsibleOpen');
        } else {
          // Else close it
          $parent.trigger('collapsibleClose');
        }
        return false;
      }
    }, '[data-collapsible-trigger-icon]').not('[data-collapsible-wrapper] [data-collapsible-icon]');

    // Catch hover on [data-collapsible-parent]
    if (self.options.openOnHover) {
      self.$element.on({
        mouseenter: function (event) {

          // No hover effects on touch devices
          if ($('html').hasClass('touch')) {
            return;
          }

          $(this).trigger('collapsibleOpen');
        },
        mouseleave: function (event) {

          // No hover effects on touch devices
          if ($('html').hasClass('touch')) {
            return;
          }

          $(this).trigger('collapsibleClose');
        }
      }, '[data-collapsible-parent]').not('[data-collapsible-wrapper] [data-collapsible-parent]');
    }

    // Catch mouseleave on [data-collapsible-wrapper]
    if (self.options.closeOnMouseleave) {
      self.$element.on({
        mouseleave: function () {
          self.reset();
        }
      });
    }
  };

  /**
   * open subnav
   *
   * @return void
   * @access public
   */
  collapsible_plugin.prototype.open = function ($parent) {
    var self = this;

    // Find target
    var $target = $parent.find('> [data-collapsible-target]:first');

    if ($target.length && self.options.jsAnimation) {

      // Animate target open
      $target.slideDown(self.options.jsSlideSpeed, function() {
        $parent.addClass('collapsible--is-open');
      });

    } else {

      // Toggle class on parent
      $parent.addClass('collapsible--is-open');

      // Close siblings if Window Width >= self.options.closeSiblings
      if (self.options.closeSiblings > 0 && $.code.ww >= self.options.closeSiblings) {
        $parent.siblings().each(function (index, el) {
          self.close($(this));
        });
      }
    }
  };

  /**
   * close subnav
   *
   * @return void
   * @access public
   */
  collapsible_plugin.prototype.close = function ($parent) {
    var self = this;

    // Find target
    var $target = $parent.find('> [data-collapsible-target]:first');

    if ($target.length && self.options.jsAnimation) {

      $target.slideUp(self.options.jsSlideSpeed, function() {
        $parent.removeClass('collapsible--is-open');
      });

    } else {

      // Toggle class on parent and close all children
      $parent.removeClass('collapsible--is-open')
        .find('.collapsible--is-open')
        .removeClass('collapsible--is-open');
    }
  };

  /**
   * reset navigation elements
   *
   * @return void
   * @access public
   */
  collapsible_plugin.prototype.reset = function () {
    var self = this;
    // self.$element.find('[data-collapsible-trigger]').each(function (index, el) {
    //   var $parent = $(this).closest('[data-collapsible-parent]');
    //   if ($parent.hasClass('collapsible--is-open')) {
    //     $parent.trigger('collapsibleClose');
    //   }
    // });
  };

  /**
   * collapsible plugin
   *
   * @return jQuery objects
   */
  $.fn.collapsible = function (options) {

    // Put args in array
    var args = Array.prototype.slice.call(arguments, 1);

    // Initialize the items
    return this.each(function () {

      // Store the element the plugin is set on
      var $element = $(this);

      // Guard if plugin was already initted
      var instance = $element.data('plugin_' + _pluginName);

      // If plugin was not innited
      if (!instance) {

        // Init plugin on element and set guard data on element
        $element.data('plugin_' + _pluginName, new collapsible_plugin($element, options));
      } else {

        // If instance already created call method from plugin
        if (typeof options === 'string') {
          instance[options].apply(instance, args);
        }
      }
    });
  };

})(jQuery, document, window);
