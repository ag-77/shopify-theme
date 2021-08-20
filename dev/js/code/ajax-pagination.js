/****************************************************************
 * CODE ajaxPagination
 *
 ****************************************************************/

!(function ($, document, window, undefined) {

  /**
   * Plugin name
   */
  var _pluginName = 'ajaxPagination';

  /**
   * @param $element Element Wrapping container div
   * @param options Options passed to public functions
   * @return ajaxPagination_plugin
   */
  var ajaxPagination_plugin = function ($element, options) {

    // Scope it
    var self = this;
    self.$element = $element;

    // Set default options
    var defaults = {};

    var metaOptions = self.$element.data('ajax-pagination');
    self.options = $.extend({}, defaults, metaOptions);

    if ($.code.debug) {
      console.log('Init ajaxPagination:', self.$element, self.options);
    }

    // Find containers
    self.$target = self.$element.find('[data-ajax-pagination-target]:first');

    // Init event handlers
    self.handleEvents();
  };

  /**
   * Handle events
   *
   * @return void
   * @access public
   */
  ajaxPagination_plugin.prototype.handleEvents = function () {
    var self = this;

    // Catch click on ajax pagination link
    self.$element.on('click', '[data-ajax-pagination-link]', function (event) {
      event.preventDefault();

      // Load the page link
      self.loadPage($(this));
    });

    // Catch click on products with data-ajax-pagination-item.
    // This will store the collection page that contains this product in history
    // so browsing back from the PDP will always show the page where you left
    self.$element.on('click', '[data-ajax-pagination-item]', function (event) {
      event.preventDefault();

      // Store the clicked link
      var productUrl = $(this).attr('href');

      // Store the page nr this product belongs to in return_page
      var return_page = $(this).data('ajax-pagination-item');

      // Replace the page parameter in the current url with return_page
      var currentUrl = replaceUrlParam(document.location.href, 'page', return_page);

      // Remove the view parameter from the url
      var historyUrl = currentUrl.replace('&view=ajax-pagination', '').replace('?view=ajax-pagination', '?');

      // Replace the current url in history so the user can browse back to the page containg the viewed product
      history.replaceState({}, "", historyUrl);

      // Open the clicked link
      document.location = productUrl;
    });
  };

  /**
   * Create a loading animation on the link wrappers
   *
   * @return void
   * @access public
   */
  ajaxPagination_plugin.prototype.loadingAnimation = function ($wrapper) {

    $wrapper.slideUp(function () {
      $wrapper.remove();
    });
  };

  /**
   * Load the next/previous collection page
   *
   * @return void
   * @access public
   */
  ajaxPagination_plugin.prototype.loadPage = function ($el) {
    var self = this;

    // Get the url to load
    var url = $el.attr('href');

    // Check if we're paging forward or backward
    var paginationDirection = $el.data('ajax-pagination-link');

    // Show loading animation
    var $wrapper = $el.closest('[data-ajax-pagination-link-wrapper]');
    self.loadingAnimation($wrapper);

    // Load the url
    $.ajax({
      url: url,
      data: {
        view: 'ajax-pagination'
      },
      success: function (response) {

        var stateObj = {};
        var $html;

        // When loading previous page
        if (paginationDirection === '-') {

          // Get the elements from the html, remove the next button
          $html = $(response).find('[data-ajax-pagination-link-wrapper="+"]').remove()
            .end()
            .find('[data-ajax-pagination-target]:first')
            .children()
            .hide();

          // Prepend elements to the beginning of the target
          self.$target.prepend($html);

        } else {

          // Remove the view parameter from the url
          var historyUrl = url.replace('&view=ajax-pagination', '').replace('?view=ajax-pagination', '?');

          // Set the url in history so the user can browse back
          history.pushState(stateObj, "", historyUrl);

          // Get the elements from the html, remove the previous button
          $html = $(response).find('[data-ajax-pagination-link-wrapper="-"]').remove()
            .end()
            .find('[data-ajax-pagination-target]:first')
            .children()
            .hide();

          // Append elements to the end of the target
          self.$target.append($html);
        }

        // Slide new elements down
        $html.slideDown();
      }
    });
  };

  /**
   * ajaxPagination plugin
   *
   * @return jQuery objects
   */
  $.fn.ajaxPagination = function (options) {

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
        $element.data('plugin_' + _pluginName, new ajaxPagination_plugin($element, options));
      } else {

        // If instance already created call method from plugin
        if (typeof options === 'string') {
          instance[options].apply(instance, args);
        }
      }
    });
  };

})(jQuery, document, window);
