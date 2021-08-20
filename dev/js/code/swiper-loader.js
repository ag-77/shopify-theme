/****************************************************************
 * CODE swiperLoader
 ****************************************************************/

!(function ($, document, window, undefined) {

  /**
   * Plugin name
   */
  var _pluginName = 'swiperLoader';

  /**
   * @param $element Element Wrapping container div
   * @param options Options passed to public functions
   * @return swiperLoader_plugin
   */
  var swiperLoader_plugin = function ($element, options) {

    // scope it
    var self = this;
    self.$element = $element;

    // Set default options, for more options check: https://idangero.us/swiper/api/
    var defaults = {
      loop: false,
      initialSlide: 0,    // Index number of initial slide.
      speed: 300,   // Duration of transition between slides (in ms)
      direction:	'horizontal',     // Could be 'horizontal' or 'vertical' (for vertical slider).
      autoHeight: false,    // Set to true and slider wrapper will adopt its height to the height of the currently active slide
      roundLengths: true,     // Set to true to round values of slides width and height to prevent blurry texts on usual resolution screens (if you have such)
      effect:	'slide',    // Transition effect. Could be "slide", "fade", "cube", "coverflow" or "flip"
      spaceBetween: 0,    // Distance between slides in px.
      slidesPerView: 1,     // Number of slides per view (slides visible at the same time on slider's container).
      centeredSlides: false,    // 	If true, then active slide will be centered, not always on the left side.
      centerInsufficientSlides: false,    // When enabled it center slides if the amount of slides less than `slidesPerView`. Not intended to be used loop mode
      grabCursor: false,    // This option may a little improve desktop usability. If true, user will see the "grab" cursor when hover on Swiper
      touchEventsTarget: 'wrapper',     // Target element to listen touch events on. Can be 'container' (to listen for touch events on swiper-container) or 'wrapper' (to listen for touch events on swiper-wrapper)
      watchOverflow: true,  // When enabled Swiper will be disabled and hide navigation buttons on case there are not enough slides for sliding
      shortSwipes: true, // Set to false if you want to disable short swipes
      threshold: 10, // Threshold value in px. If "touch distance" will be lower than this value then swiper will not move
      navigation: {
        nextEl: '.swiper-button-next',    //	string / HTMLElement	null	String with CSS selector or HTML element of the element that will work like "next" button after click on it
        prevEl: '.swiper-button-prev',	    // string / HTMLElement	null	String with CSS selector or HTML element of the element that will work like "prev" button after click on it
        hideOnClick: false,     //	Toggle navigation buttons visibility after click on Slider's container
        disabledClass: 'swiper-button-disabled',    // CSS class name added to navigation button when it becomes disabled
        hiddenClass: 'swiper-button-hidden',     // CSS class name added to navigation button when it becomes hidden
        nextText: "<svg role='img' xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 0 24 24' width='24'><path class='fill' d='M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z'></path></svg>",
        prevText: "<svg role='img' xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 0 24 24' width='24'><path class='fill' d='M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z'></path></svg>"
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',    //String with type of pagination. Can be "bullets", "fraction", "progressbar" or "custom"
        bulletElement:	'span',     //	Defines which HTML tag will be use to represent single pagination bullet. Only for bullets pagination type.
        hideOnClick:	false,    // Toggle (hide/true) pagination container visibility after click on Slider's container
        clickable: true     //	If true then clicking on pagination button will cause transition to appropriate slide. Only for bullets pagination type
      },
      scrollbar: {
        el: '.swiper-scrollbar',
        hide:	true,     //	Hide scrollbar automatically after user interaction
        draggable:	true,     //	Set to true to enable make scrollbar draggable that allows you to control slider position
        snapOnRelease:	true,     //	Set to false to unsnap slider position to slides when you release scrollbar
        dragSize:	'auto',     // string/number	Size of scrollbar draggable element in px
        lockClass: 'swiper-scrollbar-lock',     //	Scrollbar element additional CSS class when it is disabled
        dragClass: 'swiper-scrollbar-drag'    //	Scrollbar draggable element CSS class
      }
    };

    // get options from element
    var metaOptions = self.$element.data('swiper-options');
    self.options = $.extend({}, defaults, metaOptions, options);

    if ($.code.debug) {
      console.log('Init swiper:', self.$element, self.options);
    }

    self.$element.removeClass('row');
    self.$sliderContainer = self.$element.find('.swiper-container:first');

    // Add elements from options
    if (self.options.scrollbar) {
      self.$sliderContainer.append('<div class="swiper-scrollbar"></div>');
    }
    if (self.options.navigation) {
      self.$sliderContainer.append('<div class="swiper-button-prev">'+ self.options.navigation.prevText +'</div><div class="swiper-button-next">'+ self.options.navigation.nextText +'</div>');
    }
    if (self.options.pagination) {
      self.$sliderContainer.append('<div class="swiper-pagination"></div>');
    }

    // start the swiper
    self.swiperInst = new Swiper (self.$sliderContainer[0], self.options);

    // Custom next navigation (must be [data-swiper] > [data-swiper-nav="next"])
    self.$element.on('click', '[data-swiper-nav="next"]', function(){
      self.swiperInst.slideNext();
    });

    // Custom prev navigation (must be [data-swiper] > [data-swiper-nav="prev"])
    self.$element.on('click', '[data-swiper-nav="prev"]', function(){
      self.swiperInst.slidePrev();
    });

    // Prevent click bubbling on nav elements
    self.$element.on('click', '.swiper-button-prev, .swiper-button-next', function(event){
      event.stopPropagation();
    });
  };

  /**
   * Edit slide
   *
   * @return void
   * @access public
   */
  swiperLoader_plugin.prototype.editSlide = function ($slide) {

    var self = this;
    var index = $(self.swiperInst.slides).index($slide);
    self.goToSlide(index - 1);
  };

  /**
   * Go To slide
   *
   * @return void
   * @access public
   */
  swiperLoader_plugin.prototype.goToSlide = function (index, speed) {

    var self = this;

    // If no speed is defined, use the speed from options (speed can be 0)
    if ( !speed && speed !== 0 ) {
      speed = self.options.speed;
    }

    // slide to index
    if (self.options.loop) {
      self.swiperInst.slideToLoop(index, speed);
    } else {
      self.swiperInst.slideTo(index, speed);
    }
  };

  /**
   * swiperLoader plugin
   *
   * @return jQuery objects
   */
  $.fn.swiperLoader = function (options) {

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
        $element.data('plugin_' + _pluginName, new swiperLoader_plugin($element, options));
      } else {
        // if instance already created call method from plugin
        if (typeof options === 'string') {
          instance[options].apply(instance, args);
        }
      }
    });
  };

})(jQuery, document, window);
