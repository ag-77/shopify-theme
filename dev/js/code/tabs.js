/****************************************************************
 * CODE tabs
 ****************************************************************/

!(function ($, document, window, undefined) {

  /**
   * Plugin name
   */
  var _pluginName = 'tabs';

  /**
   * @param $element Element Wrapping container div
   * @param options Options passed to public functions
   * @return tabs_plugin
   */
  var tabs_plugin = function ($element, options) {

    // Scope it
    var self = this;
    self.$element = $element;

    // Get options
    var defaults = {};
    var metaOptions = self.$element.data('tabs');
    self.options = $.extend({}, defaults, metaOptions);

    if ($.code.debug) {
      console.log('Init tabs:', self.$element, self.options);
    }

    // Start the tabs
    self.init();
  };

  /**
   * Init
   *
   * @return void
   * @access public
   */
  tabs_plugin.prototype.init = function () {
    var self = this;

    self.$tabsContent = self.$element.find('[data-tabs-content]');
    self.$tabsNav = self.$element.find('[data-tabs-nav]');

    if (self.options.create) {
      self.createTabs();
    }

    // Catch click on desktop tab navigation
    self.$tabsNav.on({
      click: function (event) {
        event.preventDefault();
        if (!$(this).is('.is-active')) {
          $(this).trigger('open');
        }
      },
      open: function () {
        var title = $(this).data('tabs-link');

        // Close the active tab and open the clicked tab after that
        self.closeActiveTab(title, self.openTab(title));

        // Open the clicked tag link
        self.openTabNavLink(title);
      }
    }, '[data-tabs-link]');

    // Catch click on mobile tab navigation
    self.$tabsContent.on('click', '[data-tabs-link]', function (event) {

      var title = $(this).data('tabs-link');

      if ($(this).hasClass('is-active')) {

        // Close the tab and link in content
        self.closeTab(title);
      } else {
        // Open the tab and link in content
        self.openTab(title);
      }
    });

    // Catch open tab by url hash
    if (window.location.hash) {
      var hash = window.location.hash.substring(1);
      self.$tabsNav.find('[data-tabs-link="' + hash + '"]').trigger('open');
    } else {
      self.$tabsNav.find('[data-tabs-link]:first').trigger('open');
    }
  };

  /**
   * create tabs
   *
   * @return void
   * @access public
   */
  tabs_plugin.prototype.createTabs = function () {
    var self = this;

    self.$tabsContent.find('h2').each(function (i, tabDivider) {

      // Get tab title from h2
      var tabTitle = $(tabDivider).text();
      var tabLink = tabTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '').replace(/^-/, '');

      // Make tab html
      var $parent = $(tabDivider).closest('.tabs-content-pane');
      var $link = $('<div class="tabs-content-link" data-tabs-link="' + tabLink + '"><span>' + tabTitle + '</span></div>');
      $parent.attr('data-tabs-content-pane', tabLink);
      $link.insertBefore($parent);
      $(tabDivider).remove();

      // Add to tab nav
      self.$tabsNav.find('ol').append('<li class="tabs__nav-item" data-tabs-link="' + tabLink + '"><a href="#' + tabLink + '">' + tabTitle + '</a></li>')

    })
  };

  /**
   * close tab
   *
   * @return void
   * @access public
   */
  tabs_plugin.prototype.closeActiveTab = function (title, callback) {
    var self = this;

    var $activeTab = self.$tabsNav.find('.is-active').not('[data-tabs-link="' + title + '"]');

    // If there is an active tab
    if ($activeTab.length) {

      // Get title
      var activeTitle = $activeTab.data('tabs-link');

      // Don't reopen self
      if (activeTitle == title) {
        return;
      }

      self.closeTab(activeTitle);
      self.closeTabNavLink(activeTitle);
    }

    if (typeof callback == 'function') {
      callback();
    }
  };

  /**
   * close tab
   *
   * @return void
   * @access public
   */
  tabs_plugin.prototype.closeTab = function (title) {
    var self = this;

    // Close the tab
    self.$tabsContent.find('[data-tabs-content-pane="' + title + '"]').removeClass('is-active');

    // Close the tablink in content (on mobile)
    self.$tabsContent.find('[data-tabs-link="' + title + '"]').removeClass('is-active');
  };

  /**
   * close link in tab nav
   *
   * @return void
   * @access public
   */
  tabs_plugin.prototype.closeTabNavLink = function (title) {
    var self = this;

    // Close the tablink in nav
    self.$tabsNav.find('[data-tabs-link="' + title + '"]').removeClass('is-active');
  };

  /**
   * open tab
   *
   * @return void
   * @access public
   */
  tabs_plugin.prototype.openTab = function (title) {
    var self = this;

    // Open new tab
    self.$tabsContent.find('[data-tabs-content-pane="' + title + '"]').addClass('is-active');

    // Close the tablink in content (on mobile)
    self.$tabsContent.find('[data-tabs-link="' + title + '"]').addClass('is-active');
  };

  /**
   * open tablink in Nav
   *
   * @return void
   * @access public
   */
  tabs_plugin.prototype.openTabNavLink = function (title) {
    var self = this;

    // Open new tab
    self.$tabsNav.find('[data-tabs-link="' + title + '"]').addClass('is-active');
  };

  /**
   * Reset the tab navigation and tabs
   *
   * @return void
   * @access public
   */
  tabs_plugin.prototype.reset = function () {
    var self = this;

    // If there is no active tab in navigation or content
    if (self.$tabsNav.find('.is-active').length == 0 || self.$tabsContent.find('.is-active').length == 0) {

      // Remove all active classes
      self.$element.find('.is-active').removeClass('is-active');

      // open the first tab in navigation
      self.$tabsNav.find('[data-tabs-link]').first().trigger('click');
    }
  };

  /**
   * tabs plugin
   *
   * @return jQuery objects
   */
  $.fn.tabs = function (options) {

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
        $element.data('plugin_' + _pluginName, new tabs_plugin($element, options));
      } else {

        // If instance already created call method from plugin
        if (typeof options === 'string') {
          instance[options].apply(instance, args);
        }
      }
    });
  };

})(jQuery, document, window);
