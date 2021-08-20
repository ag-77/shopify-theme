/****************************************************************
 * CODE enhancedSearch
 ****************************************************************/

!(function ($, document, window, undefined) {

  /**
   * Plugin name
   */
  var _pluginName = 'enhancedSearch';

  /**
   * @param $element Element Wrapping container div
   * @return enhancedSearch_plugin
   */
  var enhancedSearch_plugin = function ($element, options) {

    // Scope it
    var self = this;

    // Find elements
    self.$element = $element;
    self.type = self.$element.data('enhanced-search');
    self.$input = self.$element.find('input[type="search"]');

    // Set options
    var defaults = {
      "wildcard": true,                               // Always add wildcard *
      "predictiveSearch": true,                       // Use predicitve search
      "show_all": "Show all results",                 // Translatable string
      "type": "product",                              // product, page, article or collection
      "limit": 10,                                    // Default: 10. Min: 1. Max: 10.
      "options": {
        "unavailable_products": "last",               // show, hide or last
        "fields": "title,product_type,variants.title" // Specifies the list of fields to search on. Valid fields are: author, body, product_type, tag, title, variants.barcode, variants.sku, variants.title, and vendor. The default fields searched on are: title, product_type, variants.title, and vendor.
      }
    };
    var metaOptions = self.$element.data('enhanced-search');
    self.options = $.extend({}, defaults, metaOptions);

    if ($.code.debug) {
      console.log('Init Enhanced Search:', self.$element, self.options);
    }

    if (self.options.wildcard) {
      self.initWildcard();
    }

    if (self.options.predictiveSearch) {
      self.initPredictiveSearch();
    }
  };

  /**
   * Search with product dropdown
   */
  enhancedSearch_plugin.prototype.initPredictiveSearch = function () {
    var self = this;

    // Current Ajax request.
    var currentAjaxRequest = null;

    // Grabbing text input.
    var $input = self.$element.find('input[name="q"]');

    // Create a list
    self.$dropdown = $('<ul class="search__dropdown-results" data-enhanced-search="results"></ul>');

    // Adding a list for showing search results.
    $(self.$dropdown).appendTo(self.$element);

    // Listening to keyup and change on the text field within these search forms.
    $input.attr('autocomplete', 'off').on('keyup change', function () {

      // What are the search self.terms
      self.terms = $input.val();

      // If that's a new term and it contains at least 2 characters.
      if (self.terms.length > 2 && self.terms != $input.attr('data-old-self.terms')) {

        // Saving old query.
        $input.attr('data-old-self.terms', self.terms);

        // Killing any Ajax request that's currently being processed.
        if (currentAjaxRequest != null) {
          currentAjaxRequest.abort();
        }

        currentAjaxRequest = jQuery.getJSON("/search/suggest.json", {
          "q": self.terms,
          "resources": self.options
        }).done(function (response) {

          self.renderResults(response);
        });
      }
    });

    $input.keydown(function (e) {

      if (!self.dropdownVisible) {
        // on key arrow down and if results are filled
        if (e.which == 40 && self.$element.find('[data-enhanced-search="results"]').children().length) {
          self.openDropdown();
        } else {
          return;
        }
      }

      var i = self.$dropdown.find('.is-active').index();

      switch (e.which) {
      case 38: // up
        i--;
        break;

      case 40: // down
        i++;
        break;

      case 27:
        self.closeDropdown();
        break;

      case 13: // enter
        if (self.$dropdown.find('li.is-active').length) {
          e.preventDefault();
          var url = self.$dropdown.find('li.is-active a').attr('href');
          document.location.href = url;
        }
        break;

      default:
        return; // exit this handler for other keys
      }

      self.$dropdown.find('li:eq(' + i + ')').addClass('is-active').siblings('.is-active').removeClass('is-active');
    });

    // Clicking outside makes the results disappear.
    $('body').on('click', function () {
      self.closeDropdown();
    });
  };

  /**
   * Render results in dropdown
   */
  enhancedSearch_plugin.prototype.renderResults = function (response) {
    var self = this;

    if ( $.code.debug ) { console.log( response ); }

    var pageSuggestions = response.resources.results.pages;
    var productSuggestions = response.resources.results.products;
    var articleSuggestions = response.resources.results.articles;
    var collectionSuggestions = response.resources.results.collections;

    // Reset results
    self.$dropdown.empty();

    // Result: product
    if (productSuggestions && productSuggestions.length > 0) {

      $.each(productSuggestions, function (index, item) {
        var link = $('<a class="search-result__product"></a>').attr('href', item.url);
        if (item.featured_image.url) {
          link.append('<span class="thumbnail"><img src="' + Shopify.resizeImage(item.featured_image.url, '100x100') + '" /></span>');
        } else {
          link.append('<span class="thumbnail no-image"></span>');
        }
        link.append('<span class="title">' + item.title + '</span>');
        link.append('<span class="price">' + Shopify.formatMoney(item.price) + '</span>');
        link.wrap('<li></li>');
        self.$dropdown.append(link.parent());
      });
    }

    // Result: article
    if (articleSuggestions && articleSuggestions.length > 0) {

      $.each(articleSuggestions, function (index, item) {
        var link = $('<a class="search-result__article"></a>').attr('href', item.url);
        if (item.featured_image.url) {
          link.append('<span class="thumbnail"><img src="' + Shopify.resizeImage(item.featured_image.url, '100x100') + '" /></span>');
        } else {
          link.append('<span class="thumbnail no-image"></span>');
        }
        link.append('<span class="title">' + item.title + '</span>');
        link.wrap('<li></li>');
        self.$dropdown.append(link.parent());
      });
    }

    // Result: page
    if (pageSuggestions && pageSuggestions.length > 0) {

      $.each(pageSuggestions, function (index, item) {
        var link = $('<a class="search-result__page"></a>').attr('href', item.url);
        link.append('<span class="thumbnail no-image"></span>');
        link.append('<span class="title">' + item.title + '</span>');
        link.wrap('<li></li>');
        self.$dropdown.append(link.parent());
      });
    }

    // Result: collection
    if (collectionSuggestions && collectionSuggestions.length > 0) {

      $.each(collectionSuggestions, function (index, item) {
        var link = $('<a class="search-result__collection"></a>').attr('href', item.url);
        if (item.featured_image.url) {
          link.append('<span class="thumbnail"><img src="' + Shopify.resizeImage(item.featured_image.url, '100x100') + '" /></span>');
        } else {
          link.append('<span class="thumbnail no-image"></span>');
        }
        link.append('<span class="title">' + item.title + '</span>');
        link.wrap('<li></li>');
        self.$dropdown.append(link.parent());
      });
    }

    // If results
    if (self.$dropdown.children().length) {

      var query = self.createQuery();

      // Show all results
      self.$dropdown.append('<li class="search-show_all"><a href="/search' + query + '">' + self.options.show_all + '</a></li>');
      self.openDropdown();

    // If no results
    } else {

      self.closeDropdown();
    }
  };

  /**
   * Open predictiveSearch dropdown
   */
  enhancedSearch_plugin.prototype.openDropdown = function () {
    var self = this;
    self.$element.find('[data-enhanced-search="results"]').addClass('search__dropdown--is-open');
    self.dropdownVisible = true;
  };

  /**
   * Close predictiveSearch dropdown
   */
  enhancedSearch_plugin.prototype.closeDropdown = function () {
    var self = this;
    self.$element.find('[data-enhanced-search="results"]').removeClass('search__dropdown--is-open');
    self.dropdownVisible = false;
  };

  /**
   * Create query from form elements
   */
  enhancedSearch_plugin.prototype.createQuery = function () {
    var self = this;
    var query = '';

    // Loop all inputs
    self.$element.find('input').each(function(index, input){

      var name = $(input).attr('name');
      var val = $(input).val();
      query += '&' + name + '=' + val;

      if (self.options.wildcard && name == 'q' && val.indexOf('*') < 0) {
        query += '*';
      }
    });

    return query.replace('&','?');
  };

  /**
   * search with automatic Wildcard
   */
  enhancedSearch_plugin.prototype.initWildcard = function () {
    var self = this;

    var canSubmit = false;

    // on submit form
    self.$element.on('submit', function (e) {

      // prevent default
      e.preventDefault();

      // Create a search query
      self.terms = self.createQuery();

      // submit form
      location.href = '/search' + self.terms;
    });
  };

  /**
   * enhancedSearch plugin
   *
   * @return jQuery objects
   */
  $.fn.enhancedSearch = function (options) {

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
        $element.data('plugin_' + _pluginName, new enhancedSearch_plugin($element, options));
      } else {

        // if instance already created call method from plugin
        if (typeof options === 'string') {
          instance[options].apply(instance, args);
        }
      }
    });
  };

})(jQuery, document, window);
