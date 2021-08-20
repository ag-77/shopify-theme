function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/****************************************************************
 * Js imports
 ****************************************************************/

/*!
 * @name        easyzoom
 * @author       <>
 * @modified    Thursday, November 22nd, 2018
 * @version     2.5.2
 */
!function (t, e) {
  "use strict";

  "function" == typeof define && define.amd ? define(["jquery"], function (t) {
    e(t);
  }) : "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) && module.exports ? module.exports = t.EasyZoom = e(require("jquery")) : t.EasyZoom = e(t.jQuery);
}(this, function (i) {
  "use strict";

  var c,
      d,
      l,
      p,
      u,
      f,
      o = {
    loadingNotice: "Loading image",
    errorNotice: "The image could not be loaded",
    errorDuration: 2500,
    linkAttribute: "href",
    preventClicks: !0,
    beforeShow: i.noop,
    beforeHide: i.noop,
    onShow: i.noop,
    onHide: i.noop,
    onMove: i.noop
  };

  function s(t, e) {
    this.$target = i(t), this.opts = i.extend({}, o, e, this.$target.data()), void 0 === this.isOpen && this._init();
  }

  return s.prototype._init = function () {
    this.$link = this.$target.find("a"), this.$image = this.$target.find("img"), this.$flyout = i('<div class="easyzoom-flyout" />'), this.$notice = i('<div class="easyzoom-notice" />'), this.$target.on({
      "mousemove.easyzoom touchmove.easyzoom": i.proxy(this._onMove, this),
      "mouseleave.easyzoom touchend.easyzoom": i.proxy(this._onLeave, this),
      "mouseenter.easyzoom touchstart.easyzoom": i.proxy(this._onEnter, this)
    }), this.opts.preventClicks && this.$target.on("click.easyzoom", function (t) {
      t.preventDefault();
    });
  }, s.prototype.show = function (t, e) {
    var o = this;

    if (!1 !== this.opts.beforeShow.call(this)) {
      if (!this.isReady) return this._loadImage(this.$link.attr(this.opts.linkAttribute), function () {
        !o.isMouseOver && e || o.show(t);
      });
      this.$target.append(this.$flyout);
      var i = this.$target.outerWidth(),
          s = this.$target.outerHeight(),
          h = this.$flyout.width(),
          n = this.$flyout.height(),
          a = this.$zoom.width(),
          r = this.$zoom.height();
      (c = a - h) < 0 && (c = 0), (d = r - n) < 0 && (d = 0), l = c / i, p = d / s, this.isOpen = !0, this.opts.onShow.call(this), t && this._move(t);
    }
  }, s.prototype._onEnter = function (t) {
    var e = t.originalEvent.touches;
    this.isMouseOver = !0, e && 1 != e.length || (t.preventDefault(), this.show(t, !0));
  }, s.prototype._onMove = function (t) {
    this.isOpen && (t.preventDefault(), this._move(t));
  }, s.prototype._onLeave = function () {
    this.isMouseOver = !1, this.isOpen && this.hide();
  }, s.prototype._onLoad = function (t) {
    t.currentTarget.width && (this.isReady = !0, this.$notice.detach(), this.$flyout.html(this.$zoom), this.$target.removeClass("is-loading").addClass("is-ready"), t.data.call && t.data());
  }, s.prototype._onError = function () {
    var t = this;
    this.$notice.text(this.opts.errorNotice), this.$target.removeClass("is-loading").addClass("is-error"), this.detachNotice = setTimeout(function () {
      t.$notice.detach(), t.detachNotice = null;
    }, this.opts.errorDuration);
  }, s.prototype._loadImage = function (t, e) {
    var o = new Image();
    this.$target.addClass("is-loading").append(this.$notice.text(this.opts.loadingNotice)), this.$zoom = i(o).on("error", i.proxy(this._onError, this)).on("load", e, i.proxy(this._onLoad, this)), o.style.position = "absolute", o.src = t;
  }, s.prototype._move = function (t) {
    if (0 === t.type.indexOf("touch")) {
      var e = t.touches || t.originalEvent.touches;
      u = e[0].pageX, f = e[0].pageY;
    } else u = t.pageX || u, f = t.pageY || f;

    var o = this.$target.offset(),
        i = f - o.top,
        s = u - o.left,
        h = Math.ceil(i * p),
        n = Math.ceil(s * l);
    if (n < 0 || h < 0 || c < n || d < h) this.hide();else {
      var a = -1 * h,
          r = -1 * n;
      this.$zoom.css({
        top: a,
        left: r
      }), this.opts.onMove.call(this, a, r);
    }
  }, s.prototype.hide = function () {
    this.isOpen && !1 !== this.opts.beforeHide.call(this) && (this.$flyout.detach(), this.isOpen = !1, this.opts.onHide.call(this));
  }, s.prototype.swap = function (t, e, o) {
    this.hide(), this.isReady = !1, this.detachNotice && clearTimeout(this.detachNotice), this.$notice.parent().length && this.$notice.detach(), this.$target.removeClass("is-loading is-ready is-error"), this.$image.attr({
      src: t,
      srcset: i.isArray(o) ? o.join() : o
    }), this.$link.attr(this.opts.linkAttribute, e);
  }, s.prototype.teardown = function () {
    this.hide(), this.$target.off(".easyzoom").removeClass("is-loading is-ready is-error"), this.detachNotice && clearTimeout(this.detachNotice), delete this.$link, delete this.$zoom, delete this.$image, delete this.$notice, delete this.$flyout, delete this.isOpen, delete this.isReady;
  }, i.fn.easyZoom = function (e) {
    return this.each(function () {
      var t = i.data(this, "easyZoom");
      t ? void 0 === t.isOpen && t._init() : i.data(this, "easyZoom", new s(this, e));
    });
  }, s;
});
/* jQuery elevateZoom 3.0.8 - Demo's and documentation: - www.elevateweb.co.uk/image-zoom - Copyright (c) 2013 Andrew Eades - www.elevateweb.co.uk - Dual licensed under the LGPL licenses. - http://en.wikipedia.org/wiki/MIT_License - http://en.wikipedia.org/wiki/GNU_General_Public_License */

"function" !== typeof Object.create && (Object.create = function (d) {
  function h() {}

  h.prototype = d;
  return new h();
});

