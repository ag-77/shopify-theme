/****************************************************************
 * CODE productRecommendations
 ****************************************************************/

!(function ($, document, window, undefined) {

  /**
   * Plugin name
   */
  var _pluginName = 'productRecommendations';

  /**
   * @param $element Element Wrapping container div
   * @param options Options passed to public functions
   * @return productRecommendations_plugin
   */
  var productRecommendations_plugin = function ($element, options) {

    // Scope it
    var self = this;
    self.$element = $element;

    // Get options
    var defaults = {};
    var metaOptions = self.$element.data('product-recommendations');
    self.options = $.extend({}, defaults, metaOptions);

    // Create url
    self.requestUrl = "/recommendations/products?section_id=product-recommendations&limit=" + self.options.limit + "&product_id=" + self.options.productId;

    if ($.code.debug) {
      console.log('Init productRecommendations:', self.$element, self.options, self.requestUrl);
    }

    // Start the productRecommendations
    self.init();
  };

  /**
   * Init
   *
   * @return void
   * @access public
   */
  productRecommendations_plugin.prototype.init = function () {
    var self = this;

    $.ajax({
      type: "GET",
      url: self.requestUrl,
      success: function (response) {

        var $newHtml = $(response).children();

        // Replace section self with result
        self.$element.parent().replaceWith($newHtml);
        self.$element = $newHtml;

        // Load slider
        self.$element.find('[data-swiper-options]').swiperLoader();
      }
    });
  };


  /**
   * productRecommendations plugin
   *
   * @return jQuery objects
   */
  $.fn.productRecommendations = function (options) {

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
        $element.data('plugin_' + _pluginName, new productRecommendations_plugin($element, options));
      } else {

        // If instance already created call method from plugin
        if (typeof options === 'string') {
          instance[options].apply(instance, args);
        }
      }
    });
  };

})(jQuery, document, window);
