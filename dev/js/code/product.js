/****************************************************************
 * CODE product
 ****************************************************************/

!(function ($, document, window, undefined) {

  /**
   * Plugin name
   */
  var _pluginName = 'product';

  /**
   * @param $element Element Wrapping container div
   * @param options Options passed to public functions
   * @return product_plugin
   */
  var product_plugin = function ($element, options) {

    // Scope it
    var self = this;
    self.$element = $element;

    // Create product Options
    var defaultOptions = {
      onMasterSelectChange: {
        updateSpecs: true,                    // On variant change, update the specs
        updateVariantImagesInSwiper: true,    // On variant change, show the image of the variant
        triggerOnPageLoad: true               // Trigger a variant change when the PDP is loaded with a variant parameter to show the image of the variant
      },
      easyzoom: {
        loadingNotice: "",
        errorNotice: ""
      },
      fancybox:{
        hash: false,
        backFocus: false,
        baseClass: "product-detail-popup",
        thumbs : {
          autoStart   : true,
          hideOnClose : true
        }
      }
    };
    var metaOptions = self.$element.data('product-options');
    self.options = $.extend({}, defaultOptions, metaOptions);

    if ($.code.debug) {
      console.log('Init product:', self.$element, self.options);
    }

    // Get elements
    self.productImagesSwiper = $('.product-images__slider');
    self.productImagesSwiperNav = $('.product-images__slider-nav');

    self.$specsWrapper = self.$element.find('[data-product-specs-wrapper]');
    self.$specs = self.$element.find('[data-product-specs]');
    self.specs_data = self.$specs.data('product-specs');

    if (self.productImagesSwiper.length) {

      // Init product Swipers
      self.initProductSwipers();
    } else {

      // Init productzoom on product image
      self.initProductZoom();

      // Init productzoom popup gallery
      self.initProductFancyboxGallery();
    }

    // Capture masterSelectChange from slate variants.js
    self.$element.on('masterSelectChange', function (event) {

      if ($.code.debug) {
        console.log('masterSelectChange:', event.variant);
      }

      // Get variant id from event
      var variant_id = event.variant.id;

      // Update the specs
      if (self.options.onMasterSelectChange.updateSpecs) {
        self.updateSpecs(variant_id);
      }

      // Tell slideshow to go to slide i
      if (self.options.onMasterSelectChange.updateVariantImagesInSwiper) {
        self.goToVariant(variant_id);
      }
    });
  };

  /**
   * Init the product zoom
   *
   * @return void
   * @access public
   */
  product_plugin.prototype.initProductZoom = function () {
    var self = this;

    // Init easyzoom
    self.$element.find('[data-product-easy-zoom]').each(function () {
      $(this).easyZoom(self.options.easyzoom);
    });
  };

  /**
   * Update Product Specs
   *
   * @return void
   * @access public
   */
  product_plugin.prototype.updateSpecs = function (currentVariantId) {
    var self = this;

    if (!self.$specs.length || !self.specs_data.specs || !self.specs_data.row_template || !self.specs_data.divider) {
      return;
    }

    // Loop the specs
    $.each(self.specs_data.specs, function (index, value) {
      var variantSpecs = value.split(self.specs_data.divider);
      var variantId = variantSpecs[0].split(':::')[1];

      if (variantId == currentVariantId) {
        var rowHtml = self.specs_data.row_template;
        var specHtml = '';

        // Loop the specs to create html from the template
        $.each(variantSpecs, function (i, specs) {
          var pair = variantSpecs[i];
          var key = pair.split(':::')[0];
          var value = pair.split(':::')[1];

          // Skip the variant ID
          if (key == 'variant_id') {
            return;
          }
          specHtml = specHtml + rowHtml.replace('[key]', key ).replace('[value]', value );
        });

        // Insert the html
        self.$specs.html(specHtml);

        // break the loop
        return false;
      }
    });
  };

  /**
   * Init the product fancybox Image popup slideshow
   *
   * @return void
   * @access public
   */
  product_plugin.prototype.initProductFancyboxGallery = function () {
    var self = this;

    // Init fancybox on all Product images, except for slide duplicates
    self.$element.find("[data-fancybox]").not('.swiper-slide-duplicate [data-fancybox]').fancybox(self.options.fancybox);
  };

  /**
   * Init the product slideshow
   *
   * @return void
   * @access public
   */
  product_plugin.prototype.initProductSwipers = function () {
    var self = this;

    var swiperOptions = {};

    // If thumbnails must be a swiper
    if (typeof self.productImagesSwiperNav.data('swiper-options') != 'undefined') {

      // Init thumbnail Swiper
      self.productImagesSwiperNav.swiperLoader();

      // Get the thumbnail Swiper Instance
      var productImagesSwiperNavInstance = self.productImagesSwiperNav.find('.swiper-container:first')[0].swiper;

      // Set thumbnail instance as thumbs in options for Product image Swiper
      swiperOptions = {
        thumbs: {
          swiper: productImagesSwiperNavInstance
        }
      };
    } else {

      // Find all thumbnails
      var $thumbs = self.productImagesSwiperNav.find('[data-product-thumb]');

      // Catch click on a thumbnail
      self.productImagesSwiperNav.on('click','[data-product-thumb]',function(){
        var slideIndex = $thumbs.index($(this));

        // Tell Product images Swiper to show that image
        self.productImagesSwiper.swiperLoader('goToSlide', slideIndex);
      });
    }

    // Init Product images Swiper
    self.productImagesSwiper.swiperLoader(swiperOptions);

    // Get Swiper options for gotovariant
    self.swiperOptions = self.productImagesSwiper.data('swiper-options');

    // Get the Product image Swiper Instance
    self.productImagesSwiperInstance = self.productImagesSwiper.find('.swiper-container:first')[0].swiper;

    // If the PDP is loaded with a variant parameter, show the image of the variant
    if (self.options.onMasterSelectChange.triggerOnPageLoad) {

      // Find the current variant
      var currentVariantId = self.$element.find('[name="id"]').val();

      self.goToVariant(currentVariantId, 0);
    }

    // Init productzoom on product image
    self.initProductZoom();

    // Init productzoom popup gallery
    self.initProductFancyboxGallery();
  };

  /**
   * Slideshow GoToVariant
   *
   * @return void
   * @access public
   */
  product_plugin.prototype.goToVariant = function (variantId, speed) {
    var self = this;

    if (typeof self.productImagesSwiperInstance == 'undefined') {
      return;
    }

    // Loop the slides in self.productImagesSwiperInstance
    self.productImagesSwiperInstance.slides.each(function(slideIndex){

      // Get variant Ids for this slide
      var ids = $(this).data('product-variant-image');

      if (typeof ids == 'undefined') {
        return;
      }

      for (var index = 0; index < ids.length; index++) {
        var id = ids[index];

        // If this slide has the variantId
        if (id == variantId) {

          if (self.swiperOptions.loop) {
            slideIndex -= 1;
          }

          // Tell slider to go to this slide
          self.productImagesSwiper.swiperLoader('goToSlide', slideIndex, speed);

          // Stop loop
          return false;
        }
      }
    });
  };

  /**
   * product plugin
   *
   * @return jQuery objects
   */
  $.fn.product = function (options) {

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
        $element.data('plugin_' + _pluginName, new product_plugin($element, options));
      } else {
        // If instance already created call method from plugin
        if (typeof options === 'string') {
          instance[options].apply(instance, args);
        }
      }
    });
  };

})(jQuery, document, window);