(function (d, h, l, m) {
  var k = {
    init: function init(b, a) {
      var c = this;
      c.elem = a;
      c.$elem = d(a);
      c.imageSrc = c.$elem.data("zoom-image") ? c.$elem.data("zoom-image") : c.$elem.attr("src");
      c.options = d.extend({}, d.fn.elevateZoom.options, b);
      c.options.tint && (c.options.lensColour = "none", c.options.lensOpacity = "1");
      "inner" == c.options.zoomType && (c.options.showLens = !1);
      c.$elem.parent().removeAttr("title").removeAttr("alt");
      c.zoomImage = c.imageSrc;
      c.refresh(1);
      d("#" + c.options.gallery + " a").click(function (a) {
        c.options.galleryActiveClass && (d("#" + c.options.gallery + " a").removeClass(c.options.galleryActiveClass), d(this).addClass(c.options.galleryActiveClass));
        a.preventDefault();
        d(this).data("zoom-image") ? c.zoomImagePre = d(this).data("zoom-image") : c.zoomImagePre = d(this).data("image");
        c.swaptheimage(d(this).data("image"), c.zoomImagePre);
        return !1;
      });
    },
    refresh: function refresh(b) {
      var a = this;
      setTimeout(function () {
        a.fetch(a.imageSrc);
      }, b || a.options.refresh);
    },
    fetch: function fetch(b) {
      var a = this,
          c = new Image();

      c.onload = function () {
        a.largeWidth = c.width;
        a.largeHeight = c.height;
        a.startZoom();
        a.currentImage = a.imageSrc;
        a.options.onZoomedImageLoaded(a.$elem);
      };

      c.src = b;
    },
    startZoom: function startZoom() {
      var b = this;
      b.nzWidth = b.$elem.width();
      b.nzHeight = b.$elem.height();
      b.isWindowActive = !1;
      b.isLensActive = !1;
      b.isTintActive = !1;
      b.overWindow = !1;
      b.options.imageCrossfade && (b.zoomWrap = b.$elem.wrap('<div style="height:' + b.nzHeight + "px;width:" + b.nzWidth + 'px;" class="zoomWrapper" />'), b.$elem.css("position", "absolute"));
      b.zoomLock = 1;
      b.scrollingLock = !1;
      b.changeBgSize = !1;
      b.currentZoomLevel = b.options.zoomLevel;
      b.nzOffset = b.$elem.offset();
      b.widthRatio = b.largeWidth / b.currentZoomLevel / b.nzWidth;
      b.heightRatio = b.largeHeight / b.currentZoomLevel / b.nzHeight;
      "window" == b.options.zoomType && (b.zoomWindowStyle = "overflow: hidden;background-position: 0px 0px;text-align:center;background-color: " + String(b.options.zoomWindowBgColour) + ";width: " + String(b.options.zoomWindowWidth) + "px;height: " + String(b.options.zoomWindowHeight) + "px;float: left;background-size: " + b.largeWidth / b.currentZoomLevel + "px " + b.largeHeight / b.currentZoomLevel + "px;display: none;z-index:100;border: " + String(b.options.borderSize) + "px solid " + b.options.borderColour + ";background-repeat: no-repeat;position: absolute;");

      if ("inner" == b.options.zoomType) {
        var a = b.$elem.css("border-left-width");
        b.zoomWindowStyle = "overflow: hidden;margin-left: " + String(a) + ";margin-top: " + String(a) + ";background-position: 0px 0px;width: " + String(b.nzWidth) + "px;height: " + String(b.nzHeight) + "px;float: left;display: none;cursor:" + b.options.cursor + ";px solid " + b.options.borderColour + ";background-repeat: no-repeat;position: absolute;";
      }

      "window" == b.options.zoomType && (lensHeight = b.nzHeight < b.options.zoomWindowWidth / b.widthRatio ? b.nzHeight : String(b.options.zoomWindowHeight / b.heightRatio), lensWidth = b.largeWidth < b.options.zoomWindowWidth ? b.nzWidth : b.options.zoomWindowWidth / b.widthRatio, b.lensStyle = "background-position: 0px 0px;width: " + String(b.options.zoomWindowWidth / b.widthRatio) + "px;height: " + String(b.options.zoomWindowHeight / b.heightRatio) + "px;float: right;display: none;overflow: hidden;z-index: 999;-webkit-transform: translateZ(0);opacity:" + b.options.lensOpacity + ";filter: alpha(opacity = " + 100 * b.options.lensOpacity + "); zoom:1;width:" + lensWidth + "px;height:" + lensHeight + "px;background-color:" + b.options.lensColour + ";cursor:" + b.options.cursor + ";border: " + b.options.lensBorderSize + "px solid " + b.options.lensBorderColour + ";background-repeat: no-repeat;position: absolute;");
      b.tintStyle = "display: block;position: absolute;background-color: " + b.options.tintColour + ";filter:alpha(opacity=0);opacity: 0;width: " + b.nzWidth + "px;height: " + b.nzHeight + "px;";
      b.lensRound = "";
      "lens" == b.options.zoomType && (b.lensStyle = "background-position: 0px 0px;float: left;display: none;border: " + String(b.options.borderSize) + "px solid " + b.options.borderColour + ";width:" + String(b.options.lensSize) + "px;height:" + String(b.options.lensSize) + "px;background-repeat: no-repeat;position: absolute;");
      "round" == b.options.lensShape && (b.lensRound = "border-top-left-radius: " + String(b.options.lensSize / 2 + b.options.borderSize) + "px;border-top-right-radius: " + String(b.options.lensSize / 2 + b.options.borderSize) + "px;border-bottom-left-radius: " + String(b.options.lensSize / 2 + b.options.borderSize) + "px;border-bottom-right-radius: " + String(b.options.lensSize / 2 + b.options.borderSize) + "px;");
      b.zoomContainer = d('<div class="zoomContainer" style="-webkit-transform: translateZ(0);position:absolute;left:' + b.nzOffset.left + "px;top:" + b.nzOffset.top + "px;height:" + b.nzHeight + "px;width:" + b.nzWidth + 'px;"></div>');
      d("body").append(b.zoomContainer);
      b.options.containLensZoom && "lens" == b.options.zoomType && b.zoomContainer.css("overflow", "hidden");
      "inner" != b.options.zoomType && (b.zoomLens = d("<div class='zoomLens' style='" + b.lensStyle + b.lensRound + "'>&nbsp;</div>").appendTo(b.zoomContainer).click(function () {
        b.$elem.trigger("click");
      }), b.options.tint && (b.tintContainer = d("<div/>").addClass("tintContainer"), b.zoomTint = d("<div class='zoomTint' style='" + b.tintStyle + "'></div>"), b.zoomLens.wrap(b.tintContainer), b.zoomTintcss = b.zoomLens.after(b.zoomTint), b.zoomTintImage = d('<img style="position: absolute; left: 0px; top: 0px; max-width: none; width: ' + b.nzWidth + "px; height: " + b.nzHeight + 'px;" src="' + b.imageSrc + '">').appendTo(b.zoomLens).click(function () {
        b.$elem.trigger("click");
      })));
      isNaN(b.options.zoomWindowPosition) ? b.zoomWindow = d("<div style='z-index:999;left:" + b.windowOffsetLeft + "px;top:" + b.windowOffsetTop + "px;" + b.zoomWindowStyle + "' class='zoomWindow'>&nbsp;</div>").appendTo("body").click(function () {
        b.$elem.trigger("click");
      }) : b.zoomWindow = d("<div style='z-index:999;left:" + b.windowOffsetLeft + "px;top:" + b.windowOffsetTop + "px;" + b.zoomWindowStyle + "' class='zoomWindow'>&nbsp;</div>").appendTo(b.zoomContainer).click(function () {
        b.$elem.trigger("click");
      });
      b.zoomWindowContainer = d("<div/>").addClass("zoomWindowContainer").css("width", b.options.zoomWindowWidth);
      b.zoomWindow.wrap(b.zoomWindowContainer);
      "lens" == b.options.zoomType && b.zoomLens.css({
        backgroundImage: "url('" + b.imageSrc + "')"
      });
      "window" == b.options.zoomType && b.zoomWindow.css({
        backgroundImage: "url('" + b.imageSrc + "')"
      });
      "inner" == b.options.zoomType && b.zoomWindow.css({
        backgroundImage: "url('" + b.imageSrc + "')"
      });
      b.$elem.bind("touchmove", function (a) {
        a.preventDefault();
        b.setPosition(a.originalEvent.touches[0] || a.originalEvent.changedTouches[0]);
      });
      b.zoomContainer.bind("touchmove", function (a) {
        "inner" == b.options.zoomType && b.showHideWindow("show");
        a.preventDefault();
        b.setPosition(a.originalEvent.touches[0] || a.originalEvent.changedTouches[0]);
      });
      b.zoomContainer.bind("touchend", function (a) {
        b.showHideWindow("hide");
        b.options.showLens && b.showHideLens("hide");
        b.options.tint && "inner" != b.options.zoomType && b.showHideTint("hide");
      });
      b.$elem.bind("touchend", function (a) {
        b.showHideWindow("hide");
        b.options.showLens && b.showHideLens("hide");
        b.options.tint && "inner" != b.options.zoomType && b.showHideTint("hide");
      });
      b.options.showLens && (b.zoomLens.bind("touchmove", function (a) {
        a.preventDefault();
        b.setPosition(a.originalEvent.touches[0] || a.originalEvent.changedTouches[0]);
      }), b.zoomLens.bind("touchend", function (a) {
        b.showHideWindow("hide");
        b.options.showLens && b.showHideLens("hide");
        b.options.tint && "inner" != b.options.zoomType && b.showHideTint("hide");
      }));
      b.$elem.bind("mousemove", function (a) {
        !1 == b.overWindow && b.setElements("show");
        if (b.lastX !== a.clientX || b.lastY !== a.clientY) b.setPosition(a), b.currentLoc = a;
        b.lastX = a.clientX;
        b.lastY = a.clientY;
      });
      b.zoomContainer.bind("mousemove", function (a) {
        !1 == b.overWindow && b.setElements("show");
        if (b.lastX !== a.clientX || b.lastY !== a.clientY) b.setPosition(a), b.currentLoc = a;
        b.lastX = a.clientX;
        b.lastY = a.clientY;
      });
      "inner" != b.options.zoomType && b.zoomLens.bind("mousemove", function (a) {
        if (b.lastX !== a.clientX || b.lastY !== a.clientY) b.setPosition(a), b.currentLoc = a;
        b.lastX = a.clientX;
        b.lastY = a.clientY;
      });
      b.options.tint && "inner" != b.options.zoomType && b.zoomTint.bind("mousemove", function (a) {
        if (b.lastX !== a.clientX || b.lastY !== a.clientY) b.setPosition(a), b.currentLoc = a;
        b.lastX = a.clientX;
        b.lastY = a.clientY;
      });
      "inner" == b.options.zoomType && b.zoomWindow.bind("mousemove", function (a) {
        if (b.lastX !== a.clientX || b.lastY !== a.clientY) b.setPosition(a), b.currentLoc = a;
        b.lastX = a.clientX;
        b.lastY = a.clientY;
      });
      b.zoomContainer.add(b.$elem).mouseenter(function () {
        !1 == b.overWindow && b.setElements("show");
      }).mouseleave(function () {
        b.scrollLock || b.setElements("hide");
      });
      "inner" != b.options.zoomType && b.zoomWindow.mouseenter(function () {
        b.overWindow = !0;
        b.setElements("hide");
      }).mouseleave(function () {
        b.overWindow = !1;
      });
      b.minZoomLevel = b.options.minZoomLevel ? b.options.minZoomLevel : 2 * b.options.scrollZoomIncrement;
      b.options.scrollZoom && b.zoomContainer.add(b.$elem).bind("mousewheel DOMMouseScroll MozMousePixelScroll", function (a) {
        b.scrollLock = !0;
        clearTimeout(d.data(this, "timer"));
        d.data(this, "timer", setTimeout(function () {
          b.scrollLock = !1;
        }, 250));
        var e = a.originalEvent.wheelDelta || -1 * a.originalEvent.detail;
        a.stopImmediatePropagation();
        a.stopPropagation();
        a.preventDefault();
        0 < e / 120 ? b.currentZoomLevel >= b.minZoomLevel && b.changeZoomLevel(b.currentZoomLevel - b.options.scrollZoomIncrement) : b.options.maxZoomLevel ? b.currentZoomLevel <= b.options.maxZoomLevel && b.changeZoomLevel(parseFloat(b.currentZoomLevel) + b.options.scrollZoomIncrement) : b.changeZoomLevel(parseFloat(b.currentZoomLevel) + b.options.scrollZoomIncrement);
        return !1;
      });
    },
    setElements: function setElements(b) {
      if (!this.options.zoomEnabled) return !1;
      "show" == b && this.isWindowSet && ("inner" == this.options.zoomType && this.showHideWindow("show"), "window" == this.options.zoomType && this.showHideWindow("show"), this.options.showLens && this.showHideLens("show"), this.options.tint && "inner" != this.options.zoomType && this.showHideTint("show"));
      "hide" == b && ("window" == this.options.zoomType && this.showHideWindow("hide"), this.options.tint || this.showHideWindow("hide"), this.options.showLens && this.showHideLens("hide"), this.options.tint && this.showHideTint("hide"));
    },
    setPosition: function setPosition(b) {
      if (!this.options.zoomEnabled) return !1;
      this.nzHeight = this.$elem.height();
      this.nzWidth = this.$elem.width();
      this.nzOffset = this.$elem.offset();
      this.options.tint && "inner" != this.options.zoomType && (this.zoomTint.css({
        top: 0
      }), this.zoomTint.css({
        left: 0
      }));
      this.options.responsive && !this.options.scrollZoom && this.options.showLens && (lensHeight = this.nzHeight < this.options.zoomWindowWidth / this.widthRatio ? this.nzHeight : String(this.options.zoomWindowHeight / this.heightRatio), lensWidth = this.largeWidth < this.options.zoomWindowWidth ? this.nzWidth : this.options.zoomWindowWidth / this.widthRatio, this.widthRatio = this.largeWidth / this.nzWidth, this.heightRatio = this.largeHeight / this.nzHeight, "lens" != this.options.zoomType && (lensHeight = this.nzHeight < this.options.zoomWindowWidth / this.widthRatio ? this.nzHeight : String(this.options.zoomWindowHeight / this.heightRatio), lensWidth = this.options.zoomWindowWidth < this.options.zoomWindowWidth ? this.nzWidth : this.options.zoomWindowWidth / this.widthRatio, this.zoomLens.css("width", lensWidth), this.zoomLens.css("height", lensHeight), this.options.tint && (this.zoomTintImage.css("width", this.nzWidth), this.zoomTintImage.css("height", this.nzHeight))), "lens" == this.options.zoomType && this.zoomLens.css({
        width: String(this.options.lensSize) + "px",
        height: String(this.options.lensSize) + "px"
      }));
      this.zoomContainer.css({
        top: this.nzOffset.top
      });
      this.zoomContainer.css({
        left: this.nzOffset.left
      });
      this.mouseLeft = parseInt(b.pageX - this.nzOffset.left);
      this.mouseTop = parseInt(b.pageY - this.nzOffset.top);
      "window" == this.options.zoomType && (this.Etoppos = this.mouseTop < this.zoomLens.height() / 2, this.Eboppos = this.mouseTop > this.nzHeight - this.zoomLens.height() / 2 - 2 * this.options.lensBorderSize, this.Eloppos = this.mouseLeft < 0 + this.zoomLens.width() / 2, this.Eroppos = this.mouseLeft > this.nzWidth - this.zoomLens.width() / 2 - 2 * this.options.lensBorderSize);
      "inner" == this.options.zoomType && (this.Etoppos = this.mouseTop < this.nzHeight / 2 / this.heightRatio, this.Eboppos = this.mouseTop > this.nzHeight - this.nzHeight / 2 / this.heightRatio, this.Eloppos = this.mouseLeft < 0 + this.nzWidth / 2 / this.widthRatio, this.Eroppos = this.mouseLeft > this.nzWidth - this.nzWidth / 2 / this.widthRatio - 2 * this.options.lensBorderSize);
      0 >= this.mouseLeft || 0 > this.mouseTop || this.mouseLeft > this.nzWidth || this.mouseTop > this.nzHeight ? this.setElements("hide") : (this.options.showLens && (this.lensLeftPos = String(this.mouseLeft - this.zoomLens.width() / 2), this.lensTopPos = String(this.mouseTop - this.zoomLens.height() / 2)), this.Etoppos && (this.lensTopPos = 0), this.Eloppos && (this.tintpos = this.lensLeftPos = this.windowLeftPos = 0), "window" == this.options.zoomType && (this.Eboppos && (this.lensTopPos = Math.max(this.nzHeight - this.zoomLens.height() - 2 * this.options.lensBorderSize, 0)), this.Eroppos && (this.lensLeftPos = this.nzWidth - this.zoomLens.width() - 2 * this.options.lensBorderSize)), "inner" == this.options.zoomType && (this.Eboppos && (this.lensTopPos = Math.max(this.nzHeight - 2 * this.options.lensBorderSize, 0)), this.Eroppos && (this.lensLeftPos = this.nzWidth - this.nzWidth - 2 * this.options.lensBorderSize)), "lens" == this.options.zoomType && (this.windowLeftPos = String(-1 * ((b.pageX - this.nzOffset.left) * this.widthRatio - this.zoomLens.width() / 2)), this.windowTopPos = String(-1 * ((b.pageY - this.nzOffset.top) * this.heightRatio - this.zoomLens.height() / 2)), this.zoomLens.css({
        backgroundPosition: this.windowLeftPos + "px " + this.windowTopPos + "px"
      }), this.changeBgSize && (this.nzHeight > this.nzWidth ? ("lens" == this.options.zoomType && this.zoomLens.css({
        "background-size": this.largeWidth / this.newvalueheight + "px " + this.largeHeight / this.newvalueheight + "px"
      }), this.zoomWindow.css({
        "background-size": this.largeWidth / this.newvalueheight + "px " + this.largeHeight / this.newvalueheight + "px"
      })) : ("lens" == this.options.zoomType && this.zoomLens.css({
        "background-size": this.largeWidth / this.newvaluewidth + "px " + this.largeHeight / this.newvaluewidth + "px"
      }), this.zoomWindow.css({
        "background-size": this.largeWidth / this.newvaluewidth + "px " + this.largeHeight / this.newvaluewidth + "px"
      })), this.changeBgSize = !1), this.setWindowPostition(b)), this.options.tint && "inner" != this.options.zoomType && this.setTintPosition(b), "window" == this.options.zoomType && this.setWindowPostition(b), "inner" == this.options.zoomType && this.setWindowPostition(b), this.options.showLens && (this.fullwidth && "lens" != this.options.zoomType && (this.lensLeftPos = 0), this.zoomLens.css({
        left: this.lensLeftPos + "px",
        top: this.lensTopPos + "px"
      })));
    },
    showHideWindow: function showHideWindow(b) {
      "show" != b || this.isWindowActive || (this.options.zoomWindowFadeIn ? this.zoomWindow.stop(!0, !0, !1).fadeIn(this.options.zoomWindowFadeIn) : this.zoomWindow.show(), this.isWindowActive = !0);
      "hide" == b && this.isWindowActive && (this.options.zoomWindowFadeOut ? this.zoomWindow.stop(!0, !0).fadeOut(this.options.zoomWindowFadeOut) : this.zoomWindow.hide(), this.isWindowActive = !1);
    },
    showHideLens: function showHideLens(b) {
      "show" != b || this.isLensActive || (this.options.lensFadeIn ? this.zoomLens.stop(!0, !0, !1).fadeIn(this.options.lensFadeIn) : this.zoomLens.show(), this.isLensActive = !0);
      "hide" == b && this.isLensActive && (this.options.lensFadeOut ? this.zoomLens.stop(!0, !0).fadeOut(this.options.lensFadeOut) : this.zoomLens.hide(), this.isLensActive = !1);
    },
    showHideTint: function showHideTint(b) {
      "show" != b || this.isTintActive || (this.options.zoomTintFadeIn ? this.zoomTint.css({
        opacity: this.options.tintOpacity
      }).animate().stop(!0, !0).fadeIn("slow") : (this.zoomTint.css({
        opacity: this.options.tintOpacity
      }).animate(), this.zoomTint.show()), this.isTintActive = !0);
      "hide" == b && this.isTintActive && (this.options.zoomTintFadeOut ? this.zoomTint.stop(!0, !0).fadeOut(this.options.zoomTintFadeOut) : this.zoomTint.hide(), this.isTintActive = !1);
    },
    setLensPostition: function setLensPostition(b) {},
    setWindowPostition: function setWindowPostition(b) {
      var a = this;
      if (isNaN(a.options.zoomWindowPosition)) a.externalContainer = d("#" + a.options.zoomWindowPosition), a.externalContainerWidth = a.externalContainer.width(), a.externalContainerHeight = a.externalContainer.height(), a.externalContainerOffset = a.externalContainer.offset(), a.windowOffsetTop = a.externalContainerOffset.top, a.windowOffsetLeft = a.externalContainerOffset.left;else switch (a.options.zoomWindowPosition) {
        case 1:
          a.windowOffsetTop = a.options.zoomWindowOffety;
          a.windowOffsetLeft = +a.nzWidth;
          break;

        case 2:
          a.options.zoomWindowHeight > a.nzHeight && (a.windowOffsetTop = -1 * (a.options.zoomWindowHeight / 2 - a.nzHeight / 2), a.windowOffsetLeft = a.nzWidth);
          break;

        case 3:
          a.windowOffsetTop = a.nzHeight - a.zoomWindow.height() - 2 * a.options.borderSize;
          a.windowOffsetLeft = a.nzWidth;
          break;

        case 4:
          a.windowOffsetTop = a.nzHeight;
          a.windowOffsetLeft = a.nzWidth;
          break;

        case 5:
          a.windowOffsetTop = a.nzHeight;
          a.windowOffsetLeft = a.nzWidth - a.zoomWindow.width() - 2 * a.options.borderSize;
          break;

        case 6:
          a.options.zoomWindowHeight > a.nzHeight && (a.windowOffsetTop = a.nzHeight, a.windowOffsetLeft = -1 * (a.options.zoomWindowWidth / 2 - a.nzWidth / 2 + 2 * a.options.borderSize));
          break;

        case 7:
          a.windowOffsetTop = a.nzHeight;
          a.windowOffsetLeft = 0;
          break;

        case 8:
          a.windowOffsetTop = a.nzHeight;
          a.windowOffsetLeft = -1 * (a.zoomWindow.width() + 2 * a.options.borderSize);
          break;

        case 9:
          a.windowOffsetTop = a.nzHeight - a.zoomWindow.height() - 2 * a.options.borderSize;
          a.windowOffsetLeft = -1 * (a.zoomWindow.width() + 2 * a.options.borderSize);
          break;

        case 10:
          a.options.zoomWindowHeight > a.nzHeight && (a.windowOffsetTop = -1 * (a.options.zoomWindowHeight / 2 - a.nzHeight / 2), a.windowOffsetLeft = -1 * (a.zoomWindow.width() + 2 * a.options.borderSize));
          break;

        case 11:
          a.windowOffsetTop = a.options.zoomWindowOffety;
          a.windowOffsetLeft = -1 * (a.zoomWindow.width() + 2 * a.options.borderSize);
          break;

        case 12:
          a.windowOffsetTop = -1 * (a.zoomWindow.height() + 2 * a.options.borderSize);
          a.windowOffsetLeft = -1 * (a.zoomWindow.width() + 2 * a.options.borderSize);
          break;

        case 13:
          a.windowOffsetTop = -1 * (a.zoomWindow.height() + 2 * a.options.borderSize);
          a.windowOffsetLeft = 0;
          break;

        case 14:
          a.options.zoomWindowHeight > a.nzHeight && (a.windowOffsetTop = -1 * (a.zoomWindow.height() + 2 * a.options.borderSize), a.windowOffsetLeft = -1 * (a.options.zoomWindowWidth / 2 - a.nzWidth / 2 + 2 * a.options.borderSize));
          break;

        case 15:
          a.windowOffsetTop = -1 * (a.zoomWindow.height() + 2 * a.options.borderSize);
          a.windowOffsetLeft = a.nzWidth - a.zoomWindow.width() - 2 * a.options.borderSize;
          break;

        case 16:
          a.windowOffsetTop = -1 * (a.zoomWindow.height() + 2 * a.options.borderSize);
          a.windowOffsetLeft = a.nzWidth;
          break;

        default:
          a.windowOffsetTop = a.options.zoomWindowOffety, a.windowOffsetLeft = a.nzWidth;
      }
      a.isWindowSet = !0;
      a.windowOffsetTop += a.options.zoomWindowOffety;
      a.windowOffsetLeft += a.options.zoomWindowOffetx;
      a.zoomWindow.css({
        top: a.windowOffsetTop
      });
      a.zoomWindow.css({
        left: a.windowOffsetLeft
      });
      "inner" == a.options.zoomType && (a.zoomWindow.css({
        top: 0
      }), a.zoomWindow.css({
        left: 0
      }));
      a.windowLeftPos = String(-1 * ((b.pageX - a.nzOffset.left) * a.widthRatio - a.zoomWindow.width() / 2));
      a.windowTopPos = String(-1 * ((b.pageY - a.nzOffset.top) * a.heightRatio - a.zoomWindow.height() / 2));
      a.Etoppos && (a.windowTopPos = 0);
      a.Eloppos && (a.windowLeftPos = 0);
      a.Eboppos && (a.windowTopPos = -1 * (a.largeHeight / a.currentZoomLevel - a.zoomWindow.height()));
      a.Eroppos && (a.windowLeftPos = -1 * (a.largeWidth / a.currentZoomLevel - a.zoomWindow.width()));
      a.fullheight && (a.windowTopPos = 0);
      a.fullwidth && (a.windowLeftPos = 0);
      if ("window" == a.options.zoomType || "inner" == a.options.zoomType) 1 == a.zoomLock && (1 >= a.widthRatio && (a.windowLeftPos = 0), 1 >= a.heightRatio && (a.windowTopPos = 0)), a.largeHeight < a.options.zoomWindowHeight && (a.windowTopPos = 0), a.largeWidth < a.options.zoomWindowWidth && (a.windowLeftPos = 0), a.options.easing ? (a.xp || (a.xp = 0), a.yp || (a.yp = 0), a.loop || (a.loop = setInterval(function () {
        a.xp += (a.windowLeftPos - a.xp) / a.options.easingAmount;
        a.yp += (a.windowTopPos - a.yp) / a.options.easingAmount;
        a.scrollingLock ? (clearInterval(a.loop), a.xp = a.windowLeftPos, a.yp = a.windowTopPos, a.xp = -1 * ((b.pageX - a.nzOffset.left) * a.widthRatio - a.zoomWindow.width() / 2), a.yp = -1 * ((b.pageY - a.nzOffset.top) * a.heightRatio - a.zoomWindow.height() / 2), a.changeBgSize && (a.nzHeight > a.nzWidth ? ("lens" == a.options.zoomType && a.zoomLens.css({
          "background-size": a.largeWidth / a.newvalueheight + "px " + a.largeHeight / a.newvalueheight + "px"
        }), a.zoomWindow.css({
          "background-size": a.largeWidth / a.newvalueheight + "px " + a.largeHeight / a.newvalueheight + "px"
        })) : ("lens" != a.options.zoomType && a.zoomLens.css({
          "background-size": a.largeWidth / a.newvaluewidth + "px " + a.largeHeight / a.newvalueheight + "px"
        }), a.zoomWindow.css({
          "background-size": a.largeWidth / a.newvaluewidth + "px " + a.largeHeight / a.newvaluewidth + "px"
        })), a.changeBgSize = !1), a.zoomWindow.css({
          backgroundPosition: a.windowLeftPos + "px " + a.windowTopPos + "px"
        }), a.scrollingLock = !1, a.loop = !1) : (a.changeBgSize && (a.nzHeight > a.nzWidth ? ("lens" == a.options.zoomType && a.zoomLens.css({
          "background-size": a.largeWidth / a.newvalueheight + "px " + a.largeHeight / a.newvalueheight + "px"
        }), a.zoomWindow.css({
          "background-size": a.largeWidth / a.newvalueheight + "px " + a.largeHeight / a.newvalueheight + "px"
        })) : ("lens" != a.options.zoomType && a.zoomLens.css({
          "background-size": a.largeWidth / a.newvaluewidth + "px " + a.largeHeight / a.newvaluewidth + "px"
        }), a.zoomWindow.css({
          "background-size": a.largeWidth / a.newvaluewidth + "px " + a.largeHeight / a.newvaluewidth + "px"
        })), a.changeBgSize = !1), a.zoomWindow.css({
          backgroundPosition: a.xp + "px " + a.yp + "px"
        }));
      }, 16))) : (a.changeBgSize && (a.nzHeight > a.nzWidth ? ("lens" == a.options.zoomType && a.zoomLens.css({
        "background-size": a.largeWidth / a.newvalueheight + "px " + a.largeHeight / a.newvalueheight + "px"
      }), a.zoomWindow.css({
        "background-size": a.largeWidth / a.newvalueheight + "px " + a.largeHeight / a.newvalueheight + "px"
      })) : ("lens" == a.options.zoomType && a.zoomLens.css({
        "background-size": a.largeWidth / a.newvaluewidth + "px " + a.largeHeight / a.newvaluewidth + "px"
      }), a.largeHeight / a.newvaluewidth < a.options.zoomWindowHeight ? a.zoomWindow.css({
        "background-size": a.largeWidth / a.newvaluewidth + "px " + a.largeHeight / a.newvaluewidth + "px"
      }) : a.zoomWindow.css({
        "background-size": a.largeWidth / a.newvalueheight + "px " + a.largeHeight / a.newvalueheight + "px"
      })), a.changeBgSize = !1), a.zoomWindow.css({
        backgroundPosition: a.windowLeftPos + "px " + a.windowTopPos + "px"
      }));
    },
    setTintPosition: function setTintPosition(b) {
      this.nzOffset = this.$elem.offset();
      this.tintpos = String(-1 * (b.pageX - this.nzOffset.left - this.zoomLens.width() / 2));
      this.tintposy = String(-1 * (b.pageY - this.nzOffset.top - this.zoomLens.height() / 2));
      this.Etoppos && (this.tintposy = 0);
      this.Eloppos && (this.tintpos = 0);
      this.Eboppos && (this.tintposy = -1 * (this.nzHeight - this.zoomLens.height() - 2 * this.options.lensBorderSize));
      this.Eroppos && (this.tintpos = -1 * (this.nzWidth - this.zoomLens.width() - 2 * this.options.lensBorderSize));
      this.options.tint && (this.fullheight && (this.tintposy = 0), this.fullwidth && (this.tintpos = 0), this.zoomTintImage.css({
        left: this.tintpos + "px"
      }), this.zoomTintImage.css({
        top: this.tintposy + "px"
      }));
    },
    swaptheimage: function swaptheimage(b, a) {
      var c = this,
          e = new Image();
      c.options.loadingIcon && (c.spinner = d("<div style=\"background: url('" + c.options.loadingIcon + "') no-repeat center;height:" + c.nzHeight + "px;width:" + c.nzWidth + 'px;z-index: 2000;position: absolute; background-position: center center;"></div>'), c.$elem.after(c.spinner));
      c.options.onImageSwap(c.$elem);

      e.onload = function () {
        c.largeWidth = e.width;
        c.largeHeight = e.height;
        c.zoomImage = a;
        c.zoomWindow.css({
          "background-size": c.largeWidth + "px " + c.largeHeight + "px"
        });
        c.zoomWindow.css({
          "background-size": c.largeWidth + "px " + c.largeHeight + "px"
        });
        c.swapAction(b, a);
      };

      e.src = a;
    },
    swapAction: function swapAction(b, a) {
      var c = this,
          e = new Image();

      e.onload = function () {
        c.nzHeight = e.height;
        c.nzWidth = e.width;
        c.options.onImageSwapComplete(c.$elem);
        c.doneCallback();
      };

      e.src = b;
      c.currentZoomLevel = c.options.zoomLevel;
      c.options.maxZoomLevel = !1;
      "lens" == c.options.zoomType && c.zoomLens.css({
        backgroundImage: "url('" + a + "')"
      });
      "window" == c.options.zoomType && c.zoomWindow.css({
        backgroundImage: "url('" + a + "')"
      });
      "inner" == c.options.zoomType && c.zoomWindow.css({
        backgroundImage: "url('" + a + "')"
      });
      c.currentImage = a;

      if (c.options.imageCrossfade) {
        var f = c.$elem,
            g = f.clone();
        c.$elem.attr("src", b);
        c.$elem.after(g);
        g.stop(!0).fadeOut(c.options.imageCrossfade, function () {
          d(this).remove();
        });
        c.$elem.width("auto").removeAttr("width");
        c.$elem.height("auto").removeAttr("height");
        f.fadeIn(c.options.imageCrossfade);
        c.options.tint && "inner" != c.options.zoomType && (f = c.zoomTintImage, g = f.clone(), c.zoomTintImage.attr("src", a), c.zoomTintImage.after(g), g.stop(!0).fadeOut(c.options.imageCrossfade, function () {
          d(this).remove();
        }), f.fadeIn(c.options.imageCrossfade), c.zoomTint.css({
          height: c.$elem.height()
        }), c.zoomTint.css({
          width: c.$elem.width()
        }));
        c.zoomContainer.css("height", c.$elem.height());
        c.zoomContainer.css("width", c.$elem.width());
        "inner" != c.options.zoomType || c.options.constrainType || (c.zoomWrap.parent().css("height", c.$elem.height()), c.zoomWrap.parent().css("width", c.$elem.width()), c.zoomWindow.css("height", c.$elem.height()), c.zoomWindow.css("width", c.$elem.width()));
      } else c.$elem.attr("src", b), c.options.tint && (c.zoomTintImage.attr("src", a), c.zoomTintImage.attr("height", c.$elem.height()), c.zoomTintImage.css({
        height: c.$elem.height()
      }), c.zoomTint.css({
        height: c.$elem.height()
      })), c.zoomContainer.css("height", c.$elem.height()), c.zoomContainer.css("width", c.$elem.width());

      c.options.imageCrossfade && (c.zoomWrap.css("height", c.$elem.height()), c.zoomWrap.css("width", c.$elem.width()));
      c.options.constrainType && ("height" == c.options.constrainType && (c.zoomContainer.css("height", c.options.constrainSize), c.zoomContainer.css("width", "auto"), c.options.imageCrossfade ? (c.zoomWrap.css("height", c.options.constrainSize), c.zoomWrap.css("width", "auto"), c.constwidth = c.zoomWrap.width()) : (c.$elem.css("height", c.options.constrainSize), c.$elem.css("width", "auto"), c.constwidth = c.$elem.width()), "inner" == c.options.zoomType && (c.zoomWrap.parent().css("height", c.options.constrainSize), c.zoomWrap.parent().css("width", c.constwidth), c.zoomWindow.css("height", c.options.constrainSize), c.zoomWindow.css("width", c.constwidth)), c.options.tint && (c.tintContainer.css("height", c.options.constrainSize), c.tintContainer.css("width", c.constwidth), c.zoomTint.css("height", c.options.constrainSize), c.zoomTint.css("width", c.constwidth), c.zoomTintImage.css("height", c.options.constrainSize), c.zoomTintImage.css("width", c.constwidth))), "width" == c.options.constrainType && (c.zoomContainer.css("height", "auto"), c.zoomContainer.css("width", c.options.constrainSize), c.options.imageCrossfade ? (c.zoomWrap.css("height", "auto"), c.zoomWrap.css("width", c.options.constrainSize), c.constheight = c.zoomWrap.height()) : (c.$elem.css("height", "auto"), c.$elem.css("width", c.options.constrainSize), c.constheight = c.$elem.height()), "inner" == c.options.zoomType && (c.zoomWrap.parent().css("height", c.constheight), c.zoomWrap.parent().css("width", c.options.constrainSize), c.zoomWindow.css("height", c.constheight), c.zoomWindow.css("width", c.options.constrainSize)), c.options.tint && (c.tintContainer.css("height", c.constheight), c.tintContainer.css("width", c.options.constrainSize), c.zoomTint.css("height", c.constheight), c.zoomTint.css("width", c.options.constrainSize), c.zoomTintImage.css("height", c.constheight), c.zoomTintImage.css("width", c.options.constrainSize))));
    },
    doneCallback: function doneCallback() {
      this.options.loadingIcon && this.spinner.hide();
      this.nzOffset = this.$elem.offset();
      this.nzWidth = this.$elem.width();
      this.nzHeight = this.$elem.height();
      this.currentZoomLevel = this.options.zoomLevel;
      this.widthRatio = this.largeWidth / this.nzWidth;
      this.heightRatio = this.largeHeight / this.nzHeight;
      "window" == this.options.zoomType && (lensHeight = this.nzHeight < this.options.zoomWindowWidth / this.widthRatio ? this.nzHeight : String(this.options.zoomWindowHeight / this.heightRatio), lensWidth = this.options.zoomWindowWidth < this.options.zoomWindowWidth ? this.nzWidth : this.options.zoomWindowWidth / this.widthRatio, this.zoomLens && (this.zoomLens.css("width", lensWidth), this.zoomLens.css("height", lensHeight)));
    },
    getCurrentImage: function getCurrentImage() {
      return this.zoomImage;
    },
    getGalleryList: function getGalleryList() {
      var b = this;
      b.gallerylist = [];
      b.options.gallery ? d("#" + b.options.gallery + " a").each(function () {
        var a = "";
        d(this).data("zoom-image") ? a = d(this).data("zoom-image") : d(this).data("image") && (a = d(this).data("image"));
        a == b.zoomImage ? b.gallerylist.unshift({
          href: "" + a + "",
          title: d(this).find("img").attr("title")
        }) : b.gallerylist.push({
          href: "" + a + "",
          title: d(this).find("img").attr("title")
        });
      }) : b.gallerylist.push({
        href: "" + b.zoomImage + "",
        title: d(this).find("img").attr("title")
      });
      return b.gallerylist;
    },
    changeZoomLevel: function changeZoomLevel(b) {
      this.scrollingLock = !0;
      this.newvalue = parseFloat(b).toFixed(2);
      newvalue = parseFloat(b).toFixed(2);
      maxheightnewvalue = this.largeHeight / (this.options.zoomWindowHeight / this.nzHeight * this.nzHeight);
      maxwidthtnewvalue = this.largeWidth / (this.options.zoomWindowWidth / this.nzWidth * this.nzWidth);
      "inner" != this.options.zoomType && (maxheightnewvalue <= newvalue ? (this.heightRatio = this.largeHeight / maxheightnewvalue / this.nzHeight, this.newvalueheight = maxheightnewvalue, this.fullheight = !0) : (this.heightRatio = this.largeHeight / newvalue / this.nzHeight, this.newvalueheight = newvalue, this.fullheight = !1), maxwidthtnewvalue <= newvalue ? (this.widthRatio = this.largeWidth / maxwidthtnewvalue / this.nzWidth, this.newvaluewidth = maxwidthtnewvalue, this.fullwidth = !0) : (this.widthRatio = this.largeWidth / newvalue / this.nzWidth, this.newvaluewidth = newvalue, this.fullwidth = !1), "lens" == this.options.zoomType && (maxheightnewvalue <= newvalue ? (this.fullwidth = !0, this.newvaluewidth = maxheightnewvalue) : (this.widthRatio = this.largeWidth / newvalue / this.nzWidth, this.newvaluewidth = newvalue, this.fullwidth = !1)));
      "inner" == this.options.zoomType && (maxheightnewvalue = parseFloat(this.largeHeight / this.nzHeight).toFixed(2), maxwidthtnewvalue = parseFloat(this.largeWidth / this.nzWidth).toFixed(2), newvalue > maxheightnewvalue && (newvalue = maxheightnewvalue), newvalue > maxwidthtnewvalue && (newvalue = maxwidthtnewvalue), maxheightnewvalue <= newvalue ? (this.heightRatio = this.largeHeight / newvalue / this.nzHeight, this.newvalueheight = newvalue > maxheightnewvalue ? maxheightnewvalue : newvalue, this.fullheight = !0) : (this.heightRatio = this.largeHeight / newvalue / this.nzHeight, this.newvalueheight = newvalue > maxheightnewvalue ? maxheightnewvalue : newvalue, this.fullheight = !1), maxwidthtnewvalue <= newvalue ? (this.widthRatio = this.largeWidth / newvalue / this.nzWidth, this.newvaluewidth = newvalue > maxwidthtnewvalue ? maxwidthtnewvalue : newvalue, this.fullwidth = !0) : (this.widthRatio = this.largeWidth / newvalue / this.nzWidth, this.newvaluewidth = newvalue, this.fullwidth = !1));
      scrcontinue = !1;
      "inner" == this.options.zoomType && (this.nzWidth > this.nzHeight && (this.newvaluewidth <= maxwidthtnewvalue ? scrcontinue = !0 : (scrcontinue = !1, this.fullwidth = this.fullheight = !0)), this.nzHeight > this.nzWidth && (this.newvaluewidth <= maxwidthtnewvalue ? scrcontinue = !0 : (scrcontinue = !1, this.fullwidth = this.fullheight = !0)));
      "inner" != this.options.zoomType && (scrcontinue = !0);
      scrcontinue && (this.zoomLock = 0, this.changeZoom = !0, this.options.zoomWindowHeight / this.heightRatio <= this.nzHeight && (this.currentZoomLevel = this.newvalueheight, "lens" != this.options.zoomType && "inner" != this.options.zoomType && (this.changeBgSize = !0, this.zoomLens.css({
        height: String(this.options.zoomWindowHeight / this.heightRatio) + "px"
      })), "lens" == this.options.zoomType || "inner" == this.options.zoomType) && (this.changeBgSize = !0), this.options.zoomWindowWidth / this.widthRatio <= this.nzWidth && ("inner" != this.options.zoomType && this.newvaluewidth > this.newvalueheight && (this.currentZoomLevel = this.newvaluewidth), "lens" != this.options.zoomType && "inner" != this.options.zoomType && (this.changeBgSize = !0, this.zoomLens.css({
        width: String(this.options.zoomWindowWidth / this.widthRatio) + "px"
      })), "lens" == this.options.zoomType || "inner" == this.options.zoomType) && (this.changeBgSize = !0), "inner" == this.options.zoomType && (this.changeBgSize = !0, this.nzWidth > this.nzHeight && (this.currentZoomLevel = this.newvaluewidth), this.nzHeight > this.nzWidth && (this.currentZoomLevel = this.newvaluewidth)));
      this.setPosition(this.currentLoc);
    },
    closeAll: function closeAll() {
      self.zoomWindow && self.zoomWindow.hide();
      self.zoomLens && self.zoomLens.hide();
      self.zoomTint && self.zoomTint.hide();
    },
    changeState: function changeState(b) {
      "enable" == b && (this.options.zoomEnabled = !0);
      "disable" == b && (this.options.zoomEnabled = !1);
    }
  };

  d.fn.elevateZoom = function (b) {
    return this.each(function () {
      var a = Object.create(k);
      a.init(b, this);
      d.data(this, "elevateZoom", a);
    });
  };

  d.fn.elevateZoom.options = {
    zoomActivation: "hover",
    zoomEnabled: !0,
    preloading: 1,
    zoomLevel: 1,
    scrollZoom: !1,
    scrollZoomIncrement: 0.1,
    minZoomLevel: !1,
    maxZoomLevel: !1,
    easing: !1,
    easingAmount: 12,
    lensSize: 200,
    zoomWindowWidth: 400,
    zoomWindowHeight: 400,
    zoomWindowOffetx: 0,
    zoomWindowOffety: 0,
    zoomWindowPosition: 1,
    zoomWindowBgColour: "#fff",
    lensFadeIn: !1,
    lensFadeOut: !1,
    debug: !1,
    zoomWindowFadeIn: !1,
    zoomWindowFadeOut: !1,
    zoomWindowAlwaysShow: !1,
    zoomTintFadeIn: !1,
    zoomTintFadeOut: !1,
    borderSize: 4,
    showLens: !0,
    borderColour: "#888",
    lensBorderSize: 1,
    lensBorderColour: "#000",
    lensShape: "square",
    zoomType: "window",
    containLensZoom: !1,
    lensColour: "white",
    lensOpacity: 0.4,
    lenszoom: !1,
    tint: !1,
    tintColour: "#333",
    tintOpacity: 0.4,
    gallery: !1,
    galleryActiveClass: "zoomGalleryActive",
    imageCrossfade: !1,
    constrainType: !1,
    constrainSize: !1,
    loadingIcon: !1,
    cursor: "default",
    responsive: !0,
    onComplete: d.noop,
    onZoomedImageLoaded: function onZoomedImageLoaded() {},
    onImageSwap: d.noop,
    onImageSwapComplete: d.noop
  };
})(jQuery, window, document);
/****************************************************************
 * CODE product
 ****************************************************************/


