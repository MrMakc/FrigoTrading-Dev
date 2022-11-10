(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.global = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

/**
*
* Global helper functions
* They can be called from any JS Class, provided they are imported
*
* @author mha
*/

var helpers = {
    // get viewport size, without scrollbar
    // to call it from anywhere else than here : global.helpers.viewport() (ex :  global.helpers.viewport().width )
    viewport: function viewport() {
        var e = window,
            a = 'inner';
        if (!('innerWidth' in window)) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        return {
            width: e[a + 'Width'],
            height: e[a + 'Height']
        };
    }
};

module.exports = helpers;

},{}],2:[function(require,module,exports){
'use strict';

/**
 *
 * Global variables
 * They can be called from any JS Class, provided they are imported
 *
 * @author mha
 */

function getdata(name) {
  return $('meta[property=' + JSON.stringify(name) + ']').attr('content');
}
var store = {
  projectJsName: getdata('app:site_data:projectJsName'),
  aAvailableMarkersType: getdata('app:site_data:aAvailableMarkersType'),
  sRootPath: getdata('app:site_data:sRootPath'),
  sMarkersPath: getdata('app:site_data:sMarkersPath'),
  defaultRequiredMsg: getdata('app:site_data:defaultRequiredMsg'),
  defaultErrorMsg: getdata('app:site_data:defaultErrorMsg'),
  defaultPwdErrorMsg: getdata('app:site_data:defaultPwdErrorMsg'),
  wWidth: 0,
  wHeight: 0,
  currentWidth: 0,
  currentHeight: 0,
  timerResponsive: 0,
  wScroll: 0,
  mq1: 'only screen and (max-width: 25em)',
  mq2: 'only screen and (max-width: 32em)',
  mq3: 'only screen and (max-width: 39em)',
  mq4: 'only screen and (max-width: 52em)',
  mq5: 'only screen and (max-width: 58em)',
  mq6: 'only screen and (max-width: 70em)',
  mq7: 'only screen and (max-width: 85em)'

};

module.exports = store;

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _store = require('../_store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 * BannerMessages
 * Generic class for messages elements : cookies / warning / news
 *
 * @author efr
 */

var BannerMessages = function () {

  /**
   *
   * Constructor
   *
   * @param {Object} options - List of settings
   * @param {string} options.project - Project name in camelCase witch prefix the coockie name
   * @param {number} options.caping - Speccify the number of time the banner display
   * @param {string} options.container - The selector of the banner
   */

  function BannerMessages() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, BannerMessages);

    var defaults = {
      project: _store2.default.projectJsName,
      bannerName: '',
      hideJs: true, // if hideJs == true, hideClass is note needed
      hideClass: 'hide-banner', // class to animate the hide if hideJs = false
      hiddenClass: 'as--hidden', // class to remove when banner is hidden by default
      caping: 0,
      container: '.c-banner-messages',
      durationLife: 365 + 30,
      remove: true
    };
    var privatesOptions = {
      reset: '.sg-banner-messages-reset' // /!\ use only in styles.twig
    };

    // fusionne les options renseignees avec celles par defaut pour creer l'objet settings
    this.settings = $.extend({}, defaults, options, privatesOptions);

    this.bindUI();
  }

  /**
   *
   * hideBanner
   */

  _createClass(BannerMessages, [{
    key: 'hideBanner',
    value: function hideBanner($banner, accept) {
      //console.log('hideBanner : ', $banner);
      var self = this;
      var acceptCooky = accept || false;
      var settings = $banner.data('banner-settings');
      var bannerCookyName = settings.bannerCookyName;
      //console.log('$banner : ', $banner);
      //console.log('bannerCookyName : ', bannerCookyName);
      if (acceptCooky === true) {
        _store2.default.cookies.setCookie(bannerCookyName, true, settings.durationLife);
      }
      if (settings.hideJs === true) {
        $banner.animate({ height: 'hide', paddingTop: 0, paddingBottom: 0 }, 350, function () {
          $banner.remove();
        });
      } else {
        $banner.addClass(settings.hideClass);
      }
      sessionStorage.setItem(bannerCookyName, 1);
      // show delete cookies button only in styles.twig
      $(self.settings.reset).parent('p').removeClass('as--hidden');
    }

    /**
     *
     * bindUI
     */

  }, {
    key: 'bindUI',
    value: function bindUI() {
      var self = this;
      var aExistingCookies = [];
      /* Banner messages */
      $(self.settings.container).each(function () {
        var $banner = $(this);
        var projectBannerName = self.settings.project;
        var settings = $.extend({}, self.settings, $(this).data('banner-options') || {});
        var bannerName = settings.bannerName;
        //console.log('settings : ', settings);
        if (bannerName === '') {
          console.error('BannerMessages - You must set the "bannerName" in data-banner-options - camelCase only');
        }
        var bannerCookyName = settings.bannerCookyName = projectBannerName + 'BannerMessages' + bannerName;
        var bannerCookyNameCaping = settings.bannerCookyNameCaping = projectBannerName + 'BannerMessagesCaping' + bannerName;
        aExistingCookies.push(bannerCookyName);
        if ($.inArray(aExistingCookies, bannerCookyName) !== -1) {
          console.error('BannerMessages - "bannerName : ' + bannerName + '" is already set for an other banner - camelCase only');
        }

        var bannerMessages = _store2.default.cookies.getCookie(bannerCookyName);
        if (settings.hideJs === false) {
          $banner.addClass('has-transition');
        }
        if (typeof settings.caping === 'number' && settings.caping > 0) {
          var bannerMessagesCaping = sessionStorage.getItem(bannerCookyNameCaping);
          //console.log('bannerMessagesCaping : ', bannerMessagesCaping);
          if (bannerMessagesCaping !== null) {
            //console.log('setItem descrease');
            if (parseInt(bannerMessagesCaping, 10) > 0) {
              bannerMessagesCaping--;
              sessionStorage.setItem(bannerCookyNameCaping, bannerMessagesCaping);
              //console.log('bannerMessagesCaping : ', bannerMessagesCaping);
            }
          } else {
            //console.log('setItem init');
            sessionStorage.setItem(bannerCookyNameCaping, settings.caping);
          }
          if (parseInt(bannerMessagesCaping, 10) === 0) {
            //console.log('force');
            bannerMessages = '1';
          }
        }
        if (bannerMessages === '') {
          bannerMessages = sessionStorage.getItem(bannerCookyName) || '';
        }
        //console.log(bannerCookyName + 'BannerMessages : ', bannerMessages);
        if (bannerMessages !== '') {
          if (settings.hideJs === true) {
            $banner.remove();
          }
          $(self.settings.reset).parent('p').removeClass('as--hidden');
        } else {
          $banner.removeClass(self.settings.hiddenClass);
        }
        /*--- Banner messages : accept / close  ---*/
        /*$(settings.container + ' .js-banner-btn-close, ' + settings.container + ' .js-banner-btn-accept').data({
          container: settings.container,
          bannerCookyName: bannerCookyName
        });*/
        $banner.data({
          'banner-settings': settings
        });

        $banner.find('.js-banner-btn-close').on('click', function (event) {
          var $banner = $(this).closest('[data-banner-options]');
          self.hideBanner($banner);
        });
        $banner.find('.js-banner-btn-accept').on('click', function (event) {
          // name / value / duration day validity (13 month max)
          var $banner = $(this).closest('[data-banner-options]');
          self.hideBanner($banner, true);
        });

        if ($(self.settings.reset).data('aBannersCookiesName')) {
          var aBannersCookiesName = $(self.settings.reset).data('aBannersCookiesName');
          var aBannersCookiesNameCaping = $(self.settings.reset).data('aBannersCookiesNameCaping');
          aBannersCookiesName.push(bannerCookyName);
          aBannersCookiesNameCaping.push(bannerCookyNameCaping);
          $(self.settings.reset).data('aBannersCookiesName', aBannersCookiesName);
          $(self.settings.reset).data('aBannersCookiesNameCaping', aBannersCookiesNameCaping);
        } else {
          $(self.settings.reset).data('aBannersCookiesName', [bannerCookyName]);
          $(self.settings.reset).data('aBannersCookiesNameCaping', [bannerCookyNameCaping]);
        }
      });
      // delete only available in styles.twig
      $('body').on('click', self.settings.reset, function (event) {
        event.stopPropagation();
        event.preventDefault();
        var aBannersCookiesName = $(self.settings.reset).data('aBannersCookiesName');
        var aBannersCookiesNameCaping = $(self.settings.reset).data('aBannersCookiesNameCaping');
        //console.log('aBannersCookiesName : ', aBannersCookiesName);
        //console.log('aBannersCookiesNameCaping : ', aBannersCookiesNameCaping);
        $.each(aBannersCookiesName, function (i, cookyName) {
          _store2.default.cookies.deleteCookie(cookyName);
          sessionStorage.removeItem(cookyName);
        });
        $.each(aBannersCookiesNameCaping, function (i, cookyName) {
          sessionStorage.removeItem(cookyName);
        });
        setTimeout(function () {
          window.location.href = 'components.html?r=' + Math.ceil(Math.random() * 1000000) + '#sg-banner-messages';
        }, 500);
      });
    }
  }]);

  return BannerMessages;
}();

module.exports = BannerMessages;

},{"../_store":2}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 * ClearInput
 * Generic class for clear input
 *
 * @author efr
 */

/**
 *
 * HTML minimal example template
 *
 * <div class="form-field as--btn-clear as--not-empty">
 *   <div>
 *     <input type="text" value="value to clear">
 *        <span data-js-clear-field>&times;</span>
 *     </div>
 *   </div>
 * </div>
 *
 */

var ClearInput = function () {

  /**
   *
   * Constructor
   *
   * @param options Object List of settings
   */

  function ClearInput() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ClearInput);

    var defaults = {
      container: '.as--btn-clear',
      cta: '[data-js-clear-field]',
      className: 'as--not-empty'
    };

    // fusionne les options renseignees avec celles par defaut pour creer l'objet settings
    this.settings = $.extend({}, defaults, options);

    // evenements par utilisateur ex scroll hover clic touch
    this.bindUIActions();
  }

  /**
   *
   * Bind UI Actions
   *
   */

  _createClass(ClearInput, [{
    key: 'bindUIActions',
    value: function bindUIActions() {
      var self = this;
      //console.log('ClearInput : ', self.settings);


      $('body').on('input', self.settings.container + ' input', function () {
        //console.log('val : ', $(this).val());
        if ($(this).val() !== '') {
          $(this).closest(self.settings.container).addClass(self.settings.className);
        } else {
          $(this).closest(self.settings.container).removeClass(self.settings.className);
        }
      });
      $('body').on('click', self.settings.cta, function () {
        $(this).closest(self.settings.container).removeClass(self.settings.className).find('input').val('').trigger('change').trigger('focus');
      });
    }
  }]);

  return ClearInput;
}();

module.exports = ClearInput;

},{}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 * Collapsible
 * Generic class for collapsible elements
 *
 * @author mha
 */

/**
 *
 * HTML minimal example template
 *
 * (optional .other-collapsible)
 *   .collapsible (optional .as--open)
 *     .cta-open-collapsible (button or a)
 *     (optional .cta-close-collapsible)
 */

var Collapsible = function () {

  /**
   *
   * Constructor
   *
   * @param options Object settings
   */

  function Collapsible() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Collapsible);

    var defaults = {
      container: '.collapsible',
      cta: '.cta-open-collapsible',
      className: 'as--open',
      optionCloseAll: false, // to close all others when opens one
      optionClose: false, // there is a button to close it
      ctaClose: '.cta-close-collapsible', // only if optionClose = true
      optionCloseOnBody: false, // to close all when click somewhere else,
      optionEsc: false, // to close with Escape key
      optionHover: false, // to open on hover / focus / touchstart
      optionFocusInput: false,
      inputContainer: '.input-text',
      delay: 300, // only if optionHover = true
      optionNoAria: false, // special option to avoid changing aria attributes (rare use cases),
      optionOtherContainer: true, // another container should change class at the same time
      otherContainer: '.other-collapsible', // only if optionOtherContainer = true
      optionFocusOnly: false // to open on focus / touchstart only
    };

    // fusionne les options renseignees avec celles par defaut pour creer l'objet settings
    this.settings = $.extend({}, defaults, options);

    this.timer = null;

    // evenements par utilisateur ex scroll hover clic touch
    this.bindUIActions();
  }

  /**
   *
   * Show
   *
   * @param elem Object element to open
   */

  _createClass(Collapsible, [{
    key: 'show',
    value: function show(elem) {
      var self = this;

      $(elem).addClass(self.settings.className);

      if (self.settings.optionNoAria === false) {
        var cta = $(elem).find(self.settings.cta);
        if ($(cta).attr('aria-expanded')) {
          $(cta).attr('aria-expanded', 'true');
        }
      }
      if (self.settings.optionFocusInput === true) {
        setTimeout(function () {
          $(elem).find(self.settings.inputContainer).first().focus();
        }, 150);
      }

      if (self.settings.optionOtherContainer === true) {
        $(elem).closest(self.settings.otherContainer).addClass(self.settings.className);
      }
    }

    /**
     *
     * Hide
     *
     * @param elem Object element to close
     */

  }, {
    key: 'hide',
    value: function hide(elem) {
      var self = this;

      $(elem).removeClass(self.settings.className);

      if (self.settings.optionNoAria === false) {
        var cta = $(elem).find(self.settings.cta);
        if ($(cta).attr('aria-expanded')) {
          $(cta).attr('aria-expanded', 'false');
        }
      }

      if (self.settings.optionOtherContainer === true) {
        $(elem).closest(self.settings.otherContainer).removeClass(self.settings.className);
      }
    }

    /**
     *
     * Toggle
     *
     * @param elem Object element to toggle
     */

  }, {
    key: 'toggle',
    value: function toggle(elem) {
      var self = this;

      if ($(elem).hasClass(self.settings.className)) {
        self.hide(elem);
      } else {
        if (self.settings.optionCloseAll === true) {
          self.hide(self.settings.container);
        }
        self.show(elem);
      }
    }

    /**
     *
     * Bind UI Actions
     *
     */

  }, {
    key: 'bindUIActions',
    value: function bindUIActions() {
      var self = this;

      if (self.settings.optionHover === true) {
        /*--- on hover / focus / touch ---*/
        $(self.settings.container).on('mouseenter focusin touchstart', function (event) {
          event.stopImmediatePropagation();
          window.clearTimeout(self.timerEnter);
          var elem = event.target;
          var container = $(elem).closest(self.settings.container);
          if (event.type === 'touchstart') {
            self.toggle(container);
          } else {
            if (event.type === 'mouseenter') {
              self.timerEnter = window.setTimeout(function () {
                self.hide(self.settings.container);
                self.show(container);
              }, self.settings.delay);
            } else {
              self.show(container);
            }
          }
        });
        $(self.settings.container).on('mouseleave focusout', function (event) {
          window.clearTimeout(self.timerLeave);
          var elem = this;
          if (event.type === 'mouseleave') {
            self.timerLeave = window.setTimeout(function () {
              self.hide(elem);
            }, self.settings.delay);
          } else {
            self.hide(elem);
          }
        });
      } else if (self.settings.optionFocusOnly === true) {
        $(self.settings.container).on(' focusin touchstart', function (event) {
          event.stopImmediatePropagation();
          window.clearTimeout(self.timer);
          var elem = event.target;
          var container = $(elem).closest(self.settings.container);
          if (event.type === 'touchstart') {
            self.toggle(container);
          } else {
            self.show(container);
          }
        });
        $(self.settings.container).on('focusout', function (event) {
          window.clearTimeout(self.timer);
          var elem = this;
          self.hide(elem);
        });
      } else {
        /*--- on click ---*/
        $(self.settings.container).on('click', self.settings.cta, function (event) {
          event.preventDefault();
          var elem = $(this);
          var container = $(elem).closest(self.settings.container);
          self.toggle(container);
        });
        $(self.settings.container).on('focusout', function (event) {
          var elem = $(this);
          var target = event.relatedTarget;
          if (self.settings.optionCloseAll === true) {
            if ($(target).closest(elem).length === 0) {
              setTimeout(function () {
                // fix click on siblings under
                self.hide(elem);
              }, 300);
            }
          }
        });
      }

      if (self.settings.optionClose === true) {
        $(self.settings.container).on('click', self.settings.ctaClose, function (event) {
          event.preventDefault();
          var container = $(this).closest(self.settings.container);
          self.hide(container);
        });
      }

      if (self.settings.optionCloseOnBody === true) {
        $('#body').on('click focusin', function (event) {
          var target = event.target;
          if ($(target).closest(self.settings.container).length === 0 && !$(target).is(self.settings.container)) {
            var elem = $(self.settings.container);
            self.hide(elem);
          }
        });
      }

      if (self.settings.optionEsc === true) {
        $(self.settings.container).on('keydown', 'input, button', function (event) {
          var key = event.which;
          if (key === 27) {
            var container = $(this).closest(self.settings.container);
            self.hide(container);
          }
        });
      }
    }
  }]);

  return Collapsible;
}();

module.exports = Collapsible;

},{}],6:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 * Cookies
 * Generic class for cookies elements
 *
 * @author efr
 */

var Cookies = function () {

  /**
   *
   * Constructor
   *
   * @param options Object List of settings
   */

  function Cookies() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Cookies);

    var defaults = {};

    // fusionne les options renseignees avec celles par defaut pour creer l'objet settings
    this.settings = $.extend({}, defaults, options);
  }

  /**
   *
   * set Cookie
   */

  _createClass(Cookies, [{
    key: 'setCookie',
    value: function setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      var expires = 'expires=' + d.toUTCString();
      document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
    }

    /**
     *
     * delete Cookie
     */

  }, {
    key: 'deleteCookie',
    value: function deleteCookie(cname) {
      document.cookie = cname + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
      console.log('deleteCookie');
    }

    /**
     *
     * get Cookie
     */

  }, {
    key: 'getCookie',
    value: function getCookie(cname) {
      var name = cname + '=';
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length);
        }
      }
      return '';
    }
  }]);

  return Cookies;
}();

module.exports = Cookies;

},{}],7:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 * DetectBrowser
 * Generic class for drag'n'drop input file multiple
 *
 * @author efr
 */

var DetectBrowser = function () {

  /**
   *
   * Constructor
   *
   * @param options Object settings
   */

  function DetectBrowser() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, DetectBrowser);

    //console.log('DetectBrowser');

    var defaults = {};

    // fusionne les options renseignees avec celles par defaut pour creer l'objet settings
    this.settings = $.extend({}, defaults, options);

    this.init();
  }

  /**
   *
   * Init dropzone
   *
   */

  _createClass(DetectBrowser, [{
    key: 'init',
    value: function init() {
      var self = this;
      var browsers = {};

      // Opera 8.0+
      browsers.isOpera = !!window.opr && !!window.opr.addons || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

      // Firefox 1.0+
      browsers.isFirefox = typeof InstallTrigger !== 'undefined';

      // Safari 3.0+ "[object HTMLElementConstructor]"
      browsers.isSafari = /constructor/i.test(window.HTMLElement) || function (p) {
        return p.toString() === '[object SafariRemoteNotification]';
      }(!window.safari || typeof window.safari !== 'undefined' && window.safari.pushNotification);

      // Internet Explorer 6-11
      browsers.isIE = /*@cc_on!@*/false || !!document.documentMode;

      // Edge 20+
      browsers.isEdge = !browsers.isIE && !!window.StyleMedia;

      // Chrome 1+
      browsers.isChrome = !!window.chrome && !!window.chrome.webstore;

      // Blink engine detection
      browsers.isBlink = (browsers.isChrome || browsers.isOpera) && !!window.CSS;

      //console.log('browsers : ', browsers);

      if (browsers.isOpera) {
        $('html').addClass('is-opera');
      } else if (browsers.isFirefox) {
        $('html').addClass('is-firefox');
      } else if (browsers.isSafari) {
        $('html').addClass('is-safari');
      } else if (browsers.isIE) {
        $('html').addClass('is-ie');
      } else if (browsers.isEdge) {
        $('html').addClass('is-edge');
      } else if (browsers.isChrome) {
        $('html').addClass('is-chrome');
      } else if (browsers.isBlink) {
        $('html').addClass('is-blinkra');
      }
    }

    /**
     *
     * Bind UI Actions
     *
     */

  }, {
    key: 'bindUIActions',
    value: function bindUIActions() {
      var self = this;
    }
  }]);

  return DetectBrowser;
}();

module.exports = DetectBrowser;

},{}],8:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 * ResponsiveDebug
 * shows current breakpoint in bottom left corner on resize
 * if localstorage 'responsive-debug' is true
 *
 * @author efr
 */

