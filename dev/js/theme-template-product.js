/****************************************************************
 * Js imports
 ****************************************************************/
//=include ./ext/easyzoom.min.js                  // PDP image zoom over the product image
//=include ./ext/jquery.elevateZoom-3.0.8.min.js  // PDP image zoom with gallery inside Fancybox
//=include ./code/product.js                      // Product scripts, init product image slideshow , zoom and gallery, specs and variant changes
//=include ./code/product-recommendations.js      // Product recommendations
//=include ./code/related-products.js             // Load related products
//=include ./code/tabs.js                         // Load tabs

/****************************************************************
 * CODE init
 ****************************************************************/

$.code.productInit = function () {

  // Init tabs
  $('[data-tabs]').tabs();

  // Init product events
  $('[data-section-type="product"]').product();

  // Init related products
  $('[data-related-products]').relatedProducts();

  // Init product recommendations
  $("[data-product-recommendations]").productRecommendations();
};

$.code.productInit();