!function ($, document, window, undefined) {
  /**
   * Plugin name
   */
  var _pluginName = 'product';
  /**
   * @param $element Element Wrapping container div
   * @param options Options passed to public functions
   * @return product_plugin
   */

  var product_plugin = function product_plugin($element, options) {
    // Scope it
    var self = this;
    self.$element = $element; // Create product Options

    var defaultOptions = {
      onMasterSelectChange: {
        updateSpecs: true,
        // On variant change, update the specs
        updateVariantImagesInSwiper: true,
        // On variant change, show the image of the variant
        triggerOnPageLoad: true // Trigger a variant change when the PDP is loaded with a variant parameter to show the image of the variant

      },
      easyzoom: {
        loadingNotice: "",
        errorNotice: ""
      },
      fancybox: {
        hash: false,
        backFocus: false,
        baseClass: "product-detail-popup",
        thumbs: {
          autoStart: true,
          hideOnClose: true
        }
      }
    };
    var metaOptions = self.$element.data('product-options');
    self.options = $.extend({}, defaultOptions, metaOptions);

    if ($.code.debug) {
      console.log('Init product:', self.$element, self.options);
    } // Get elements


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
      self.initProductZoom(); // Init productzoom popup gallery

      self.initProductFancyboxGallery();
    } // Capture masterSelectChange from slate variants.js


    self.$element.on('masterSelectChange', function (event) {
      if ($.code.debug) {
        console.log('masterSelectChange:', event.variant);
      } // Get variant id from event


      var variant_id = event.variant.id; // Update the specs

      if (self.options.onMasterSelectChange.updateSpecs) {
        self.updateSpecs(variant_id);
      } // Tell slideshow to go to slide i


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
    var self = this; // Init easyzoom

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
    } // Loop the specs


    $.each(self.specs_data.specs, function (index, value) {
      var variantSpecs = value.split(self.specs_data.divider);
      var variantId = variantSpecs[0].split(':::')[1];

      if (variantId == currentVariantId) {
        var rowHtml = self.specs_data.row_template;
        var specHtml = ''; // Loop the specs to create html from the template

        $.each(variantSpecs, function (i, specs) {
          var pair = variantSpecs[i];
          var key = pair.split(':::')[0];
          var value = pair.split(':::')[1]; // Skip the variant ID

          if (key == 'variant_id') {
            return;
          }

          specHtml = specHtml + rowHtml.replace('[key]', key).replace('[value]', value);
        }); // Insert the html

        self.$specs.html(specHtml); // break the loop

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
    var self = this; // Init fancybox on all Product images, except for slide duplicates

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
    var swiperOptions = {}; // If thumbnails must be a swiper

    if (typeof self.productImagesSwiperNav.data('swiper-options') != 'undefined') {
      // Init thumbnail Swiper
      self.productImagesSwiperNav.swiperLoader(); // Get the thumbnail Swiper Instance

      var productImagesSwiperNavInstance = self.productImagesSwiperNav.find('.swiper-container:first')[0].swiper; // Set thumbnail instance as thumbs in options for Product image Swiper

      swiperOptions = {
        thumbs: {
          swiper: productImagesSwiperNavInstance
        }
      };
    } else {
      // Find all thumbnails
      var $thumbs = self.productImagesSwiperNav.find('[data-product-thumb]'); // Catch click on a thumbnail

      self.productImagesSwiperNav.on('click', '[data-product-thumb]', function () {
        var slideIndex = $thumbs.index($(this)); // Tell Product images Swiper to show that image

        self.productImagesSwiper.swiperLoader('goToSlide', slideIndex);
      });
    } // Init Product images Swiper


    self.productImagesSwiper.swiperLoader(swiperOptions); // Get Swiper options for gotovariant

    self.swiperOptions = self.productImagesSwiper.data('swiper-options'); // Get the Product image Swiper Instance

    self.productImagesSwiperInstance = self.productImagesSwiper.find('.swiper-container:first')[0].swiper; // If the PDP is loaded with a variant parameter, show the image of the variant

    if (self.options.onMasterSelectChange.triggerOnPageLoad) {
      // Find the current variant
      var currentVariantId = self.$element.find('[name="id"]').val();
      self.goToVariant(currentVariantId, 0);
    } // Init productzoom on product image


    self.initProductZoom(); // Init productzoom popup gallery

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
    } // Loop the slides in self.productImagesSwiperInstance


    self.productImagesSwiperInstance.slides.each(function (slideIndex) {
      // Get variant Ids for this slide
      var ids = $(this).data('product-variant-image');

      if (typeof ids == 'undefined') {
        return;
      }

      for (var index = 0; index < ids.length; index++) {
        var id = ids[index]; // If this slide has the variantId

        if (id == variantId) {
          if (self.swiperOptions.loop) {
            slideIndex -= 1;
          } // Tell slider to go to this slide


          self.productImagesSwiper.swiperLoader('goToSlide', slideIndex, speed); // Stop loop

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
    var args = Array.prototype.slice.call(arguments, 1); // Initialize the items

    return this.each(function () {
      // Store the element the plugin is set on
      var $element = $(this); // Guard if plugin was already initted

      var instance = $element.data('plugin_' + _pluginName); // If plugin was not innited

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
}(jQuery, document, window);
/****************************************************************
 * CODE productRecommendations
 ****************************************************************/

!function ($, document, window, undefined) {
  /**
   * Plugin name
   */
  var _pluginName = 'productRecommendations';
  /**
   * @param $element Element Wrapping container div
   * @param options Options passed to public functions
   * @return productRecommendations_plugin
   */

  var productRecommendations_plugin = function productRecommendations_plugin($element, options) {
    // Scope it
    var self = this;
    self.$element = $element; // Get options

    var defaults = {};
    var metaOptions = self.$element.data('product-recommendations');
    self.options = $.extend({}, defaults, metaOptions); // Create url

    self.requestUrl = "/recommendations/products?section_id=product-recommendations&limit=" + self.options.limit + "&product_id=" + self.options.productId;

    if ($.code.debug) {
      console.log('Init productRecommendations:', self.$element, self.options, self.requestUrl);
    } // Start the productRecommendations


    self.init();
  };
  /**
   * Init
   *
   * @return void
   * @access public
   */


  productRecommendations_plugin.prototype.init = function () {
    var self = this;
    $.ajax({
      type: "GET",
      url: self.requestUrl,
      success: function success(response) {
        var $newHtml = $(response).children(); // Replace section self with result

        self.$element.parent().replaceWith($newHtml);
        self.$element = $newHtml; // Load slider

        self.$element.find('[data-swiper-options]').swiperLoader();
      }
    });
  };
  /**
   * productRecommendations plugin
   *
   * @return jQuery objects
   */


  $.fn.productRecommendations = function (options) {
    // Put args in array
    var args = Array.prototype.slice.call(arguments, 1); // Initialize the items

    return this.each(function () {
      // Store the element the plugin is set on
      var $element = $(this); // Guard if plugin was already initted

      var instance = $element.data('plugin_' + _pluginName); // If plugin was not innited

      if (!instance) {
        // Init plugin on element and set guard data on element
        $element.data('plugin_' + _pluginName, new productRecommendations_plugin($element, options));
      } else {
        // If instance already created call method from plugin
        if (typeof options === 'string') {
          instance[options].apply(instance, args);
        }
      }
    });
  };
}(jQuery, document, window);
/****************************************************************
 * CODE relatedProducts
 ****************************************************************/

!function ($, document, window, undefined) {
  /**
   * Plugin name
   */
  var _pluginName = 'relatedProducts';
  /**
   * @param $element Element Wrapping container div
   * @param options Options passed to public functions
   * @return relatedProducts_plugin
   */

  var relatedProducts_plugin = function relatedProducts_plugin($element, options) {
    // Scope it
    var self = this;
    self.$element = $element;
    self.xhrCount = 0; // Set default options

    var defaults = {
      view: 'product-related',
      // view for liquid files collection.product-related.liquid and product.product-related.liquid
      max: 5,
      // max products
      currentHandle: '',
      // handle of the current product
      relatedMetaHandles: '',
      // array of product handles
      relatedSameCollectionHandles: '',
      // array of product handles
      relatedPrimaryTag: '',
      // tag to filter primary collection
      relatedPrimaryCollection: '',
      // primary collection handle
      relatedSecondaryTag: '',
      // tag to filter secondary collection
      relatedSecondaryCollection: '',
      // secondary collection handle
      columnClasses: '',
      // classes for no-slider columns
      wrapper: '' // jQuery selector to show hide wrapper

    }; // Get options from html element

    var metaOptions = self.$element.data('relatedProducts');
    self.options = $.extend({}, defaults, metaOptions); // Create the ajax url for the Primary collection
    // This uses collection.product-related.liquid

    if (self.options.relatedPrimaryCollection != '' && self.options.relatedPrimaryTag != '') {
      self.options.relatedPrimaryCollectionUrl = '/collections/' + self.options.relatedPrimaryCollection + '/' + self.options.relatedPrimaryTag + '?view=' + self.options.view;
    } // Create the ajax url for the Secondary collection
    // This uses collection.product-related.liquid


    if (self.options.relatedSecondaryCollection != '' && self.options.relatedSecondaryTag != '') {
      self.options.relatedSecondaryCollectionUrl = '/collections/' + self.options.relatedSecondaryCollection + '/' + self.options.relatedSecondaryTag + '?view=' + self.options.view;
    } // Create array for Metafield related products


    var relatedProducts_Metafield = [];

    if (Array.isArray(self.options.relatedMetaHandles)) {
      relatedProducts_Metafield = self.options.relatedMetaHandles;
    } // Create array for products from the same collection (without tag filtering)


    var relatedProducts_SameCollection = [];

    if (Array.isArray(self.options.relatedSameCollectionHandles)) {
      relatedProducts_SameCollection = self.options.relatedSameCollectionHandles;
    }

    var ajax1, ajax2; // Get an array of collection products filtered by relatedPrimaryTag (only first 1000 of this collection)

    if (typeof self.options.relatedPrimaryCollectionUrl != 'undefined') {
      ajax1 = $.ajax(self.options.relatedPrimaryCollectionUrl);
    } // Get an array of all products filtered by tag (only first 1000 of all_products)


    if (typeof self.options.relatedSecondaryCollectionUrl != 'undefined') {
      ajax2 = $.ajax(self.options.relatedSecondaryCollectionUrl);
    }

    if ($.code.debug) {
      console.log('Init relatedProducts:', self.$element, self.options);
    } // Find wrapper element


    self.$wrapper = $(self.options.wrapper);
    self.$container = self.$element.find('[data-related-products-container]');

    if (!self.$wrapper.length) {
      self.$wrapper = self.$element;
    }

    $.when(ajax1, ajax2).done(function (a1, a2) {
      var relatedProducts_PrimaryCollection = [];
      var relatedProducts_SecondaryCollection = [];

      if (typeof a1 != 'undefined') {
        relatedProducts_PrimaryCollection = a1[0].split(',');
      }

      if (typeof a2 != 'undefined') {
        relatedProducts_SecondaryCollection = a2[0].split(',');
      } // Concat all arrays and remove duplicates


      var relatedProductHandles = [].concat(relatedProducts_Metafield, relatedProducts_PrimaryCollection, relatedProducts_SecondaryCollection, relatedProducts_SameCollection); // Make the product handles unique, regardless of the collection prefix

      var relatedProductHandles_unique = [];
      var testArr = [];
      $.each(relatedProductHandles, function (index, handle) {
        var shortHandle = handle; // Remove collection prefix from handle

        if (handle.indexOf('|') > -1) {
          var res = handle.split('|');
          shortHandle = res[1];
        } // if shortHandle is not in testarray and not the current product


        if ($.inArray(shortHandle, testArr) == -1 && shortHandle !== self.options.currentHandle) {
          // Add shortHandle to testarray
          testArr.push(shortHandle); // Add real handle to unique array

          relatedProductHandles_unique.push(handle);
        }
      }); // Remove products > max items

      var relatedProductHandles_arr = relatedProductHandles_unique.slice(0, self.options.max);

      if ($.code.debug) {
        console.log('relatedProducts_Metafield ' + self.options.wrapper, relatedProducts_Metafield);
        console.log('relatedProducts_PrimaryCollection ' + self.options.wrapper, self.options.relatedPrimaryCollectionUrl, relatedProducts_PrimaryCollection);
        console.log('relatedProducts_SecondaryCollection ' + self.options.wrapper, self.options.relatedSecondaryCollectionUrl, relatedProducts_SecondaryCollection);
        console.log('relatedProducts_SameCollection ' + self.options.wrapper, relatedProducts_SameCollection);
        console.log('relatedProductHandles ' + self.options.wrapper, relatedProductHandles_arr);
      } // create empty array to hold our items


      var responseArray = []; // map product urls to array

      var productsArray = $.map(relatedProductHandles_arr, function (handle, i) {
        var collectionHandle = 'all';
        var shortHandle = handle; // Split the collection|product_handle

        if (handle.indexOf('|') > -1) {
          var res = handle.split('|');
          collectionHandle = res[0];
          shortHandle = res[1];
        }

        var productUrl = '/collections/' + collectionHandle + '/products/' + shortHandle; // Store the relation

        var relation = '';

        if ($.inArray(handle, relatedProducts_SecondaryCollection) > -1) {
          relation = 'secondary collection';
        }

        if ($.inArray(handle, relatedProducts_PrimaryCollection) > -1) {
          relation = 'primary collection';
        }

        if ($.inArray(handle, relatedProducts_SameCollection) > -1) {
          relation = 'same collection';
        }

        if ($.inArray(handle, relatedProducts_Metafield) > -1) {
          relation = 'metafield';
        } // Related product original object


        return {
          index: i,
          collectionHandle: collectionHandle,
          relation: relation,
          url: productUrl
        };
      }); // create deferred ajax request to pass product urls to

      var ajax_request = function ajax_request(product) {
        var deferred = $.Deferred();
        $.ajax({
          url: product.url + '?view=' + self.options.view,
          success: function success(data) {
            // mark the ajax call as completed
            deferred.resolve(data).done(function (data) {
              // Related product response/final object
              responseArray[product.index] = {
                index: product.index,
                collectionHandle: product.collectionHandle,
                relation: product.relation,
                html: data
              };
            });
          },
          error: function error(_error) {
            // mark the ajax call as completed
            deferred.reject(_error);
          }
        });
        return deferred.promise();
      }; // define looper


      var looper = $.Deferred().resolve(); // go through each product url and call the ajax function

      $.when.apply($, $.map(productsArray, function (product, i) {
        looper = looper.then(function () {
          // trigger ajax call with product data
          return ajax_request(product);
        });
        return looper;
      })).done(function () {
        // All ajax calls have completed
        if ($.code.debug) {
          console.log('Related products original array', productsArray);
          console.log('Related products ajax response array', responseArray);
        } // empty the container


        self.$container.empty();

        for (var index = 0; index < responseArray.length; index++) {
          var element = responseArray[index];

          if (typeof element != 'undefined') {
            // Create element
            var $element = $(element.html).attr('data-related-by', element.relation); // Add to container

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
    } // Init Swiper


    var $swiperWrapper = self.$container.closest('[data-swiper-options]');

    if ($swiperWrapper.length) {
      // Add classes
      self.$container.children().addClass('swiper-slide'); // Start swiper

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
    var args = Array.prototype.slice.call(arguments, 1); // Initialize the items

    return this.each(function () {
      // Store the element the plugin is set on
      var $element = $(this); // Guard if plugin was already initted

      var instance = $element.data('plugin_' + _pluginName); // If plugin was not innited

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
}(jQuery, document, window);
/****************************************************************
 * CODE tabs
 ****************************************************************/

!function ($, document, window, undefined) {
  /**
   * Plugin name
   */
  var _pluginName = 'tabs';
  /**
   * @param $element Element Wrapping container div
   * @param options Options passed to public functions
   * @return tabs_plugin
   */

  var tabs_plugin = function tabs_plugin($element, options) {
    // Scope it
    var self = this;
    self.$element = $element; // Get options

    var defaults = {};
    var metaOptions = self.$element.data('tabs');
    self.options = $.extend({}, defaults, metaOptions);

    if ($.code.debug) {
      console.log('Init tabs:', self.$element, self.options);
    } // Start the tabs


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
    } // Catch click on desktop tab navigation


    self.$tabsNav.on({
      click: function click(event) {
        event.preventDefault();

        if (!$(this).is('.is-active')) {
          $(this).trigger('open');
        }
      },
      open: function open() {
        var title = $(this).data('tabs-link'); // Close the active tab and open the clicked tab after that

        self.closeActiveTab(title, self.openTab(title)); // Open the clicked tag link

        self.openTabNavLink(title);
      }
    }, '[data-tabs-link]'); // Catch click on mobile tab navigation

    self.$tabsContent.on('click', '[data-tabs-link]', function (event) {
      var title = $(this).data('tabs-link');

      if ($(this).hasClass('is-active')) {
        // Close the tab and link in content
        self.closeTab(title);
      } else {
        // Open the tab and link in content
        self.openTab(title);
      }
    }); // Catch open tab by url hash

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
      var tabLink = tabTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '').replace(/^-/, ''); // Make tab html

      var $parent = $(tabDivider).closest('.tabs-content-pane');
      var $link = $('<div class="tabs-content-link" data-tabs-link="' + tabLink + '"><span>' + tabTitle + '</span></div>');
      $parent.attr('data-tabs-content-pane', tabLink);
      $link.insertBefore($parent);
      $(tabDivider).remove(); // Add to tab nav

      self.$tabsNav.find('ol').append('<li class="tabs__nav-item" data-tabs-link="' + tabLink + '"><a href="#' + tabLink + '">' + tabTitle + '</a></li>');
    });
  };
  /**
   * close tab
   *
   * @return void
   * @access public
   */


  tabs_plugin.prototype.closeActiveTab = function (title, callback) {
    var self = this;
    var $activeTab = self.$tabsNav.find('.is-active').not('[data-tabs-link="' + title + '"]'); // If there is an active tab

    if ($activeTab.length) {
      // Get title
      var activeTitle = $activeTab.data('tabs-link'); // Don't reopen self

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
    var self = this; // Close the tab

    self.$tabsContent.find('[data-tabs-content-pane="' + title + '"]').removeClass('is-active'); // Close the tablink in content (on mobile)

    self.$tabsContent.find('[data-tabs-link="' + title + '"]').removeClass('is-active');
  };
  /**
   * close link in tab nav
   *
   * @return void
   * @access public
   */


  tabs_plugin.prototype.closeTabNavLink = function (title) {
    var self = this; // Close the tablink in nav

    self.$tabsNav.find('[data-tabs-link="' + title + '"]').removeClass('is-active');
  };
  /**
   * open tab
   *
   * @return void
   * @access public
   */


  tabs_plugin.prototype.openTab = function (title) {
    var self = this; // Open new tab

    self.$tabsContent.find('[data-tabs-content-pane="' + title + '"]').addClass('is-active'); // Close the tablink in content (on mobile)

    self.$tabsContent.find('[data-tabs-link="' + title + '"]').addClass('is-active');
  };
  /**
   * open tablink in Nav
   *
   * @return void
   * @access public
   */


  tabs_plugin.prototype.openTabNavLink = function (title) {
    var self = this; // Open new tab

    self.$tabsNav.find('[data-tabs-link="' + title + '"]').addClass('is-active');
  };
  /**
   * Reset the tab navigation and tabs
   *
   * @return void
   * @access public
   */


  tabs_plugin.prototype.reset = function () {
    var self = this; // If there is no active tab in navigation or content

    if (self.$tabsNav.find('.is-active').length == 0 || self.$tabsContent.find('.is-active').length == 0) {
      // Remove all active classes
      self.$element.find('.is-active').removeClass('is-active'); // open the first tab in navigation

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
    var args = Array.prototype.slice.call(arguments, 1); // Initialize the items

    return this.each(function () {
      // Store the element the plugin is set on
      var $element = $(this); // Guard if plugin was already initted

      var instance = $element.data('plugin_' + _pluginName); // If plugin was not innited

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
}(jQuery, document, window);
/****************************************************************
 * CODE init
 ****************************************************************/

$.code.productInit = function () {
  // Init tabs
  $('[data-tabs]').tabs(); // Init product events

  $('[data-section-type="product"]').product(); // Init related products

  $('[data-related-products]').relatedProducts(); // Init product recommendations

  $("[data-product-recommendations]").productRecommendations();
};

$.code.productInit();