var ResponsiveDebug = function () {

  /**
   *
   * Constructor
   *
   * @param options Object settings
   */

  function ResponsiveDebug() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ResponsiveDebug);

    var defaults = {};

    // fusionne les options renseignees avec celles par defaut pour creer l'objet settings
    this.settings = $.extend({}, defaults, options);

    // evenements par utilisateur ex scroll hover clic touch
    this.bindUIActions();
  }

  /**
   *
   * doneResizing
   *
   */

  _createClass(ResponsiveDebug, [{
    key: 'doneResizing',
    value: function doneResizing() {
      var self = this;
      self.$responsiveHelper.removeClass('as--visible');
    }

    /**
     *
     * Bind UI Actions
     *
     */

  }, {
    key: 'bindUIActions',
    value: function bindUIActions() {
      var self = this;
      if (localStorage.getItem('responsive-debug')) {
        self.$responsiveHelper = $('<div/>');
        var resizeId = void 0;
        self.$responsiveHelper.addClass('responsive-helper').appendTo($('body'));
        $(window).on('resize', function () {
          self.$responsiveHelper.addClass('as--visible');
          clearTimeout(resizeId);
          resizeId = setTimeout(function () {
            self.doneResizing();
          }, 500);
        });
      }
    }
  }]);

  return ResponsiveDebug;
}();

module.exports = ResponsiveDebug;

},{}],9:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 * ScrollAnchor
 * Generic class to have a smooth scroll when going to an anchor
 *
 * @author sdi
 */

/**
 *
 * HTML minimal example template
 *
 * a.js-scroll-anchor[href="#anchor"]
 * ...
 * #anchor
 */

var ScrollAnchor = function () {

  /**
   *
   * Constructor
   *
   * @param options Object settings
   */

  function ScrollAnchor() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ScrollAnchor);

    var defaults = {
      container: '#body',
      cta: 'a.js-scroll-anchor', //was  'a[href^="#"]:not([href="#"])' / solution CPE : 'a[href^="#"]:not([href="#"]):not(.no-scroll-to)'
      mode: 'easeInOutQuad', // animation type
      delay: 300, // animation duration
      target: null,
      durationMax: 1000,
      distanceMax: 1000
    };

    // fusionne les options renseignees avec celles par defaut pour creer l'objet settings
    this.settings = $.extend({}, defaults, options);

    // evenements par utilisateur ex scroll hover clic touch
    this.bindUIActions();
  }

  /**
   *
   * Scroll Action
   *
   */

  _createClass(ScrollAnchor, [{
    key: 'scroll',
    value: function scroll(target) {
      var self = this;

      var targetScroll = 0;
      var iHeaderHeight = 0; // edit this code if u have sticky header
      if (typeof target === 'string') {
        targetScroll = $(target).offset().top - iHeaderHeight;
      } else if (typeof target === 'number') {
        targetScroll = target;
      } else if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object' && target.length) {
        var $target = target;
        targetScroll = $target.offset().top - iHeaderHeight;
      } else {
        return;
      }
      $('html, body').animate({ // html pour firefox, body pour chrome
        scrollTop: targetScroll
      }, self.settings.delay, self.settings.mode, function () {
        // mettre un tabindex="-1" sur la cible si c'est un element qui ne recoit pas le focus par defaut
        $(target).focus();
      });
    }

    /**
     *
     * Bind UI Actions
     *
     */

  }, {
    key: 'bindUIActions',
    value: function bindUIActions() {
      var self = this;
      $(self.settings.container).on('click', self.settings.cta, function (event) {
        event.preventDefault();
        var target = $(this).attr('href');
        self.scroll(target);
        return false;
      });
    }
  }]);

  return ScrollAnchor;
}();

module.exports = ScrollAnchor;

},{}],10:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 * ShowPassword
 * Generic class to show the content of a password input
 *
 * @author mha / efr
 */

/**
 *
 * HTML minimal example template
 *
 * <div class="form-field as--btn-password as--icon">
 *   <div>
 *     <input type="password" value="myPassword">
 *       <i class="btn-password icon btn-password-show" title="Afficher le mot de passe">
 *         {% include "../../assets/img/svg.twig/icon-eye.svg.twig" %}
 *       </i>
 *       <i class="btn-password icon btn-password-hide" title="Masquer le mot de passe">
 *         {% include "../../assets/img/svg.twig/icon-eye-closed.svg.twig" %}
 *       </i>
 *   </div>
 * </div>
 *
 */
var ShowPassword = function () {

  /**
   *
   * Constructor
   *
   * @param options Object settings
   */

  function ShowPassword() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ShowPassword);

    var defaults = {
      container: '.as--btn-password',
      input: 'input',
      className: 'as--visible',
      cta: '.btn-password'
    };

    // fusionne les options renseignees avec celles par defaut pour creer l'objet settings
    this.settings = $.extend({}, defaults, options);

    // evenements par utilisateur ex scroll hover clic touch
    this.bindUIActions();
  }

  /**
   *
   * Show
   *
   * @param elem Object element to show
   */

  _createClass(ShowPassword, [{
    key: 'show',
    value: function show(elem) {
      var self = this;

      $(elem).addClass(self.settings.className);
      $(elem).find(self.settings.input).attr('type', 'text');
    }

    /**
     *
     * Hide
     *
     * @param elem Object element to hide
     */

  }, {
    key: 'hide',
    value: function hide(elem) {
      var self = this;

      $(elem).removeClass(self.settings.className);
      $(elem).find(self.settings.input).attr('type', 'password');
    }

    /**
     *
     * Toggle
     *
     * @param elem Object element to toggle
     */

  }, {
    key: 'toggle',
    value: function toggle(elem) {
      var self = this;

      if ($(elem).is('.' + self.settings.className)) {
        self.hide(elem);
      } else {
        self.show(elem);
      }
    }

    /**
     *
     * Bind UI Actions
     *
     */

  }, {
    key: 'bindUIActions',
    value: function bindUIActions() {
      var self = this;

      $(self.settings.container).on('click', self.settings.cta, function () {
        var elem = $(this).closest(self.settings.container);
        self.toggle(elem);
      });
    }
  }]);

  return ShowPassword;
}();

module.exports = ShowPassword;

},{}],11:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * ValidForm
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * A litte class which provide form validation on the fly be-passing html5 validation
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Laurent GUITTON
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _store = require('../_store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValidForm = function () {

  /**
   *
   * Constructor
   *
   * @param exemple String Exemple string
   */

  function ValidForm() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ValidForm);

    var defaults = {
      container: '.valid-form',
      fieldContainer: '.form-field',
      input: 'input[required],select[required],textarea[required]',
      validClass: 'as--valid',
      invalidClass: 'as--invalid',
      msgErrorClass: 'form-msg-error',
      submitBtn: '[submit]',
      resetBtn: '[reset]',
      defaultRequiredMsg: _store2.default.defaultRequiredMsg,
      defaultErrorMsg: _store2.default.defaultErrorMsg,
      defaultPwdErrorMsg: _store2.default.defaultPwdErrorMsg,
      validate: false
    };

    // fusionne les options renseignees avec celles par defaut pour creer l'objet settings
    this.settings = $.extend({}, defaults, options);

    // evenements par utilisateur ex scroll hover clic touch
    this.bindUIActions();
  }

  /**
   *
   * Show message
   *
   * @return void
   */

  _createClass(ValidForm, [{
    key: 'formCheck',
    value: function formCheck(input, callback) {
      var self = this;
      var $inputElement = $('#' + input);
      var $inputParent = $inputElement.closest(self.settings.fieldContainer);
      var $inputErrorContainer = void 0;

      if ($('#' + input + '-error').length > 0) {
        $inputErrorContainer = $('#' + input + '-error');
      } else {
        $inputParent.append('<div class="' + self.settings.msgErrorClass + '" id="' + input + '-error" />');
        $inputErrorContainer = $('#' + input + '-error');
      }

      var requireMsg = void 0;
      if ($inputElement.attr('data-msg-required')) {
        requireMsg = $inputElement.attr('data-msg-required');
      } else {
        requireMsg = self.settings.defaultRequiredMsg;
      }
      var errorMsg = void 0;
      if ($inputElement.attr('data-msg-error')) {
        errorMsg = $inputElement.attr('data-msg-error');
      } else {
        errorMsg = self.settings.defaultErrorMsg;
      }

      $inputElement.attr('aria-invalid', !$inputElement[0].checkValidity());

      if ($inputElement.attr('data-pwd') === 'confirmation') {
        var password1 = $('[data-pwd="initial"]').val();
        var password2 = $inputElement.val();
        if (password2 !== password1 || !password2) {
          $inputParent.addClass(self.settings.invalidClass).removeClass(self.settings.validClass);
          if (!$inputErrorContainer.length) {
            $inputParent.append('<div class="' + self.settings.msgErrorClass + '" id="' + input + '-error">' + self.settings.pwdmsgError + '</div>');
          }
        } else {
          $inputParent.addClass(self.settings.validClass).removeClass(self.settings.invalidClass);
          $inputErrorContainer.remove();
        }
      } else {
        if (!$inputElement[0].checkValidity()) {
          // Si checkValidity renvoie false : invalide

          if ($inputElement.val() === '') {
            $inputErrorContainer.html(requireMsg);
          } else {
            $inputErrorContainer.html(errorMsg);
          }

          $inputParent.addClass(self.settings.invalidClass).removeClass(self.settings.validClass);
          $inputElement.attr('aria-describedby', input + '-error');
        } else {
          // Si checkValidity renvoie true : valide
          if ($inputErrorContainer.length > 0) {
            $inputErrorContainer.html('');
          }
          $inputParent.addClass(self.settings.validClass).removeClass(self.settings.invalidClass);
          $inputElement.attr('aria-describedby', false);
          if (callback) {
            callback();
          }
        }
      }
    }

    /**
     *
     * Bind UI Actions
     *
     */

  }, {
    key: 'bindUIActions',
    value: function bindUIActions() {
      var self = this;
      $('body').on('blur', self.settings.container + ' ' + self.settings.input, function () {
        self.formCheck(this.id);
      });

      // On SUBMIT :

      $('.valid-form').on('submit', function (e) {
        $(self.settings.container).addClass('as--submited');
        var iLength = $(self.settings.input).length;
        $(self.settings.input).each(function (index) {
          self.formCheck($(this)[0].id);
          if (index >= iLength - 1) {
            var invalidInputs = $('[aria-invalid="true"]');
            if (invalidInputs.length > 0) {
              invalidInputs[0].focus();
            } else {
              self.settings.validate = true;
            }
          }

          $(this)[0].addEventListener('invalid', function (event) {
            event.preventDefault();
          });
        });

        if (!self.settings.validate) {
          return false;
        }
      });

      // On RESET :
      /*$(self.settings.container).on('click', self.settings.resetBtn, function (e) {
        $(self.settings.container).classList.remove('as--submited');
        inputs.forEach(input => {
          let inputParent = input.closest('.form-field');
          //inputs[0].focus();
          inputParent.classList.remove('is-valid');
          inputParent.classList.remove('is-invalid');
        });
        let msgErrors = $('.form-msg-error');
        msgErrors.forEach(msgError => {
          msgError.parentNode.removeChild(msgError);
        });
      });*/
    }
  }]);

  return ValidForm;
}();

module.exports = ValidForm;

},{"../_store":2}],12:[function(require,module,exports){
'use strict';

/*global Modernizr */

var _store = require('./_store');

var _store2 = _interopRequireDefault(_store);

var _helpers = require('./_helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _ResponsiveDebug = require('./class/ResponsiveDebug');

var _ResponsiveDebug2 = _interopRequireDefault(_ResponsiveDebug);

var _Collapsible = require('./class/Collapsible');

var _Collapsible2 = _interopRequireDefault(_Collapsible);

var _ScrollAnchor = require('./class/ScrollAnchor');

var _ScrollAnchor2 = _interopRequireDefault(_ScrollAnchor);

var _ShowPassword = require('./class/ShowPassword');

var _ShowPassword2 = _interopRequireDefault(_ShowPassword);

var _ClearInput = require('./class/ClearInput');

var _ClearInput2 = _interopRequireDefault(_ClearInput);

var _DetectBrowser = require('./class/DetectBrowser');

var _DetectBrowser2 = _interopRequireDefault(_DetectBrowser);

var _Cookies = require('./class/Cookies');

var _Cookies2 = _interopRequireDefault(_Cookies);

var _BannerMessages = require('./class/BannerMessages');

var _BannerMessages2 = _interopRequireDefault(_BannerMessages);

var _ValidForm = require('./class/ValidForm');

var _ValidForm2 = _interopRequireDefault(_ValidForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import AnimatedLabelField from './class/AnimatedLabelField';
//import Colorbox from './class/Colorbox';


/**
 *
 * App
 * Main Controller
 *
 * @author acti
 * (vincegobelins, mha, efr, ...)
 */

var app = {
  init: function init() {
    if ($('.onlyMarmite').length) {
      console.warn('/!\\ If you see this warning message, it means that your are in Marmite Styleguide.\n' + 'If it\'s not the case, it means that someone has forgot to remove the class .onlyMarmite in dev template\n' + 'and many js dev code won\'t work properly. :\'(');
    }

    this.bindUI();

    /*--- initialisation des tailles de viewport ---*/
    _store2.default.currentWidth = _store2.default.wWidth = _helpers2.default.viewport().width;
    _store2.default.currentHeight = _store2.default.wHeight = _helpers2.default.viewport().height;

    _store2.default.wScroll = $(window).scrollTop();

    var self = this;

    /*--- responsive-debug ---*/
    var responsiveDebug = new _ResponsiveDebug2.default();

    /*--- detectBrowser ---*/
    var detectBrowser = new _DetectBrowser2.default();

    /*--- Validation Form ---*/
    var validForm = new _ValidForm2.default({
      /*container: '.valid-form',
      fieldContainer: '.form-field',
      validClass: 'as--valid',
      invalidClass: 'as--invalid',
      msgErrorClass: 'form-msg-error',*/
    });

    /*--- cookies ---*/
    _store2.default.cookies = new _Cookies2.default();

    /*--- Banner messages (cookies consent / warnig / news...) ---*/
    var messagesBanner = new _BannerMessages2.default();

    /*--- Skip links ---*/
    var skip = new _Collapsible2.default({
      container: '.skip',
      cta: '.skip-cta',
      className: 'as--focused',
      optionHover: true
    });

    /*--- colorbox ---*/
    /*let colorbox = new Colorbox();*/

    /*--- animation scroll ---*/
    /* Use '.js-scroll-anchor' class to trigger smooth anchor scroll*/
    _store2.default.scrollAnchor = new _ScrollAnchor2.default();

    /*--- password ---*/
    var showPassword = new _ShowPassword2.default();

    /*--- clear input ---*/
    var clearInput = new _ClearInput2.default();

    /*--- animated label ---*/
    // let form = new AnimatedLabelField();

    // responsive
    self.onResize();
  },

  checkMobile: function checkMobile() {
    if (/Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent)) {
      return true;
    }
  },

  onResize: function onResize() {
    var self = this;
  },

  onScroll: function onScroll() {
    var self = this;
  },

  bindUI: function bindUI() {
    var self = this;

    if ($('.js-item-inview').length) {
      $('.js-item-inview').each(function (i, itemInview) {
        var $itemView = $(itemInview);
        $itemView.one('inview', function (event, isInView) {
          if (isInView) {
            $itemView.addClass('is-inview');
          }
        });
      });
    }

    if (Modernizr.mq('only all')) {
      $(window).on('resize', function () {
        _store2.default.wWidth = _helpers2.default.viewport().width;
        _store2.default.wHeight = _helpers2.default.viewport().height;
        if (_store2.default.currentHeight !== _store2.default.wHeight || _store2.default.currentWidth !== _store2.default.wWidth) {
          _store2.default.currentHeight = _store2.default.wHeight;
          _store2.default.currentWidth = _store2.default.wWidth;
          /*--- timer pour le redimensionnement d'ecran ---*/
          clearTimeout(_store2.default.timerResponsive);
          _store2.default.timerResponsive = setTimeout(self.onResize.bind(self), 300);
        }
      });
    }

    document.onreadystatechange = function () {
      if (document.readyState === 'complete') {
        self.onResize();
      }
    };

    /*--- fonctions au scroll ---*/
    $(window).on('scroll', function () {
      _store2.default.wScroll = $(window).scrollTop();

      self.onScroll();
    });

    if (window.matchMedia('(min-width: 896px)').matches) {
      var body = document.body;
      var scrollUp = 'scroll-up';
      var scrollDown = 'scroll-down';
      var lastScroll = 0;
      window.addEventListener('scroll', function () {
        var currentScroll = window.pageYOffset;
        if (currentScroll <= 1) {
          body.classList.remove(scrollUp);
          return;
        } else if (currentScroll < 1) {
          body.classList.remove(scrollDown);
        }

        if (currentScroll > lastScroll && !body.classList.contains(scrollDown)) {
          // down
          body.classList.remove(scrollUp);
          body.classList.add(scrollDown);
        } else if (currentScroll < lastScroll && body.classList.contains(scrollDown)) {
          // up
          body.classList.remove(scrollDown);
          body.classList.add(scrollUp);
        }
        lastScroll = currentScroll;
      });

      $('.burger-menu .switch-buttons p:first-of-type').addClass('is-active');
      $('.burger-menu .switch-content .switch-block:first-of-type').addClass('is-active');

      var timer = void 0;
      var $firstLevelItem = $('.first-lvl > li.has-submenu');

      $firstLevelItem.mouseenter(function () {
        clearTimeout(timer);
        $(this).addClass('is-hover').siblings('li').removeClass('is-hover');
        $('body').addClass('overlay-open');
      }).mouseleave(function () {
        timer = setTimeout(function () {
          $('body').removeClass('overlay-open');
          $firstLevelItem.removeClass('is-hover');
        }, 480);
      });

      $('.burger-menu').on('click', '.burger', function () {
        $('#nav-icon').toggleClass('open');
        $('.burger-menu').toggleClass('open');
        $('body').toggleClass('overlay-open');
      });
    } else {

      $('.burger-resp').on('click', '.burger', function () {
        $('#nav-icon').toggleClass('open');
        $('.burger-resp').toggleClass('open');
        $('.menu-resp').toggleClass('is-open');
      });

      $('.menu-resp .has-submenu>a').on('click', function () {
        $(this).next('.second-lvl-resp').addClass('is-open');
      });

      $('.close-resp').on('click', function () {
        $(this).closest('.second-lvl-resp').removeClass('is-open');
      });

      var height = $('.menu-resp').height();
      $('.second-lvl-resp').css('height', height - 232 + 'px');
    }

    $('body').on('click', function (e) {
      if (!$(e.target).closest('#header').length) {
        $('body').removeClass('overlay-open');
        $('.burger-menu').removeClass('open');
        $('#nav-icon').removeClass('open');
      }
    });

    if ($('.slider-multimedia').length) {
      if ($('.overlay').length) {
        $('.slider-multimedia .overlay').on('click', function () {
          $(this).fadeOut('slow');
        });
      }
      var $slider = $('.slider-multimedia');
      $slider.each(function () {
        $(this).find('.slider-wrap').slick({
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          fade: true,
          speed: 2000,
          dots: false,
          useCSS: true,
          arrow: true,
          adaptiveHeight: true,
          pauseOnHover: true,
          prevArrow: $(this).closest('.slider-multimedia').find('.slick-prev'),
          nextArrow: $(this).closest('.slider-multimedia').find('.slick-next'),
          responsive: [{
            breakpoint: 896,
            settings: {
              swipe: true,
              draggable: true,
              adaptiveHeight: true
            }
          }]
        });
      });
    }

    if ($('.slider-key-number').length) {
      var _$slider = $('.slider-key-number');
      _$slider.each(function () {
        $(this).find('.slider-wrap').slick({
          infinite: true,
          slidesToShow: 3,
          slidesToScroll: 1,
          speed: 1000,
          dots: false,
          arrow: true,
          pauseOnHover: true,
          prevArrow: $(this).closest('.slider-key-number').find('.slick-prev'),
          nextArrow: $(this).closest('.slider-key-number').find('.slick-next'),
          responsive: [{
            breakpoint: 1200,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              swipe: true,
              draggable: true
            }
          }]
        });
      });
    }

    if ($('.switch-block').length) {
      $('.switch-container').each(function () {
        var $this = $(this);
        $this.find('.switch-buttons').on('click', 'p', function () {
          $(this).addClass('is-active');
          $(this).siblings().removeClass('is-active');

          var buttonData = $(this).attr('data-switch');
          $this.find('.switch-block').each(function () {
            var blockData = $(this).attr('data-switch');
            if (buttonData === blockData) {
              $(this).addClass('is-active');
              $(this).siblings().removeClass('is-active');
            }
          });
        });
      });
    }

    if ($('.slider-img').length) {
      var _$slider2 = $('.slider-img');
      var $status = $('.counter-slider');

      _$slider2.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
        var i = (currentSlide ? currentSlide : 0) + 1;
        $status.html('<span class="current_slide">' + i + '</span><span class="slash">/</span><span class="total_slides">' + slick.slideCount + '</span>');
      });

      _$slider2.each(function () {
        $(this).find('.slider-wrap').slick({
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
          arrow: true,
          autoplay: true,
          autoplaySpeed: 8000,
          prevArrow: $(this).closest('.slider-img').siblings('.white-block, .triangle-counter').find('.slick-prev'),
          nextArrow: $(this).closest('.slider-img').siblings('.white-block, .triangle-counter').find('.slick-next')
        });
      });
    }

    if ($('.slider-products').length) {
      var _$slider3 = $('.slider-products');

      _$slider3.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
        var $SlickPrevActive = $('.slider-products .slick-active').prev().find('.slide').attr('data-categorie');
        var $SlickNextActive = $('.slider-products .slick-active').next().find('.slide').attr('data-categorie');
        $('.categorie-prev').text($SlickPrevActive);
        $('.categorie-next').text($SlickNextActive);
      });

      _$slider3.each(function () {
        $(this).find('.slider-wrap').slick({
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 8000,
          dots: false,
          arrow: true,
          prevArrow: $(this).closest('.full-block-home').find('.slick-prev'),
          nextArrow: $(this).closest('.full-block-home').find('.slick-next')
        });
      });
    }

    if ($('.slider-partners').length) {
      var _$slider4 = $('.slider-partners');

      _$slider4.each(function () {
        $(this).find('.slider-wrap').slick({
          infinite: true,
          slidesToShow: 3,
          slidesToScroll: 1,
          variableWidth: true,
          dots: false,
          arrow: true,
          draggable: true,
          prevArrow: $(this).closest('.block-partners').find('.slick-prev'),
          nextArrow: $(this).closest('.block-partners').find('.slick-next'),
          responsive: [{
            breakpoint: 1200,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              swipe: true,
              draggable: true,
              variableWidth: false
            }
          }]
        });
      });
    }

    if ($('.slider-actus').length) {
      var _$slider5 = $('.slider-actus');

      _$slider5.each(function () {
        $(this).find('.slider-wrap').slick({
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          fade: true,
          speed: 900,
          dots: false,
          arrow: true,
          draggable: true,
          prevArrow: $(this).closest('.block-actus').find('.slick-prev'),
          nextArrow: $(this).closest('.block-actus').find('.slick-next'),
          responsive: [{
            breakpoint: 1200,
            settings: {
              adaptiveHeight: true,
              speed: 300
            }
          }]
        });
      });
    }

    // if($('.list-to-show').length){
    //   let countCards = 0;
    //   $('.card').each(function(){
    //     if(countCards < 6){
    //       $(this).addClass('is-visible');
    //       countCards++;
    //     }
    //   });
    //
    //   setTimeout(function() {
    //     if($('.card').length < 6){
    //       $('.see-more').css('display', 'none');
    //     }
    //   }, 100);
    //
    //   $('.list-to-show').on('click', '.see-more', function(){
    //     countCards = 0;
    //     $('.card:not(.is-visible)').each(function(){
    //       if(countCards < 6){
    //         $(this).addClass('is-visible');
    //         countCards++;
    //         setTimeout(function(){
    //           if($('.card').length === $('.is-visible').length){
    //             $('.see-more').fadeOut();
    //           }
    //         }, 100);
    //       }
    //     });
    //   });
    // }

    if ($('.block-accordeon').length) {
      $('.block-accordeon').each(function () {
        var thisAccordeon = $(this);
        thisAccordeon.on('click', 'input[type=checkbox]', function () {
          $(this).closest('.tab').siblings().find('input[type=checkbox]').prop('checked', false);
        });
      });
    }

    if ($('.pop-in-button').length) {
      $('.pop-in-button').on('click', function () {
        var target = $(this).attr('data-target');
        $(target).addClass('is-show');
        $('body').addClass('overlay-show');
      });
      $(document).mouseup(function (e) {
        var container = $('.pop-in, .pop-in-button');
        if (!container.is(e.target) && container.has(e.target).length === 0) {
          container.removeClass('is-show');
          $('body').removeClass('overlay-show');
        }
      });
      $('.pop-in .close').on('click', function () {
        $('.pop-in').removeClass('is-show');
        $('body').removeClass('overlay-show');
      });
    }

    if ($('.slider-hexagone').length && window.matchMedia('(max-width: 1200px)').matches) {
      $('.slider-hexagone').each(function () {
        $(this).find('.slider-wrap').slick({
          slidesToShow: 1,
          centerMode: true,
          variableWidth: true,
          dots: true,
          arrow: false,
          swipeToSlide: true,
          swipe: true,
          initialSlide: 1
        });
      });
    }
  }
};

