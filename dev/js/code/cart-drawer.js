/****************************************************************
 * CODE cartDrawer
 ****************************************************************/

!(function ($, document, window, undefined) {

  /**
   * Plugin name
   */
  var _pluginName = 'cartDrawer';

  /**
   * @param $element Element Wrapping container div
   * @param options Options passed to public functions
   * @return ajaxCart_plugin
   */
  var ajaxCart_plugin = function ($element, options) {

    // Scope it
    var self = this;
    self.$body = $('body');
    self.$element = self.$body.find('[data-cart-drawer]');
    self.xhrCount = 0;

    // Set default options
    var defaults = {
      cart_image_size: "100x100_crop_center",
      notification_image_size: "100x",
      onAddShowNotification: true,
      onAddShowCart: true,
      renderCart: true
    };
    var metaOptions = self.$element.data('cart-drawer');
    self.options = $.extend({}, defaults, metaOptions);

    if ($.code.debug) {
      console.log('Init cartDrawer:', self.$element, self.options);
    }

    // Find containers
    self.$cartForm = self.$element.find('[data-cart-drawer-form]');
    self.$ajaxCartWrapper = self.$element.find('[data-cart-drawer-wrapper]');
    self.$ajaxCartContainer__products = self.$ajaxCartWrapper.find('[data-cart-drawer-container="products"]');
    self.$ajaxCartContainer__totals = self.$ajaxCartWrapper.find('[data-cart-drawer-container="totals"]');
    self.$ajaxCartContainer__actions = self.$ajaxCartWrapper.find('[data-cart-drawer-container="actions"]');

    self.$ajaxCartTemplate__warnings = $('[data-cart-drawer-template="warnings"]').html();
    self.$ajaxCartTemplate__notifications = $('[data-cart-drawer-template="notifications"]').html();
    self.$ajaxCartTemplate__products = self.$ajaxCartContainer__products.children();
    self.$ajaxCartTemplate__totals = self.$ajaxCartContainer__totals.children();
    self.$ajaxCartTemplate__actions = self.$ajaxCartContainer__actions.children();

    self.$cartContainer__totals = $('[data-cart-container="totals"]');
    self.$cartContainer__products = $('[data-cart-container="products"]');

    self.$cartIconLink = $('[data-cart-drawer-link]');
    self.$cartIconWrapper = $('[data-cart-drawer-icon__wrapper]');
    self.$cartIconQuantity = self.$cartIconWrapper.find('[data-cart-drawer-icon-quantity]');

    // Get the cart
    self.getCart(false);

    // Handle click events
    self.handleEvents();
  };

  /**
   * Handle events
   *
   * @return void
   * @access public
   */
  ajaxCart_plugin.prototype.handleEvents = function () {
    var self = this;

    // Catch click on Add to cart buttons
    self.$body.on('click', '[data-cart-drawer-add-button]', function (event) {
      event.preventDefault();

      // Add product to cart
      self.addToCart($(this));
    });

    // Prevent clickThrough on ajax cart
    self.$ajaxCartWrapper.on('click', function (event) {
      event.stopPropagation();
    });

    // Catch click on quantity modifiers in ajax cart
    self.$ajaxCartContainer__products.on('click', '[data-cart-drawer-quantity-modifier]', function (event) {
      self.handleQuantityUpdate(event);
    });

    // Catch click on quantity modifiers on the cart page
    self.$body.on('click', '[data-cart-drawer-quantity-modifier]', function (event) {
      self.handleQuantityUpdate(event);
    });

    // Catch change of quantity in ajax cart
    self.$ajaxCartContainer__products.on('change input blur', '[data-cart-drawer-quantity-value]', function (event) {
      self.handleQuantityUpdate(event);
    });

    // Catch change of quantity on the cart page
    self.$body.on('change input blur', '[data-cart-drawer-quantity-value]', function (event) {
      self.handleQuantityUpdate(event);
    });

    // Catch click on product remove in ajax cart
    self.$ajaxCartContainer__products.on('click', '[data-cart-drawer-template-element="remove"]', function (event) {
      event.preventDefault();

      var $productRow = $(this).closest('[data-cart-drawer-template-element="row"]').slideUp(300);
      self.removeProduct($productRow);
    });

    // Catch click on product remove on cart page
    self.$cartContainer__products.on('click', '[data-cart-drawer-template-element="remove"]', function (event) {
      event.preventDefault();

      // Find the product row
      var $productRow = $(this).closest('[data-cart-line]');

      // Make ajax call to remove this product
      self.removeProduct($productRow);

      // Slide the product out of view
      $productRow.slideUp(300, function () {

        // Remove the row
        $productRow.remove();

      });
    });
  };

  /**
   * Remove a product row
   *
   * @return void
   * @access public
   */
  ajaxCart_plugin.prototype.removeProduct = function ($row) {

    var self = this;

    // Set quantity input to 0
    $row.find('[data-cart-drawer-quantity-value]').val(0);

    // Find product id
    var variantInputId = $row.find('[data-cart-drawer-quantity-id]').val();

    var postData = {
      id: variantInputId,
      quantity: 0
    }

    if ($.code.debug) {
      console.log('Remove product:', postData);
    }

    // Post the updates
    self.postAjaxCartUpdates(postData);
  };

  /**
   * Show a notification of the added product
   *
   * @return void
   * @access public
   */
  ajaxCart_plugin.prototype.handleQuantityUpdate = function (event) {
    event.preventDefault();
    var self = this;
    var $trigger = $(event.currentTarget);
    var $wrapper = $trigger.closest('[data-cart-drawer-quantity-modifiers]');

    // Find quantity input
    var $quantityInput = $wrapper.find('[data-cart-drawer-quantity-value]');
    var $variantInput = $wrapper.find('[data-cart-drawer-quantity-id]');

    // if triggered by +/- button
    if ($trigger.data('cart-drawer-quantity-modifier')) {

      // Update quantity
      var oldQuantity = parseInt($quantityInput.val());

      // Quantity of 1 is minimum
      var newQuantity = Math.max(oldQuantity + parseInt($trigger.data('cart-drawer-quantity-modifier')), 1);
      $quantityInput.val(newQuantity);

    } else {
      // if triggered by manual input
      var newQuantity = parseInt($quantityInput.val());
    }

    // if nothing changed
    if (newQuantity == oldQuantity) {
      return;
    }

    var postData = {
      id: $variantInput.val(),
      quantity: newQuantity
    }

    if ($.code.debug) {
      console.log('Update cartDrawer:', postData);
    }

    // Post the form
    self.postAjaxCartUpdates(postData);
  };

  /**
   * Show a notification of the added product
   *
   * @return void
   * @access public
   */
  ajaxCart_plugin.prototype.showAddToCartNotification = function (item) {
    var self = this;

    if (!self.options.onAddShowNotification) {
      return;
    }

    // Close currently opened fancybox (like Quickshops etc)
    $.fancybox.close();

    // Clone the notification template
    var $html = $(self.$ajaxCartTemplate__notifications).clone();

    // Fill the template with data
    var $response_html = self.fillTemplate($html, item, self.options.notification_image_size);

    // Show the notification
    $.fancybox.open($response_html, {
      hideScrollbar: false,
      hash: false,
      touch: false,
      autoFocus: false,
      backFocus: false,
      baseClass: "cart-drawer__notification-popup fancybox-notification",
      // Toggle extra body class for notifications
      beforeShow: function () {
        $('body').addClass('fancybox-notification-active');
      },
      afterClose: function () {
        $('body').removeClass('fancybox-notification-active');
      }
    });
  };

  /**
   * Update Cart Icon Quantity
   *
   * @return void
   * @access public
   */
  ajaxCart_plugin.prototype.updateCartIconQuantity = function (newQuantity) {
    var self = this;

    // Update counter badge text and data attribute
    self.$cartIconQuantity.text(newQuantity).data('cart-drawer-icon-quantity', newQuantity);

    // Remove hidden to make it in/visible
    if (newQuantity > 0) {
      self.$cartIconWrapper.removeClass('hidden');
    } else {
      self.$cartIconWrapper.addClass('hidden');
    }
  };

  /**
   * Fill Template
   *
   * @return void
   * @access public
   */
  ajaxCart_plugin.prototype.fillTemplate = function ($html, data, imageSize) {
    var self = this;

    // Fill data in template
    var dataTitle = '';
    if (data.title) {
      // Strip [prefix]
      dataTitle = data.title.replace(/ *\[[^)]*\] */g, " ").trim();
    }
    $html.find('[data-cart-drawer-template-element="title"]').html(dataTitle);
    $html.find('[data-cart-drawer-template-element="warning"]').html(data.warning);
    $html.find('[data-cart-drawer-template-element="quantity"]').html(data.quantity);
    $html.find('[data-cart-drawer-template-element="vendor"]').html(data.vendor);
    $html.find('[data-cart-drawer-template-element="total"]').html(Shopify.formatMoney(data.total_price));
    $html.find('[data-cart-drawer-template-element="discounts"]').html(Shopify.formatMoney(data.discounts));
    $html.find('[data-cart-drawer-template-element="item-link"]').attr('href', data.url);
    $html.find('[data-cart-drawer-template-element="remove"]').attr('href', '/cart/change?quantity=0&id=' + data.id);
    $html.find('[data-cart-drawer-template-element="price"]').html(Shopify.formatMoney(data.final_price));
    $html.find('[data-cart-drawer-quantity-value]').attr("value", data.quantity);
    $html.find('[data-cart-drawer-quantity-id]').attr("value", data.variant_id);

    // Disable -button when quantity = 1
    if (data.quantity == 1) {
      $html.find('[data-cart-drawer-quantity-modifier="-1"]').prop("disabled", true);
    }

    // Remove discounts if 0
    if (data.discounts == 0) {
      $html.find('[data-cart-drawer-template-element="discounts"]').removeClass('hidden');
    }

    // Resize the image
    if (data.image) {
      var newSrc = Shopify.resizeImage(data.image, imageSize);
      $html.find('[data-cart-drawer-template-element="image"] img').attr('src', newSrc).attr('alt', dataTitle).attr('title', dataTitle);
    }

    return $html;
  };

  /**
   * Show cart warning
   *
   * @return void
   * @access public
   */
  ajaxCart_plugin.prototype.showWarning = function (warning) {
    var self = this;

    // Close currently opened fancybox (like Quickshops etc)
    $.fancybox.close();

    // Create the warning (must be wrapped in a single div for fancyBox)
    var warning_html = warning.replace('All 1 ', 'All ').replace('[', '- ').replace(']', '');

    var warningObj = {
      warning: warning_html
    }

    // Clone the warning template
    var $html = $(self.$ajaxCartTemplate__warnings).clone();

    // Fill the template with data
    var $response_html = self.fillTemplate($html, warningObj, self.options.notification_image_size);

    // Show the notification
    $.fancybox.open($response_html, {
      hash: false,
      touch: false,
      baseClass: "cart-drawer__warning-popup"
    });
  };

  /**
   * Add product to cart
   *
   * @return void
   * @access public
   */
  ajaxCart_plugin.prototype.addToCart = function ($el) {
    var self = this;

    // Find the form
    var $form = $el.closest('form');
    var orderedQuantity = $form.find('[data-cart-drawer-quantity]').val();

    if (isNaN(parseFloat(orderedQuantity))) {
      return;
    }

    var addData = $form.serialize();

    if ($.code.debug) {
      console.log('Add to Cart:', addData, orderedQuantity);
    }
    self.handleAddToCart(addData);
  };

  /**
   * Handle add to cart Ajax
   *
   * @return void
   * @access public
   */
  ajaxCart_plugin.prototype.handleAddToCart = function (addData) {
    var self = this;

    // Sequence number for the current invocation of function
    var seqNumber = ++self.xhrCount;

    $.ajax({
        url: '/cart/add.js',
        type: 'POST',
        data: addData,
        dataType: 'json',
        beforeSend: function () {
          if ($.code.debug) {
            console.log('Send to Cart: ' + seqNumber, addData);
          }
        },
        error: function (XMLHttpRequest) {
          if ($.code.debug) {
            console.log('Add to Cart error:', XMLHttpRequest);
          }

          // Show a warning
          var responseJSON = XMLHttpRequest.responseJSON;
          self.showWarning(responseJSON.description);
        }
      })
      .done(function (data) {

        if ($.code.debug) {
          console.log('Add to Cart ' + seqNumber + ' success:', data);
        }

        // If this is the last ajax Call
        if (seqNumber === self.xhrCount) {

          // Show the notification
          self.showAddToCartNotification(data);
        }
      })
      .always(function (data) {

        // If ( $.code.debug ) { console.log( 'Add to Cart always:', data ); }
        if (seqNumber === self.xhrCount) {

          // Get the cart
          self.getCart(self.options.onAddShowCart);
        }
      });
  };

  /**
   * Post cart updates;
   *
   * @return void
   * @access public
   */
  ajaxCart_plugin.prototype.postAjaxCartUpdates = function (newItemData) {
    var self = this;

    // Sequence number for the current invocation of function
    var seqNumber = ++self.xhrCount;

    $.ajax({
      type: "POST",
      url: '/cart/change.js',
      data: newItemData,
      dataType: 'json',
      success: function (cart) {

        // If this is the last ajax Call
        if (seqNumber === self.xhrCount) {

          var cartItemQuantity = 0;

          // Loop all cart items from the received cart object
          Object.keys(cart.items).forEach(function (itemKey, itemIndex) {

            // If this is the item that was updated
            if (cart.items[itemKey].id == newItemData.id) {

              // Store the new data for this item
              cartItemQuantity = cart.items[itemKey].quantity;
            }
          });

          // If item quantity was updated as expected
          if (cartItemQuantity == newItemData.quantity) {

            if ($.code.debug) {
              console.log('Cart update ' + seqNumber + ' success:', cart);
            }
            self.updateCart(cart);

            // If item quantity did not update, it's because there was not enough inventory
          } else {

            if ($.code.debug) {
              console.log('Cart update failed: ' + newItemData.id + ' expected quantity: ' + newItemData.quantity + ', but got: ' + cartItemQuantity);
            }

            // Add the product to trigger the default message from Shopify
            self.handleAddToCart('quantity=1&id=' + newItemData.id);
          }
        }
      },
      error: function (cart) {
        // If ( $.code.debug ) { console.log( 'Add to Cart always:', newItemData ); }
        if (seqNumber === self.xhrCount) {

          // Get the cart
          self.getCart(self.options.onAddShowCart);
        }
      }
    });
  };

  /**
   * Update the cart page and the ajax cart
   *
   * @return void
   * @access public
   */
  ajaxCart_plugin.prototype.updateCart = function (cart) {
    var self = this;

    // If we're on the cart page, with the cart-form still visible but no products in it (user removed the last product)
    if (window.location.href.indexOf('/cart') > -1 && $('#cartform').length && cart.item_count == 0) {

      // Reload the page to show the empty cart message
      window.location.reload(true);
      return;
    }

    // Update ajax cart
    self.updateAjaxCartProducts(cart.items);
    self.updateAjaxCartTotals(cart);
    self.updateAjaxCartActions(cart);

    // Update cart page
    self.updateCartProducts(cart.items);
    self.updateCartTotals(cart);
    self.updateCartIconQuantity(cart.item_count);
  };

  /**
   * Render the cart
   *
   * @return void
   * @access public
   */
  ajaxCart_plugin.prototype.getCart = function (openTheCart) {
    var self = this;

    Shopify.getCart(function (cart) {

      if ($.code.debug) {
        console.log('cartDrawer:', cart);
      }

      self.updateCart(cart);

      if (openTheCart) {
        self.openCart();
      }
    });
  };

  /**
   * Update the ajax cart products
   *
   * @return void
   * @access public
   */
  ajaxCart_plugin.prototype.updateAjaxCartProducts = function (cartProducts) {
    var self = this;

    self.$ajaxCartContainer__products.empty();

    $.each(cartProducts, function (i, productData) {

      // Clone the product template
      var $html = self.$ajaxCartTemplate__products.clone();

      // Fill the template with data
      var $product_html = self.fillTemplate($html, productData, self.options.cart_image_size);

      // Add product to container
      self.$ajaxCartContainer__products.append($product_html);
    });
  };

  /**
   * Update the cart page products
   *
   * @return void
   * @access public
   */
  ajaxCart_plugin.prototype.updateCartProducts = function (cartProducts) {
    var self = this;

    self.$cartContainer__products.find('[data-cart-line]').each(function () {

      var $row = $(this);
      var row_data = false;

      // Get row ID
      var rowId = $row.data('cart-line');

      // Get data for this row from cart data
      $.each(cartProducts, function (index, item_data) {
        if (item_data.variant_id == rowId) {
          row_data = item_data;
          return false;
        }
      });

      // Update row data
      if (row_data) {
        $row.find('[data-cart-drawer-quantity-value]').val(row_data.quantity);
        $row.find('[data-cart-drawer-template-element="line-price"]').html(Shopify.formatMoney(row_data.final_line_price));
        1

        // Disable -button when quantity = 1
        var isMinimum = row_data.quantity == 1;
        $row.find('[data-cart-drawer-quantity-modifier="-1"]').prop("disabled", isMinimum);

        // Product does not exist in cart
      } else {
        $row.remove();
      }
    });
  };

  /**
   * Update the ajax cart totals
   *
   * @return void
   * @access public
   */
  ajaxCart_plugin.prototype.updateAjaxCartTotals = function (cart) {
    var self = this;

    // Clone the total template
    var $html = self.$ajaxCartTemplate__totals.clone();

    // Fill the template with data
    var $ajax_cart_totals_html = self.fillTemplate($html, cart);

    // Render the Total
    self.$ajaxCartContainer__totals.empty().append($ajax_cart_totals_html);
  };

  /**
   * Update the ajax cart Actions
   *
   * @return void
   * @access public
   */
  ajaxCart_plugin.prototype.updateAjaxCartActions = function (cart) {
    var self = this;

    if (cart.item_count > 0) {
      self.$ajaxCartContainer__actions.show();
    } else {
      self.$ajaxCartContainer__actions.hide();
    }
  };

  /**
   * Update the cart page totals
   *
   * @return void
   * @access public
   */
  ajaxCart_plugin.prototype.updateCartTotals = function (cart) {
    var self = this;

    self.$cartContainer__totals.find('[data-cart-drawer-template-element="total"]').html(Shopify.formatMoney(cart.total_price));
    self.$cartContainer__totals.find('[data-cart-drawer-template-element="discounts"]').html(Shopify.formatMoney(cart.discounts));
  };

  /**
   * Open the cart
   *
   * @return void
   * @access public
   */
  ajaxCart_plugin.prototype.openCart = function ($el) {
    var self = this;

    // Open the dropdown
    self.$cartIconLink.toggleElementClass('addTheClass');
  };

  /**
   * cartDrawer plugin
   *
   * @return jQuery objects
   */
  $.fn.cartDrawer = function (options) {

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
        $element.data('plugin_' + _pluginName, new ajaxCart_plugin($element, options));
      } else {

        // If instance already created call method from plugin
        if (typeof options === 'string') {
          instance[options].apply(instance, args);
        }
      }
    });
  };

})(jQuery, document, window);
