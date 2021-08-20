/****************************************************************
 * CODE toggleElementClass
 ****************************************************************/

!(function ($, document, window, undefined) {

  /**
   * Plugin name
   */
  var _pluginName = 'toggleElementClass';

  /**
   * @param $element Element Wrapping container div
   * @param options Options passed to public functions
   * @return toggleElementClass_plugin
   */
  var toggleElementClass_plugin = function ($element, options) {

    // scope it
    var self = this;
    self.$element = $element;

    if ($.code.debug) {
      console.log('Init toggleElementClass:', self.$element);
    }

    // Catch click on element
    self.$element.on("click", function (event) {

      self.getOptions(self.$element);
      if (!self.$target.length || !self.options.class) {
        return;
      }
      self.handleEvents(event);
      self.toggleTheClass();
    });
  };

  /**
   * get options
   *
   * @return void
   * @access public
   */
  toggleElementClass_plugin.prototype.getOptions = function ($element) {
    var self = this;

    if (self.options) {
      return;
    }

    var defaults = {
      target: "body",
      stopPropagation: true,
      preventDefault: true
    };
    var metaOptions = $element.data('toggle-element-class');
    self.options = $.extend({}, defaults, metaOptions);
    self.$target = $(self.options.target);
  };

  /**
   * Handle events
   *
   * @return void
   * @access public
   */
  toggleElementClass_plugin.prototype.handleEvents = function (event) {
    var self = this;

    if (self.options.preventDefault) {
      event.preventDefault();
    }
    if (self.options.stopPropagation) {
      event.stopPropagation();
    }
  };

  /**
   * Toggle the Class
   *
   * @return void
   * @access public
   */
  toggleElementClass_plugin.prototype.toggleTheClass = function () {
    var self = this;

    if (self.$target.hasClass(self.options.class)) {
      // if class is set, remove it
      self.removeTheClass();
    } else {
      // if class is not set, add it
      self.addTheClass();
    }
  };

  /**
   * Add the Class
   *
   * @return void
   * @access public
   */
  toggleElementClass_plugin.prototype.addTheClass = function () {
    var self = this;
    // Get the options again in case this is called from outside
    self.getOptions(self.$element);
    self.$target.addClass(self.options.class)
  };

  /**
   * Remove the Class
   *
   * @return void
   * @access public
   */
  toggleElementClass_plugin.prototype.removeTheClass = function () {
    var self = this;
    // Get the options again in case this is called from outside
    self.getOptions(self.$element);
    self.$target.removeClass(self.options.class)
  };

  /**
   * toggleElementClass plugin
   *
   * @return jQuery objects
   */
  $.fn.toggleElementClass = function (options) {

    // put args in array
    var args = Array.prototype.slice.call(arguments, 1);

    // initialize the items
    return this.each(function () {

      // store the element the plugin is set on
      var $element = $(this);

      // guard if plugin was already initted
      var instance = $element.data('plugin_' + _pluginName);

      // if plugin was not innited
      if (!instance) {

        // init plugin on element and set guard data on element
        $element.data('plugin_' + _pluginName, new toggleElementClass_plugin($element, options));
      } else {

        // if instance already created call method from plugin
        if (typeof options === 'string') {
          instance[options].apply(instance, args);
        }
      }
    });
  };

})(jQuery, document, window);