app.init();

// global custom functions, they can be called from anywhere within the project (useful for the back-end developers)
var customFunctions = {
  // global custom function example
  // to call it from anywhere : global.customFunction.afterAjaxExample();
  /*afterAjaxExample: function() {
   helpers.resizeImg('.media-block-news');
   }*/
};
// exports the elements that need to be accessed from somewhere else (in the "global" standalone object, cf. gulpfile)
module.exports = customFunctions;

},{"./_helpers":1,"./_store":2,"./class/BannerMessages":3,"./class/ClearInput":4,"./class/Collapsible":5,"./class/Cookies":6,"./class/DetectBrowser":7,"./class/ResponsiveDebug":8,"./class/ScrollAnchor":9,"./class/ShowPassword":10,"./class/ValidForm":11}]},{},[12])(12)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtYXJtaXRlLXNyYy9hc3NldHMvanMvX2hlbHBlcnMuanMiLCJtYXJtaXRlLXNyYy9hc3NldHMvanMvX3N0b3JlLmpzIiwibWFybWl0ZS1zcmMvYXNzZXRzL2pzL2NsYXNzL0Jhbm5lck1lc3NhZ2VzLmpzIiwibWFybWl0ZS1zcmMvYXNzZXRzL2pzL2NsYXNzL0NsZWFySW5wdXQuanMiLCJtYXJtaXRlLXNyYy9hc3NldHMvanMvY2xhc3MvQ29sbGFwc2libGUuanMiLCJtYXJtaXRlLXNyYy9hc3NldHMvanMvY2xhc3MvQ29va2llcy5qcyIsIm1hcm1pdGUtc3JjL2Fzc2V0cy9qcy9jbGFzcy9EZXRlY3RCcm93c2VyLmpzIiwibWFybWl0ZS1zcmMvYXNzZXRzL2pzL2NsYXNzL1Jlc3BvbnNpdmVEZWJ1Zy5qcyIsIm1hcm1pdGUtc3JjL2Fzc2V0cy9qcy9jbGFzcy9TY3JvbGxBbmNob3IuanMiLCJtYXJtaXRlLXNyYy9hc3NldHMvanMvY2xhc3MvU2hvd1Bhc3N3b3JkLmpzIiwibWFybWl0ZS1zcmMvYXNzZXRzL2pzL2NsYXNzL1ZhbGlkRm9ybS5qcyIsIm1hcm1pdGUtc3JjL2Fzc2V0cy9qcy9zY3JpcHRzLWZyb250LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FBRUE7Ozs7Ozs7O0FBUUEsSUFBTSxVQUFVO0FBQ1o7QUFDQTtBQUNBLGNBQVUsb0JBQVk7QUFDbEIsWUFBSSxJQUFJLE1BQVI7QUFBQSxZQUFnQixJQUFJLE9BQXBCO0FBQ0EsWUFBSSxFQUFFLGdCQUFnQixNQUFsQixDQUFKLEVBQStCO0FBQzNCLGdCQUFJLFFBQUo7QUFDQSxnQkFBSSxTQUFTLGVBQVQsSUFBNEIsU0FBUyxJQUF6QztBQUNIO0FBQ0QsZUFBTztBQUNILG1CQUFPLEVBQUcsSUFBSSxPQUFQLENBREo7QUFFSCxvQkFBUSxFQUFHLElBQUksUUFBUDtBQUZMLFNBQVA7QUFJSDtBQWJX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a0JBQWtCO0FBQ3BCO0FBQ0E7QUFDQTs7O0FBSG9CLENBQXRCO0FBT0E7QUFDQSxPQUFPLE9BQVAsR0FBaUIsZUFBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuKlxyXG4qIEdsb2JhbCBoZWxwZXIgZnVuY3Rpb25zXHJcbiogVGhleSBjYW4gYmUgY2FsbGVkIGZyb20gYW55IEpTIENsYXNzLCBwcm92aWRlZCB0aGV5IGFyZSBpbXBvcnRlZFxyXG4qXHJcbiogQGF1dGhvciBtaGFcclxuKi9cclxuXHJcbmNvbnN0IGhlbHBlcnMgPSB7XHJcbiAgICAvLyBnZXQgdmlld3BvcnQgc2l6ZSwgd2l0aG91dCBzY3JvbGxiYXJcclxuICAgIC8vIHRvIGNhbGwgaXQgZnJvbSBhbnl3aGVyZSBlbHNlIHRoYW4gaGVyZSA6IGdsb2JhbC5oZWxwZXJzLnZpZXdwb3J0KCkgKGV4IDogIGdsb2JhbC5oZWxwZXJzLnZpZXdwb3J0KCkud2lkdGggKVxyXG4gICAgdmlld3BvcnQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZSA9IHdpbmRvdywgYSA9ICdpbm5lcic7XHJcbiAgICAgICAgaWYgKCEoJ2lubmVyV2lkdGgnIGluIHdpbmRvdykpIHtcclxuICAgICAgICAgICAgYSA9ICdjbGllbnQnO1xyXG4gICAgICAgICAgICBlID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IHx8IGRvY3VtZW50LmJvZHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHdpZHRoOiBlWyBhICsgJ1dpZHRoJyBdLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IGVbIGEgKyAnSGVpZ2h0JyBdXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaGVscGVycztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLyoqXHJcbiAqXHJcbiAqIEdsb2JhbCB2YXJpYWJsZXNcclxuICogVGhleSBjYW4gYmUgY2FsbGVkIGZyb20gYW55IEpTIENsYXNzLCBwcm92aWRlZCB0aGV5IGFyZSBpbXBvcnRlZFxyXG4gKlxyXG4gKiBAYXV0aG9yIG1oYVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0ZGF0YShuYW1lKSB7XHJcbiAgcmV0dXJuICQoJ21ldGFbcHJvcGVydHk9JyArIEpTT04uc3RyaW5naWZ5KG5hbWUpICsgJ10nKS5hdHRyKCdjb250ZW50Jyk7XHJcbn1cclxuY29uc3Qgc3RvcmUgPSB7XHJcbiAgcHJvamVjdEpzTmFtZTogZ2V0ZGF0YSgnYXBwOnNpdGVfZGF0YTpwcm9qZWN0SnNOYW1lJyksXHJcbiAgYUF2YWlsYWJsZU1hcmtlcnNUeXBlOiBnZXRkYXRhKCdhcHA6c2l0ZV9kYXRhOmFBdmFpbGFibGVNYXJrZXJzVHlwZScpLFxyXG4gIHNSb290UGF0aDogZ2V0ZGF0YSgnYXBwOnNpdGVfZGF0YTpzUm9vdFBhdGgnKSxcclxuICBzTWFya2Vyc1BhdGg6IGdldGRhdGEoJ2FwcDpzaXRlX2RhdGE6c01hcmtlcnNQYXRoJyksXHJcbiAgZGVmYXVsdFJlcXVpcmVkTXNnOiBnZXRkYXRhKCdhcHA6c2l0ZV9kYXRhOmRlZmF1bHRSZXF1aXJlZE1zZycpLFxyXG4gIGRlZmF1bHRFcnJvck1zZzogZ2V0ZGF0YSgnYXBwOnNpdGVfZGF0YTpkZWZhdWx0RXJyb3JNc2cnKSxcclxuICBkZWZhdWx0UHdkRXJyb3JNc2c6IGdldGRhdGEoJ2FwcDpzaXRlX2RhdGE6ZGVmYXVsdFB3ZEVycm9yTXNnJyksXHJcbiAgd1dpZHRoOiAwLFxyXG4gIHdIZWlnaHQ6IDAsXHJcbiAgY3VycmVudFdpZHRoOiAwLFxyXG4gIGN1cnJlbnRIZWlnaHQ6IDAsXHJcbiAgdGltZXJSZXNwb25zaXZlOiAwLFxyXG4gIHdTY3JvbGw6IDAsXHJcbiAgbXExOiAnb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDI1ZW0pJyxcclxuICBtcTI6ICdvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogMzJlbSknLFxyXG4gIG1xMzogJ29ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiAzOWVtKScsXHJcbiAgbXE0OiAnb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDUyZW0pJyxcclxuICBtcTU6ICdvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNThlbSknLFxyXG4gIG1xNjogJ29ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA3MGVtKScsXHJcbiAgbXE3OiAnb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDg1ZW0pJ1xyXG5cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHN0b3JlO1xyXG4iLCJpbXBvcnQgc3RvcmUgZnJvbSAnLi4vX3N0b3JlJztcclxuLyoqXHJcbiAqXHJcbiAqIEJhbm5lck1lc3NhZ2VzXHJcbiAqIEdlbmVyaWMgY2xhc3MgZm9yIG1lc3NhZ2VzIGVsZW1lbnRzIDogY29va2llcyAvIHdhcm5pbmcgLyBuZXdzXHJcbiAqXHJcbiAqIEBhdXRob3IgZWZyXHJcbiAqL1xyXG5cclxuXHJcbmNsYXNzIEJhbm5lck1lc3NhZ2VzIHtcclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBDb25zdHJ1Y3RvclxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBMaXN0IG9mIHNldHRpbmdzXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMucHJvamVjdCAtIFByb2plY3QgbmFtZSBpbiBjYW1lbENhc2Ugd2l0Y2ggcHJlZml4IHRoZSBjb29ja2llIG5hbWVcclxuICAgKiBAcGFyYW0ge251bWJlcn0gb3B0aW9ucy5jYXBpbmcgLSBTcGVjY2lmeSB0aGUgbnVtYmVyIG9mIHRpbWUgdGhlIGJhbm5lciBkaXNwbGF5XHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuY29udGFpbmVyIC0gVGhlIHNlbGVjdG9yIG9mIHRoZSBiYW5uZXJcclxuICAgKi9cclxuXHJcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XHJcblxyXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XHJcbiAgICAgIHByb2plY3Q6IHN0b3JlLnByb2plY3RKc05hbWUsXHJcbiAgICAgIGJhbm5lck5hbWU6ICcnLFxyXG4gICAgICBoaWRlSnM6IHRydWUsIC8vIGlmIGhpZGVKcyA9PSB0cnVlLCBoaWRlQ2xhc3MgaXMgbm90ZSBuZWVkZWRcclxuICAgICAgaGlkZUNsYXNzOiAnaGlkZS1iYW5uZXInLCAvLyBjbGFzcyB0byBhbmltYXRlIHRoZSBoaWRlIGlmIGhpZGVKcyA9IGZhbHNlXHJcbiAgICAgIGhpZGRlbkNsYXNzOiAnYXMtLWhpZGRlbicsIC8vIGNsYXNzIHRvIHJlbW92ZSB3aGVuIGJhbm5lciBpcyBoaWRkZW4gYnkgZGVmYXVsdFxyXG4gICAgICBjYXBpbmc6IDAsXHJcbiAgICAgIGNvbnRhaW5lcjogJy5jLWJhbm5lci1tZXNzYWdlcycsXHJcbiAgICAgIGR1cmF0aW9uTGlmZTogMzY1KzMwLFxyXG4gICAgICByZW1vdmU6IHRydWUsXHJcbiAgICB9O1xyXG4gICAgY29uc3QgcHJpdmF0ZXNPcHRpb25zID0ge1xyXG4gICAgICByZXNldDogJy5zZy1iYW5uZXItbWVzc2FnZXMtcmVzZXQnLCAvLyAvIVxcIHVzZSBvbmx5IGluIHN0eWxlcy50d2lnXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIGZ1c2lvbm5lIGxlcyBvcHRpb25zIHJlbnNlaWduZWVzIGF2ZWMgY2VsbGVzIHBhciBkZWZhdXQgcG91ciBjcmVlciBsJ29iamV0IHNldHRpbmdzXHJcbiAgICB0aGlzLnNldHRpbmdzID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCBvcHRpb25zLCBwcml2YXRlc09wdGlvbnMpO1xyXG5cclxuICAgIHRoaXMuYmluZFVJKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIGhpZGVCYW5uZXJcclxuICAgKi9cclxuXHJcbiAgaGlkZUJhbm5lcigkYmFubmVyLCBhY2NlcHQpIHtcclxuICAgIC8vY29uc29sZS5sb2coJ2hpZGVCYW5uZXIgOiAnLCAkYmFubmVyKTtcclxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgY29uc3QgYWNjZXB0Q29va3kgPSBhY2NlcHQgfHwgZmFsc2U7XHJcbiAgICBjb25zdCBzZXR0aW5ncyA9ICRiYW5uZXIuZGF0YSgnYmFubmVyLXNldHRpbmdzJyk7XHJcbiAgICBjb25zdCBiYW5uZXJDb29reU5hbWUgPSBzZXR0aW5ncy5iYW5uZXJDb29reU5hbWU7XHJcbiAgICAvL2NvbnNvbGUubG9nKCckYmFubmVyIDogJywgJGJhbm5lcik7XHJcbiAgICAvL2NvbnNvbGUubG9nKCdiYW5uZXJDb29reU5hbWUgOiAnLCBiYW5uZXJDb29reU5hbWUpO1xyXG4gICAgaWYoYWNjZXB0Q29va3kgPT09IHRydWUpIHtcclxuICAgICAgc3RvcmUuY29va2llcy5zZXRDb29raWUoYmFubmVyQ29va3lOYW1lLHRydWUsc2V0dGluZ3MuZHVyYXRpb25MaWZlKTtcclxuICAgIH1cclxuICAgIGlmKHNldHRpbmdzLmhpZGVKcyA9PT0gdHJ1ZSkge1xyXG4gICAgICAkYmFubmVyLmFuaW1hdGUoe2hlaWdodDonaGlkZScsIHBhZGRpbmdUb3A6IDAsIHBhZGRpbmdCb3R0b206IDB9LCAzNTAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkYmFubmVyLnJlbW92ZSgpO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICRiYW5uZXIuYWRkQ2xhc3Moc2V0dGluZ3MuaGlkZUNsYXNzKTtcclxuICAgIH1cclxuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oYmFubmVyQ29va3lOYW1lLCAxKTtcclxuICAgIC8vIHNob3cgZGVsZXRlIGNvb2tpZXMgYnV0dG9uIG9ubHkgaW4gc3R5bGVzLnR3aWdcclxuICAgICQoc2VsZi5zZXR0aW5ncy5yZXNldCkucGFyZW50KCdwJykucmVtb3ZlQ2xhc3MoJ2FzLS1oaWRkZW4nKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogYmluZFVJXHJcbiAgICovXHJcblxyXG4gIGJpbmRVSSgpIHtcclxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgY29uc3QgYUV4aXN0aW5nQ29va2llcyA9IFtdO1xyXG4gICAgLyogQmFubmVyIG1lc3NhZ2VzICovXHJcbiAgICAkKHNlbGYuc2V0dGluZ3MuY29udGFpbmVyKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgY29uc3QgJGJhbm5lciA9ICQodGhpcyk7XHJcbiAgICAgIGNvbnN0IHByb2plY3RCYW5uZXJOYW1lID0gc2VsZi5zZXR0aW5ncy5wcm9qZWN0O1xyXG4gICAgICBjb25zdCBzZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCBzZWxmLnNldHRpbmdzLCAkKHRoaXMpLmRhdGEoJ2Jhbm5lci1vcHRpb25zJykgfHx7fSk7XHJcbiAgICAgIGNvbnN0IGJhbm5lck5hbWUgPSBzZXR0aW5ncy5iYW5uZXJOYW1lO1xyXG4gICAgICAvL2NvbnNvbGUubG9nKCdzZXR0aW5ncyA6ICcsIHNldHRpbmdzKTtcclxuICAgICAgaWYoYmFubmVyTmFtZSA9PT0gJycpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdCYW5uZXJNZXNzYWdlcyAtIFlvdSBtdXN0IHNldCB0aGUgXCJiYW5uZXJOYW1lXCIgaW4gZGF0YS1iYW5uZXItb3B0aW9ucyAtIGNhbWVsQ2FzZSBvbmx5Jyk7XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgYmFubmVyQ29va3lOYW1lID0gc2V0dGluZ3MuYmFubmVyQ29va3lOYW1lID0gcHJvamVjdEJhbm5lck5hbWUgKyAnQmFubmVyTWVzc2FnZXMnICsgYmFubmVyTmFtZTtcclxuICAgICAgY29uc3QgYmFubmVyQ29va3lOYW1lQ2FwaW5nID0gc2V0dGluZ3MuYmFubmVyQ29va3lOYW1lQ2FwaW5nID0gcHJvamVjdEJhbm5lck5hbWUgKyAnQmFubmVyTWVzc2FnZXNDYXBpbmcnICsgYmFubmVyTmFtZTtcclxuICAgICAgYUV4aXN0aW5nQ29va2llcy5wdXNoKGJhbm5lckNvb2t5TmFtZSk7XHJcbiAgICAgIGlmKCQuaW5BcnJheShhRXhpc3RpbmdDb29raWVzLCBiYW5uZXJDb29reU5hbWUpICE9PSAtMSkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Jhbm5lck1lc3NhZ2VzIC0gXCJiYW5uZXJOYW1lIDogJyArIGJhbm5lck5hbWUgKyAnXCIgaXMgYWxyZWFkeSBzZXQgZm9yIGFuIG90aGVyIGJhbm5lciAtIGNhbWVsQ2FzZSBvbmx5Jyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBiYW5uZXJNZXNzYWdlcyA9IHN0b3JlLmNvb2tpZXMuZ2V0Q29va2llKGJhbm5lckNvb2t5TmFtZSk7XHJcbiAgICAgIGlmKHNldHRpbmdzLmhpZGVKcyA9PT0gZmFsc2UpIHtcclxuICAgICAgICAkYmFubmVyLmFkZENsYXNzKCdoYXMtdHJhbnNpdGlvbicpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKHR5cGVvZiBzZXR0aW5ncy5jYXBpbmcgPT09ICdudW1iZXInICYmIHNldHRpbmdzLmNhcGluZyA+IDApIHtcclxuICAgICAgICBsZXQgYmFubmVyTWVzc2FnZXNDYXBpbmcgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGJhbm5lckNvb2t5TmFtZUNhcGluZyk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnYmFubmVyTWVzc2FnZXNDYXBpbmcgOiAnLCBiYW5uZXJNZXNzYWdlc0NhcGluZyk7XHJcbiAgICAgICAgaWYoYmFubmVyTWVzc2FnZXNDYXBpbmcgIT09IG51bGwpIHtcclxuICAgICAgICAgIC8vY29uc29sZS5sb2coJ3NldEl0ZW0gZGVzY3JlYXNlJyk7XHJcbiAgICAgICAgICBpZiAocGFyc2VJbnQoYmFubmVyTWVzc2FnZXNDYXBpbmcsMTApID4gMCkge1xyXG4gICAgICAgICAgICBiYW5uZXJNZXNzYWdlc0NhcGluZy0tO1xyXG4gICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKGJhbm5lckNvb2t5TmFtZUNhcGluZywgYmFubmVyTWVzc2FnZXNDYXBpbmcpO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdiYW5uZXJNZXNzYWdlc0NhcGluZyA6ICcsIGJhbm5lck1lc3NhZ2VzQ2FwaW5nKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKCdzZXRJdGVtIGluaXQnKTtcclxuICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oYmFubmVyQ29va3lOYW1lQ2FwaW5nLCBzZXR0aW5ncy5jYXBpbmcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihwYXJzZUludChiYW5uZXJNZXNzYWdlc0NhcGluZywxMCkgPT09IDApIHtcclxuICAgICAgICAgIC8vY29uc29sZS5sb2coJ2ZvcmNlJyk7XHJcbiAgICAgICAgICBiYW5uZXJNZXNzYWdlcyA9ICcxJztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYoYmFubmVyTWVzc2FnZXMgPT09ICcnKSB7XHJcbiAgICAgICAgYmFubmVyTWVzc2FnZXMgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGJhbm5lckNvb2t5TmFtZSkgfHwgJyc7XHJcbiAgICAgIH1cclxuICAgICAgLy9jb25zb2xlLmxvZyhiYW5uZXJDb29reU5hbWUgKyAnQmFubmVyTWVzc2FnZXMgOiAnLCBiYW5uZXJNZXNzYWdlcyk7XHJcbiAgICAgIGlmKGJhbm5lck1lc3NhZ2VzICE9PSAnJykge1xyXG4gICAgICAgIGlmKHNldHRpbmdzLmhpZGVKcyA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgJGJhbm5lci5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJChzZWxmLnNldHRpbmdzLnJlc2V0KS5wYXJlbnQoJ3AnKS5yZW1vdmVDbGFzcygnYXMtLWhpZGRlbicpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICRiYW5uZXIucmVtb3ZlQ2xhc3Moc2VsZi5zZXR0aW5ncy5oaWRkZW5DbGFzcyk7XHJcbiAgICAgIH1cclxuICAgICAgLyotLS0gQmFubmVyIG1lc3NhZ2VzIDogYWNjZXB0IC8gY2xvc2UgIC0tLSovXHJcbiAgICAgIC8qJChzZXR0aW5ncy5jb250YWluZXIgKyAnIC5qcy1iYW5uZXItYnRuLWNsb3NlLCAnICsgc2V0dGluZ3MuY29udGFpbmVyICsgJyAuanMtYmFubmVyLWJ0bi1hY2NlcHQnKS5kYXRhKHtcclxuICAgICAgICBjb250YWluZXI6IHNldHRpbmdzLmNvbnRhaW5lcixcclxuICAgICAgICBiYW5uZXJDb29reU5hbWU6IGJhbm5lckNvb2t5TmFtZVxyXG4gICAgICB9KTsqL1xyXG4gICAgICAkYmFubmVyLmRhdGEoe1xyXG4gICAgICAgICdiYW5uZXItc2V0dGluZ3MnOiBzZXR0aW5nc1xyXG4gICAgICB9KTtcclxuXHJcblxyXG4gICAgICAkYmFubmVyLmZpbmQoJy5qcy1iYW5uZXItYnRuLWNsb3NlJykub24oJ2NsaWNrJyxmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBjb25zdCAkYmFubmVyID0gJCh0aGlzKS5jbG9zZXN0KCdbZGF0YS1iYW5uZXItb3B0aW9uc10nKTtcclxuICAgICAgICBzZWxmLmhpZGVCYW5uZXIoJGJhbm5lcik7XHJcbiAgICAgIH0pO1xyXG4gICAgICAkYmFubmVyLmZpbmQoJy5qcy1iYW5uZXItYnRuLWFjY2VwdCcpLm9uKCdjbGljaycsZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgLy8gbmFtZSAvIHZhbHVlIC8gZHVyYXRpb24gZGF5IHZhbGlkaXR5ICgxMyBtb250aCBtYXgpXHJcbiAgICAgICAgY29uc3QgJGJhbm5lciA9ICQodGhpcykuY2xvc2VzdCgnW2RhdGEtYmFubmVyLW9wdGlvbnNdJyk7XHJcbiAgICAgICAgc2VsZi5oaWRlQmFubmVyKCRiYW5uZXIsIHRydWUpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmKCQoc2VsZi5zZXR0aW5ncy5yZXNldCkuZGF0YSgnYUJhbm5lcnNDb29raWVzTmFtZScpKSB7XHJcbiAgICAgICAgY29uc3QgYUJhbm5lcnNDb29raWVzTmFtZSA9ICQoc2VsZi5zZXR0aW5ncy5yZXNldCkuZGF0YSgnYUJhbm5lcnNDb29raWVzTmFtZScpO1xyXG4gICAgICAgIGNvbnN0IGFCYW5uZXJzQ29va2llc05hbWVDYXBpbmcgPSAkKHNlbGYuc2V0dGluZ3MucmVzZXQpLmRhdGEoJ2FCYW5uZXJzQ29va2llc05hbWVDYXBpbmcnKTtcclxuICAgICAgICBhQmFubmVyc0Nvb2tpZXNOYW1lLnB1c2goYmFubmVyQ29va3lOYW1lKTtcclxuICAgICAgICBhQmFubmVyc0Nvb2tpZXNOYW1lQ2FwaW5nLnB1c2goYmFubmVyQ29va3lOYW1lQ2FwaW5nKTtcclxuICAgICAgICAkKHNlbGYuc2V0dGluZ3MucmVzZXQpLmRhdGEoJ2FCYW5uZXJzQ29va2llc05hbWUnLCBhQmFubmVyc0Nvb2tpZXNOYW1lKTtcclxuICAgICAgICAkKHNlbGYuc2V0dGluZ3MucmVzZXQpLmRhdGEoJ2FCYW5uZXJzQ29va2llc05hbWVDYXBpbmcnLCBhQmFubmVyc0Nvb2tpZXNOYW1lQ2FwaW5nKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkKHNlbGYuc2V0dGluZ3MucmVzZXQpLmRhdGEoJ2FCYW5uZXJzQ29va2llc05hbWUnLCBbYmFubmVyQ29va3lOYW1lXSk7XHJcbiAgICAgICAgJChzZWxmLnNldHRpbmdzLnJlc2V0KS5kYXRhKCdhQmFubmVyc0Nvb2tpZXNOYW1lQ2FwaW5nJywgW2Jhbm5lckNvb2t5TmFtZUNhcGluZ10pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIC8vIGRlbGV0ZSBvbmx5IGF2YWlsYWJsZSBpbiBzdHlsZXMudHdpZ1xyXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsc2VsZi5zZXR0aW5ncy5yZXNldCxmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGNvbnN0IGFCYW5uZXJzQ29va2llc05hbWUgPSAkKHNlbGYuc2V0dGluZ3MucmVzZXQpLmRhdGEoJ2FCYW5uZXJzQ29va2llc05hbWUnKTtcclxuICAgICAgY29uc3QgYUJhbm5lcnNDb29raWVzTmFtZUNhcGluZyA9ICQoc2VsZi5zZXR0aW5ncy5yZXNldCkuZGF0YSgnYUJhbm5lcnNDb29raWVzTmFtZUNhcGluZycpO1xyXG4gICAgICAvL2NvbnNvbGUubG9nKCdhQmFubmVyc0Nvb2tpZXNOYW1lIDogJywgYUJhbm5lcnNDb29raWVzTmFtZSk7XHJcbiAgICAgIC8vY29uc29sZS5sb2coJ2FCYW5uZXJzQ29va2llc05hbWVDYXBpbmcgOiAnLCBhQmFubmVyc0Nvb2tpZXNOYW1lQ2FwaW5nKTtcclxuICAgICAgJC5lYWNoKGFCYW5uZXJzQ29va2llc05hbWUsZnVuY3Rpb24gKGksY29va3lOYW1lKSB7XHJcbiAgICAgICAgc3RvcmUuY29va2llcy5kZWxldGVDb29raWUoY29va3lOYW1lKTtcclxuICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKGNvb2t5TmFtZSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICAkLmVhY2goYUJhbm5lcnNDb29raWVzTmFtZUNhcGluZywgZnVuY3Rpb24gKGksY29va3lOYW1lKSB7XHJcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShjb29reU5hbWUpO1xyXG4gICAgICB9KTtcclxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnY29tcG9uZW50cy5odG1sP3I9JytNYXRoLmNlaWwoTWF0aC5yYW5kb20oKSoxMDAwMDAwKSsnI3NnLWJhbm5lci1tZXNzYWdlcyc7XHJcbiAgICAgIH0sNTAwKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmFubmVyTWVzc2FnZXM7XHJcbiIsIi8qKlxyXG4gKlxyXG4gKiBDbGVhcklucHV0XHJcbiAqIEdlbmVyaWMgY2xhc3MgZm9yIGNsZWFyIGlucHV0XHJcbiAqXHJcbiAqIEBhdXRob3IgZWZyXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqXHJcbiAqIEhUTUwgbWluaW1hbCBleGFtcGxlIHRlbXBsYXRlXHJcbiAqXHJcbiAqIDxkaXYgY2xhc3M9XCJmb3JtLWZpZWxkIGFzLS1idG4tY2xlYXIgYXMtLW5vdC1lbXB0eVwiPlxyXG4gKiAgIDxkaXY+XHJcbiAqICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiB2YWx1ZT1cInZhbHVlIHRvIGNsZWFyXCI+XHJcbiAqICAgICAgICA8c3BhbiBkYXRhLWpzLWNsZWFyLWZpZWxkPiZ0aW1lczs8L3NwYW4+XHJcbiAqICAgICA8L2Rpdj5cclxuICogICA8L2Rpdj5cclxuICogPC9kaXY+XHJcbiAqXHJcbiAqL1xyXG5cclxuXHJcbmNsYXNzIENsZWFySW5wdXQge1xyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIENvbnN0cnVjdG9yXHJcbiAgICpcclxuICAgKiBAcGFyYW0gb3B0aW9ucyBPYmplY3QgTGlzdCBvZiBzZXR0aW5nc1xyXG4gICAqL1xyXG5cclxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcclxuXHJcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcclxuICAgICAgY29udGFpbmVyOiAnLmFzLS1idG4tY2xlYXInLFxyXG4gICAgICBjdGE6ICdbZGF0YS1qcy1jbGVhci1maWVsZF0nLFxyXG4gICAgICBjbGFzc05hbWU6ICdhcy0tbm90LWVtcHR5JyxcclxuICAgIH07XHJcblxyXG4gICAgLy8gZnVzaW9ubmUgbGVzIG9wdGlvbnMgcmVuc2VpZ25lZXMgYXZlYyBjZWxsZXMgcGFyIGRlZmF1dCBwb3VyIGNyZWVyIGwnb2JqZXQgc2V0dGluZ3NcclxuICAgIHRoaXMuc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xyXG5cclxuICAgIC8vIGV2ZW5lbWVudHMgcGFyIHV0aWxpc2F0ZXVyIGV4IHNjcm9sbCBob3ZlciBjbGljIHRvdWNoXHJcbiAgICB0aGlzLmJpbmRVSUFjdGlvbnMoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogQmluZCBVSSBBY3Rpb25zXHJcbiAgICpcclxuICAgKi9cclxuXHJcbiAgYmluZFVJQWN0aW9ucygpIHtcclxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgLy9jb25zb2xlLmxvZygnQ2xlYXJJbnB1dCA6ICcsIHNlbGYuc2V0dGluZ3MpO1xyXG5cclxuXHJcbiAgICAkKCdib2R5Jykub24oJ2lucHV0Jywgc2VsZi5zZXR0aW5ncy5jb250YWluZXIgKyAnIGlucHV0JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAvL2NvbnNvbGUubG9nKCd2YWwgOiAnLCAkKHRoaXMpLnZhbCgpKTtcclxuICAgICAgaWYoJCh0aGlzKS52YWwoKSAhPT0gJycpIHtcclxuICAgICAgICAkKHRoaXMpLmNsb3Nlc3Qoc2VsZi5zZXR0aW5ncy5jb250YWluZXIpLmFkZENsYXNzKHNlbGYuc2V0dGluZ3MuY2xhc3NOYW1lKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkKHRoaXMpLmNsb3Nlc3Qoc2VsZi5zZXR0aW5ncy5jb250YWluZXIpLnJlbW92ZUNsYXNzKHNlbGYuc2V0dGluZ3MuY2xhc3NOYW1lKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgc2VsZi5zZXR0aW5ncy5jdGEsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgJCh0aGlzKS5jbG9zZXN0KHNlbGYuc2V0dGluZ3MuY29udGFpbmVyKVxyXG4gICAgICAgIC5yZW1vdmVDbGFzcyhzZWxmLnNldHRpbmdzLmNsYXNzTmFtZSlcclxuICAgICAgICAuZmluZCgnaW5wdXQnKVxyXG4gICAgICAgIC52YWwoJycpXHJcbiAgICAgICAgLnRyaWdnZXIoJ2NoYW5nZScpXHJcbiAgICAgICAgLnRyaWdnZXIoJ2ZvY3VzJyk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG59XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDbGVhcklucHV0O1xyXG4iLCIvKipcclxuICpcclxuICogQ29sbGFwc2libGVcclxuICogR2VuZXJpYyBjbGFzcyBmb3IgY29sbGFwc2libGUgZWxlbWVudHNcclxuICpcclxuICogQGF1dGhvciBtaGFcclxuICovXHJcblxyXG4vKipcclxuICpcclxuICogSFRNTCBtaW5pbWFsIGV4YW1wbGUgdGVtcGxhdGVcclxuICpcclxuICogKG9wdGlvbmFsIC5vdGhlci1jb2xsYXBzaWJsZSlcclxuICogICAuY29sbGFwc2libGUgKG9wdGlvbmFsIC5hcy0tb3BlbilcclxuICogICAgIC5jdGEtb3Blbi1jb2xsYXBzaWJsZSAoYnV0dG9uIG9yIGEpXHJcbiAqICAgICAob3B0aW9uYWwgLmN0YS1jbG9zZS1jb2xsYXBzaWJsZSlcclxuICovXHJcblxyXG5jbGFzcyBDb2xsYXBzaWJsZSB7XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogQ29uc3RydWN0b3JcclxuICAgKlxyXG4gICAqIEBwYXJhbSBvcHRpb25zIE9iamVjdCBzZXR0aW5nc1xyXG4gICAqL1xyXG5cclxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcclxuXHJcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcclxuICAgICAgY29udGFpbmVyOiAnLmNvbGxhcHNpYmxlJyxcclxuICAgICAgY3RhOiAnLmN0YS1vcGVuLWNvbGxhcHNpYmxlJyxcclxuICAgICAgY2xhc3NOYW1lOiAnYXMtLW9wZW4nLFxyXG4gICAgICBvcHRpb25DbG9zZUFsbDogZmFsc2UsIC8vIHRvIGNsb3NlIGFsbCBvdGhlcnMgd2hlbiBvcGVucyBvbmVcclxuICAgICAgb3B0aW9uQ2xvc2U6IGZhbHNlLCAvLyB0aGVyZSBpcyBhIGJ1dHRvbiB0byBjbG9zZSBpdFxyXG4gICAgICBjdGFDbG9zZTogJy5jdGEtY2xvc2UtY29sbGFwc2libGUnLCAvLyBvbmx5IGlmIG9wdGlvbkNsb3NlID0gdHJ1ZVxyXG4gICAgICBvcHRpb25DbG9zZU9uQm9keTogZmFsc2UsIC8vIHRvIGNsb3NlIGFsbCB3aGVuIGNsaWNrIHNvbWV3aGVyZSBlbHNlLFxyXG4gICAgICBvcHRpb25Fc2M6IGZhbHNlLCAvLyB0byBjbG9zZSB3aXRoIEVzY2FwZSBrZXlcclxuICAgICAgb3B0aW9uSG92ZXI6IGZhbHNlLCAvLyB0byBvcGVuIG9uIGhvdmVyIC8gZm9jdXMgLyB0b3VjaHN0YXJ0XHJcbiAgICAgIG9wdGlvbkZvY3VzSW5wdXQ6IGZhbHNlLFxyXG4gICAgICBpbnB1dENvbnRhaW5lcjogJy5pbnB1dC10ZXh0JyxcclxuICAgICAgZGVsYXk6IDMwMCwgLy8gb25seSBpZiBvcHRpb25Ib3ZlciA9IHRydWVcclxuICAgICAgb3B0aW9uTm9BcmlhOiBmYWxzZSwgLy8gc3BlY2lhbCBvcHRpb24gdG8gYXZvaWQgY2hhbmdpbmcgYXJpYSBhdHRyaWJ1dGVzIChyYXJlIHVzZSBjYXNlcyksXHJcbiAgICAgIG9wdGlvbk90aGVyQ29udGFpbmVyOiB0cnVlLCAvLyBhbm90aGVyIGNvbnRhaW5lciBzaG91bGQgY2hhbmdlIGNsYXNzIGF0IHRoZSBzYW1lIHRpbWVcclxuICAgICAgb3RoZXJDb250YWluZXI6ICcub3RoZXItY29sbGFwc2libGUnLCAvLyBvbmx5IGlmIG9wdGlvbk90aGVyQ29udGFpbmVyID0gdHJ1ZVxyXG4gICAgICBvcHRpb25Gb2N1c09ubHk6IGZhbHNlIC8vIHRvIG9wZW4gb24gZm9jdXMgLyB0b3VjaHN0YXJ0IG9ubHlcclxuICAgIH07XHJcblxyXG4gICAgLy8gZnVzaW9ubmUgbGVzIG9wdGlvbnMgcmVuc2VpZ25lZXMgYXZlYyBjZWxsZXMgcGFyIGRlZmF1dCBwb3VyIGNyZWVyIGwnb2JqZXQgc2V0dGluZ3NcclxuICAgIHRoaXMuc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xyXG5cclxuICAgIHRoaXMudGltZXIgPSBudWxsO1xyXG5cclxuICAgIC8vIGV2ZW5lbWVudHMgcGFyIHV0aWxpc2F0ZXVyIGV4IHNjcm9sbCBob3ZlciBjbGljIHRvdWNoXHJcbiAgICB0aGlzLmJpbmRVSUFjdGlvbnMoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogU2hvd1xyXG4gICAqXHJcbiAgICogQHBhcmFtIGVsZW0gT2JqZWN0IGVsZW1lbnQgdG8gb3BlblxyXG4gICAqL1xyXG5cclxuICBzaG93KGVsZW0pIHtcclxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICQoZWxlbSkuYWRkQ2xhc3Moc2VsZi5zZXR0aW5ncy5jbGFzc05hbWUpO1xyXG5cclxuICAgIGlmIChzZWxmLnNldHRpbmdzLm9wdGlvbk5vQXJpYSA9PT0gZmFsc2UpIHtcclxuICAgICAgdmFyIGN0YSA9ICQoZWxlbSkuZmluZChzZWxmLnNldHRpbmdzLmN0YSk7XHJcbiAgICAgIGlmICgkKGN0YSkuYXR0cignYXJpYS1leHBhbmRlZCcpKSB7XHJcbiAgICAgICAgJChjdGEpLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoc2VsZi5zZXR0aW5ncy5vcHRpb25Gb2N1c0lucHV0ID09PSB0cnVlKSB7XHJcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoZWxlbSkuZmluZChzZWxmLnNldHRpbmdzLmlucHV0Q29udGFpbmVyKS5maXJzdCgpLmZvY3VzKCk7XHJcbiAgICAgIH0sIDE1MCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNlbGYuc2V0dGluZ3Mub3B0aW9uT3RoZXJDb250YWluZXIgPT09IHRydWUpIHtcclxuICAgICAgJChlbGVtKS5jbG9zZXN0KHNlbGYuc2V0dGluZ3Mub3RoZXJDb250YWluZXIpLmFkZENsYXNzKHNlbGYuc2V0dGluZ3MuY2xhc3NOYW1lKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEhpZGVcclxuICAgKlxyXG4gICAqIEBwYXJhbSBlbGVtIE9iamVjdCBlbGVtZW50IHRvIGNsb3NlXHJcbiAgICovXHJcblxyXG4gIGhpZGUoZWxlbSkge1xyXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgJChlbGVtKS5yZW1vdmVDbGFzcyhzZWxmLnNldHRpbmdzLmNsYXNzTmFtZSk7XHJcblxyXG4gICAgaWYgKHNlbGYuc2V0dGluZ3Mub3B0aW9uTm9BcmlhID09PSBmYWxzZSkge1xyXG4gICAgICB2YXIgY3RhID0gJChlbGVtKS5maW5kKHNlbGYuc2V0dGluZ3MuY3RhKTtcclxuICAgICAgaWYgKCQoY3RhKS5hdHRyKCdhcmlhLWV4cGFuZGVkJykpIHtcclxuICAgICAgICAkKGN0YSkuYXR0cignYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNlbGYuc2V0dGluZ3Mub3B0aW9uT3RoZXJDb250YWluZXIgPT09IHRydWUpIHtcclxuICAgICAgJChlbGVtKS5jbG9zZXN0KHNlbGYuc2V0dGluZ3Mub3RoZXJDb250YWluZXIpLnJlbW92ZUNsYXNzKHNlbGYuc2V0dGluZ3MuY2xhc3NOYW1lKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogVG9nZ2xlXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZWxlbSBPYmplY3QgZWxlbWVudCB0byB0b2dnbGVcclxuICAgKi9cclxuXHJcbiAgdG9nZ2xlKGVsZW0pIHtcclxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIGlmICgkKGVsZW0pLmhhc0NsYXNzKHNlbGYuc2V0dGluZ3MuY2xhc3NOYW1lKSkge1xyXG4gICAgICBzZWxmLmhpZGUoZWxlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoc2VsZi5zZXR0aW5ncy5vcHRpb25DbG9zZUFsbCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIHNlbGYuaGlkZShzZWxmLnNldHRpbmdzLmNvbnRhaW5lcik7XHJcbiAgICAgIH1cclxuICAgICAgc2VsZi5zaG93KGVsZW0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBCaW5kIFVJIEFjdGlvbnNcclxuICAgKlxyXG4gICAqL1xyXG5cclxuICBiaW5kVUlBY3Rpb25zKCkge1xyXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgaWYgKHNlbGYuc2V0dGluZ3Mub3B0aW9uSG92ZXIgPT09IHRydWUpIHtcclxuICAgICAgLyotLS0gb24gaG92ZXIgLyBmb2N1cyAvIHRvdWNoIC0tLSovXHJcbiAgICAgICQoc2VsZi5zZXR0aW5ncy5jb250YWluZXIpLm9uKCdtb3VzZWVudGVyIGZvY3VzaW4gdG91Y2hzdGFydCcsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQoc2VsZi50aW1lckVudGVyKTtcclxuICAgICAgICBjb25zdCBlbGVtID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9ICQoZWxlbSkuY2xvc2VzdChzZWxmLnNldHRpbmdzLmNvbnRhaW5lcik7XHJcbiAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICd0b3VjaHN0YXJ0Jykge1xyXG4gICAgICAgICAgc2VsZi50b2dnbGUoY29udGFpbmVyKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdtb3VzZWVudGVyJykge1xyXG4gICAgICAgICAgICBzZWxmLnRpbWVyRW50ZXIgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgc2VsZi5oaWRlKHNlbGYuc2V0dGluZ3MuY29udGFpbmVyKTtcclxuICAgICAgICAgICAgICBzZWxmLnNob3coY29udGFpbmVyKTtcclxuICAgICAgICAgICAgfSwgc2VsZi5zZXR0aW5ncy5kZWxheSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZWxmLnNob3coY29udGFpbmVyKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICAkKHNlbGYuc2V0dGluZ3MuY29udGFpbmVyKS5vbignbW91c2VsZWF2ZSBmb2N1c291dCcsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQoc2VsZi50aW1lckxlYXZlKTtcclxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcztcclxuICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ21vdXNlbGVhdmUnKSB7XHJcbiAgICAgICAgICBzZWxmLnRpbWVyTGVhdmUgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYuaGlkZShlbGVtKTtcclxuICAgICAgICAgIH0sIHNlbGYuc2V0dGluZ3MuZGVsYXkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzZWxmLmhpZGUoZWxlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAoc2VsZi5zZXR0aW5ncy5vcHRpb25Gb2N1c09ubHkgPT09IHRydWUpIHtcclxuICAgICAgJChzZWxmLnNldHRpbmdzLmNvbnRhaW5lcikub24oJyBmb2N1c2luIHRvdWNoc3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHNlbGYudGltZXIpO1xyXG4gICAgICAgIGNvbnN0IGVsZW0gPSBldmVudC50YXJnZXQ7XHJcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gJChlbGVtKS5jbG9zZXN0KHNlbGYuc2V0dGluZ3MuY29udGFpbmVyKTtcclxuICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ3RvdWNoc3RhcnQnKSB7XHJcbiAgICAgICAgICBzZWxmLnRvZ2dsZShjb250YWluZXIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzZWxmLnNob3coY29udGFpbmVyKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICAkKHNlbGYuc2V0dGluZ3MuY29udGFpbmVyKS5vbignZm9jdXNvdXQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHNlbGYudGltZXIpO1xyXG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzO1xyXG4gICAgICAgIHNlbGYuaGlkZShlbGVtKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvKi0tLSBvbiBjbGljayAtLS0qL1xyXG4gICAgICAkKHNlbGYuc2V0dGluZ3MuY29udGFpbmVyKS5vbignY2xpY2snLCBzZWxmLnNldHRpbmdzLmN0YSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBjb25zdCBlbGVtID0gJCh0aGlzKTtcclxuICAgICAgICBjb25zdCBjb250YWluZXIgPSAkKGVsZW0pLmNsb3Nlc3Qoc2VsZi5zZXR0aW5ncy5jb250YWluZXIpO1xyXG4gICAgICAgIHNlbGYudG9nZ2xlKGNvbnRhaW5lcik7XHJcbiAgICAgIH0pO1xyXG4gICAgICAkKHNlbGYuc2V0dGluZ3MuY29udGFpbmVyKS5vbignZm9jdXNvdXQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICB2YXIgZWxlbSA9ICQodGhpcyk7XHJcbiAgICAgICAgdmFyIHRhcmdldCA9IGV2ZW50LnJlbGF0ZWRUYXJnZXQ7XHJcbiAgICAgICAgaWYgKHNlbGYuc2V0dGluZ3Mub3B0aW9uQ2xvc2VBbGwgPT09IHRydWUpIHtcclxuICAgICAgICAgIGlmICgkKHRhcmdldCkuY2xvc2VzdChlbGVtKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IC8vIGZpeCBjbGljayBvbiBzaWJsaW5ncyB1bmRlclxyXG4gICAgICAgICAgICAgIHNlbGYuaGlkZShlbGVtKTtcclxuICAgICAgICAgICAgfSwzMDApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNlbGYuc2V0dGluZ3Mub3B0aW9uQ2xvc2UgPT09IHRydWUpIHtcclxuICAgICAgJChzZWxmLnNldHRpbmdzLmNvbnRhaW5lcikub24oJ2NsaWNrJywgc2VsZi5zZXR0aW5ncy5jdGFDbG9zZSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBjb25zdCBjb250YWluZXIgPSAkKHRoaXMpLmNsb3Nlc3Qoc2VsZi5zZXR0aW5ncy5jb250YWluZXIpO1xyXG4gICAgICAgIHNlbGYuaGlkZShjb250YWluZXIpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2VsZi5zZXR0aW5ncy5vcHRpb25DbG9zZU9uQm9keSA9PT0gdHJ1ZSkge1xyXG4gICAgICAkKCcjYm9keScpLm9uKCdjbGljayBmb2N1c2luJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgICAgIGlmICgkKHRhcmdldCkuY2xvc2VzdChzZWxmLnNldHRpbmdzLmNvbnRhaW5lcikubGVuZ3RoID09PSAwICYmICEkKHRhcmdldCkuaXMoc2VsZi5zZXR0aW5ncy5jb250YWluZXIpKSB7XHJcbiAgICAgICAgICBjb25zdCBlbGVtID0gJChzZWxmLnNldHRpbmdzLmNvbnRhaW5lcik7XHJcbiAgICAgICAgICBzZWxmLmhpZGUoZWxlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2VsZi5zZXR0aW5ncy5vcHRpb25Fc2MgPT09IHRydWUpIHtcclxuICAgICAgJChzZWxmLnNldHRpbmdzLmNvbnRhaW5lcikub24oJ2tleWRvd24nLCAnaW5wdXQsIGJ1dHRvbicsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGNvbnN0IGtleSA9IGV2ZW50LndoaWNoO1xyXG4gICAgICAgIGlmIChrZXkgPT09IDI3KSB7XHJcbiAgICAgICAgICBjb25zdCBjb250YWluZXIgPSAkKHRoaXMpLmNsb3Nlc3Qoc2VsZi5zZXR0aW5ncy5jb250YWluZXIpO1xyXG4gICAgICAgICAgc2VsZi5oaWRlKGNvbnRhaW5lcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb2xsYXBzaWJsZTtcclxuIiwiLyoqXHJcbiAqXHJcbiAqIENvb2tpZXNcclxuICogR2VuZXJpYyBjbGFzcyBmb3IgY29va2llcyBlbGVtZW50c1xyXG4gKlxyXG4gKiBAYXV0aG9yIGVmclxyXG4gKi9cclxuXHJcblxyXG5jbGFzcyBDb29raWVzIHtcclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBDb25zdHJ1Y3RvclxyXG4gICAqXHJcbiAgICogQHBhcmFtIG9wdGlvbnMgT2JqZWN0IExpc3Qgb2Ygc2V0dGluZ3NcclxuICAgKi9cclxuXHJcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XHJcblxyXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIGZ1c2lvbm5lIGxlcyBvcHRpb25zIHJlbnNlaWduZWVzIGF2ZWMgY2VsbGVzIHBhciBkZWZhdXQgcG91ciBjcmVlciBsJ29iamV0IHNldHRpbmdzXHJcbiAgICB0aGlzLnNldHRpbmdzID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcclxuXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIHNldCBDb29raWVcclxuICAgKi9cclxuXHJcbiAgc2V0Q29va2llKGNuYW1lLCBjdmFsdWUsIGV4ZGF5cykge1xyXG4gICAgbGV0IGQgPSBuZXcgRGF0ZSgpO1xyXG4gICAgZC5zZXRUaW1lKGQuZ2V0VGltZSgpICsgKGV4ZGF5cyoyNCo2MCo2MCoxMDAwKSk7XHJcbiAgICBjb25zdCBleHBpcmVzID0gJ2V4cGlyZXM9JysgZC50b1VUQ1N0cmluZygpO1xyXG4gICAgZG9jdW1lbnQuY29va2llID0gY25hbWUgKyAnPScgKyBjdmFsdWUgKyAnOycgKyBleHBpcmVzICsgJztwYXRoPS8nO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBkZWxldGUgQ29va2llXHJcbiAgICovXHJcblxyXG4gIGRlbGV0ZUNvb2tpZShjbmFtZSkge1xyXG4gICAgZG9jdW1lbnQuY29va2llID0gY25hbWUgKyAnPTtleHBpcmVzPVRodSwgMDEgSmFuIDE5NzAgMDA6MDA6MDEgR01UO3BhdGg9Lyc7XHJcbiAgICBjb25zb2xlLmxvZygnZGVsZXRlQ29va2llJyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIGdldCBDb29raWVcclxuICAgKi9cclxuXHJcbiAgZ2V0Q29va2llKGNuYW1lKSB7XHJcbiAgICBjb25zdCBuYW1lID0gY25hbWUgKyAnPSc7XHJcbiAgICBjb25zdCBkZWNvZGVkQ29va2llID0gZGVjb2RlVVJJQ29tcG9uZW50KGRvY3VtZW50LmNvb2tpZSk7XHJcbiAgICBjb25zdCBjYSA9IGRlY29kZWRDb29raWUuc3BsaXQoJzsnKTtcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPGNhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGxldCBjID0gY2FbaV07XHJcbiAgICAgIHdoaWxlIChjLmNoYXJBdCgwKSA9PT0gJyAnKSB7XHJcbiAgICAgICAgYyA9IGMuc3Vic3RyaW5nKDEpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChjLmluZGV4T2YobmFtZSkgPT09IDApIHtcclxuICAgICAgICByZXR1cm4gYy5zdWJzdHJpbmcobmFtZS5sZW5ndGgsIGMubGVuZ3RoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuICcnO1xyXG4gIH1cclxuXHJcblxyXG5cclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29va2llcztcclxuIiwiLyoqXHJcbiAqXHJcbiAqIERldGVjdEJyb3dzZXJcclxuICogR2VuZXJpYyBjbGFzcyBmb3IgZHJhZyduJ2Ryb3AgaW5wdXQgZmlsZSBtdWx0aXBsZVxyXG4gKlxyXG4gKiBAYXV0aG9yIGVmclxyXG4gKi9cclxuXHJcbmNsYXNzIERldGVjdEJyb3dzZXIge1xyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIENvbnN0cnVjdG9yXHJcbiAgICpcclxuICAgKiBAcGFyYW0gb3B0aW9ucyBPYmplY3Qgc2V0dGluZ3NcclxuICAgKi9cclxuXHJcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKCdEZXRlY3RCcm93c2VyJyk7XHJcblxyXG4gICAgbGV0IGRlZmF1bHRzID0ge1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBmdXNpb25uZSBsZXMgb3B0aW9ucyByZW5zZWlnbmVlcyBhdmVjIGNlbGxlcyBwYXIgZGVmYXV0IHBvdXIgY3JlZXIgbCdvYmpldCBzZXR0aW5nc1xyXG4gICAgdGhpcy5zZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XHJcblxyXG5cclxuICAgIHRoaXMuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBJbml0IGRyb3B6b25lXHJcbiAgICpcclxuICAgKi9cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgY29uc3QgYnJvd3NlcnMgPSB7fTtcclxuXHJcblxyXG4gICAgLy8gT3BlcmEgOC4wK1xyXG4gICAgYnJvd3NlcnMuaXNPcGVyYSA9ICghIXdpbmRvdy5vcHIgJiYgISF3aW5kb3cub3ByLmFkZG9ucykgfHwgISF3aW5kb3cub3BlcmEgfHwgbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCcgT1BSLycpID49IDA7XHJcblxyXG4gICAgLy8gRmlyZWZveCAxLjArXHJcbiAgICBicm93c2Vycy5pc0ZpcmVmb3ggPSB0eXBlb2YgSW5zdGFsbFRyaWdnZXIgIT09ICd1bmRlZmluZWQnO1xyXG5cclxuICAgIC8vIFNhZmFyaSAzLjArIFwiW29iamVjdCBIVE1MRWxlbWVudENvbnN0cnVjdG9yXVwiXHJcbiAgICBicm93c2Vycy5pc1NhZmFyaSA9IC9jb25zdHJ1Y3Rvci9pLnRlc3Qod2luZG93LkhUTUxFbGVtZW50KSB8fFxyXG4gICAgICAoZnVuY3Rpb24gKHApIHsgcmV0dXJuIHAudG9TdHJpbmcoKSA9PT0gJ1tvYmplY3QgU2FmYXJpUmVtb3RlTm90aWZpY2F0aW9uXSc7IH0pKCF3aW5kb3cuc2FmYXJpIHx8XHJcbiAgICAgICAgKHR5cGVvZiB3aW5kb3cuc2FmYXJpICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuc2FmYXJpLnB1c2hOb3RpZmljYXRpb24pKTtcclxuXHJcbiAgICAvLyBJbnRlcm5ldCBFeHBsb3JlciA2LTExXHJcbiAgICBicm93c2Vycy5pc0lFID0gLypAY2Nfb24hQCovZmFsc2UgfHwgISFkb2N1bWVudC5kb2N1bWVudE1vZGU7XHJcblxyXG4gICAgLy8gRWRnZSAyMCtcclxuICAgIGJyb3dzZXJzLmlzRWRnZSA9ICFicm93c2Vycy5pc0lFICYmICEhd2luZG93LlN0eWxlTWVkaWE7XHJcblxyXG4gICAgLy8gQ2hyb21lIDErXHJcbiAgICBicm93c2Vycy5pc0Nocm9tZSA9ICEhd2luZG93LmNocm9tZSAmJiAhIXdpbmRvdy5jaHJvbWUud2Vic3RvcmU7XHJcblxyXG4gICAgLy8gQmxpbmsgZW5naW5lIGRldGVjdGlvblxyXG4gICAgYnJvd3NlcnMuaXNCbGluayA9IChicm93c2Vycy5pc0Nocm9tZSB8fCBicm93c2Vycy5pc09wZXJhKSAmJiAhIXdpbmRvdy5DU1M7XHJcblxyXG4gICAgLy9jb25zb2xlLmxvZygnYnJvd3NlcnMgOiAnLCBicm93c2Vycyk7XHJcblxyXG4gICAgaWYoYnJvd3NlcnMuaXNPcGVyYSkge1xyXG4gICAgICAkKCdodG1sJykuYWRkQ2xhc3MoJ2lzLW9wZXJhJyk7XHJcbiAgICB9IGVsc2UgaWYoYnJvd3NlcnMuaXNGaXJlZm94KSB7XHJcbiAgICAgICQoJ2h0bWwnKS5hZGRDbGFzcygnaXMtZmlyZWZveCcpO1xyXG4gICAgfSBlbHNlIGlmKGJyb3dzZXJzLmlzU2FmYXJpKSB7XHJcbiAgICAgICQoJ2h0bWwnKS5hZGRDbGFzcygnaXMtc2FmYXJpJyk7XHJcbiAgICB9IGVsc2UgaWYoYnJvd3NlcnMuaXNJRSkge1xyXG4gICAgICAkKCdodG1sJykuYWRkQ2xhc3MoJ2lzLWllJyk7XHJcbiAgICB9IGVsc2UgaWYoYnJvd3NlcnMuaXNFZGdlKSB7XHJcbiAgICAgICQoJ2h0bWwnKS5hZGRDbGFzcygnaXMtZWRnZScpO1xyXG4gICAgfSBlbHNlIGlmKGJyb3dzZXJzLmlzQ2hyb21lKSB7XHJcbiAgICAgICQoJ2h0bWwnKS5hZGRDbGFzcygnaXMtY2hyb21lJyk7XHJcbiAgICB9IGVsc2UgaWYoYnJvd3NlcnMuaXNCbGluaykge1xyXG4gICAgICAkKCdodG1sJykuYWRkQ2xhc3MoJ2lzLWJsaW5rcmEnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEJpbmQgVUkgQWN0aW9uc1xyXG4gICAqXHJcbiAgICovXHJcblxyXG4gIGJpbmRVSUFjdGlvbnMoKSB7XHJcbiAgICBjb25zdCBzZWxmID0gdGhpcztcclxuXHJcbiAgfVxyXG59XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEZXRlY3RCcm93c2VyO1xyXG4iLCIvKipcclxuICpcclxuICogUmVzcG9uc2l2ZURlYnVnXHJcbiAqIHNob3dzIGN1cnJlbnQgYnJlYWtwb2ludCBpbiBib3R0b20gbGVmdCBjb3JuZXIgb24gcmVzaXplXHJcbiAqIGlmIGxvY2Fsc3RvcmFnZSAncmVzcG9uc2l2ZS1kZWJ1ZycgaXMgdHJ1ZVxyXG4gKlxyXG4gKiBAYXV0aG9yIGVmclxyXG4gKi9cclxuXHJcbmNsYXNzIFJlc3BvbnNpdmVEZWJ1ZyB7XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogQ29uc3RydWN0b3JcclxuICAgKlxyXG4gICAqIEBwYXJhbSBvcHRpb25zIE9iamVjdCBzZXR0aW5nc1xyXG4gICAqL1xyXG5cclxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcclxuXHJcbiAgICBjb25zdCBkZWZhdWx0cyA9IHt9O1xyXG5cclxuICAgIC8vIGZ1c2lvbm5lIGxlcyBvcHRpb25zIHJlbnNlaWduZWVzIGF2ZWMgY2VsbGVzIHBhciBkZWZhdXQgcG91ciBjcmVlciBsJ29iamV0IHNldHRpbmdzXHJcbiAgICB0aGlzLnNldHRpbmdzID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcclxuXHJcbiAgICAvLyBldmVuZW1lbnRzIHBhciB1dGlsaXNhdGV1ciBleCBzY3JvbGwgaG92ZXIgY2xpYyB0b3VjaFxyXG4gICAgdGhpcy5iaW5kVUlBY3Rpb25zKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIGRvbmVSZXNpemluZ1xyXG4gICAqXHJcbiAgICovXHJcblxyXG4gIGRvbmVSZXNpemluZygpIHtcclxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgc2VsZi4kcmVzcG9uc2l2ZUhlbHBlci5yZW1vdmVDbGFzcygnYXMtLXZpc2libGUnKTtcclxuXHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBCaW5kIFVJIEFjdGlvbnNcclxuICAgKlxyXG4gICAqL1xyXG5cclxuICBiaW5kVUlBY3Rpb25zKCkge1xyXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICBpZihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVzcG9uc2l2ZS1kZWJ1ZycpKXtcclxuICAgICAgc2VsZi4kcmVzcG9uc2l2ZUhlbHBlciA9ICQoJzxkaXYvPicpO1xyXG4gICAgICBsZXQgcmVzaXplSWQ7XHJcbiAgICAgIHNlbGYuJHJlc3BvbnNpdmVIZWxwZXIuYWRkQ2xhc3MoJ3Jlc3BvbnNpdmUtaGVscGVyJykuYXBwZW5kVG8oJCgnYm9keScpKTtcclxuICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNlbGYuJHJlc3BvbnNpdmVIZWxwZXIuYWRkQ2xhc3MoJ2FzLS12aXNpYmxlJyk7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHJlc2l6ZUlkKTtcclxuICAgICAgICByZXNpemVJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgc2VsZi5kb25lUmVzaXppbmcoKTtcclxuICAgICAgICB9LCA1MDApO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gIH1cclxuXHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlc3BvbnNpdmVEZWJ1ZztcclxuIiwiLyoqXHJcbiAqXHJcbiAqIFNjcm9sbEFuY2hvclxyXG4gKiBHZW5lcmljIGNsYXNzIHRvIGhhdmUgYSBzbW9vdGggc2Nyb2xsIHdoZW4gZ29pbmcgdG8gYW4gYW5jaG9yXHJcbiAqXHJcbiAqIEBhdXRob3Igc2RpXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqXHJcbiAqIEhUTUwgbWluaW1hbCBleGFtcGxlIHRlbXBsYXRlXHJcbiAqXHJcbiAqIGEuanMtc2Nyb2xsLWFuY2hvcltocmVmPVwiI2FuY2hvclwiXVxyXG4gKiAuLi5cclxuICogI2FuY2hvclxyXG4gKi9cclxuXHJcbmNsYXNzIFNjcm9sbEFuY2hvciB7XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogQ29uc3RydWN0b3JcclxuICAgKlxyXG4gICAqIEBwYXJhbSBvcHRpb25zIE9iamVjdCBzZXR0aW5nc1xyXG4gICAqL1xyXG5cclxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcclxuXHJcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcclxuICAgICAgY29udGFpbmVyOiAnI2JvZHknLFxyXG4gICAgICBjdGE6ICdhLmpzLXNjcm9sbC1hbmNob3InLCAvL3dhcyAgJ2FbaHJlZl49XCIjXCJdOm5vdChbaHJlZj1cIiNcIl0pJyAvIHNvbHV0aW9uIENQRSA6ICdhW2hyZWZePVwiI1wiXTpub3QoW2hyZWY9XCIjXCJdKTpub3QoLm5vLXNjcm9sbC10byknXHJcbiAgICAgIG1vZGU6ICdlYXNlSW5PdXRRdWFkJywgLy8gYW5pbWF0aW9uIHR5cGVcclxuICAgICAgZGVsYXk6IDMwMCwgLy8gYW5pbWF0aW9uIGR1cmF0aW9uXHJcbiAgICAgIHRhcmdldCA6IG51bGwsXHJcbiAgICAgIGR1cmF0aW9uTWF4OiAxMDAwLFxyXG4gICAgICBkaXN0YW5jZU1heCA6MTAwMCxcclxuICAgIH07XHJcblxyXG4gICAgLy8gZnVzaW9ubmUgbGVzIG9wdGlvbnMgcmVuc2VpZ25lZXMgYXZlYyBjZWxsZXMgcGFyIGRlZmF1dCBwb3VyIGNyZWVyIGwnb2JqZXQgc2V0dGluZ3NcclxuICAgIHRoaXMuc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xyXG5cclxuICAgIC8vIGV2ZW5lbWVudHMgcGFyIHV0aWxpc2F0ZXVyIGV4IHNjcm9sbCBob3ZlciBjbGljIHRvdWNoXHJcbiAgICB0aGlzLmJpbmRVSUFjdGlvbnMoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogU2Nyb2xsIEFjdGlvblxyXG4gICAqXHJcbiAgICovXHJcblxyXG4gIHNjcm9sbCh0YXJnZXQpIHtcclxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIGxldCB0YXJnZXRTY3JvbGwgPSAwO1xyXG4gICAgbGV0IGlIZWFkZXJIZWlnaHQgPSAwOyAvLyBlZGl0IHRoaXMgY29kZSBpZiB1IGhhdmUgc3RpY2t5IGhlYWRlclxyXG4gICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdzdHJpbmcnKXtcclxuICAgICAgdGFyZ2V0U2Nyb2xsID0gJCh0YXJnZXQpLm9mZnNldCgpLnRvcCAtIGlIZWFkZXJIZWlnaHQ7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdudW1iZXInKXtcclxuICAgICAgdGFyZ2V0U2Nyb2xsID0gdGFyZ2V0O1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnb2JqZWN0JyAmJiB0YXJnZXQubGVuZ3RoKXtcclxuICAgICAgdmFyICR0YXJnZXQgPSB0YXJnZXQ7XHJcbiAgICAgIHRhcmdldFNjcm9sbCA9ICR0YXJnZXQub2Zmc2V0KCkudG9wIC0gaUhlYWRlckhlaWdodDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHsgLy8gaHRtbCBwb3VyIGZpcmVmb3gsIGJvZHkgcG91ciBjaHJvbWVcclxuICAgICAgc2Nyb2xsVG9wOiB0YXJnZXRTY3JvbGxcclxuICAgIH0sIHNlbGYuc2V0dGluZ3MuZGVsYXksIHNlbGYuc2V0dGluZ3MubW9kZSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAvLyBtZXR0cmUgdW4gdGFiaW5kZXg9XCItMVwiIHN1ciBsYSBjaWJsZSBzaSBjJ2VzdCB1biBlbGVtZW50IHF1aSBuZSByZWNvaXQgcGFzIGxlIGZvY3VzIHBhciBkZWZhdXRcclxuICAgICAgJCh0YXJnZXQpLmZvY3VzKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogQmluZCBVSSBBY3Rpb25zXHJcbiAgICpcclxuICAgKi9cclxuXHJcbiAgYmluZFVJQWN0aW9ucygpIHtcclxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgJChzZWxmLnNldHRpbmdzLmNvbnRhaW5lcikub24oJ2NsaWNrJywgc2VsZi5zZXR0aW5ncy5jdGEsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBjb25zdCB0YXJnZXQgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcclxuICAgICAgc2VsZi5zY3JvbGwodGFyZ2V0KTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2Nyb2xsQW5jaG9yO1xyXG4iLCIvKipcclxuICpcclxuICogU2hvd1Bhc3N3b3JkXHJcbiAqIEdlbmVyaWMgY2xhc3MgdG8gc2hvdyB0aGUgY29udGVudCBvZiBhIHBhc3N3b3JkIGlucHV0XHJcbiAqXHJcbiAqIEBhdXRob3IgbWhhIC8gZWZyXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqXHJcbiAqIEhUTUwgbWluaW1hbCBleGFtcGxlIHRlbXBsYXRlXHJcbiAqXHJcbiAqIDxkaXYgY2xhc3M9XCJmb3JtLWZpZWxkIGFzLS1idG4tcGFzc3dvcmQgYXMtLWljb25cIj5cclxuICogICA8ZGl2PlxyXG4gKiAgICAgPGlucHV0IHR5cGU9XCJwYXNzd29yZFwiIHZhbHVlPVwibXlQYXNzd29yZFwiPlxyXG4gKiAgICAgICA8aSBjbGFzcz1cImJ0bi1wYXNzd29yZCBpY29uIGJ0bi1wYXNzd29yZC1zaG93XCIgdGl0bGU9XCJBZmZpY2hlciBsZSBtb3QgZGUgcGFzc2VcIj5cclxuICogICAgICAgICB7JSBpbmNsdWRlIFwiLi4vLi4vYXNzZXRzL2ltZy9zdmcudHdpZy9pY29uLWV5ZS5zdmcudHdpZ1wiICV9XHJcbiAqICAgICAgIDwvaT5cclxuICogICAgICAgPGkgY2xhc3M9XCJidG4tcGFzc3dvcmQgaWNvbiBidG4tcGFzc3dvcmQtaGlkZVwiIHRpdGxlPVwiTWFzcXVlciBsZSBtb3QgZGUgcGFzc2VcIj5cclxuICogICAgICAgICB7JSBpbmNsdWRlIFwiLi4vLi4vYXNzZXRzL2ltZy9zdmcudHdpZy9pY29uLWV5ZS1jbG9zZWQuc3ZnLnR3aWdcIiAlfVxyXG4gKiAgICAgICA8L2k+XHJcbiAqICAgPC9kaXY+XHJcbiAqIDwvZGl2PlxyXG4gKlxyXG4gKi9cclxuY2xhc3MgU2hvd1Bhc3N3b3JkIHtcclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBDb25zdHJ1Y3RvclxyXG4gICAqXHJcbiAgICogQHBhcmFtIG9wdGlvbnMgT2JqZWN0IHNldHRpbmdzXHJcbiAgICovXHJcblxyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xyXG5cclxuICAgIGxldCBkZWZhdWx0cyA9IHtcclxuICAgICAgY29udGFpbmVyOiAnLmFzLS1idG4tcGFzc3dvcmQnLFxyXG4gICAgICBpbnB1dDogJ2lucHV0JyxcclxuICAgICAgY2xhc3NOYW1lOiAnYXMtLXZpc2libGUnLFxyXG4gICAgICBjdGE6ICcuYnRuLXBhc3N3b3JkJ1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBmdXNpb25uZSBsZXMgb3B0aW9ucyByZW5zZWlnbmVlcyBhdmVjIGNlbGxlcyBwYXIgZGVmYXV0IHBvdXIgY3JlZXIgbCdvYmpldCBzZXR0aW5nc1xyXG4gICAgdGhpcy5zZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XHJcblxyXG4gICAgLy8gZXZlbmVtZW50cyBwYXIgdXRpbGlzYXRldXIgZXggc2Nyb2xsIGhvdmVyIGNsaWMgdG91Y2hcclxuICAgIHRoaXMuYmluZFVJQWN0aW9ucygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBTaG93XHJcbiAgICpcclxuICAgKiBAcGFyYW0gZWxlbSBPYmplY3QgZWxlbWVudCB0byBzaG93XHJcbiAgICovXHJcblxyXG4gIHNob3coZWxlbSkge1xyXG4gICAgbGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICQoZWxlbSkuYWRkQ2xhc3Moc2VsZi5zZXR0aW5ncy5jbGFzc05hbWUpO1xyXG4gICAgJChlbGVtKS5maW5kKHNlbGYuc2V0dGluZ3MuaW5wdXQpLmF0dHIoJ3R5cGUnLCAndGV4dCcpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBIaWRlXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZWxlbSBPYmplY3QgZWxlbWVudCB0byBoaWRlXHJcbiAgICovXHJcblxyXG4gIGhpZGUoZWxlbSkge1xyXG4gICAgbGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICQoZWxlbSkucmVtb3ZlQ2xhc3Moc2VsZi5zZXR0aW5ncy5jbGFzc05hbWUpO1xyXG4gICAgJChlbGVtKS5maW5kKHNlbGYuc2V0dGluZ3MuaW5wdXQpLmF0dHIoJ3R5cGUnLCAncGFzc3dvcmQnKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogVG9nZ2xlXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZWxlbSBPYmplY3QgZWxlbWVudCB0byB0b2dnbGVcclxuICAgKi9cclxuXHJcbiAgdG9nZ2xlKGVsZW0pIHtcclxuICAgIGxldCBzZWxmID0gdGhpcztcclxuXHJcbiAgICBpZiAoJChlbGVtKS5pcygnLicgKyBzZWxmLnNldHRpbmdzLmNsYXNzTmFtZSkpIHtcclxuICAgICAgc2VsZi5oaWRlKGVsZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2VsZi5zaG93KGVsZW0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBCaW5kIFVJIEFjdGlvbnNcclxuICAgKlxyXG4gICAqL1xyXG5cclxuICBiaW5kVUlBY3Rpb25zKCkge1xyXG4gICAgbGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICQoc2VsZi5zZXR0aW5ncy5jb250YWluZXIpLm9uKCdjbGljaycsIHNlbGYuc2V0dGluZ3MuY3RhLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGxldCBlbGVtID0gJCh0aGlzKS5jbG9zZXN0KHNlbGYuc2V0dGluZ3MuY29udGFpbmVyKTtcclxuICAgICAgc2VsZi50b2dnbGUoZWxlbSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG59XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaG93UGFzc3dvcmQ7XHJcbiIsIi8qKlxyXG4gKlxyXG4gKiBWYWxpZEZvcm1cclxuICogQSBsaXR0ZSBjbGFzcyB3aGljaCBwcm92aWRlIGZvcm0gdmFsaWRhdGlvbiBvbiB0aGUgZmx5IGJlLXBhc3NpbmcgaHRtbDUgdmFsaWRhdGlvblxyXG4gKlxyXG4gKiBAYXV0aG9yIExhdXJlbnQgR1VJVFRPTlxyXG4gKi9cclxuXHJcbmltcG9ydCBzdG9yZSBmcm9tICcuLi9fc3RvcmUnO1xyXG5cclxuY2xhc3MgVmFsaWRGb3JtIHtcclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBDb25zdHJ1Y3RvclxyXG4gICAqXHJcbiAgICogQHBhcmFtIGV4ZW1wbGUgU3RyaW5nIEV4ZW1wbGUgc3RyaW5nXHJcbiAgICovXHJcblxyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xyXG5cclxuICAgIGxldCBkZWZhdWx0cyA9IHtcclxuICAgICAgY29udGFpbmVyOiAnLnZhbGlkLWZvcm0nLFxyXG4gICAgICBmaWVsZENvbnRhaW5lcjogJy5mb3JtLWZpZWxkJyxcclxuICAgICAgaW5wdXQ6ICdpbnB1dFtyZXF1aXJlZF0sc2VsZWN0W3JlcXVpcmVkXSx0ZXh0YXJlYVtyZXF1aXJlZF0nLFxyXG4gICAgICB2YWxpZENsYXNzOiAnYXMtLXZhbGlkJyxcclxuICAgICAgaW52YWxpZENsYXNzOiAnYXMtLWludmFsaWQnLFxyXG4gICAgICBtc2dFcnJvckNsYXNzOiAnZm9ybS1tc2ctZXJyb3InLFxyXG4gICAgICBzdWJtaXRCdG46ICdbc3VibWl0XScsXHJcbiAgICAgIHJlc2V0QnRuOiAnW3Jlc2V0XScsXHJcbiAgICAgIGRlZmF1bHRSZXF1aXJlZE1zZzogc3RvcmUuZGVmYXVsdFJlcXVpcmVkTXNnLFxyXG4gICAgICBkZWZhdWx0RXJyb3JNc2c6IHN0b3JlLmRlZmF1bHRFcnJvck1zZyxcclxuICAgICAgZGVmYXVsdFB3ZEVycm9yTXNnOiBzdG9yZS5kZWZhdWx0UHdkRXJyb3JNc2csXHJcbiAgICAgIHZhbGlkYXRlOiBmYWxzZVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBmdXNpb25uZSBsZXMgb3B0aW9ucyByZW5zZWlnbmVlcyBhdmVjIGNlbGxlcyBwYXIgZGVmYXV0IHBvdXIgY3JlZXIgbCdvYmpldCBzZXR0aW5nc1xyXG4gICAgdGhpcy5zZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XHJcblxyXG4gICAgLy8gZXZlbmVtZW50cyBwYXIgdXRpbGlzYXRldXIgZXggc2Nyb2xsIGhvdmVyIGNsaWMgdG91Y2hcclxuICAgIHRoaXMuYmluZFVJQWN0aW9ucygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBTaG93IG1lc3NhZ2VcclxuICAgKlxyXG4gICAqIEByZXR1cm4gdm9pZFxyXG4gICAqL1xyXG5cclxuICBmb3JtQ2hlY2soaW5wdXQsIGNhbGxiYWNrKSB7XHJcbiAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICBsZXQgJGlucHV0RWxlbWVudCA9ICQoJyMnICsgaW5wdXQpO1xyXG4gICAgbGV0ICRpbnB1dFBhcmVudCA9ICRpbnB1dEVsZW1lbnQuY2xvc2VzdChzZWxmLnNldHRpbmdzLmZpZWxkQ29udGFpbmVyKTtcclxuICAgIGxldCAkaW5wdXRFcnJvckNvbnRhaW5lcjtcclxuXHJcbiAgICBpZiAoJCgnIycgKyBpbnB1dCArICctZXJyb3InKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICRpbnB1dEVycm9yQ29udGFpbmVyID0gJCgnIycgKyBpbnB1dCArICctZXJyb3InKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICRpbnB1dFBhcmVudC5hcHBlbmQoJzxkaXYgY2xhc3M9XCInICsgc2VsZi5zZXR0aW5ncy5tc2dFcnJvckNsYXNzICsgJ1wiIGlkPVwiJyArIGlucHV0ICsgJy1lcnJvclwiIC8+Jyk7XHJcbiAgICAgICRpbnB1dEVycm9yQ29udGFpbmVyID0gJCgnIycgKyBpbnB1dCArICctZXJyb3InKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcmVxdWlyZU1zZztcclxuICAgIGlmICgkaW5wdXRFbGVtZW50LmF0dHIoJ2RhdGEtbXNnLXJlcXVpcmVkJykpIHtcclxuICAgICAgcmVxdWlyZU1zZyA9ICRpbnB1dEVsZW1lbnQuYXR0cignZGF0YS1tc2ctcmVxdWlyZWQnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlcXVpcmVNc2cgPSBzZWxmLnNldHRpbmdzLmRlZmF1bHRSZXF1aXJlZE1zZztcclxuICAgIH1cclxuICAgIGxldCBlcnJvck1zZztcclxuICAgIGlmICgkaW5wdXRFbGVtZW50LmF0dHIoJ2RhdGEtbXNnLWVycm9yJykpIHtcclxuICAgICAgZXJyb3JNc2cgPSAkaW5wdXRFbGVtZW50LmF0dHIoJ2RhdGEtbXNnLWVycm9yJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBlcnJvck1zZyA9IHNlbGYuc2V0dGluZ3MuZGVmYXVsdEVycm9yTXNnO1xyXG4gICAgfVxyXG5cclxuICAgICRpbnB1dEVsZW1lbnQuYXR0cignYXJpYS1pbnZhbGlkJywgISRpbnB1dEVsZW1lbnRbMF0uY2hlY2tWYWxpZGl0eSgpKTtcclxuXHJcbiAgICBpZiAoJGlucHV0RWxlbWVudC5hdHRyKCdkYXRhLXB3ZCcpID09PSAnY29uZmlybWF0aW9uJykge1xyXG4gICAgICBsZXQgcGFzc3dvcmQxID0gJCgnW2RhdGEtcHdkPVwiaW5pdGlhbFwiXScpLnZhbCgpO1xyXG4gICAgICBsZXQgcGFzc3dvcmQyID0gJGlucHV0RWxlbWVudC52YWwoKTtcclxuICAgICAgaWYgKHBhc3N3b3JkMiAhPT0gcGFzc3dvcmQxIHx8ICFwYXNzd29yZDIpIHtcclxuICAgICAgICAkaW5wdXRQYXJlbnQuYWRkQ2xhc3Moc2VsZi5zZXR0aW5ncy5pbnZhbGlkQ2xhc3MpLnJlbW92ZUNsYXNzKHNlbGYuc2V0dGluZ3MudmFsaWRDbGFzcyk7XHJcbiAgICAgICAgaWYgKCEkaW5wdXRFcnJvckNvbnRhaW5lci5sZW5ndGgpIHtcclxuICAgICAgICAgICRpbnB1dFBhcmVudC5hcHBlbmQoJzxkaXYgY2xhc3M9XCInICsgc2VsZi5zZXR0aW5ncy5tc2dFcnJvckNsYXNzICsgJ1wiIGlkPVwiJyArIGlucHV0ICsgJy1lcnJvclwiPicgKyBzZWxmLnNldHRpbmdzLnB3ZG1zZ0Vycm9yICsgJzwvZGl2PicpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkaW5wdXRQYXJlbnQuYWRkQ2xhc3Moc2VsZi5zZXR0aW5ncy52YWxpZENsYXNzKS5yZW1vdmVDbGFzcyhzZWxmLnNldHRpbmdzLmludmFsaWRDbGFzcyk7XHJcbiAgICAgICAgJGlucHV0RXJyb3JDb250YWluZXIucmVtb3ZlKCk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmICghJGlucHV0RWxlbWVudFswXS5jaGVja1ZhbGlkaXR5KCkpIHsgLy8gU2kgY2hlY2tWYWxpZGl0eSByZW52b2llIGZhbHNlIDogaW52YWxpZGVcclxuXHJcbiAgICAgICAgaWYgKCRpbnB1dEVsZW1lbnQudmFsKCkgPT09ICcnKSB7XHJcbiAgICAgICAgICAkaW5wdXRFcnJvckNvbnRhaW5lci5odG1sKHJlcXVpcmVNc2cpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkaW5wdXRFcnJvckNvbnRhaW5lci5odG1sKGVycm9yTXNnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRpbnB1dFBhcmVudC5hZGRDbGFzcyhzZWxmLnNldHRpbmdzLmludmFsaWRDbGFzcykucmVtb3ZlQ2xhc3Moc2VsZi5zZXR0aW5ncy52YWxpZENsYXNzKTtcclxuICAgICAgICAkaW5wdXRFbGVtZW50LmF0dHIoJ2FyaWEtZGVzY3JpYmVkYnknLCBpbnB1dCArICctZXJyb3InKTtcclxuICAgICAgfSBlbHNlIHsgLy8gU2kgY2hlY2tWYWxpZGl0eSByZW52b2llIHRydWUgOiB2YWxpZGVcclxuICAgICAgICBpZiAoJGlucHV0RXJyb3JDb250YWluZXIubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgJGlucHV0RXJyb3JDb250YWluZXIuaHRtbCgnJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICRpbnB1dFBhcmVudC5hZGRDbGFzcyhzZWxmLnNldHRpbmdzLnZhbGlkQ2xhc3MpLnJlbW92ZUNsYXNzKHNlbGYuc2V0dGluZ3MuaW52YWxpZENsYXNzKTtcclxuICAgICAgICAkaW5wdXRFbGVtZW50LmF0dHIoJ2FyaWEtZGVzY3JpYmVkYnknLCBmYWxzZSk7XHJcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogQmluZCBVSSBBY3Rpb25zXHJcbiAgICpcclxuICAgKi9cclxuXHJcbiAgYmluZFVJQWN0aW9ucygpIHtcclxuICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgICQoJ2JvZHknKS5vbignYmx1cicsIHNlbGYuc2V0dGluZ3MuY29udGFpbmVyICsgJyAnICsgc2VsZi5zZXR0aW5ncy5pbnB1dCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICBzZWxmLmZvcm1DaGVjayh0aGlzLmlkKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbi8vIE9uIFNVQk1JVCA6XHJcblxyXG4gICAgJCgnLnZhbGlkLWZvcm0nKS5vbignc3VibWl0JywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgJChzZWxmLnNldHRpbmdzLmNvbnRhaW5lcikuYWRkQ2xhc3MoJ2FzLS1zdWJtaXRlZCcpO1xyXG4gICAgICBjb25zdCBpTGVuZ3RoID0gJChzZWxmLnNldHRpbmdzLmlucHV0KS5sZW5ndGg7XHJcbiAgICAgICQoc2VsZi5zZXR0aW5ncy5pbnB1dCkuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICBzZWxmLmZvcm1DaGVjaygkKHRoaXMpWzBdLmlkKTtcclxuICAgICAgICBpZiAoaW5kZXggPj0gaUxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgIGNvbnN0IGludmFsaWRJbnB1dHMgPSAkKCdbYXJpYS1pbnZhbGlkPVwidHJ1ZVwiXScpO1xyXG4gICAgICAgICAgaWYgKGludmFsaWRJbnB1dHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBpbnZhbGlkSW5wdXRzWzBdLmZvY3VzKCk7XHJcbiAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgc2VsZi5zZXR0aW5ncy52YWxpZGF0ZSA9IHRydWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKHRoaXMpWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2ludmFsaWQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYgKCFzZWxmLnNldHRpbmdzLnZhbGlkYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbi8vIE9uIFJFU0VUIDpcclxuICAgIC8qJChzZWxmLnNldHRpbmdzLmNvbnRhaW5lcikub24oJ2NsaWNrJywgc2VsZi5zZXR0aW5ncy5yZXNldEJ0biwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgJChzZWxmLnNldHRpbmdzLmNvbnRhaW5lcikuY2xhc3NMaXN0LnJlbW92ZSgnYXMtLXN1Ym1pdGVkJyk7XHJcbiAgICAgIGlucHV0cy5mb3JFYWNoKGlucHV0ID0+IHtcclxuICAgICAgICBsZXQgaW5wdXRQYXJlbnQgPSBpbnB1dC5jbG9zZXN0KCcuZm9ybS1maWVsZCcpO1xyXG4gICAgICAgIC8vaW5wdXRzWzBdLmZvY3VzKCk7XHJcbiAgICAgICAgaW5wdXRQYXJlbnQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdmFsaWQnKTtcclxuICAgICAgICBpbnB1dFBhcmVudC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1pbnZhbGlkJyk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBsZXQgbXNnRXJyb3JzID0gJCgnLmZvcm0tbXNnLWVycm9yJyk7XHJcbiAgICAgIG1zZ0Vycm9ycy5mb3JFYWNoKG1zZ0Vycm9yID0+IHtcclxuICAgICAgICBtc2dFcnJvci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG1zZ0Vycm9yKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTsqL1xyXG5cclxuICB9XHJcblxyXG5cclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmFsaWRGb3JtO1xyXG4iLCIndXNlIHN0cmljdCc7XG5cbi8qZ2xvYmFsIE1vZGVybml6ciAqL1xuaW1wb3J0IHN0b3JlIGZyb20gJy4vX3N0b3JlJztcbmltcG9ydCBoZWxwZXJzIGZyb20gJy4vX2hlbHBlcnMnO1xuaW1wb3J0IFJlc3BvbnNpdmVEZWJ1ZyBmcm9tICcuL2NsYXNzL1Jlc3BvbnNpdmVEZWJ1Zyc7XG5pbXBvcnQgQ29sbGFwc2libGUgZnJvbSAnLi9jbGFzcy9Db2xsYXBzaWJsZSc7XG5pbXBvcnQgU2Nyb2xsQW5jaG9yIGZyb20gJy4vY2xhc3MvU2Nyb2xsQW5jaG9yJztcbmltcG9ydCBTaG93UGFzc3dvcmQgZnJvbSAnLi9jbGFzcy9TaG93UGFzc3dvcmQnO1xuaW1wb3J0IENsZWFySW5wdXQgZnJvbSAnLi9jbGFzcy9DbGVhcklucHV0JztcbmltcG9ydCBEZXRlY3RCcm93c2VyIGZyb20gJy4vY2xhc3MvRGV0ZWN0QnJvd3Nlcic7XG5pbXBvcnQgQ29va2llcyBmcm9tICcuL2NsYXNzL0Nvb2tpZXMnO1xuaW1wb3J0IEJhbm5lck1lc3NhZ2VzIGZyb20gJy4vY2xhc3MvQmFubmVyTWVzc2FnZXMnO1xuaW1wb3J0IFZhbGlkRm9ybSBmcm9tICcuL2NsYXNzL1ZhbGlkRm9ybSc7XG4vLyBpbXBvcnQgQW5pbWF0ZWRMYWJlbEZpZWxkIGZyb20gJy4vY2xhc3MvQW5pbWF0ZWRMYWJlbEZpZWxkJztcbi8vaW1wb3J0IENvbG9yYm94IGZyb20gJy4vY2xhc3MvQ29sb3Jib3gnO1xuXG5cbi8qKlxuICpcbiAqIEFwcFxuICogTWFpbiBDb250cm9sbGVyXG4gKlxuICogQGF1dGhvciBhY3RpXG4gKiAodmluY2Vnb2JlbGlucywgbWhhLCBlZnIsIC4uLilcbiAqL1xuXG5jb25zdCBhcHAgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZigkKCcub25seU1hcm1pdGUnKS5sZW5ndGgpIHtcbiAgICAgIGNvbnNvbGUud2FybignLyFcXFxcIElmIHlvdSBzZWUgdGhpcyB3YXJuaW5nIG1lc3NhZ2UsIGl0IG1lYW5zIHRoYXQgeW91ciBhcmUgaW4gTWFybWl0ZSBTdHlsZWd1aWRlLlxcbicgK1xuICAgICAgICAnSWYgaXRcXCdzIG5vdCB0aGUgY2FzZSwgaXQgbWVhbnMgdGhhdCBzb21lb25lIGhhcyBmb3Jnb3QgdG8gcmVtb3ZlIHRoZSBjbGFzcyAub25seU1hcm1pdGUgaW4gZGV2IHRlbXBsYXRlXFxuJyArXG4gICAgICAgICdhbmQgbWFueSBqcyBkZXYgY29kZSB3b25cXCd0IHdvcmsgcHJvcGVybHkuIDpcXCcoJyApO1xuICAgIH1cblxuICAgIHRoaXMuYmluZFVJKCk7XG5cbiAgICAvKi0tLSBpbml0aWFsaXNhdGlvbiBkZXMgdGFpbGxlcyBkZSB2aWV3cG9ydCAtLS0qL1xuICAgIHN0b3JlLmN1cnJlbnRXaWR0aCA9IHN0b3JlLndXaWR0aCA9IGhlbHBlcnMudmlld3BvcnQoKS53aWR0aDtcbiAgICBzdG9yZS5jdXJyZW50SGVpZ2h0ID0gc3RvcmUud0hlaWdodCA9IGhlbHBlcnMudmlld3BvcnQoKS5oZWlnaHQ7XG5cbiAgICBzdG9yZS53U2Nyb2xsID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXG4gICAgbGV0IHNlbGYgPSB0aGlzO1xuXG5cbiAgICAvKi0tLSByZXNwb25zaXZlLWRlYnVnIC0tLSovXG4gICAgbGV0IHJlc3BvbnNpdmVEZWJ1ZyA9IG5ldyBSZXNwb25zaXZlRGVidWcoKTtcblxuICAgIC8qLS0tIGRldGVjdEJyb3dzZXIgLS0tKi9cbiAgICBsZXQgZGV0ZWN0QnJvd3NlciA9IG5ldyBEZXRlY3RCcm93c2VyKCk7XG5cbiAgICAvKi0tLSBWYWxpZGF0aW9uIEZvcm0gLS0tKi9cbiAgICBsZXQgdmFsaWRGb3JtID0gbmV3IFZhbGlkRm9ybSh7XG4gICAgICAvKmNvbnRhaW5lcjogJy52YWxpZC1mb3JtJyxcbiAgICAgIGZpZWxkQ29udGFpbmVyOiAnLmZvcm0tZmllbGQnLFxuICAgICAgdmFsaWRDbGFzczogJ2FzLS12YWxpZCcsXG4gICAgICBpbnZhbGlkQ2xhc3M6ICdhcy0taW52YWxpZCcsXG4gICAgICBtc2dFcnJvckNsYXNzOiAnZm9ybS1tc2ctZXJyb3InLCovXG4gICAgfSk7XG5cbiAgICAvKi0tLSBjb29raWVzIC0tLSovXG4gICAgc3RvcmUuY29va2llcyA9IG5ldyBDb29raWVzKCk7XG5cbiAgICAvKi0tLSBCYW5uZXIgbWVzc2FnZXMgKGNvb2tpZXMgY29uc2VudCAvIHdhcm5pZyAvIG5ld3MuLi4pIC0tLSovXG4gICAgY29uc3QgbWVzc2FnZXNCYW5uZXIgPSBuZXcgQmFubmVyTWVzc2FnZXMoLyp7XG4gICAgICAvL2NhcGluZzogMyxcbiAgICB9Ki8pO1xuXG4gICAgLyotLS0gU2tpcCBsaW5rcyAtLS0qL1xuICAgIGxldCBza2lwID0gbmV3IENvbGxhcHNpYmxlKHtcbiAgICAgIGNvbnRhaW5lcjogJy5za2lwJyxcbiAgICAgIGN0YTogJy5za2lwLWN0YScsXG4gICAgICBjbGFzc05hbWU6ICdhcy0tZm9jdXNlZCcsXG4gICAgICBvcHRpb25Ib3ZlcjogdHJ1ZVxuICAgIH0pO1xuXG4gICAgLyotLS0gY29sb3Jib3ggLS0tKi9cbiAgICAvKmxldCBjb2xvcmJveCA9IG5ldyBDb2xvcmJveCgpOyovXG5cbiAgICAvKi0tLSBhbmltYXRpb24gc2Nyb2xsIC0tLSovXG4gICAgLyogVXNlICcuanMtc2Nyb2xsLWFuY2hvcicgY2xhc3MgdG8gdHJpZ2dlciBzbW9vdGggYW5jaG9yIHNjcm9sbCovXG4gICAgc3RvcmUuc2Nyb2xsQW5jaG9yID0gbmV3IFNjcm9sbEFuY2hvcigpO1xuXG4gICAgLyotLS0gcGFzc3dvcmQgLS0tKi9cbiAgICBsZXQgc2hvd1Bhc3N3b3JkID0gbmV3IFNob3dQYXNzd29yZCgpO1xuXG4gICAgLyotLS0gY2xlYXIgaW5wdXQgLS0tKi9cbiAgICBsZXQgY2xlYXJJbnB1dCA9IG5ldyBDbGVhcklucHV0KCk7XG5cbiAgICAvKi0tLSBhbmltYXRlZCBsYWJlbCAtLS0qL1xuICAgIC8vIGxldCBmb3JtID0gbmV3IEFuaW1hdGVkTGFiZWxGaWVsZCgpO1xuXG4gICAgLy8gcmVzcG9uc2l2ZVxuICAgIHNlbGYub25SZXNpemUoKTtcbiAgfSxcblxuICBjaGVja01vYmlsZTogZnVuY3Rpb24gKCkge1xuICAgIGlmICgvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxCbGFja0JlcnJ5fFdpbmRvd3MgUGhvbmV8T3BlcmEgTWluaXxJRU1vYmlsZXxNb2JpbGUvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0sXG5cbiAgb25SZXNpemU6IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgc2VsZiA9IHRoaXM7XG4gIH0sXG5cbiAgb25TY3JvbGw6IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgc2VsZiA9IHRoaXM7XG4gIH0sXG5cbiAgYmluZFVJOiBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYoJCgnLmpzLWl0ZW0taW52aWV3JykubGVuZ3RoKXtcbiAgICAgICQoJy5qcy1pdGVtLWludmlldycpLmVhY2goZnVuY3Rpb24gKGksIGl0ZW1JbnZpZXcpIHtcbiAgICAgICAgY29uc3QgJGl0ZW1WaWV3ID0gJChpdGVtSW52aWV3KTtcbiAgICAgICAgJGl0ZW1WaWV3Lm9uZSgnaW52aWV3JywgZnVuY3Rpb24gKGV2ZW50LCBpc0luVmlldykge1xuICAgICAgICAgIGlmIChpc0luVmlldykge1xuICAgICAgICAgICAgJGl0ZW1WaWV3LmFkZENsYXNzKCdpcy1pbnZpZXcnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKE1vZGVybml6ci5tcSgnb25seSBhbGwnKSkge1xuICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHN0b3JlLndXaWR0aCA9IGhlbHBlcnMudmlld3BvcnQoKS53aWR0aDtcbiAgICAgICAgc3RvcmUud0hlaWdodCA9IGhlbHBlcnMudmlld3BvcnQoKS5oZWlnaHQ7XG4gICAgICAgIGlmIChzdG9yZS5jdXJyZW50SGVpZ2h0ICE9PSBzdG9yZS53SGVpZ2h0IHx8IHN0b3JlLmN1cnJlbnRXaWR0aCAhPT0gc3RvcmUud1dpZHRoKSB7XG4gICAgICAgICAgc3RvcmUuY3VycmVudEhlaWdodCA9IHN0b3JlLndIZWlnaHQ7XG4gICAgICAgICAgc3RvcmUuY3VycmVudFdpZHRoID0gc3RvcmUud1dpZHRoO1xuICAgICAgICAgIC8qLS0tIHRpbWVyIHBvdXIgbGUgcmVkaW1lbnNpb25uZW1lbnQgZCdlY3JhbiAtLS0qL1xuICAgICAgICAgIGNsZWFyVGltZW91dChzdG9yZS50aW1lclJlc3BvbnNpdmUpO1xuICAgICAgICAgIHN0b3JlLnRpbWVyUmVzcG9uc2l2ZSA9IHNldFRpbWVvdXQoc2VsZi5vblJlc2l6ZS5iaW5kKHNlbGYpLCAzMDApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBkb2N1bWVudC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgICBzZWxmLm9uUmVzaXplKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qLS0tIGZvbmN0aW9ucyBhdSBzY3JvbGwgLS0tKi9cbiAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHN0b3JlLndTY3JvbGwgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cbiAgICAgIHNlbGYub25TY3JvbGwoKTtcbiAgICB9KTtcblxuICAgIGlmICh3aW5kb3cubWF0Y2hNZWRpYSgnKG1pbi13aWR0aDogODk2cHgpJykubWF0Y2hlcykge1xuICAgICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XG4gICAgICBjb25zdCBzY3JvbGxVcCA9ICdzY3JvbGwtdXAnO1xuICAgICAgY29uc3Qgc2Nyb2xsRG93biA9ICdzY3JvbGwtZG93bic7XG4gICAgICBsZXQgbGFzdFNjcm9sbCA9IDA7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBjdXJyZW50U2Nyb2xsID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgICAgICBpZiAoY3VycmVudFNjcm9sbCA8PSAxKSB7XG4gICAgICAgICAgYm9keS5jbGFzc0xpc3QucmVtb3ZlKHNjcm9sbFVwKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihjdXJyZW50U2Nyb2xsIDwgMSl7XG4gICAgICAgICAgYm9keS5jbGFzc0xpc3QucmVtb3ZlKHNjcm9sbERvd24pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGN1cnJlbnRTY3JvbGwgPiBsYXN0U2Nyb2xsICYmICFib2R5LmNsYXNzTGlzdC5jb250YWlucyhzY3JvbGxEb3duKSkge1xuICAgICAgICAgIC8vIGRvd25cbiAgICAgICAgICBib2R5LmNsYXNzTGlzdC5yZW1vdmUoc2Nyb2xsVXApO1xuICAgICAgICAgIGJvZHkuY2xhc3NMaXN0LmFkZChzY3JvbGxEb3duKTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50U2Nyb2xsIDwgbGFzdFNjcm9sbCAmJiBib2R5LmNsYXNzTGlzdC5jb250YWlucyhzY3JvbGxEb3duKSkge1xuICAgICAgICAgIC8vIHVwXG4gICAgICAgICAgYm9keS5jbGFzc0xpc3QucmVtb3ZlKHNjcm9sbERvd24pO1xuICAgICAgICAgIGJvZHkuY2xhc3NMaXN0LmFkZChzY3JvbGxVcCk7XG4gICAgICAgIH1cbiAgICAgICAgbGFzdFNjcm9sbCA9IGN1cnJlbnRTY3JvbGw7XG4gICAgICB9KTtcblxuICAgICAgJCgnLmJ1cmdlci1tZW51IC5zd2l0Y2gtYnV0dG9ucyBwOmZpcnN0LW9mLXR5cGUnKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAkKCcuYnVyZ2VyLW1lbnUgLnN3aXRjaC1jb250ZW50IC5zd2l0Y2gtYmxvY2s6Zmlyc3Qtb2YtdHlwZScpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblxuXG4gICAgICBsZXQgdGltZXI7XG4gICAgICBjb25zdCAkZmlyc3RMZXZlbEl0ZW0gPSAkKCcuZmlyc3QtbHZsID4gbGkuaGFzLXN1Ym1lbnUnKTtcblxuICAgICAgJGZpcnN0TGV2ZWxJdGVtLm1vdXNlZW50ZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdpcy1ob3ZlcicpLnNpYmxpbmdzKCdsaScpLnJlbW92ZUNsYXNzKCdpcy1ob3ZlcicpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnb3ZlcmxheS1vcGVuJyk7XG4gICAgICAgIH0pXG4gICAgICAgIC5tb3VzZWxlYXZlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnb3ZlcmxheS1vcGVuJyk7XG4gICAgICAgICAgICAkZmlyc3RMZXZlbEl0ZW0ucmVtb3ZlQ2xhc3MoJ2lzLWhvdmVyJyk7XG4gICAgICAgICAgfSw0ODApO1xuICAgICAgICB9KTtcblxuICAgICAgJCgnLmJ1cmdlci1tZW51Jykub24oJ2NsaWNrJywgJy5idXJnZXInLCBmdW5jdGlvbigpe1xuICAgICAgICAkKCcjbmF2LWljb24nKS50b2dnbGVDbGFzcygnb3BlbicpO1xuICAgICAgICAkKCcuYnVyZ2VyLW1lbnUnKS50b2dnbGVDbGFzcygnb3BlbicpO1xuICAgICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ292ZXJsYXktb3BlbicpO1xuICAgICAgfSk7XG5cbiAgICB9ZWxzZXtcblxuICAgICAgJCgnLmJ1cmdlci1yZXNwJykub24oJ2NsaWNrJywgJy5idXJnZXInLCBmdW5jdGlvbigpe1xuICAgICAgICAkKCcjbmF2LWljb24nKS50b2dnbGVDbGFzcygnb3BlbicpO1xuICAgICAgICAkKCcuYnVyZ2VyLXJlc3AnKS50b2dnbGVDbGFzcygnb3BlbicpO1xuICAgICAgICAkKCcubWVudS1yZXNwJykudG9nZ2xlQ2xhc3MoJ2lzLW9wZW4nKTtcbiAgICAgIH0pO1xuXG4gICAgICAkKCcubWVudS1yZXNwIC5oYXMtc3VibWVudT5hJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICAgJCh0aGlzKS5uZXh0KCcuc2Vjb25kLWx2bC1yZXNwJykuYWRkQ2xhc3MoJ2lzLW9wZW4nKTtcbiAgICAgIH0pO1xuXG4gICAgICAkKCcuY2xvc2UtcmVzcCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgICAgICQodGhpcykuY2xvc2VzdCgnLnNlY29uZC1sdmwtcmVzcCcpLnJlbW92ZUNsYXNzKCdpcy1vcGVuJyk7XG4gICAgICB9KTtcblxuICAgICAgbGV0IGhlaWdodCA9ICQoJy5tZW51LXJlc3AnKS5oZWlnaHQoKTtcbiAgICAgICQoJy5zZWNvbmQtbHZsLXJlc3AnKS5jc3MoJ2hlaWdodCcsaGVpZ2h0LTIzMisncHgnKTtcblxuICAgIH1cblxuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoISQoZS50YXJnZXQpLmNsb3Nlc3QoJyNoZWFkZXInKS5sZW5ndGggKSB7XG4gICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnb3ZlcmxheS1vcGVuJyk7XG4gICAgICAgICQoJy5idXJnZXItbWVudScpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICAgICQoJyNuYXYtaWNvbicpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoJCgnLnNsaWRlci1tdWx0aW1lZGlhJykubGVuZ3RoKSB7XG4gICAgICBpZigkKCcub3ZlcmxheScpLmxlbmd0aCl7XG4gICAgICAgICQoJy5zbGlkZXItbXVsdGltZWRpYSAub3ZlcmxheScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgJCh0aGlzKS5mYWRlT3V0KCdzbG93Jyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgbGV0ICRzbGlkZXIgPSAkKCcuc2xpZGVyLW11bHRpbWVkaWEnKTtcbiAgICAgICRzbGlkZXIuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAkKHRoaXMpLmZpbmQoJy5zbGlkZXItd3JhcCcpLnNsaWNrKHtcbiAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcbiAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXG4gICAgICAgICAgZmFkZTogdHJ1ZSxcbiAgICAgICAgICBzcGVlZDogMjAwMCxcbiAgICAgICAgICBkb3RzOiBmYWxzZSxcbiAgICAgICAgICB1c2VDU1M6IHRydWUsXG4gICAgICAgICAgYXJyb3c6IHRydWUsXG4gICAgICAgICAgYWRhcHRpdmVIZWlnaHQ6IHRydWUsXG4gICAgICAgICAgcGF1c2VPbkhvdmVyOiB0cnVlLFxuICAgICAgICAgIHByZXZBcnJvdzogJCh0aGlzKS5jbG9zZXN0KCcuc2xpZGVyLW11bHRpbWVkaWEnKS5maW5kKCcuc2xpY2stcHJldicpLFxuICAgICAgICAgIG5leHRBcnJvdzogJCh0aGlzKS5jbG9zZXN0KCcuc2xpZGVyLW11bHRpbWVkaWEnKS5maW5kKCcuc2xpY2stbmV4dCcpLFxuICAgICAgICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgYnJlYWtwb2ludDogODk2LFxuICAgICAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgICAgIHN3aXBlOnRydWUsXG4gICAgICAgICAgICAgICAgZHJhZ2dhYmxlOnRydWUsXG4gICAgICAgICAgICAgICAgYWRhcHRpdmVIZWlnaHQ6IHRydWUsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICgkKCcuc2xpZGVyLWtleS1udW1iZXInKS5sZW5ndGgpIHtcbiAgICAgIGxldCAkc2xpZGVyID0gJCgnLnNsaWRlci1rZXktbnVtYmVyJyk7XG4gICAgICAkc2xpZGVyLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgJCh0aGlzKS5maW5kKCcuc2xpZGVyLXdyYXAnKS5zbGljayh7XG4gICAgICAgICAgaW5maW5pdGU6IHRydWUsXG4gICAgICAgICAgc2xpZGVzVG9TaG93OiAzLFxuICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxuICAgICAgICAgIHNwZWVkOiAxMDAwLFxuICAgICAgICAgIGRvdHM6IGZhbHNlLFxuICAgICAgICAgIGFycm93OiB0cnVlLFxuICAgICAgICAgIHBhdXNlT25Ib3ZlcjogdHJ1ZSxcbiAgICAgICAgICBwcmV2QXJyb3c6ICQodGhpcykuY2xvc2VzdCgnLnNsaWRlci1rZXktbnVtYmVyJykuZmluZCgnLnNsaWNrLXByZXYnKSxcbiAgICAgICAgICBuZXh0QXJyb3c6ICQodGhpcykuY2xvc2VzdCgnLnNsaWRlci1rZXktbnVtYmVyJykuZmluZCgnLnNsaWNrLW5leHQnKSxcbiAgICAgICAgICByZXNwb25zaXZlOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDEyMDAsXG4gICAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxuICAgICAgICAgICAgICAgIHN3aXBlOnRydWUsXG4gICAgICAgICAgICAgICAgZHJhZ2dhYmxlOnRydWUsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmKCQoJy5zd2l0Y2gtYmxvY2snKS5sZW5ndGgpe1xuICAgICAgJCgnLnN3aXRjaC1jb250YWluZXInKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0ICR0aGlzID0gJCh0aGlzKTtcbiAgICAgICAgJHRoaXMuZmluZCgnLnN3aXRjaC1idXR0b25zJykub24oJ2NsaWNrJywgJ3AnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICQodGhpcykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG5cbiAgICAgICAgICBsZXQgYnV0dG9uRGF0YSA9ICQodGhpcykuYXR0cignZGF0YS1zd2l0Y2gnKTtcbiAgICAgICAgICAkdGhpcy5maW5kKCcuc3dpdGNoLWJsb2NrJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbGV0IGJsb2NrRGF0YSA9ICQodGhpcykuYXR0cignZGF0YS1zd2l0Y2gnKTtcbiAgICAgICAgICAgIGlmKGJ1dHRvbkRhdGEgPT09IGJsb2NrRGF0YSl7XG4gICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICgkKCcuc2xpZGVyLWltZycpLmxlbmd0aCkge1xuICAgICAgbGV0ICRzbGlkZXIgPSAkKCcuc2xpZGVyLWltZycpO1xuICAgICAgdmFyICRzdGF0dXMgPSAkKCcuY291bnRlci1zbGlkZXInKTtcblxuICAgICAgJHNsaWRlci5vbignaW5pdCByZUluaXQgYWZ0ZXJDaGFuZ2UnLCBmdW5jdGlvbiAoZXZlbnQsIHNsaWNrLCBjdXJyZW50U2xpZGUsIG5leHRTbGlkZSkge1xuICAgICAgICB2YXIgaSA9IChjdXJyZW50U2xpZGUgPyBjdXJyZW50U2xpZGUgOiAwKSArIDE7XG4gICAgICAgICRzdGF0dXMuaHRtbCgnPHNwYW4gY2xhc3M9XCJjdXJyZW50X3NsaWRlXCI+JyArIGkgKyAnPC9zcGFuPjxzcGFuIGNsYXNzPVwic2xhc2hcIj4vPC9zcGFuPjxzcGFuIGNsYXNzPVwidG90YWxfc2xpZGVzXCI+JyArIHNsaWNrLnNsaWRlQ291bnQgKyAnPC9zcGFuPicpO1xuICAgICAgfSk7XG5cbiAgICAgICRzbGlkZXIuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAkKHRoaXMpLmZpbmQoJy5zbGlkZXItd3JhcCcpLnNsaWNrKHtcbiAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcbiAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXG4gICAgICAgICAgZG90czogZmFsc2UsXG4gICAgICAgICAgYXJyb3c6IHRydWUsXG4gICAgICAgICAgYXV0b3BsYXk6IHRydWUsXG4gICAgICAgICAgYXV0b3BsYXlTcGVlZDogODAwMCxcbiAgICAgICAgICBwcmV2QXJyb3c6ICQodGhpcykuY2xvc2VzdCgnLnNsaWRlci1pbWcnKS5zaWJsaW5ncygnLndoaXRlLWJsb2NrLCAudHJpYW5nbGUtY291bnRlcicpLmZpbmQoJy5zbGljay1wcmV2JyksXG4gICAgICAgICAgbmV4dEFycm93OiAkKHRoaXMpLmNsb3Nlc3QoJy5zbGlkZXItaW1nJykuc2libGluZ3MoJy53aGl0ZS1ibG9jaywgLnRyaWFuZ2xlLWNvdW50ZXInKS5maW5kKCcuc2xpY2stbmV4dCcpLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICgkKCcuc2xpZGVyLXByb2R1Y3RzJykubGVuZ3RoKSB7XG4gICAgICBsZXQgJHNsaWRlciA9ICQoJy5zbGlkZXItcHJvZHVjdHMnKTtcblxuICAgICAgJHNsaWRlci5vbignaW5pdCByZUluaXQgYWZ0ZXJDaGFuZ2UnLCBmdW5jdGlvbiAoZXZlbnQsIHNsaWNrLCBjdXJyZW50U2xpZGUsIG5leHRTbGlkZSkge1xuICAgICAgICBsZXQgJFNsaWNrUHJldkFjdGl2ZSA9ICQoJy5zbGlkZXItcHJvZHVjdHMgLnNsaWNrLWFjdGl2ZScpLnByZXYoKS5maW5kKCcuc2xpZGUnKS5hdHRyKCdkYXRhLWNhdGVnb3JpZScpO1xuICAgICAgICBsZXQgJFNsaWNrTmV4dEFjdGl2ZSA9ICQoJy5zbGlkZXItcHJvZHVjdHMgLnNsaWNrLWFjdGl2ZScpLm5leHQoKS5maW5kKCcuc2xpZGUnKS5hdHRyKCdkYXRhLWNhdGVnb3JpZScpO1xuICAgICAgICAkKCcuY2F0ZWdvcmllLXByZXYnKS50ZXh0KCRTbGlja1ByZXZBY3RpdmUpO1xuICAgICAgICAkKCcuY2F0ZWdvcmllLW5leHQnKS50ZXh0KCRTbGlja05leHRBY3RpdmUpO1xuICAgICAgfSk7XG5cbiAgICAgICRzbGlkZXIuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAkKHRoaXMpLmZpbmQoJy5zbGlkZXItd3JhcCcpLnNsaWNrKHtcbiAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcbiAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXG4gICAgICAgICAgYXV0b3BsYXk6IHRydWUsXG4gICAgICAgICAgYXV0b3BsYXlTcGVlZDogODAwMCxcbiAgICAgICAgICBkb3RzOiBmYWxzZSxcbiAgICAgICAgICBhcnJvdzogdHJ1ZSxcbiAgICAgICAgICBwcmV2QXJyb3c6ICQodGhpcykuY2xvc2VzdCgnLmZ1bGwtYmxvY2staG9tZScpLmZpbmQoJy5zbGljay1wcmV2JyksXG4gICAgICAgICAgbmV4dEFycm93OiAkKHRoaXMpLmNsb3Nlc3QoJy5mdWxsLWJsb2NrLWhvbWUnKS5maW5kKCcuc2xpY2stbmV4dCcpLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICgkKCcuc2xpZGVyLXBhcnRuZXJzJykubGVuZ3RoKSB7XG4gICAgICBsZXQgJHNsaWRlciA9ICQoJy5zbGlkZXItcGFydG5lcnMnKTtcblxuICAgICAgJHNsaWRlci5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICQodGhpcykuZmluZCgnLnNsaWRlci13cmFwJykuc2xpY2soe1xuICAgICAgICAgIGluZmluaXRlOiB0cnVlLFxuICAgICAgICAgIHNsaWRlc1RvU2hvdzogMyxcbiAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcbiAgICAgICAgICB2YXJpYWJsZVdpZHRoOiB0cnVlLFxuICAgICAgICAgIGRvdHM6IGZhbHNlLFxuICAgICAgICAgIGFycm93OiB0cnVlLFxuICAgICAgICAgIGRyYWdnYWJsZTogdHJ1ZSxcbiAgICAgICAgICBwcmV2QXJyb3c6ICQodGhpcykuY2xvc2VzdCgnLmJsb2NrLXBhcnRuZXJzJykuZmluZCgnLnNsaWNrLXByZXYnKSxcbiAgICAgICAgICBuZXh0QXJyb3c6ICQodGhpcykuY2xvc2VzdCgnLmJsb2NrLXBhcnRuZXJzJykuZmluZCgnLnNsaWNrLW5leHQnKSxcbiAgICAgICAgICByZXNwb25zaXZlOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDEyMDAsXG4gICAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxuICAgICAgICAgICAgICAgIHN3aXBlOnRydWUsXG4gICAgICAgICAgICAgICAgZHJhZ2dhYmxlOnRydWUsXG4gICAgICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogZmFsc2UsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICgkKCcuc2xpZGVyLWFjdHVzJykubGVuZ3RoKSB7XG4gICAgICBsZXQgJHNsaWRlciA9ICQoJy5zbGlkZXItYWN0dXMnKTtcblxuICAgICAgJHNsaWRlci5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICQodGhpcykuZmluZCgnLnNsaWRlci13cmFwJykuc2xpY2soe1xuICAgICAgICAgIGluZmluaXRlOiB0cnVlLFxuICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcbiAgICAgICAgICBmYWRlOiB0cnVlLFxuICAgICAgICAgIHNwZWVkOiA5MDAsXG4gICAgICAgICAgZG90czogZmFsc2UsXG4gICAgICAgICAgYXJyb3c6IHRydWUsXG4gICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlLFxuICAgICAgICAgIHByZXZBcnJvdzogJCh0aGlzKS5jbG9zZXN0KCcuYmxvY2stYWN0dXMnKS5maW5kKCcuc2xpY2stcHJldicpLFxuICAgICAgICAgIG5leHRBcnJvdzogJCh0aGlzKS5jbG9zZXN0KCcuYmxvY2stYWN0dXMnKS5maW5kKCcuc2xpY2stbmV4dCcpLFxuICAgICAgICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgYnJlYWtwb2ludDogMTIwMCxcbiAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICBhZGFwdGl2ZUhlaWdodDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzcGVlZDogMzAwLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBpZigkKCcubGlzdC10by1zaG93JykubGVuZ3RoKXtcbiAgICAvLyAgIGxldCBjb3VudENhcmRzID0gMDtcbiAgICAvLyAgICQoJy5jYXJkJykuZWFjaChmdW5jdGlvbigpe1xuICAgIC8vICAgICBpZihjb3VudENhcmRzIDwgNil7XG4gICAgLy8gICAgICAgJCh0aGlzKS5hZGRDbGFzcygnaXMtdmlzaWJsZScpO1xuICAgIC8vICAgICAgIGNvdW50Q2FyZHMrKztcbiAgICAvLyAgICAgfVxuICAgIC8vICAgfSk7XG4gICAgLy9cbiAgICAvLyAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgLy8gICAgIGlmKCQoJy5jYXJkJykubGVuZ3RoIDwgNil7XG4gICAgLy8gICAgICAgJCgnLnNlZS1tb3JlJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgfSwgMTAwKTtcbiAgICAvL1xuICAgIC8vICAgJCgnLmxpc3QtdG8tc2hvdycpLm9uKCdjbGljaycsICcuc2VlLW1vcmUnLCBmdW5jdGlvbigpe1xuICAgIC8vICAgICBjb3VudENhcmRzID0gMDtcbiAgICAvLyAgICAgJCgnLmNhcmQ6bm90KC5pcy12aXNpYmxlKScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAvLyAgICAgICBpZihjb3VudENhcmRzIDwgNil7XG4gICAgLy8gICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdpcy12aXNpYmxlJyk7XG4gICAgLy8gICAgICAgICBjb3VudENhcmRzKys7XG4gICAgLy8gICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgLy8gICAgICAgICAgIGlmKCQoJy5jYXJkJykubGVuZ3RoID09PSAkKCcuaXMtdmlzaWJsZScpLmxlbmd0aCl7XG4gICAgLy8gICAgICAgICAgICAgJCgnLnNlZS1tb3JlJykuZmFkZU91dCgpO1xuICAgIC8vICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICB9LCAxMDApO1xuICAgIC8vICAgICAgIH1cbiAgICAvLyAgICAgfSk7XG4gICAgLy8gICB9KTtcbiAgICAvLyB9XG5cbiAgICBpZigkKCcuYmxvY2stYWNjb3JkZW9uJykubGVuZ3RoKXtcbiAgICAgICQoJy5ibG9jay1hY2NvcmRlb24nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgIGxldCB0aGlzQWNjb3JkZW9uID0gJCh0aGlzKTtcbiAgICAgICAgdGhpc0FjY29yZGVvbi5vbignY2xpY2snLCAnaW5wdXRbdHlwZT1jaGVja2JveF0nLCBmdW5jdGlvbigpe1xuICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLnRhYicpLnNpYmxpbmdzKCkuZmluZCgnaW5wdXRbdHlwZT1jaGVja2JveF0nKS5wcm9wKCdjaGVja2VkJyxmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCQoJy5wb3AtaW4tYnV0dG9uJykubGVuZ3RoKSB7XG4gICAgICAkKCcucG9wLWluLWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgICAgIGxldCB0YXJnZXQgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtdGFyZ2V0Jyk7XG4gICAgICAgICQodGFyZ2V0KS5hZGRDbGFzcygnaXMtc2hvdycpO1xuICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ292ZXJsYXktc2hvdycpO1xuICAgICAgfSk7XG4gICAgICAkKGRvY3VtZW50KS5tb3VzZXVwKGZ1bmN0aW9uKGUpe1xuICAgICAgICB2YXIgY29udGFpbmVyID0gJCgnLnBvcC1pbiwgLnBvcC1pbi1idXR0b24nKTtcbiAgICAgICAgaWYgKCFjb250YWluZXIuaXMoZS50YXJnZXQpICYmIGNvbnRhaW5lci5oYXMoZS50YXJnZXQpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIGNvbnRhaW5lci5yZW1vdmVDbGFzcygnaXMtc2hvdycpO1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnb3ZlcmxheS1zaG93Jyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgJCgnLnBvcC1pbiAuY2xvc2UnKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuICAgICAgICAkKCcucG9wLWluJykucmVtb3ZlQ2xhc3MoJ2lzLXNob3cnKTtcbiAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdvdmVybGF5LXNob3cnKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICgkKCcuc2xpZGVyLWhleGFnb25lJykubGVuZ3RoICYmIHdpbmRvdy5tYXRjaE1lZGlhKCcobWF4LXdpZHRoOiAxMjAwcHgpJykubWF0Y2hlcykge1xuICAgICAgJCgnLnNsaWRlci1oZXhhZ29uZScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgJCh0aGlzKS5maW5kKCcuc2xpZGVyLXdyYXAnKS5zbGljayh7XG4gICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICAgIGNlbnRlck1vZGU6IHRydWUsXG4gICAgICAgICAgdmFyaWFibGVXaWR0aDogdHJ1ZSxcbiAgICAgICAgICBkb3RzOiB0cnVlLFxuICAgICAgICAgIGFycm93OiBmYWxzZSxcbiAgICAgICAgICBzd2lwZVRvU2xpZGU6IHRydWUsXG4gICAgICAgICAgc3dpcGU6dHJ1ZSxcbiAgICAgICAgICBpbml0aWFsU2xpZGUgOiAxLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICB9XG59O1xuXG5hcHAuaW5pdCgpO1xuXG4vLyBnbG9iYWwgY3VzdG9tIGZ1bmN0aW9ucywgdGhleSBjYW4gYmUgY2FsbGVkIGZyb20gYW55d2hlcmUgd2l0aGluIHRoZSBwcm9qZWN0ICh1c2VmdWwgZm9yIHRoZSBiYWNrLWVuZCBkZXZlbG9wZXJzKVxubGV0IGN1c3RvbUZ1bmN0aW9ucyA9IHtcbiAgLy8gZ2xvYmFsIGN1c3RvbSBmdW5jdGlvbiBleGFtcGxlXG4gIC8vIHRvIGNhbGwgaXQgZnJvbSBhbnl3aGVyZSA6IGdsb2JhbC5jdXN0b21GdW5jdGlvbi5hZnRlckFqYXhFeGFtcGxlKCk7XG4gIC8qYWZ0ZXJBamF4RXhhbXBsZTogZnVuY3Rpb24oKSB7XG4gICBoZWxwZXJzLnJlc2l6ZUltZygnLm1lZGlhLWJsb2NrLW5ld3MnKTtcbiAgIH0qL1xufTtcbi8vIGV4cG9ydHMgdGhlIGVsZW1lbnRzIHRoYXQgbmVlZCB0byBiZSBhY2Nlc3NlZCBmcm9tIHNvbWV3aGVyZSBlbHNlIChpbiB0aGUgXCJnbG9iYWxcIiBzdGFuZGFsb25lIG9iamVjdCwgY2YuIGd1bHBmaWxlKVxubW9kdWxlLmV4cG9ydHMgPSBjdXN0b21GdW5jdGlvbnM7XG4iXX0=
