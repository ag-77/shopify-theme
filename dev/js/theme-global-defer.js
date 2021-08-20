"use strict"

window.slate = window.slate || {};
window.theme = window.theme || {};
$.code = $.code || {};

/****************************************************************
 * Js imports
 ****************************************************************/

/* external scripts */

//=include ./ext/slate/slate/a11y.js
//=include ./ext/slate/slate/cart.js
//=include ./ext/slate/slate/utils.js
//=include ./ext/slate/slate/rte.js
//=include ./ext/slate/slate/sections.js
//=include ./ext/slate/slate/currency.js
//=include ./ext/slate/slate/images.js
//=include ./ext/slate/slate/variants.js
//=include ./ext/slate/sections/product.js
//=include ./ext/slate/slate.js
//=include lazysizes/lazysizes.min.js             // Lazy image loader
//=include ./ext/swiper.min.js                    // Slideshow Swiper
//=include ./ext/getParameterByName.js            // Get url parameters by name
//=include ./ext/jquery.fancybox.min.js           // Fancybox for popups
//=include ./ext/replaceUrlParam.js               // Replace url parameters

/* Code plugins */
//=include ./code/cart-drawer.js                  // Update the cart and cart drawer and show a add-to-cart notification
//=include ./code/ajax-pagination.js              // Load new pages by ajax for collection pages
//=include ./code/collapsible.js                  // Collapsible panes
//=include ./code/country-popup.js                // Country switcher from popup when in a different country
//=include ./code/js.cookie.min.js                // Handle cookies
//=include ./code/search.js                       // Make search always use a * and show quicksearch dropdown
//=include ./code/swiper-loader.js                // Load Swiper slideshows
//=include ./code/toggle-element-class.js         // Toggle element classes

/****************************************************************
 * CODE init
 ****************************************************************/

$.code.init = function () {

  // Set debugging flag
  $.code.debug = true;

  // Set global variables
  $.code.setVars();

  // Handle window resizing
  $.code.windowResizeHandler();

  /**
   * init plugins
   */
  // Init ajax cart
  $('body').cartDrawer();

  // Init Swipers
  $('[data-swiper]').swiperLoader();

  // Init collapsible panes
  $('[data-collapsible-wrapper]').collapsible();

  // Init enhanced search
  $('[data-enhanced-search]').enhancedSearch();

  // Init Ajax pagination
  $('[data-ajax-pagination]').ajaxPagination();

  // Init class togglers
  $('[data-toggle-element-class]').toggleElementClass();

  // Init country popup
  $('body').countryPopup();

  // Scroll to element on page load
  var $scrollEl = $('[data-scroll-here]');
  if ($scrollEl.length) {
    $('html, body').animate({
      scrollTop: $scrollEl.offset().top
    }, 500);
  }

  // Catch change of currency switcher
  $('body').on('change', '[data-currency="switcher"] select', function () {
    $(this).parents('form').submit();
  });
};

/**
 * Handle window resizing
 */
$.code.windowResizeHandler = function () {

  // Call window resize functions 200ms after window stops being resized
  var timeoutOffset = false;
  $(window).resize(function () {
    if (timeoutOffset !== false) {
      clearTimeout(timeoutOffset);
    }
    timeoutOffset = setTimeout(function () {
      $.code.onWindowResize();
    }, 200);
  });
};

/**
 * Functions to be called after window resizing is finished
 *
 * To re-init a function after resize just add it to this array:
 * $.code.onResizeFunctions.push($.code.myFunction);
 */
$.code.onWindowResize = function () {
  var self = this;

  // Get new global window width
  $.code.ww = $(window).width();

  // Fire all functions from the array
  $.each($.code.onResizeFunctions, function (indexInArray, functionName) {
    if (typeof functionName == 'function') {
      functionName();
    }
  });
};

/**
 * Set global variables
 */
$.code.setVars = function () {
  var self = this;

  // Set debug to true for deveolment environments
  if (window.location.host.indexOf('localhost') > -1 || window.location.host.indexOf('myshopify') > -1) {
    $.code.debug = true;
  }
  if ($.code.debug) {
    console.log('Init CODE js with debugging');
  }

  // Create global array to collect functions that need to be fired after a resize
  $.code.onResizeFunctions = [];

  // Get window width
  $.code.onWindowResize();

  // Check for localstorage
  $.code.localStorage = $.code.localStorageTest();

  // Set if page is in theme editor
  if (Shopify.designMode) {
    $.code.themeEditor = true;
    $('body').addClass('theme-editor');
    if ($.code.debug) {
      console.log('Theme editor active');
    }
  }
};

/**
 * Test for localStorage
 */
$.code.localStorageTest = function () {
  var test = 'test';
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Initialize CODE JS
 */
$.code.init();

/**
 * shopify Theme editor Events
 */
if ($.code.themeEditor) {

  $(document).on('shopify:section:load', function (e) {

    var $parentSection = $('#shopify-section-' + e.detail.sectionId);
    var blockId = e.detail.blockId;

    // Re-init featured product
    if ($parentSection.hasClass('product-featured-section')) {
      $('[data-section-type="product"]', $parentSection).product();
    }
    // Re-init swiper
    if ($parentSection.hasClass('swiper-section')) {
      $('[data-swiper]', $parentSection).swiperLoader();
    }
  }).on('shopify:section:reorder', function (e) {

  }).on('shopify:section:unload', function (e) {

    var $parentSection = $('#shopify-section-' + e.detail.sectionId);
    var blockId = e.detail.blockId;
  }).on('shopify:block:select', function (e) {

    var $parentSection = $('#shopify-section-' + e.detail.sectionId);
    var blockId = e.detail.blockId;

    // Edit swiper slide
    if ($parentSection.hasClass('swiper-section')) {
      var $slide = $(e.target);
      $('[data-swiper]', $parentSection).swiperLoader('editSlide', $slide);
    }
  }).on('shopify:block:deselect', function (e) {

    var $parentSection = $('#shopify-section-' + e.detail.sectionId);
    var blockId = e.detail.blockId;
  });
}
