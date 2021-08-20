/****************************************************************
 * CODE Country Popup
 ****************************************************************/

!(function ($, document, window, undefined) {

  /**
   * Plugin name
   */
  var _pluginName = 'countryPopup';

  /**
   * @param $element Element Wrapping container div
   * @param options Options passed to public functions
   * @return countryPopup_plugin
   */
  var countryPopup_plugin = function ($element, options) {

    // scope
    var self = this;
    self.$element = $element;

    var country_popup_wrapper_identifier = "#country-popup";
    self.country_popup_wrapper = self.$element.find(country_popup_wrapper_identifier);
    self.button_stay = self.country_popup_wrapper.find('[data-country-message-stay]');

    // guard: check country popup exists
    if (self.country_popup_wrapper.length == 0) {
      return;
    }
    // guard: check fancybox object exists
    if (typeof $.fancybox != 'object') {
      return;
    }

    // get options
    var defaults = {
      'current_country_code': '',
      'location_api_url': '',
      'location_field_name': '',
      'popup_messages': {}
    };
    var metaOptions = self.country_popup_wrapper.data('country-message-options');
    self.options = $.extend({}, defaults, metaOptions);

    // set country popup cookie identifier
    self.country_popup_cookie_identifier = "country_popup";

    // set fancybox
    self.fancybox = $.fancybox;

    if ($.code.debug) {
      console.log('Init country popup:', self.country_popup_wrapper, self.options);
    }

    // init country popup
    self.init();

    // section loaded reload popup
    $(document).on('shopify:section:load', function (e) {
      if (e.detail.sectionId == "site-country-popup") {
        self.fancybox.close();
        self.init();
      }
    });
  };

  /**
   * Init the country popup plugin
   *
   * @return void
   */
  countryPopup_plugin.prototype.init = function () {

    // scope
    var self = this;

    // if country popup days is set to zero, remove cookie if exists
    if (parseInt(self.options.expires_in_days) == 0) {
      Cookies.remove(self.country_popup_cookie_identifier);
    }

    // Get element
    self.countryPopupCookie = Cookies.get(self.country_popup_cookie_identifier);

    // Render country popup if given
    if (!self.mayRenderCountryPopup()) {
      return false;
    }

    // get country location
    self.getLocation(function () {
      // render the country popup
      self.renderCountryPopup();
    });

    // button close popup
    $(self.button_stay).on('click', function () {
      self.closeCountryPopup();
    });
  };

  /**
   * Check if the country popup may be rendered and that there is a message to show
   *
   * @return boolean
   */
  countryPopup_plugin.prototype.mayRenderCountryPopup = function () {

    // scope
    var self = this;

    // guard: check if popup cookie is set
    if (self.countryPopupCookie) {
      return false;
    }
    // guard: check if there are messages given
    if (self.options.popup_messages.length == 0) {
      return false;
    }

    return true;
  };

  /**
   * Get country location from cookie or GeoAPI
   *
   * @return string country_code
   */
  countryPopup_plugin.prototype.getLocation = function (callback) {

    // scope
    var self = this;

    // get country code from cookie
    self.country_code = Cookies.get(self.country_popup_cookie_identifier + '-country_code');

    // if country code is given, return the code
    if (self.country_code) {
      return callback();
    }

    // get country code from api, if done call the callback
    self.getCountryCodeFromAPI().done(function (country_code) {
      self.setCountryCode(country_code);
      return callback();
    });

    return self.country_code;
  };

  /**
   * Get country code from API service
   *
   * @return string country_code
   */
  countryPopup_plugin.prototype.getCountryCodeFromAPI = function () {

    // scope
    var self = this;

    var default_api_url = '//extreme-ip-lookup.com/json/';
    var country_code_api = self.options.location_api_url || default_api_url;
    var country_code_fieldname_identifier = self.options.location_field_name || 'country_code';

    // guard: get country code api url from options
    if (country_code_api == '') {
      return self;
    }
    // guard: get country code field name
    if (country_code_fieldname_identifier == '') {
      return self;
    }

    // get country coude from api
    return $.getJSON(country_code_api).then(function (response) {
      if (typeof response[country_code_fieldname_identifier] != "undefined" && response[country_code_fieldname_identifier] != '') {
        return response[country_code_fieldname_identifier];
      }
    });
  };

  /**
   * Render the country popup
   *
   * @return string country_code
   */
  countryPopup_plugin.prototype.setCountryCode = function (country_code) {

    // scope
    var self = this;

    // guard: check country code is given
    if (typeof country_code == "undefined" || country_code == '') {
      return '';
    }

    // set the country code
    self.country_code = country_code;

    // create a cookie with the country code
    var inOneHourMinutes = new Date(new Date().getTime() + 60 * 1000);
    Cookies.set(self.country_popup_cookie_identifier + '-country_code', country_code, {
      expires: inOneHourMinutes
    });

    return country_code;
  };

  /**
   * Internal function for when calling done from a cookie state
   * @param  callback
   * @return object
   */
  countryPopup_plugin.prototype.done = function (callback) {
    // scope
    var self = this;
    if (typeof calback == "object") {
      callback(self.country_code);
    }
    return self;
  };

  /**
   * Render the country popup
   *
   * @return string country_code
   */
  countryPopup_plugin.prototype.renderCountryPopup = function () {

    // scope
    var self = this;

    // check country code is given
    if (self.country_code == '' || self.options.current_country_code == '') {
      return;
    }
    // guard: if the given country_Code is the same as the shop country code then skip!
    if (self.country_code == self.options.current_country_code) {
      return;
    }

    var countryData;
    // get the data by country code if available
    if (typeof self.options.popup_messages[self.country_code] != 'undefined') {
      countryData = self.options.popup_messages[self.country_code];

      // if country option does not exists shop ROW
    } else if (typeof self.options.popup_messages['ROW'] != 'undefined') {
      countryData = self.options.popup_messages['ROW'];

      // guard: no country data to render
    } else {
      return;
    }

    // populate the wrapper with the country data
    $(self.country_popup_wrapper).find('[data-country-message-title]').text(countryData.country_title || '');
    $(self.country_popup_wrapper).find('[data-country-message-name-title]').text(countryData.country_name || '');
    $(self.country_popup_wrapper).find('[data-country-message-text]').text(countryData.country_body || '');
    $(self.country_popup_wrapper).find('[data-country-message-url]').attr("href", countryData.country_url || '');
    $(self.country_popup_wrapper).find('[data-country-message-label]').text(countryData.country_button || '');
    $(self.country_popup_wrapper).find('[data-country-message-stay]').val(countryData.country_stay || '');

    // open fancybox
    self.fancybox.open(self.country_popup_wrapper, {
      afterClose: function () {
        self.closeCountryPopup();
      }
    });

    // set enable cookie
    Cookies.set(self.country_popup_cookie_identifier, true, {
      expires: self.options.expires_in_days
    });
  };

  /**
   * Close country popup
   *
   * @return void
   */
  countryPopup_plugin.prototype.closeCountryPopup = function () {
    // scope
    var self = this;

    Cookies.set(self.country_popup_cookie_identifier, false, {
      expires: self.options.expires_in_days
    });
    self.fancybox.close();
  };

  /**
   * countryPopup plugin
   *
   * @return jQuery objects
   */
  $.fn.countryPopup = function (options) {

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
        $element.data('plugin_' + _pluginName, new countryPopup_plugin($element, options));
      } else {

        // if instance already created call method from plugin
        if (typeof options === 'string') {
          instance[options].apply(instance, args);
        }
      }
    });
  };

})(jQuery, document, window);
