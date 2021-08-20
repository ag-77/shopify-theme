/****************************************************************
 * CODE relatedProducts
 ****************************************************************/

!(function ($, document, window, undefined) {

  /**
   * Plugin name
   */
  var _pluginName = 'relatedProducts';

  /**
   * @param $element Element Wrapping container div
   * @param options Options passed to public functions
   * @return relatedProducts_plugin
   */
  var relatedProducts_plugin = function ($element, options) {

    // Scope it
    var self = this;
    self.$element = $element;
    self.xhrCount = 0;

    // Set default options
    var defaults = {
      view: 'product-related',          // view for liquid files collection.product-related.liquid and product.product-related.liquid
      max: 5,                           // max products
      currentHandle: '',                // handle of the current product
      relatedMetaHandles: '',           // array of product handles
      relatedSameCollectionHandles: '', // array of product handles
      relatedPrimaryTag: '',            // tag to filter primary collection
      relatedPrimaryCollection: '',     // primary collection handle
      relatedSecondaryTag: '',          // tag to filter secondary collection
      relatedSecondaryCollection: '',   // secondary collection handle
      columnClasses: '',                // classes for no-slider columns
      wrapper: ''                       // jQuery selector to show hide wrapper
    };

    // Get options from html element
    var metaOptions = self.$element.data('relatedProducts');
    self.options = $.extend({}, defaults, metaOptions);

    // Create the ajax url for the Primary collection
    // This uses collection.product-related.liquid
    if (self.options.relatedPrimaryCollection != '' && self.options.relatedPrimaryTag != '') {
      self.options.relatedPrimaryCollectionUrl = '/collections/' + self.options.relatedPrimaryCollection + '/' + self.options.relatedPrimaryTag + '?view=' + self.options.view;
    }

    // Create the ajax url for the Secondary collection
    // This uses collection.product-related.liquid
    if (self.options.relatedSecondaryCollection != '' && self.options.relatedSecondaryTag != '' ) {
      self.options.relatedSecondaryCollectionUrl = '/collections/' + self.options.relatedSecondaryCollection + '/' + self.options.relatedSecondaryTag + '?view=' + self.options.view;
    }

    // Create array for Metafield related products
    var relatedProducts_Metafield = [];
    if (Array.isArray(self.options.relatedMetaHandles)) {
      relatedProducts_Metafield = self.options.relatedMetaHandles;
    }

    // Create array for products from the same collection (without tag filtering)
    var relatedProducts_SameCollection = [];
    if (Array.isArray(self.options.relatedSameCollectionHandles)) {
      relatedProducts_SameCollection = self.options.relatedSameCollectionHandles;
    }

    var ajax1, ajax2;

    // Get an array of collection products filtered by relatedPrimaryTag (only first 1000 of this collection)
    if (typeof self.options.relatedPrimaryCollectionUrl != 'undefined') {
      ajax1 = $.ajax(self.options.relatedPrimaryCollectionUrl);
    }

    // Get an array of all products filtered by tag (only first 1000 of all_products)
    if (typeof self.options.relatedSecondaryCollectionUrl != 'undefined') {
      ajax2 = $.ajax(self.options.relatedSecondaryCollectionUrl);
    }

    if ($.code.debug) {
      console.log('Init relatedProducts:', self.$element, self.options);
    }

    // Find wrapper element
    self.$wrapper = $(self.options.wrapper);
    self.$container = self.$element.find('[data-related-products-container]');

    if (!self.$wrapper.length) {
      self.$wrapper = self.$element;
    }

    $.when( ajax1, ajax2 )
    .done(function( a1, a2 ) {

      var relatedProducts_PrimaryCollection = [];
      var relatedProducts_SecondaryCollection = [];

      if (typeof a1 != 'undefined') {
        relatedProducts_PrimaryCollection = a1[0].split(',');
      }
      if (typeof a2 != 'undefined') {
        relatedProducts_SecondaryCollection = a2[0].split(',');
      }

      // Concat all arrays and remove duplicates
      var relatedProductHandles = [].concat(
        relatedProducts_Metafield,
        relatedProducts_PrimaryCollection,
        relatedProducts_SecondaryCollection,
        relatedProducts_SameCollection
      );

      // Make the product handles unique, regardless of the collection prefix
      var relatedProductHandles_unique = [];
      var testArr = [];
      $.each(relatedProductHandles, function(index, handle) {

        var shortHandle = handle;

        // Remove collection prefix from handle
        if (handle.indexOf('|') > -1) {
          var res = handle.split('|');
          shortHandle = res[1];
        }

        // if shortHandle is not in testarray and not the current product
        if ($.inArray(shortHandle, testArr) == -1 && shortHandle !== self.options.currentHandle) {

          // Add shortHandle to testarray
          testArr.push(shortHandle);

          // Add real handle to unique array
          relatedProductHandles_unique.push(handle);
        }
      });

      // Remove products > max items
      var relatedProductHandles_arr = relatedProductHandles_unique.slice(0, self.options.max);

      if ($.code.debug) {
        console.log('relatedProducts_Metafield ' + self.options.wrapper, relatedProducts_Metafield);
        console.log('relatedProducts_PrimaryCollection ' + self.options.wrapper, self.options.relatedPrimaryCollectionUrl, relatedProducts_PrimaryCollection);
        console.log('relatedProducts_SecondaryCollection ' + self.options.wrapper, self.options.relatedSecondaryCollectionUrl, relatedProducts_SecondaryCollection);
        console.log('relatedProducts_SameCollection ' + self.options.wrapper, relatedProducts_SameCollection);
        console.log('relatedProductHandles ' + self.options.wrapper, relatedProductHandles_arr);
      }

      // create empty array to hold our items
      var responseArray = [];

      // map product urls to array
      var productsArray = $.map(relatedProductHandles_arr, function(handle, i) {
        var collectionHandle = 'all';
        var shortHandle = handle;

        // Split the collection|product_handle
        if (handle.indexOf('|') > -1) {
          var res = handle.split('|');
          collectionHandle = res[0];
          shortHandle = res[1];
        }

        var productUrl = '/collections/'+ collectionHandle +'/products/'+ shortHandle;

        // Store the relation
        var relation = '';
        if ($.inArray(handle, relatedProducts_SecondaryCollection) > -1 ) { relation = 'secondary collection'; }
        if ($.inArray(handle, relatedProducts_PrimaryCollection) > -1 ) { relation = 'primary collection'; }
        if ($.inArray(handle, relatedProducts_SameCollection) > -1 ) { relation = 'same collection'; }
        if ($.inArray(handle, relatedProducts_Metafield) > -1 ) { relation = 'metafield'; }

        // Related product original object
        return {
          index: i,
          collectionHandle: collectionHandle,
          relation: relation,
          url: productUrl
        };
      });

      // create deferred ajax request to pass product urls to
      var ajax_request = function(product) {
        var deferred = $.Deferred();

        $.ajax({
          url: product.url + '?view=' + self.options.view,
          success: function(data) {
            // mark the ajax call as completed
            deferred.resolve(data).done(function(data) {
              // Related product response/final object
              responseArray[product.index] = {
                index: product.index,
                collectionHandle: product.collectionHandle,
                relation: product.relation,
                html: data
              };
            });
          },
          error: function(error) {
            // mark the ajax call as completed
            deferred.reject(error);
          }
        });

        return deferred.promise();
      };

      // define looper
      var looper = $.Deferred().resolve();

      // go through each product url and call the ajax function
      $.when.apply($, $.map(productsArray, function(product, i) {
        looper = looper.then(function() {

          // trigger ajax call with product data
          return ajax_request(product);
        });

        return looper;
      })).done(function() {

        // All ajax calls have completed
        if ($.code.debug) {
          console.log('Related products original array', productsArray);
          console.log('Related products ajax response array', responseArray);
        }

        // empty the container
        self.$container.empty();

        for (var index = 0; index < responseArray.length; index++) {

          var element = responseArray[index];

          if (typeof element != 'undefined') {

            // Create element
            var $element = $(element.html).attr('data-related-by', element.relation);

            // Add to container
            self.$container.append($element);
          }
        }
        self.render();
      });
    });
  };

  /**
   * Render products
   *
   * @return void
   * @access public
   */
  relatedProducts_plugin.prototype.render = function () {
    var self = this;

    if (self.$container.children().length > 0) {

      // Show the wrapper
      self.$wrapper.show();
    } else {

      // Hide the wrapper
      self.$wrapper.remove();
      return;
    }

    // Init Swiper
    var $swiperWrapper = self.$container.closest('[data-swiper-options]');
    if ($swiperWrapper.length) {

      // Add classes
      self.$container.children().addClass('swiper-slide');

      // Start swiper
      $swiperWrapper.swiperLoader();
    } else {
      self.$container.children().addClass(self.options.columnClasses);
    }
  };

  /**
   * relatedProducts plugin
   *
   * @return jQuery objects
   */
  $.fn.relatedProducts = function (options) {

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
        $element.data('plugin_' + _pluginName, new relatedProducts_plugin($element, options));
      } else {

        // If instance already created call method from plugin
        if (typeof options === 'string') {
          instance[options].apply(instance, args);
        }
      }
    });
  };

})(jQuery, document, window);
