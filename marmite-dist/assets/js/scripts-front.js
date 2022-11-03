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

      $('.first-lvl > li').mouseenter(function () {
        if ($(this).hasClass('has-submenu')) {
          $(this).addClass('is-hover');
          $(this).siblings().removeClass('is-hover');
          $('body').addClass('overlay-open');
        }
      }).mouseleave(function () {
        $('body').removeClass('overlay-open');
        $('.first-lvl li').removeClass('is-hover');
      });

      $('.burger-menu').on('click', '.burger', function () {
        $('#nav-icon').toggleClass('open');
        $('.burger-menu').toggleClass('open');
        $('body').toggleClass('overlay-open');
      });
    } else {}

    $('body').on('click', function (e) {
      if (!$(e.target).closest('#header').length) {
        $('body').removeClass('overlay-open');
        $('.burger-menu').removeClass('open');
        $('#nav-icon').removeClass('open');
      }
    });

    if ($('.switch-block').length) {
      $('.switch-buttons').on('click', 'p', function () {
        $(this).addClass('is-active');
        $(this).siblings().removeClass('is-active');

        var buttonData = $(this).attr('data-switch');
        $('.switch-block').each(function () {
          var blockData = $(this).attr('data-switch');
          if (buttonData === blockData) {
            $(this).addClass('is-active');
            $(this).siblings().removeClass('is-active');
            $(this).find('.cards').addClass('is-visible');
          }
        });
      });
    }

    if ($('.slider-img').length) {
      var $slider = $('.slider-img');
      var $status = $('.counter-slider');

      $slider.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
        var i = (currentSlide ? currentSlide : 0) + 1;
        $status.html('<span class="current_slide">' + i + '</span><span class="slash">/</span><span class="total_slides">' + slick.slideCount + '</span>');
      });

      $slider.each(function () {
        $(this).find('.slider-wrap').slick({
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
          arrow: true,
          prevArrow: $(this).closest('.slider-img').siblings('.white-block, .triangle-counter').find('.slick-prev'),
          nextArrow: $(this).closest('.slider-img').siblings('.white-block, .triangle-counter').find('.slick-next'),
          responsive: [{
            breakpoint: 1400,
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

    if ($('.slider-products').length) {
      var _$slider = $('.slider-products');

      _$slider.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
        var $SlickPrevActive = $('.slider-products .slick-active').prev().find('.slide').attr('data-categorie');
        var $SlickNextActive = $('.slider-products .slick-active').next().find('.slide').attr('data-categorie');
        $('.categorie-prev').text($SlickPrevActive);
        $('.categorie-next').text($SlickNextActive);
      });

      _$slider.each(function () {
        $(this).find('.slider-wrap').slick({
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
          arrow: true,
          prevArrow: $(this).closest('.full-block-home').find('.slick-prev'),
          nextArrow: $(this).closest('.full-block-home').find('.slick-next')
        });
      });
    }

    if ($('.slider-partners').length) {
      var _$slider2 = $('.slider-partners');

      _$slider2.each(function () {
        $(this).find('.slider-wrap').slick({
          infinite: true,
          slidesToShow: 3,
          slidesToScroll: 1,
          variableWidth: true,
          dots: false,
          arrow: true,
          draggable: true,
          prevArrow: $(this).closest('.block-partners').find('.slick-prev'),
          nextArrow: $(this).closest('.block-partners').find('.slick-next')
        });
      });
    }

    if ($('.slider-actus').length) {
      var _$slider3 = $('.slider-actus');

      _$slider3.each(function () {
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
          nextArrow: $(this).closest('.block-actus').find('.slick-next')
        });
      });
    }

    // if($('.list-to-show').length){
    //   let countCards = 0;
    //   $('.produit').each(function(){
    //     if(countCards < 6){
    //       $(this).addClass('is-visible');
    //       countCards++;
    //     }
    //   });
    //
    //   setTimeout(function() {
    //     if($('.produit').length < 6){
    //       $('.see-more').css('display', 'none');
    //     }
    //   }, 100);
    //
    //   $('.list-to-show').on('click', '.see-more', function(){
    //     countCards = 0;
    //     $('.produit:not(.is-visible)').each(function(){
    //       if(countCards < 6){
    //         $(this).addClass('is-visible');
    //         countCards++;
    //         setTimeout(function(){
    //           if($('.produit').length === $('.is-visible').length){
    //             $('.see-more').fadeOut();
    //           }
    //         }, 100);
    //       }
    //     });
    //   });
    // }

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

    if ($('.slider-hexagone').length && window.matchMedia('(max-width: 896px)').matches) {
      $('.slider-hexagone').each(function () {
        $(this).find('.slider-wrap').slick({
          infinite: false,
          slidesToShow: 3,
          slidesToScroll: 1,
          dots: false,
          arrow: false,
          variableWidth: true,
          responsive: [{
            breakpoint: 896,
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtYXJtaXRlLXNyYy9hc3NldHMvanMvX2hlbHBlcnMuanMiLCJtYXJtaXRlLXNyYy9hc3NldHMvanMvX3N0b3JlLmpzIiwibWFybWl0ZS1zcmMvYXNzZXRzL2pzL2NsYXNzL0Jhbm5lck1lc3NhZ2VzLmpzIiwibWFybWl0ZS1zcmMvYXNzZXRzL2pzL2NsYXNzL0NsZWFySW5wdXQuanMiLCJtYXJtaXRlLXNyYy9hc3NldHMvanMvY2xhc3MvQ29sbGFwc2libGUuanMiLCJtYXJtaXRlLXNyYy9hc3NldHMvanMvY2xhc3MvQ29va2llcy5qcyIsIm1hcm1pdGUtc3JjL2Fzc2V0cy9qcy9jbGFzcy9EZXRlY3RCcm93c2VyLmpzIiwibWFybWl0ZS1zcmMvYXNzZXRzL2pzL2NsYXNzL1Jlc3BvbnNpdmVEZWJ1Zy5qcyIsIm1hcm1pdGUtc3JjL2Fzc2V0cy9qcy9jbGFzcy9TY3JvbGxBbmNob3IuanMiLCJtYXJtaXRlLXNyYy9hc3NldHMvanMvY2xhc3MvU2hvd1Bhc3N3b3JkLmpzIiwibWFybWl0ZS1zcmMvYXNzZXRzL2pzL2NsYXNzL1ZhbGlkRm9ybS5qcyIsIm1hcm1pdGUtc3JjL2Fzc2V0cy9qcy9zY3JpcHRzLWZyb250LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FBRUE7Ozs7Ozs7O0FBUUEsSUFBTSxVQUFVO0FBQ1o7QUFDQTtBQUNBLGNBQVUsb0JBQVk7QUFDbEIsWUFBSSxJQUFJLE1BQVI7QUFBQSxZQUFnQixJQUFJLE9BQXBCO0FBQ0EsWUFBSSxFQUFFLGdCQUFnQixNQUFsQixDQUFKLEVBQStCO0FBQzNCLGdCQUFJLFFBQUo7QUFDQSxnQkFBSSxTQUFTLGVBQVQsSUFBNEIsU0FBUyxJQUF6QztBQUNIO0FBQ0QsZUFBTztBQUNILG1CQUFPLEVBQUcsSUFBSSxPQUFQLENBREo7QUFFSCxvQkFBUSxFQUFHLElBQUksUUFBUDtBQUZMLFNBQVA7QUFJSDtBQWJX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Q0E7QUFDQTs7O0FBSG9CLENBQXRCO0FBT0E7QUFDQSxPQUFPLE9BQVAsR0FBaUIsZUFBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuKlxuKiBHbG9iYWwgaGVscGVyIGZ1bmN0aW9uc1xuKiBUaGV5IGNhbiBiZSBjYWxsZWQgZnJvbSBhbnkgSlMgQ2xhc3MsIHByb3ZpZGVkIHRoZXkgYXJlIGltcG9ydGVkXG4qXG4qIEBhdXRob3IgbWhhXG4qL1xuXG5jb25zdCBoZWxwZXJzID0ge1xuICAgIC8vIGdldCB2aWV3cG9ydCBzaXplLCB3aXRob3V0IHNjcm9sbGJhclxuICAgIC8vIHRvIGNhbGwgaXQgZnJvbSBhbnl3aGVyZSBlbHNlIHRoYW4gaGVyZSA6IGdsb2JhbC5oZWxwZXJzLnZpZXdwb3J0KCkgKGV4IDogIGdsb2JhbC5oZWxwZXJzLnZpZXdwb3J0KCkud2lkdGggKVxuICAgIHZpZXdwb3J0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBlID0gd2luZG93LCBhID0gJ2lubmVyJztcbiAgICAgICAgaWYgKCEoJ2lubmVyV2lkdGgnIGluIHdpbmRvdykpIHtcbiAgICAgICAgICAgIGEgPSAnY2xpZW50JztcbiAgICAgICAgICAgIGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgfHwgZG9jdW1lbnQuYm9keTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2lkdGg6IGVbIGEgKyAnV2lkdGgnIF0sXG4gICAgICAgICAgICBoZWlnaHQ6IGVbIGEgKyAnSGVpZ2h0JyBdXG4gICAgICAgIH07XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBoZWxwZXJzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqXG4gKiBHbG9iYWwgdmFyaWFibGVzXG4gKiBUaGV5IGNhbiBiZSBjYWxsZWQgZnJvbSBhbnkgSlMgQ2xhc3MsIHByb3ZpZGVkIHRoZXkgYXJlIGltcG9ydGVkXG4gKlxuICogQGF1dGhvciBtaGFcbiAqL1xuZnVuY3Rpb24gZ2V0ZGF0YShuYW1lKSB7XG4gIHJldHVybiAkKCdtZXRhW3Byb3BlcnR5PScgKyBKU09OLnN0cmluZ2lmeShuYW1lKSArICddJykuYXR0cignY29udGVudCcpO1xufVxuY29uc3Qgc3RvcmUgPSB7XG4gIHByb2plY3RKc05hbWU6IGdldGRhdGEoJ2FwcDpzaXRlX2RhdGE6cHJvamVjdEpzTmFtZScpLFxuICBhQXZhaWxhYmxlTWFya2Vyc1R5cGU6IGdldGRhdGEoJ2FwcDpzaXRlX2RhdGE6YUF2YWlsYWJsZU1hcmtlcnNUeXBlJyksXG4gIHNSb290UGF0aDogZ2V0ZGF0YSgnYXBwOnNpdGVfZGF0YTpzUm9vdFBhdGgnKSxcbiAgc01hcmtlcnNQYXRoOiBnZXRkYXRhKCdhcHA6c2l0ZV9kYXRhOnNNYXJrZXJzUGF0aCcpLFxuICBkZWZhdWx0UmVxdWlyZWRNc2c6IGdldGRhdGEoJ2FwcDpzaXRlX2RhdGE6ZGVmYXVsdFJlcXVpcmVkTXNnJyksXG4gIGRlZmF1bHRFcnJvck1zZzogZ2V0ZGF0YSgnYXBwOnNpdGVfZGF0YTpkZWZhdWx0RXJyb3JNc2cnKSxcbiAgZGVmYXVsdFB3ZEVycm9yTXNnOiBnZXRkYXRhKCdhcHA6c2l0ZV9kYXRhOmRlZmF1bHRQd2RFcnJvck1zZycpLFxuICB3V2lkdGg6IDAsXG4gIHdIZWlnaHQ6IDAsXG4gIGN1cnJlbnRXaWR0aDogMCxcbiAgY3VycmVudEhlaWdodDogMCxcbiAgdGltZXJSZXNwb25zaXZlOiAwLFxuICB3U2Nyb2xsOiAwLFxuICBtcTE6ICdvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogMjVlbSknLFxuICBtcTI6ICdvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogMzJlbSknLFxuICBtcTM6ICdvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogMzllbSknLFxuICBtcTQ6ICdvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNTJlbSknLFxuICBtcTU6ICdvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNThlbSknLFxuICBtcTY6ICdvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNzBlbSknLFxuICBtcTc6ICdvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogODVlbSknXG5cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdG9yZTtcbiIsImltcG9ydCBzdG9yZSBmcm9tICcuLi9fc3RvcmUnO1xuLyoqXG4gKlxuICogQmFubmVyTWVzc2FnZXNcbiAqIEdlbmVyaWMgY2xhc3MgZm9yIG1lc3NhZ2VzIGVsZW1lbnRzIDogY29va2llcyAvIHdhcm5pbmcgLyBuZXdzXG4gKlxuICogQGF1dGhvciBlZnJcbiAqL1xuXG5cbmNsYXNzIEJhbm5lck1lc3NhZ2VzIHtcblxuICAvKipcbiAgICpcbiAgICogQ29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBMaXN0IG9mIHNldHRpbmdzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLnByb2plY3QgLSBQcm9qZWN0IG5hbWUgaW4gY2FtZWxDYXNlIHdpdGNoIHByZWZpeCB0aGUgY29vY2tpZSBuYW1lXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBvcHRpb25zLmNhcGluZyAtIFNwZWNjaWZ5IHRoZSBudW1iZXIgb2YgdGltZSB0aGUgYmFubmVyIGRpc3BsYXlcbiAgICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuY29udGFpbmVyIC0gVGhlIHNlbGVjdG9yIG9mIHRoZSBiYW5uZXJcbiAgICovXG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHByb2plY3Q6IHN0b3JlLnByb2plY3RKc05hbWUsXG4gICAgICBiYW5uZXJOYW1lOiAnJyxcbiAgICAgIGhpZGVKczogdHJ1ZSwgLy8gaWYgaGlkZUpzID09IHRydWUsIGhpZGVDbGFzcyBpcyBub3RlIG5lZWRlZFxuICAgICAgaGlkZUNsYXNzOiAnaGlkZS1iYW5uZXInLCAvLyBjbGFzcyB0byBhbmltYXRlIHRoZSBoaWRlIGlmIGhpZGVKcyA9IGZhbHNlXG4gICAgICBoaWRkZW5DbGFzczogJ2FzLS1oaWRkZW4nLCAvLyBjbGFzcyB0byByZW1vdmUgd2hlbiBiYW5uZXIgaXMgaGlkZGVuIGJ5IGRlZmF1bHRcbiAgICAgIGNhcGluZzogMCxcbiAgICAgIGNvbnRhaW5lcjogJy5jLWJhbm5lci1tZXNzYWdlcycsXG4gICAgICBkdXJhdGlvbkxpZmU6IDM2NSszMCxcbiAgICAgIHJlbW92ZTogdHJ1ZSxcbiAgICB9O1xuICAgIGNvbnN0IHByaXZhdGVzT3B0aW9ucyA9IHtcbiAgICAgIHJlc2V0OiAnLnNnLWJhbm5lci1tZXNzYWdlcy1yZXNldCcsIC8vIC8hXFwgdXNlIG9ubHkgaW4gc3R5bGVzLnR3aWdcbiAgICB9O1xuXG4gICAgLy8gZnVzaW9ubmUgbGVzIG9wdGlvbnMgcmVuc2VpZ25lZXMgYXZlYyBjZWxsZXMgcGFyIGRlZmF1dCBwb3VyIGNyZWVyIGwnb2JqZXQgc2V0dGluZ3NcbiAgICB0aGlzLnNldHRpbmdzID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCBvcHRpb25zLCBwcml2YXRlc09wdGlvbnMpO1xuXG4gICAgdGhpcy5iaW5kVUkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBoaWRlQmFubmVyXG4gICAqL1xuXG4gIGhpZGVCYW5uZXIoJGJhbm5lciwgYWNjZXB0KSB7XG4gICAgLy9jb25zb2xlLmxvZygnaGlkZUJhbm5lciA6ICcsICRiYW5uZXIpO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IGFjY2VwdENvb2t5ID0gYWNjZXB0IHx8IGZhbHNlO1xuICAgIGNvbnN0IHNldHRpbmdzID0gJGJhbm5lci5kYXRhKCdiYW5uZXItc2V0dGluZ3MnKTtcbiAgICBjb25zdCBiYW5uZXJDb29reU5hbWUgPSBzZXR0aW5ncy5iYW5uZXJDb29reU5hbWU7XG4gICAgLy9jb25zb2xlLmxvZygnJGJhbm5lciA6ICcsICRiYW5uZXIpO1xuICAgIC8vY29uc29sZS5sb2coJ2Jhbm5lckNvb2t5TmFtZSA6ICcsIGJhbm5lckNvb2t5TmFtZSk7XG4gICAgaWYoYWNjZXB0Q29va3kgPT09IHRydWUpIHtcbiAgICAgIHN0b3JlLmNvb2tpZXMuc2V0Q29va2llKGJhbm5lckNvb2t5TmFtZSx0cnVlLHNldHRpbmdzLmR1cmF0aW9uTGlmZSk7XG4gICAgfVxuICAgIGlmKHNldHRpbmdzLmhpZGVKcyA9PT0gdHJ1ZSkge1xuICAgICAgJGJhbm5lci5hbmltYXRlKHtoZWlnaHQ6J2hpZGUnLCBwYWRkaW5nVG9wOiAwLCBwYWRkaW5nQm90dG9tOiAwfSwgMzUwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRiYW5uZXIucmVtb3ZlKCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgJGJhbm5lci5hZGRDbGFzcyhzZXR0aW5ncy5oaWRlQ2xhc3MpO1xuICAgIH1cbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKGJhbm5lckNvb2t5TmFtZSwgMSk7XG4gICAgLy8gc2hvdyBkZWxldGUgY29va2llcyBidXR0b24gb25seSBpbiBzdHlsZXMudHdpZ1xuICAgICQoc2VsZi5zZXR0aW5ncy5yZXNldCkucGFyZW50KCdwJykucmVtb3ZlQ2xhc3MoJ2FzLS1oaWRkZW4nKTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBiaW5kVUlcbiAgICovXG5cbiAgYmluZFVJKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IGFFeGlzdGluZ0Nvb2tpZXMgPSBbXTtcbiAgICAvKiBCYW5uZXIgbWVzc2FnZXMgKi9cbiAgICAkKHNlbGYuc2V0dGluZ3MuY29udGFpbmVyKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0ICRiYW5uZXIgPSAkKHRoaXMpO1xuICAgICAgY29uc3QgcHJvamVjdEJhbm5lck5hbWUgPSBzZWxmLnNldHRpbmdzLnByb2plY3Q7XG4gICAgICBjb25zdCBzZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCBzZWxmLnNldHRpbmdzLCAkKHRoaXMpLmRhdGEoJ2Jhbm5lci1vcHRpb25zJykgfHx7fSk7XG4gICAgICBjb25zdCBiYW5uZXJOYW1lID0gc2V0dGluZ3MuYmFubmVyTmFtZTtcbiAgICAgIC8vY29uc29sZS5sb2coJ3NldHRpbmdzIDogJywgc2V0dGluZ3MpO1xuICAgICAgaWYoYmFubmVyTmFtZSA9PT0gJycpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignQmFubmVyTWVzc2FnZXMgLSBZb3UgbXVzdCBzZXQgdGhlIFwiYmFubmVyTmFtZVwiIGluIGRhdGEtYmFubmVyLW9wdGlvbnMgLSBjYW1lbENhc2Ugb25seScpO1xuICAgICAgfVxuICAgICAgY29uc3QgYmFubmVyQ29va3lOYW1lID0gc2V0dGluZ3MuYmFubmVyQ29va3lOYW1lID0gcHJvamVjdEJhbm5lck5hbWUgKyAnQmFubmVyTWVzc2FnZXMnICsgYmFubmVyTmFtZTtcbiAgICAgIGNvbnN0IGJhbm5lckNvb2t5TmFtZUNhcGluZyA9IHNldHRpbmdzLmJhbm5lckNvb2t5TmFtZUNhcGluZyA9IHByb2plY3RCYW5uZXJOYW1lICsgJ0Jhbm5lck1lc3NhZ2VzQ2FwaW5nJyArIGJhbm5lck5hbWU7XG4gICAgICBhRXhpc3RpbmdDb29raWVzLnB1c2goYmFubmVyQ29va3lOYW1lKTtcbiAgICAgIGlmKCQuaW5BcnJheShhRXhpc3RpbmdDb29raWVzLCBiYW5uZXJDb29reU5hbWUpICE9PSAtMSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdCYW5uZXJNZXNzYWdlcyAtIFwiYmFubmVyTmFtZSA6ICcgKyBiYW5uZXJOYW1lICsgJ1wiIGlzIGFscmVhZHkgc2V0IGZvciBhbiBvdGhlciBiYW5uZXIgLSBjYW1lbENhc2Ugb25seScpO1xuICAgICAgfVxuXG4gICAgICBsZXQgYmFubmVyTWVzc2FnZXMgPSBzdG9yZS5jb29raWVzLmdldENvb2tpZShiYW5uZXJDb29reU5hbWUpO1xuICAgICAgaWYoc2V0dGluZ3MuaGlkZUpzID09PSBmYWxzZSkge1xuICAgICAgICAkYmFubmVyLmFkZENsYXNzKCdoYXMtdHJhbnNpdGlvbicpO1xuICAgICAgfVxuICAgICAgaWYodHlwZW9mIHNldHRpbmdzLmNhcGluZyA9PT0gJ251bWJlcicgJiYgc2V0dGluZ3MuY2FwaW5nID4gMCkge1xuICAgICAgICBsZXQgYmFubmVyTWVzc2FnZXNDYXBpbmcgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGJhbm5lckNvb2t5TmFtZUNhcGluZyk7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ2Jhbm5lck1lc3NhZ2VzQ2FwaW5nIDogJywgYmFubmVyTWVzc2FnZXNDYXBpbmcpO1xuICAgICAgICBpZihiYW5uZXJNZXNzYWdlc0NhcGluZyAhPT0gbnVsbCkge1xuICAgICAgICAgIC8vY29uc29sZS5sb2coJ3NldEl0ZW0gZGVzY3JlYXNlJyk7XG4gICAgICAgICAgaWYgKHBhcnNlSW50KGJhbm5lck1lc3NhZ2VzQ2FwaW5nLDEwKSA+IDApIHtcbiAgICAgICAgICAgIGJhbm5lck1lc3NhZ2VzQ2FwaW5nLS07XG4gICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKGJhbm5lckNvb2t5TmFtZUNhcGluZywgYmFubmVyTWVzc2FnZXNDYXBpbmcpO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnYmFubmVyTWVzc2FnZXNDYXBpbmcgOiAnLCBiYW5uZXJNZXNzYWdlc0NhcGluZyk7XG4gICAgICAgICAgfVxuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgLy9jb25zb2xlLmxvZygnc2V0SXRlbSBpbml0Jyk7XG4gICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShiYW5uZXJDb29reU5hbWVDYXBpbmcsIHNldHRpbmdzLmNhcGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYocGFyc2VJbnQoYmFubmVyTWVzc2FnZXNDYXBpbmcsMTApID09PSAwKSB7XG4gICAgICAgICAgLy9jb25zb2xlLmxvZygnZm9yY2UnKTtcbiAgICAgICAgICBiYW5uZXJNZXNzYWdlcyA9ICcxJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYoYmFubmVyTWVzc2FnZXMgPT09ICcnKSB7XG4gICAgICAgIGJhbm5lck1lc3NhZ2VzID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShiYW5uZXJDb29reU5hbWUpIHx8ICcnO1xuICAgICAgfVxuICAgICAgLy9jb25zb2xlLmxvZyhiYW5uZXJDb29reU5hbWUgKyAnQmFubmVyTWVzc2FnZXMgOiAnLCBiYW5uZXJNZXNzYWdlcyk7XG4gICAgICBpZihiYW5uZXJNZXNzYWdlcyAhPT0gJycpIHtcbiAgICAgICAgaWYoc2V0dGluZ3MuaGlkZUpzID09PSB0cnVlKSB7XG4gICAgICAgICAgJGJhbm5lci5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgICAkKHNlbGYuc2V0dGluZ3MucmVzZXQpLnBhcmVudCgncCcpLnJlbW92ZUNsYXNzKCdhcy0taGlkZGVuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkYmFubmVyLnJlbW92ZUNsYXNzKHNlbGYuc2V0dGluZ3MuaGlkZGVuQ2xhc3MpO1xuICAgICAgfVxuICAgICAgLyotLS0gQmFubmVyIG1lc3NhZ2VzIDogYWNjZXB0IC8gY2xvc2UgIC0tLSovXG4gICAgICAvKiQoc2V0dGluZ3MuY29udGFpbmVyICsgJyAuanMtYmFubmVyLWJ0bi1jbG9zZSwgJyArIHNldHRpbmdzLmNvbnRhaW5lciArICcgLmpzLWJhbm5lci1idG4tYWNjZXB0JykuZGF0YSh7XG4gICAgICAgIGNvbnRhaW5lcjogc2V0dGluZ3MuY29udGFpbmVyLFxuICAgICAgICBiYW5uZXJDb29reU5hbWU6IGJhbm5lckNvb2t5TmFtZVxuICAgICAgfSk7Ki9cbiAgICAgICRiYW5uZXIuZGF0YSh7XG4gICAgICAgICdiYW5uZXItc2V0dGluZ3MnOiBzZXR0aW5nc1xuICAgICAgfSk7XG5cblxuICAgICAgJGJhbm5lci5maW5kKCcuanMtYmFubmVyLWJ0bi1jbG9zZScpLm9uKCdjbGljaycsZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGNvbnN0ICRiYW5uZXIgPSAkKHRoaXMpLmNsb3Nlc3QoJ1tkYXRhLWJhbm5lci1vcHRpb25zXScpO1xuICAgICAgICBzZWxmLmhpZGVCYW5uZXIoJGJhbm5lcik7XG4gICAgICB9KTtcbiAgICAgICRiYW5uZXIuZmluZCgnLmpzLWJhbm5lci1idG4tYWNjZXB0Jykub24oJ2NsaWNrJyxmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgLy8gbmFtZSAvIHZhbHVlIC8gZHVyYXRpb24gZGF5IHZhbGlkaXR5ICgxMyBtb250aCBtYXgpXG4gICAgICAgIGNvbnN0ICRiYW5uZXIgPSAkKHRoaXMpLmNsb3Nlc3QoJ1tkYXRhLWJhbm5lci1vcHRpb25zXScpO1xuICAgICAgICBzZWxmLmhpZGVCYW5uZXIoJGJhbm5lciwgdHJ1ZSk7XG4gICAgICB9KTtcblxuICAgICAgaWYoJChzZWxmLnNldHRpbmdzLnJlc2V0KS5kYXRhKCdhQmFubmVyc0Nvb2tpZXNOYW1lJykpIHtcbiAgICAgICAgY29uc3QgYUJhbm5lcnNDb29raWVzTmFtZSA9ICQoc2VsZi5zZXR0aW5ncy5yZXNldCkuZGF0YSgnYUJhbm5lcnNDb29raWVzTmFtZScpO1xuICAgICAgICBjb25zdCBhQmFubmVyc0Nvb2tpZXNOYW1lQ2FwaW5nID0gJChzZWxmLnNldHRpbmdzLnJlc2V0KS5kYXRhKCdhQmFubmVyc0Nvb2tpZXNOYW1lQ2FwaW5nJyk7XG4gICAgICAgIGFCYW5uZXJzQ29va2llc05hbWUucHVzaChiYW5uZXJDb29reU5hbWUpO1xuICAgICAgICBhQmFubmVyc0Nvb2tpZXNOYW1lQ2FwaW5nLnB1c2goYmFubmVyQ29va3lOYW1lQ2FwaW5nKTtcbiAgICAgICAgJChzZWxmLnNldHRpbmdzLnJlc2V0KS5kYXRhKCdhQmFubmVyc0Nvb2tpZXNOYW1lJywgYUJhbm5lcnNDb29raWVzTmFtZSk7XG4gICAgICAgICQoc2VsZi5zZXR0aW5ncy5yZXNldCkuZGF0YSgnYUJhbm5lcnNDb29raWVzTmFtZUNhcGluZycsIGFCYW5uZXJzQ29va2llc05hbWVDYXBpbmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJChzZWxmLnNldHRpbmdzLnJlc2V0KS5kYXRhKCdhQmFubmVyc0Nvb2tpZXNOYW1lJywgW2Jhbm5lckNvb2t5TmFtZV0pO1xuICAgICAgICAkKHNlbGYuc2V0dGluZ3MucmVzZXQpLmRhdGEoJ2FCYW5uZXJzQ29va2llc05hbWVDYXBpbmcnLCBbYmFubmVyQ29va3lOYW1lQ2FwaW5nXSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgLy8gZGVsZXRlIG9ubHkgYXZhaWxhYmxlIGluIHN0eWxlcy50d2lnXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsc2VsZi5zZXR0aW5ncy5yZXNldCxmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnN0IGFCYW5uZXJzQ29va2llc05hbWUgPSAkKHNlbGYuc2V0dGluZ3MucmVzZXQpLmRhdGEoJ2FCYW5uZXJzQ29va2llc05hbWUnKTtcbiAgICAgIGNvbnN0IGFCYW5uZXJzQ29va2llc05hbWVDYXBpbmcgPSAkKHNlbGYuc2V0dGluZ3MucmVzZXQpLmRhdGEoJ2FCYW5uZXJzQ29va2llc05hbWVDYXBpbmcnKTtcbiAgICAgIC8vY29uc29sZS5sb2coJ2FCYW5uZXJzQ29va2llc05hbWUgOiAnLCBhQmFubmVyc0Nvb2tpZXNOYW1lKTtcbiAgICAgIC8vY29uc29sZS5sb2coJ2FCYW5uZXJzQ29va2llc05hbWVDYXBpbmcgOiAnLCBhQmFubmVyc0Nvb2tpZXNOYW1lQ2FwaW5nKTtcbiAgICAgICQuZWFjaChhQmFubmVyc0Nvb2tpZXNOYW1lLGZ1bmN0aW9uIChpLGNvb2t5TmFtZSkge1xuICAgICAgICBzdG9yZS5jb29raWVzLmRlbGV0ZUNvb2tpZShjb29reU5hbWUpO1xuICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKGNvb2t5TmFtZSk7XG4gICAgICB9KTtcbiAgICAgICQuZWFjaChhQmFubmVyc0Nvb2tpZXNOYW1lQ2FwaW5nLCBmdW5jdGlvbiAoaSxjb29reU5hbWUpIHtcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShjb29reU5hbWUpO1xuICAgICAgfSk7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnY29tcG9uZW50cy5odG1sP3I9JytNYXRoLmNlaWwoTWF0aC5yYW5kb20oKSoxMDAwMDAwKSsnI3NnLWJhbm5lci1tZXNzYWdlcyc7XG4gICAgICB9LDUwMCk7XG4gICAgfSk7XG4gIH1cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEJhbm5lck1lc3NhZ2VzO1xuIiwiLyoqXG4gKlxuICogQ2xlYXJJbnB1dFxuICogR2VuZXJpYyBjbGFzcyBmb3IgY2xlYXIgaW5wdXRcbiAqXG4gKiBAYXV0aG9yIGVmclxuICovXG5cbi8qKlxuICpcbiAqIEhUTUwgbWluaW1hbCBleGFtcGxlIHRlbXBsYXRlXG4gKlxuICogPGRpdiBjbGFzcz1cImZvcm0tZmllbGQgYXMtLWJ0bi1jbGVhciBhcy0tbm90LWVtcHR5XCI+XG4gKiAgIDxkaXY+XG4gKiAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgdmFsdWU9XCJ2YWx1ZSB0byBjbGVhclwiPlxuICogICAgICAgIDxzcGFuIGRhdGEtanMtY2xlYXItZmllbGQ+JnRpbWVzOzwvc3Bhbj5cbiAqICAgICA8L2Rpdj5cbiAqICAgPC9kaXY+XG4gKiA8L2Rpdj5cbiAqXG4gKi9cblxuXG5jbGFzcyBDbGVhcklucHV0IHtcblxuICAvKipcbiAgICpcbiAgICogQ29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgT2JqZWN0IExpc3Qgb2Ygc2V0dGluZ3NcbiAgICovXG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGNvbnRhaW5lcjogJy5hcy0tYnRuLWNsZWFyJyxcbiAgICAgIGN0YTogJ1tkYXRhLWpzLWNsZWFyLWZpZWxkXScsXG4gICAgICBjbGFzc05hbWU6ICdhcy0tbm90LWVtcHR5JyxcbiAgICB9O1xuXG4gICAgLy8gZnVzaW9ubmUgbGVzIG9wdGlvbnMgcmVuc2VpZ25lZXMgYXZlYyBjZWxsZXMgcGFyIGRlZmF1dCBwb3VyIGNyZWVyIGwnb2JqZXQgc2V0dGluZ3NcbiAgICB0aGlzLnNldHRpbmdzID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgIC8vIGV2ZW5lbWVudHMgcGFyIHV0aWxpc2F0ZXVyIGV4IHNjcm9sbCBob3ZlciBjbGljIHRvdWNoXG4gICAgdGhpcy5iaW5kVUlBY3Rpb25zKCk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQmluZCBVSSBBY3Rpb25zXG4gICAqXG4gICAqL1xuXG4gIGJpbmRVSUFjdGlvbnMoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgLy9jb25zb2xlLmxvZygnQ2xlYXJJbnB1dCA6ICcsIHNlbGYuc2V0dGluZ3MpO1xuXG5cbiAgICAkKCdib2R5Jykub24oJ2lucHV0Jywgc2VsZi5zZXR0aW5ncy5jb250YWluZXIgKyAnIGlucHV0JywgZnVuY3Rpb24gKCkge1xuICAgICAgLy9jb25zb2xlLmxvZygndmFsIDogJywgJCh0aGlzKS52YWwoKSk7XG4gICAgICBpZigkKHRoaXMpLnZhbCgpICE9PSAnJykge1xuICAgICAgICAkKHRoaXMpLmNsb3Nlc3Qoc2VsZi5zZXR0aW5ncy5jb250YWluZXIpLmFkZENsYXNzKHNlbGYuc2V0dGluZ3MuY2xhc3NOYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQodGhpcykuY2xvc2VzdChzZWxmLnNldHRpbmdzLmNvbnRhaW5lcikucmVtb3ZlQ2xhc3Moc2VsZi5zZXR0aW5ncy5jbGFzc05hbWUpO1xuICAgICAgfVxuICAgIH0pO1xuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCBzZWxmLnNldHRpbmdzLmN0YSwgZnVuY3Rpb24gKCkge1xuICAgICAgJCh0aGlzKS5jbG9zZXN0KHNlbGYuc2V0dGluZ3MuY29udGFpbmVyKVxuICAgICAgICAucmVtb3ZlQ2xhc3Moc2VsZi5zZXR0aW5ncy5jbGFzc05hbWUpXG4gICAgICAgIC5maW5kKCdpbnB1dCcpXG4gICAgICAgIC52YWwoJycpXG4gICAgICAgIC50cmlnZ2VyKCdjaGFuZ2UnKVxuICAgICAgICAudHJpZ2dlcignZm9jdXMnKTtcbiAgICB9KTtcbiAgfVxuXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBDbGVhcklucHV0O1xuIiwiLyoqXG4gKlxuICogQ29sbGFwc2libGVcbiAqIEdlbmVyaWMgY2xhc3MgZm9yIGNvbGxhcHNpYmxlIGVsZW1lbnRzXG4gKlxuICogQGF1dGhvciBtaGFcbiAqL1xuXG4vKipcbiAqXG4gKiBIVE1MIG1pbmltYWwgZXhhbXBsZSB0ZW1wbGF0ZVxuICpcbiAqIChvcHRpb25hbCAub3RoZXItY29sbGFwc2libGUpXG4gKiAgIC5jb2xsYXBzaWJsZSAob3B0aW9uYWwgLmFzLS1vcGVuKVxuICogICAgIC5jdGEtb3Blbi1jb2xsYXBzaWJsZSAoYnV0dG9uIG9yIGEpXG4gKiAgICAgKG9wdGlvbmFsIC5jdGEtY2xvc2UtY29sbGFwc2libGUpXG4gKi9cblxuY2xhc3MgQ29sbGFwc2libGUge1xuXG4gIC8qKlxuICAgKlxuICAgKiBDb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPYmplY3Qgc2V0dGluZ3NcbiAgICovXG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGNvbnRhaW5lcjogJy5jb2xsYXBzaWJsZScsXG4gICAgICBjdGE6ICcuY3RhLW9wZW4tY29sbGFwc2libGUnLFxuICAgICAgY2xhc3NOYW1lOiAnYXMtLW9wZW4nLFxuICAgICAgb3B0aW9uQ2xvc2VBbGw6IGZhbHNlLCAvLyB0byBjbG9zZSBhbGwgb3RoZXJzIHdoZW4gb3BlbnMgb25lXG4gICAgICBvcHRpb25DbG9zZTogZmFsc2UsIC8vIHRoZXJlIGlzIGEgYnV0dG9uIHRvIGNsb3NlIGl0XG4gICAgICBjdGFDbG9zZTogJy5jdGEtY2xvc2UtY29sbGFwc2libGUnLCAvLyBvbmx5IGlmIG9wdGlvbkNsb3NlID0gdHJ1ZVxuICAgICAgb3B0aW9uQ2xvc2VPbkJvZHk6IGZhbHNlLCAvLyB0byBjbG9zZSBhbGwgd2hlbiBjbGljayBzb21ld2hlcmUgZWxzZSxcbiAgICAgIG9wdGlvbkVzYzogZmFsc2UsIC8vIHRvIGNsb3NlIHdpdGggRXNjYXBlIGtleVxuICAgICAgb3B0aW9uSG92ZXI6IGZhbHNlLCAvLyB0byBvcGVuIG9uIGhvdmVyIC8gZm9jdXMgLyB0b3VjaHN0YXJ0XG4gICAgICBvcHRpb25Gb2N1c0lucHV0OiBmYWxzZSxcbiAgICAgIGlucHV0Q29udGFpbmVyOiAnLmlucHV0LXRleHQnLFxuICAgICAgZGVsYXk6IDMwMCwgLy8gb25seSBpZiBvcHRpb25Ib3ZlciA9IHRydWVcbiAgICAgIG9wdGlvbk5vQXJpYTogZmFsc2UsIC8vIHNwZWNpYWwgb3B0aW9uIHRvIGF2b2lkIGNoYW5naW5nIGFyaWEgYXR0cmlidXRlcyAocmFyZSB1c2UgY2FzZXMpLFxuICAgICAgb3B0aW9uT3RoZXJDb250YWluZXI6IHRydWUsIC8vIGFub3RoZXIgY29udGFpbmVyIHNob3VsZCBjaGFuZ2UgY2xhc3MgYXQgdGhlIHNhbWUgdGltZVxuICAgICAgb3RoZXJDb250YWluZXI6ICcub3RoZXItY29sbGFwc2libGUnLCAvLyBvbmx5IGlmIG9wdGlvbk90aGVyQ29udGFpbmVyID0gdHJ1ZVxuICAgICAgb3B0aW9uRm9jdXNPbmx5OiBmYWxzZSAvLyB0byBvcGVuIG9uIGZvY3VzIC8gdG91Y2hzdGFydCBvbmx5XG4gICAgfTtcblxuICAgIC8vIGZ1c2lvbm5lIGxlcyBvcHRpb25zIHJlbnNlaWduZWVzIGF2ZWMgY2VsbGVzIHBhciBkZWZhdXQgcG91ciBjcmVlciBsJ29iamV0IHNldHRpbmdzXG4gICAgdGhpcy5zZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLnRpbWVyID0gbnVsbDtcblxuICAgIC8vIGV2ZW5lbWVudHMgcGFyIHV0aWxpc2F0ZXVyIGV4IHNjcm9sbCBob3ZlciBjbGljIHRvdWNoXG4gICAgdGhpcy5iaW5kVUlBY3Rpb25zKCk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogU2hvd1xuICAgKlxuICAgKiBAcGFyYW0gZWxlbSBPYmplY3QgZWxlbWVudCB0byBvcGVuXG4gICAqL1xuXG4gIHNob3coZWxlbSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgJChlbGVtKS5hZGRDbGFzcyhzZWxmLnNldHRpbmdzLmNsYXNzTmFtZSk7XG5cbiAgICBpZiAoc2VsZi5zZXR0aW5ncy5vcHRpb25Ob0FyaWEgPT09IGZhbHNlKSB7XG4gICAgICB2YXIgY3RhID0gJChlbGVtKS5maW5kKHNlbGYuc2V0dGluZ3MuY3RhKTtcbiAgICAgIGlmICgkKGN0YSkuYXR0cignYXJpYS1leHBhbmRlZCcpKSB7XG4gICAgICAgICQoY3RhKS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNlbGYuc2V0dGluZ3Mub3B0aW9uRm9jdXNJbnB1dCA9PT0gdHJ1ZSkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoZWxlbSkuZmluZChzZWxmLnNldHRpbmdzLmlucHV0Q29udGFpbmVyKS5maXJzdCgpLmZvY3VzKCk7XG4gICAgICB9LCAxNTApO1xuICAgIH1cblxuICAgIGlmIChzZWxmLnNldHRpbmdzLm9wdGlvbk90aGVyQ29udGFpbmVyID09PSB0cnVlKSB7XG4gICAgICAkKGVsZW0pLmNsb3Nlc3Qoc2VsZi5zZXR0aW5ncy5vdGhlckNvbnRhaW5lcikuYWRkQ2xhc3Moc2VsZi5zZXR0aW5ncy5jbGFzc05hbWUpO1xuICAgIH1cblxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEhpZGVcbiAgICpcbiAgICogQHBhcmFtIGVsZW0gT2JqZWN0IGVsZW1lbnQgdG8gY2xvc2VcbiAgICovXG5cbiAgaGlkZShlbGVtKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAkKGVsZW0pLnJlbW92ZUNsYXNzKHNlbGYuc2V0dGluZ3MuY2xhc3NOYW1lKTtcblxuICAgIGlmIChzZWxmLnNldHRpbmdzLm9wdGlvbk5vQXJpYSA9PT0gZmFsc2UpIHtcbiAgICAgIHZhciBjdGEgPSAkKGVsZW0pLmZpbmQoc2VsZi5zZXR0aW5ncy5jdGEpO1xuICAgICAgaWYgKCQoY3RhKS5hdHRyKCdhcmlhLWV4cGFuZGVkJykpIHtcbiAgICAgICAgJChjdGEpLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2VsZi5zZXR0aW5ncy5vcHRpb25PdGhlckNvbnRhaW5lciA9PT0gdHJ1ZSkge1xuICAgICAgJChlbGVtKS5jbG9zZXN0KHNlbGYuc2V0dGluZ3Mub3RoZXJDb250YWluZXIpLnJlbW92ZUNsYXNzKHNlbGYuc2V0dGluZ3MuY2xhc3NOYW1lKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogVG9nZ2xlXG4gICAqXG4gICAqIEBwYXJhbSBlbGVtIE9iamVjdCBlbGVtZW50IHRvIHRvZ2dsZVxuICAgKi9cblxuICB0b2dnbGUoZWxlbSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKCQoZWxlbSkuaGFzQ2xhc3Moc2VsZi5zZXR0aW5ncy5jbGFzc05hbWUpKSB7XG4gICAgICBzZWxmLmhpZGUoZWxlbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChzZWxmLnNldHRpbmdzLm9wdGlvbkNsb3NlQWxsID09PSB0cnVlKSB7XG4gICAgICAgIHNlbGYuaGlkZShzZWxmLnNldHRpbmdzLmNvbnRhaW5lcik7XG4gICAgICB9XG4gICAgICBzZWxmLnNob3coZWxlbSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEJpbmQgVUkgQWN0aW9uc1xuICAgKlxuICAgKi9cblxuICBiaW5kVUlBY3Rpb25zKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKHNlbGYuc2V0dGluZ3Mub3B0aW9uSG92ZXIgPT09IHRydWUpIHtcbiAgICAgIC8qLS0tIG9uIGhvdmVyIC8gZm9jdXMgLyB0b3VjaCAtLS0qL1xuICAgICAgJChzZWxmLnNldHRpbmdzLmNvbnRhaW5lcikub24oJ21vdXNlZW50ZXIgZm9jdXNpbiB0b3VjaHN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHNlbGYudGltZXJFbnRlcik7XG4gICAgICAgIGNvbnN0IGVsZW0gPSBldmVudC50YXJnZXQ7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9ICQoZWxlbSkuY2xvc2VzdChzZWxmLnNldHRpbmdzLmNvbnRhaW5lcik7XG4gICAgICAgIGlmIChldmVudC50eXBlID09PSAndG91Y2hzdGFydCcpIHtcbiAgICAgICAgICBzZWxmLnRvZ2dsZShjb250YWluZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAnbW91c2VlbnRlcicpIHtcbiAgICAgICAgICAgIHNlbGYudGltZXJFbnRlciA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgc2VsZi5oaWRlKHNlbGYuc2V0dGluZ3MuY29udGFpbmVyKTtcbiAgICAgICAgICAgICAgc2VsZi5zaG93KGNvbnRhaW5lcik7XG4gICAgICAgICAgICB9LCBzZWxmLnNldHRpbmdzLmRlbGF5KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZi5zaG93KGNvbnRhaW5lcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgICQoc2VsZi5zZXR0aW5ncy5jb250YWluZXIpLm9uKCdtb3VzZWxlYXZlIGZvY3Vzb3V0JywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQoc2VsZi50aW1lckxlYXZlKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXM7XG4gICAgICAgIGlmIChldmVudC50eXBlID09PSAnbW91c2VsZWF2ZScpIHtcbiAgICAgICAgICBzZWxmLnRpbWVyTGVhdmUgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZWxmLmhpZGUoZWxlbSk7XG4gICAgICAgICAgfSwgc2VsZi5zZXR0aW5ncy5kZWxheSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5oaWRlKGVsZW0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHNlbGYuc2V0dGluZ3Mub3B0aW9uRm9jdXNPbmx5ID09PSB0cnVlKSB7XG4gICAgICAkKHNlbGYuc2V0dGluZ3MuY29udGFpbmVyKS5vbignIGZvY3VzaW4gdG91Y2hzdGFydCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgd2luZG93LmNsZWFyVGltZW91dChzZWxmLnRpbWVyKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gJChlbGVtKS5jbG9zZXN0KHNlbGYuc2V0dGluZ3MuY29udGFpbmVyKTtcbiAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICd0b3VjaHN0YXJ0Jykge1xuICAgICAgICAgIHNlbGYudG9nZ2xlKGNvbnRhaW5lcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5zaG93KGNvbnRhaW5lcik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgJChzZWxmLnNldHRpbmdzLmNvbnRhaW5lcikub24oJ2ZvY3Vzb3V0JywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQoc2VsZi50aW1lcik7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzO1xuICAgICAgICBzZWxmLmhpZGUoZWxlbSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLyotLS0gb24gY2xpY2sgLS0tKi9cbiAgICAgICQoc2VsZi5zZXR0aW5ncy5jb250YWluZXIpLm9uKCdjbGljaycsIHNlbGYuc2V0dGluZ3MuY3RhLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgZWxlbSA9ICQodGhpcyk7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9ICQoZWxlbSkuY2xvc2VzdChzZWxmLnNldHRpbmdzLmNvbnRhaW5lcik7XG4gICAgICAgIHNlbGYudG9nZ2xlKGNvbnRhaW5lcik7XG4gICAgICB9KTtcbiAgICAgICQoc2VsZi5zZXR0aW5ncy5jb250YWluZXIpLm9uKCdmb2N1c291dCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB2YXIgZWxlbSA9ICQodGhpcyk7XG4gICAgICAgIHZhciB0YXJnZXQgPSBldmVudC5yZWxhdGVkVGFyZ2V0O1xuICAgICAgICBpZiAoc2VsZi5zZXR0aW5ncy5vcHRpb25DbG9zZUFsbCA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGlmICgkKHRhcmdldCkuY2xvc2VzdChlbGVtKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyAvLyBmaXggY2xpY2sgb24gc2libGluZ3MgdW5kZXJcbiAgICAgICAgICAgICAgc2VsZi5oaWRlKGVsZW0pO1xuICAgICAgICAgICAgfSwzMDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHNlbGYuc2V0dGluZ3Mub3B0aW9uQ2xvc2UgPT09IHRydWUpIHtcbiAgICAgICQoc2VsZi5zZXR0aW5ncy5jb250YWluZXIpLm9uKCdjbGljaycsIHNlbGYuc2V0dGluZ3MuY3RhQ2xvc2UsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSAkKHRoaXMpLmNsb3Nlc3Qoc2VsZi5zZXR0aW5ncy5jb250YWluZXIpO1xuICAgICAgICBzZWxmLmhpZGUoY29udGFpbmVyKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChzZWxmLnNldHRpbmdzLm9wdGlvbkNsb3NlT25Cb2R5ID09PSB0cnVlKSB7XG4gICAgICAkKCcjYm9keScpLm9uKCdjbGljayBmb2N1c2luJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgaWYgKCQodGFyZ2V0KS5jbG9zZXN0KHNlbGYuc2V0dGluZ3MuY29udGFpbmVyKS5sZW5ndGggPT09IDAgJiYgISQodGFyZ2V0KS5pcyhzZWxmLnNldHRpbmdzLmNvbnRhaW5lcikpIHtcbiAgICAgICAgICBjb25zdCBlbGVtID0gJChzZWxmLnNldHRpbmdzLmNvbnRhaW5lcik7XG4gICAgICAgICAgc2VsZi5oaWRlKGVsZW0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoc2VsZi5zZXR0aW5ncy5vcHRpb25Fc2MgPT09IHRydWUpIHtcbiAgICAgICQoc2VsZi5zZXR0aW5ncy5jb250YWluZXIpLm9uKCdrZXlkb3duJywgJ2lucHV0LCBidXR0b24nLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gZXZlbnQud2hpY2g7XG4gICAgICAgIGlmIChrZXkgPT09IDI3KSB7XG4gICAgICAgICAgY29uc3QgY29udGFpbmVyID0gJCh0aGlzKS5jbG9zZXN0KHNlbGYuc2V0dGluZ3MuY29udGFpbmVyKTtcbiAgICAgICAgICBzZWxmLmhpZGUoY29udGFpbmVyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbGxhcHNpYmxlO1xuIiwiLyoqXG4gKlxuICogQ29va2llc1xuICogR2VuZXJpYyBjbGFzcyBmb3IgY29va2llcyBlbGVtZW50c1xuICpcbiAqIEBhdXRob3IgZWZyXG4gKi9cblxuXG5jbGFzcyBDb29raWVzIHtcblxuICAvKipcbiAgICpcbiAgICogQ29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgT2JqZWN0IExpc3Qgb2Ygc2V0dGluZ3NcbiAgICovXG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICB9O1xuXG4gICAgLy8gZnVzaW9ubmUgbGVzIG9wdGlvbnMgcmVuc2VpZ25lZXMgYXZlYyBjZWxsZXMgcGFyIGRlZmF1dCBwb3VyIGNyZWVyIGwnb2JqZXQgc2V0dGluZ3NcbiAgICB0aGlzLnNldHRpbmdzID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcblxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIHNldCBDb29raWVcbiAgICovXG5cbiAgc2V0Q29va2llKGNuYW1lLCBjdmFsdWUsIGV4ZGF5cykge1xuICAgIGxldCBkID0gbmV3IERhdGUoKTtcbiAgICBkLnNldFRpbWUoZC5nZXRUaW1lKCkgKyAoZXhkYXlzKjI0KjYwKjYwKjEwMDApKTtcbiAgICBjb25zdCBleHBpcmVzID0gJ2V4cGlyZXM9JysgZC50b1VUQ1N0cmluZygpO1xuICAgIGRvY3VtZW50LmNvb2tpZSA9IGNuYW1lICsgJz0nICsgY3ZhbHVlICsgJzsnICsgZXhwaXJlcyArICc7cGF0aD0vJztcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBkZWxldGUgQ29va2llXG4gICAqL1xuXG4gIGRlbGV0ZUNvb2tpZShjbmFtZSkge1xuICAgIGRvY3VtZW50LmNvb2tpZSA9IGNuYW1lICsgJz07ZXhwaXJlcz1UaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAxIEdNVDtwYXRoPS8nO1xuICAgIGNvbnNvbGUubG9nKCdkZWxldGVDb29raWUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBnZXQgQ29va2llXG4gICAqL1xuXG4gIGdldENvb2tpZShjbmFtZSkge1xuICAgIGNvbnN0IG5hbWUgPSBjbmFtZSArICc9JztcbiAgICBjb25zdCBkZWNvZGVkQ29va2llID0gZGVjb2RlVVJJQ29tcG9uZW50KGRvY3VtZW50LmNvb2tpZSk7XG4gICAgY29uc3QgY2EgPSBkZWNvZGVkQ29va2llLnNwbGl0KCc7Jyk7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8Y2EubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBjID0gY2FbaV07XG4gICAgICB3aGlsZSAoYy5jaGFyQXQoMCkgPT09ICcgJykge1xuICAgICAgICBjID0gYy5zdWJzdHJpbmcoMSk7XG4gICAgICB9XG4gICAgICBpZiAoYy5pbmRleE9mKG5hbWUpID09PSAwKSB7XG4gICAgICAgIHJldHVybiBjLnN1YnN0cmluZyhuYW1lLmxlbmd0aCwgYy5sZW5ndGgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gJyc7XG4gIH1cblxuXG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvb2tpZXM7XG4iLCIvKipcbiAqXG4gKiBEZXRlY3RCcm93c2VyXG4gKiBHZW5lcmljIGNsYXNzIGZvciBkcmFnJ24nZHJvcCBpbnB1dCBmaWxlIG11bHRpcGxlXG4gKlxuICogQGF1dGhvciBlZnJcbiAqL1xuXG5jbGFzcyBEZXRlY3RCcm93c2VyIHtcblxuICAvKipcbiAgICpcbiAgICogQ29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgT2JqZWN0IHNldHRpbmdzXG4gICAqL1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIC8vY29uc29sZS5sb2coJ0RldGVjdEJyb3dzZXInKTtcblxuICAgIGxldCBkZWZhdWx0cyA9IHtcbiAgICB9O1xuXG4gICAgLy8gZnVzaW9ubmUgbGVzIG9wdGlvbnMgcmVuc2VpZ25lZXMgYXZlYyBjZWxsZXMgcGFyIGRlZmF1dCBwb3VyIGNyZWVyIGwnb2JqZXQgc2V0dGluZ3NcbiAgICB0aGlzLnNldHRpbmdzID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcblxuXG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogSW5pdCBkcm9wem9uZVxuICAgKlxuICAgKi9cblxuICBpbml0KCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IGJyb3dzZXJzID0ge307XG5cblxuICAgIC8vIE9wZXJhIDguMCtcbiAgICBicm93c2Vycy5pc09wZXJhID0gKCEhd2luZG93Lm9wciAmJiAhIXdpbmRvdy5vcHIuYWRkb25zKSB8fCAhIXdpbmRvdy5vcGVyYSB8fCBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJyBPUFIvJykgPj0gMDtcblxuICAgIC8vIEZpcmVmb3ggMS4wK1xuICAgIGJyb3dzZXJzLmlzRmlyZWZveCA9IHR5cGVvZiBJbnN0YWxsVHJpZ2dlciAhPT0gJ3VuZGVmaW5lZCc7XG5cbiAgICAvLyBTYWZhcmkgMy4wKyBcIltvYmplY3QgSFRNTEVsZW1lbnRDb25zdHJ1Y3Rvcl1cIlxuICAgIGJyb3dzZXJzLmlzU2FmYXJpID0gL2NvbnN0cnVjdG9yL2kudGVzdCh3aW5kb3cuSFRNTEVsZW1lbnQpIHx8XG4gICAgICAoZnVuY3Rpb24gKHApIHsgcmV0dXJuIHAudG9TdHJpbmcoKSA9PT0gJ1tvYmplY3QgU2FmYXJpUmVtb3RlTm90aWZpY2F0aW9uXSc7IH0pKCF3aW5kb3cuc2FmYXJpIHx8XG4gICAgICAgICh0eXBlb2Ygd2luZG93LnNhZmFyaSAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LnNhZmFyaS5wdXNoTm90aWZpY2F0aW9uKSk7XG5cbiAgICAvLyBJbnRlcm5ldCBFeHBsb3JlciA2LTExXG4gICAgYnJvd3NlcnMuaXNJRSA9IC8qQGNjX29uIUAqL2ZhbHNlIHx8ICEhZG9jdW1lbnQuZG9jdW1lbnRNb2RlO1xuXG4gICAgLy8gRWRnZSAyMCtcbiAgICBicm93c2Vycy5pc0VkZ2UgPSAhYnJvd3NlcnMuaXNJRSAmJiAhIXdpbmRvdy5TdHlsZU1lZGlhO1xuXG4gICAgLy8gQ2hyb21lIDErXG4gICAgYnJvd3NlcnMuaXNDaHJvbWUgPSAhIXdpbmRvdy5jaHJvbWUgJiYgISF3aW5kb3cuY2hyb21lLndlYnN0b3JlO1xuXG4gICAgLy8gQmxpbmsgZW5naW5lIGRldGVjdGlvblxuICAgIGJyb3dzZXJzLmlzQmxpbmsgPSAoYnJvd3NlcnMuaXNDaHJvbWUgfHwgYnJvd3NlcnMuaXNPcGVyYSkgJiYgISF3aW5kb3cuQ1NTO1xuXG4gICAgLy9jb25zb2xlLmxvZygnYnJvd3NlcnMgOiAnLCBicm93c2Vycyk7XG5cbiAgICBpZihicm93c2Vycy5pc09wZXJhKSB7XG4gICAgICAkKCdodG1sJykuYWRkQ2xhc3MoJ2lzLW9wZXJhJyk7XG4gICAgfSBlbHNlIGlmKGJyb3dzZXJzLmlzRmlyZWZveCkge1xuICAgICAgJCgnaHRtbCcpLmFkZENsYXNzKCdpcy1maXJlZm94Jyk7XG4gICAgfSBlbHNlIGlmKGJyb3dzZXJzLmlzU2FmYXJpKSB7XG4gICAgICAkKCdodG1sJykuYWRkQ2xhc3MoJ2lzLXNhZmFyaScpO1xuICAgIH0gZWxzZSBpZihicm93c2Vycy5pc0lFKSB7XG4gICAgICAkKCdodG1sJykuYWRkQ2xhc3MoJ2lzLWllJyk7XG4gICAgfSBlbHNlIGlmKGJyb3dzZXJzLmlzRWRnZSkge1xuICAgICAgJCgnaHRtbCcpLmFkZENsYXNzKCdpcy1lZGdlJyk7XG4gICAgfSBlbHNlIGlmKGJyb3dzZXJzLmlzQ2hyb21lKSB7XG4gICAgICAkKCdodG1sJykuYWRkQ2xhc3MoJ2lzLWNocm9tZScpO1xuICAgIH0gZWxzZSBpZihicm93c2Vycy5pc0JsaW5rKSB7XG4gICAgICAkKCdodG1sJykuYWRkQ2xhc3MoJ2lzLWJsaW5rcmEnKTtcbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAgKlxuICAgKiBCaW5kIFVJIEFjdGlvbnNcbiAgICpcbiAgICovXG5cbiAgYmluZFVJQWN0aW9ucygpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICB9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBEZXRlY3RCcm93c2VyO1xuIiwiLyoqXG4gKlxuICogUmVzcG9uc2l2ZURlYnVnXG4gKiBzaG93cyBjdXJyZW50IGJyZWFrcG9pbnQgaW4gYm90dG9tIGxlZnQgY29ybmVyIG9uIHJlc2l6ZVxuICogaWYgbG9jYWxzdG9yYWdlICdyZXNwb25zaXZlLWRlYnVnJyBpcyB0cnVlXG4gKlxuICogQGF1dGhvciBlZnJcbiAqL1xuXG5jbGFzcyBSZXNwb25zaXZlRGVidWcge1xuXG4gIC8qKlxuICAgKlxuICAgKiBDb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPYmplY3Qgc2V0dGluZ3NcbiAgICovXG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHt9O1xuXG4gICAgLy8gZnVzaW9ubmUgbGVzIG9wdGlvbnMgcmVuc2VpZ25lZXMgYXZlYyBjZWxsZXMgcGFyIGRlZmF1dCBwb3VyIGNyZWVyIGwnb2JqZXQgc2V0dGluZ3NcbiAgICB0aGlzLnNldHRpbmdzID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgIC8vIGV2ZW5lbWVudHMgcGFyIHV0aWxpc2F0ZXVyIGV4IHNjcm9sbCBob3ZlciBjbGljIHRvdWNoXG4gICAgdGhpcy5iaW5kVUlBY3Rpb25zKCk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogZG9uZVJlc2l6aW5nXG4gICAqXG4gICAqL1xuXG4gIGRvbmVSZXNpemluZygpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLiRyZXNwb25zaXZlSGVscGVyLnJlbW92ZUNsYXNzKCdhcy0tdmlzaWJsZScpO1xuXG4gIH1cblxuXG4gIC8qKlxuICAgKlxuICAgKiBCaW5kIFVJIEFjdGlvbnNcbiAgICpcbiAgICovXG5cbiAgYmluZFVJQWN0aW9ucygpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBpZihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVzcG9uc2l2ZS1kZWJ1ZycpKXtcbiAgICAgIHNlbGYuJHJlc3BvbnNpdmVIZWxwZXIgPSAkKCc8ZGl2Lz4nKTtcbiAgICAgIGxldCByZXNpemVJZDtcbiAgICAgIHNlbGYuJHJlc3BvbnNpdmVIZWxwZXIuYWRkQ2xhc3MoJ3Jlc3BvbnNpdmUtaGVscGVyJykuYXBwZW5kVG8oJCgnYm9keScpKTtcbiAgICAgICQod2luZG93KS5vbigncmVzaXplJyxmdW5jdGlvbigpIHtcbiAgICAgICAgc2VsZi4kcmVzcG9uc2l2ZUhlbHBlci5hZGRDbGFzcygnYXMtLXZpc2libGUnKTtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHJlc2l6ZUlkKTtcbiAgICAgICAgcmVzaXplSWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLmRvbmVSZXNpemluZygpO1xuICAgICAgICB9LCA1MDApO1xuICAgICAgfSk7XG4gICAgfVxuXG5cbiAgfVxuXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBSZXNwb25zaXZlRGVidWc7XG4iLCIvKipcbiAqXG4gKiBTY3JvbGxBbmNob3JcbiAqIEdlbmVyaWMgY2xhc3MgdG8gaGF2ZSBhIHNtb290aCBzY3JvbGwgd2hlbiBnb2luZyB0byBhbiBhbmNob3JcbiAqXG4gKiBAYXV0aG9yIHNkaVxuICovXG5cbi8qKlxuICpcbiAqIEhUTUwgbWluaW1hbCBleGFtcGxlIHRlbXBsYXRlXG4gKlxuICogYS5qcy1zY3JvbGwtYW5jaG9yW2hyZWY9XCIjYW5jaG9yXCJdXG4gKiAuLi5cbiAqICNhbmNob3JcbiAqL1xuXG5jbGFzcyBTY3JvbGxBbmNob3Ige1xuXG4gIC8qKlxuICAgKlxuICAgKiBDb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPYmplY3Qgc2V0dGluZ3NcbiAgICovXG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGNvbnRhaW5lcjogJyNib2R5JyxcbiAgICAgIGN0YTogJ2EuanMtc2Nyb2xsLWFuY2hvcicsIC8vd2FzICAnYVtocmVmXj1cIiNcIl06bm90KFtocmVmPVwiI1wiXSknIC8gc29sdXRpb24gQ1BFIDogJ2FbaHJlZl49XCIjXCJdOm5vdChbaHJlZj1cIiNcIl0pOm5vdCgubm8tc2Nyb2xsLXRvKSdcbiAgICAgIG1vZGU6ICdlYXNlSW5PdXRRdWFkJywgLy8gYW5pbWF0aW9uIHR5cGVcbiAgICAgIGRlbGF5OiAzMDAsIC8vIGFuaW1hdGlvbiBkdXJhdGlvblxuICAgICAgdGFyZ2V0IDogbnVsbCxcbiAgICAgIGR1cmF0aW9uTWF4OiAxMDAwLFxuICAgICAgZGlzdGFuY2VNYXggOjEwMDAsXG4gICAgfTtcblxuICAgIC8vIGZ1c2lvbm5lIGxlcyBvcHRpb25zIHJlbnNlaWduZWVzIGF2ZWMgY2VsbGVzIHBhciBkZWZhdXQgcG91ciBjcmVlciBsJ29iamV0IHNldHRpbmdzXG4gICAgdGhpcy5zZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICAvLyBldmVuZW1lbnRzIHBhciB1dGlsaXNhdGV1ciBleCBzY3JvbGwgaG92ZXIgY2xpYyB0b3VjaFxuICAgIHRoaXMuYmluZFVJQWN0aW9ucygpO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIFNjcm9sbCBBY3Rpb25cbiAgICpcbiAgICovXG5cbiAgc2Nyb2xsKHRhcmdldCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgbGV0IHRhcmdldFNjcm9sbCA9IDA7XG4gICAgbGV0IGlIZWFkZXJIZWlnaHQgPSAwOyAvLyBlZGl0IHRoaXMgY29kZSBpZiB1IGhhdmUgc3RpY2t5IGhlYWRlclxuICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnc3RyaW5nJyl7XG4gICAgICB0YXJnZXRTY3JvbGwgPSAkKHRhcmdldCkub2Zmc2V0KCkudG9wIC0gaUhlYWRlckhlaWdodDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdudW1iZXInKXtcbiAgICAgIHRhcmdldFNjcm9sbCA9IHRhcmdldDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdvYmplY3QnICYmIHRhcmdldC5sZW5ndGgpe1xuICAgICAgdmFyICR0YXJnZXQgPSB0YXJnZXQ7XG4gICAgICB0YXJnZXRTY3JvbGwgPSAkdGFyZ2V0Lm9mZnNldCgpLnRvcCAtIGlIZWFkZXJIZWlnaHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoeyAvLyBodG1sIHBvdXIgZmlyZWZveCwgYm9keSBwb3VyIGNocm9tZVxuICAgICAgc2Nyb2xsVG9wOiB0YXJnZXRTY3JvbGxcbiAgICB9LCBzZWxmLnNldHRpbmdzLmRlbGF5LCBzZWxmLnNldHRpbmdzLm1vZGUsIGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIG1ldHRyZSB1biB0YWJpbmRleD1cIi0xXCIgc3VyIGxhIGNpYmxlIHNpIGMnZXN0IHVuIGVsZW1lbnQgcXVpIG5lIHJlY29pdCBwYXMgbGUgZm9jdXMgcGFyIGRlZmF1dFxuICAgICAgJCh0YXJnZXQpLmZvY3VzKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQmluZCBVSSBBY3Rpb25zXG4gICAqXG4gICAqL1xuXG4gIGJpbmRVSUFjdGlvbnMoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgJChzZWxmLnNldHRpbmdzLmNvbnRhaW5lcikub24oJ2NsaWNrJywgc2VsZi5zZXR0aW5ncy5jdGEsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnN0IHRhcmdldCA9ICQodGhpcykuYXR0cignaHJlZicpO1xuICAgICAgc2VsZi5zY3JvbGwodGFyZ2V0KTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTY3JvbGxBbmNob3I7XG4iLCIvKipcbiAqXG4gKiBTaG93UGFzc3dvcmRcbiAqIEdlbmVyaWMgY2xhc3MgdG8gc2hvdyB0aGUgY29udGVudCBvZiBhIHBhc3N3b3JkIGlucHV0XG4gKlxuICogQGF1dGhvciBtaGEgLyBlZnJcbiAqL1xuXG4vKipcbiAqXG4gKiBIVE1MIG1pbmltYWwgZXhhbXBsZSB0ZW1wbGF0ZVxuICpcbiAqIDxkaXYgY2xhc3M9XCJmb3JtLWZpZWxkIGFzLS1idG4tcGFzc3dvcmQgYXMtLWljb25cIj5cbiAqICAgPGRpdj5cbiAqICAgICA8aW5wdXQgdHlwZT1cInBhc3N3b3JkXCIgdmFsdWU9XCJteVBhc3N3b3JkXCI+XG4gKiAgICAgICA8aSBjbGFzcz1cImJ0bi1wYXNzd29yZCBpY29uIGJ0bi1wYXNzd29yZC1zaG93XCIgdGl0bGU9XCJBZmZpY2hlciBsZSBtb3QgZGUgcGFzc2VcIj5cbiAqICAgICAgICAgeyUgaW5jbHVkZSBcIi4uLy4uL2Fzc2V0cy9pbWcvc3ZnLnR3aWcvaWNvbi1leWUuc3ZnLnR3aWdcIiAlfVxuICogICAgICAgPC9pPlxuICogICAgICAgPGkgY2xhc3M9XCJidG4tcGFzc3dvcmQgaWNvbiBidG4tcGFzc3dvcmQtaGlkZVwiIHRpdGxlPVwiTWFzcXVlciBsZSBtb3QgZGUgcGFzc2VcIj5cbiAqICAgICAgICAgeyUgaW5jbHVkZSBcIi4uLy4uL2Fzc2V0cy9pbWcvc3ZnLnR3aWcvaWNvbi1leWUtY2xvc2VkLnN2Zy50d2lnXCIgJX1cbiAqICAgICAgIDwvaT5cbiAqICAgPC9kaXY+XG4gKiA8L2Rpdj5cbiAqXG4gKi9cbmNsYXNzIFNob3dQYXNzd29yZCB7XG5cbiAgLyoqXG4gICAqXG4gICAqIENvbnN0cnVjdG9yXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIE9iamVjdCBzZXR0aW5nc1xuICAgKi9cblxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcblxuICAgIGxldCBkZWZhdWx0cyA9IHtcbiAgICAgIGNvbnRhaW5lcjogJy5hcy0tYnRuLXBhc3N3b3JkJyxcbiAgICAgIGlucHV0OiAnaW5wdXQnLFxuICAgICAgY2xhc3NOYW1lOiAnYXMtLXZpc2libGUnLFxuICAgICAgY3RhOiAnLmJ0bi1wYXNzd29yZCdcbiAgICB9O1xuXG4gICAgLy8gZnVzaW9ubmUgbGVzIG9wdGlvbnMgcmVuc2VpZ25lZXMgYXZlYyBjZWxsZXMgcGFyIGRlZmF1dCBwb3VyIGNyZWVyIGwnb2JqZXQgc2V0dGluZ3NcbiAgICB0aGlzLnNldHRpbmdzID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgIC8vIGV2ZW5lbWVudHMgcGFyIHV0aWxpc2F0ZXVyIGV4IHNjcm9sbCBob3ZlciBjbGljIHRvdWNoXG4gICAgdGhpcy5iaW5kVUlBY3Rpb25zKCk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogU2hvd1xuICAgKlxuICAgKiBAcGFyYW0gZWxlbSBPYmplY3QgZWxlbWVudCB0byBzaG93XG4gICAqL1xuXG4gIHNob3coZWxlbSkge1xuICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICQoZWxlbSkuYWRkQ2xhc3Moc2VsZi5zZXR0aW5ncy5jbGFzc05hbWUpO1xuICAgICQoZWxlbSkuZmluZChzZWxmLnNldHRpbmdzLmlucHV0KS5hdHRyKCd0eXBlJywgJ3RleHQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBIaWRlXG4gICAqXG4gICAqIEBwYXJhbSBlbGVtIE9iamVjdCBlbGVtZW50IHRvIGhpZGVcbiAgICovXG5cbiAgaGlkZShlbGVtKSB7XG4gICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgJChlbGVtKS5yZW1vdmVDbGFzcyhzZWxmLnNldHRpbmdzLmNsYXNzTmFtZSk7XG4gICAgJChlbGVtKS5maW5kKHNlbGYuc2V0dGluZ3MuaW5wdXQpLmF0dHIoJ3R5cGUnLCAncGFzc3dvcmQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBUb2dnbGVcbiAgICpcbiAgICogQHBhcmFtIGVsZW0gT2JqZWN0IGVsZW1lbnQgdG8gdG9nZ2xlXG4gICAqL1xuXG4gIHRvZ2dsZShlbGVtKSB7XG4gICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKCQoZWxlbSkuaXMoJy4nICsgc2VsZi5zZXR0aW5ncy5jbGFzc05hbWUpKSB7XG4gICAgICBzZWxmLmhpZGUoZWxlbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYuc2hvdyhlbGVtKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQmluZCBVSSBBY3Rpb25zXG4gICAqXG4gICAqL1xuXG4gIGJpbmRVSUFjdGlvbnMoKSB7XG4gICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgJChzZWxmLnNldHRpbmdzLmNvbnRhaW5lcikub24oJ2NsaWNrJywgc2VsZi5zZXR0aW5ncy5jdGEsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCBlbGVtID0gJCh0aGlzKS5jbG9zZXN0KHNlbGYuc2V0dGluZ3MuY29udGFpbmVyKTtcbiAgICAgIHNlbGYudG9nZ2xlKGVsZW0pO1xuICAgIH0pO1xuICB9XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFNob3dQYXNzd29yZDtcbiIsIi8qKlxuICpcbiAqIFZhbGlkRm9ybVxuICogQSBsaXR0ZSBjbGFzcyB3aGljaCBwcm92aWRlIGZvcm0gdmFsaWRhdGlvbiBvbiB0aGUgZmx5IGJlLXBhc3NpbmcgaHRtbDUgdmFsaWRhdGlvblxuICpcbiAqIEBhdXRob3IgTGF1cmVudCBHVUlUVE9OXG4gKi9cblxuaW1wb3J0IHN0b3JlIGZyb20gJy4uL19zdG9yZSc7XG5cbmNsYXNzIFZhbGlkRm9ybSB7XG5cbiAgLyoqXG4gICAqXG4gICAqIENvbnN0cnVjdG9yXG4gICAqXG4gICAqIEBwYXJhbSBleGVtcGxlIFN0cmluZyBFeGVtcGxlIHN0cmluZ1xuICAgKi9cblxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcblxuICAgIGxldCBkZWZhdWx0cyA9IHtcbiAgICAgIGNvbnRhaW5lcjogJy52YWxpZC1mb3JtJyxcbiAgICAgIGZpZWxkQ29udGFpbmVyOiAnLmZvcm0tZmllbGQnLFxuICAgICAgaW5wdXQ6ICdpbnB1dFtyZXF1aXJlZF0sc2VsZWN0W3JlcXVpcmVkXSx0ZXh0YXJlYVtyZXF1aXJlZF0nLFxuICAgICAgdmFsaWRDbGFzczogJ2FzLS12YWxpZCcsXG4gICAgICBpbnZhbGlkQ2xhc3M6ICdhcy0taW52YWxpZCcsXG4gICAgICBtc2dFcnJvckNsYXNzOiAnZm9ybS1tc2ctZXJyb3InLFxuICAgICAgc3VibWl0QnRuOiAnW3N1Ym1pdF0nLFxuICAgICAgcmVzZXRCdG46ICdbcmVzZXRdJyxcbiAgICAgIGRlZmF1bHRSZXF1aXJlZE1zZzogc3RvcmUuZGVmYXVsdFJlcXVpcmVkTXNnLFxuICAgICAgZGVmYXVsdEVycm9yTXNnOiBzdG9yZS5kZWZhdWx0RXJyb3JNc2csXG4gICAgICBkZWZhdWx0UHdkRXJyb3JNc2c6IHN0b3JlLmRlZmF1bHRQd2RFcnJvck1zZyxcbiAgICAgIHZhbGlkYXRlOiBmYWxzZVxuICAgIH07XG5cbiAgICAvLyBmdXNpb25uZSBsZXMgb3B0aW9ucyByZW5zZWlnbmVlcyBhdmVjIGNlbGxlcyBwYXIgZGVmYXV0IHBvdXIgY3JlZXIgbCdvYmpldCBzZXR0aW5nc1xuICAgIHRoaXMuc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgLy8gZXZlbmVtZW50cyBwYXIgdXRpbGlzYXRldXIgZXggc2Nyb2xsIGhvdmVyIGNsaWMgdG91Y2hcbiAgICB0aGlzLmJpbmRVSUFjdGlvbnMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBTaG93IG1lc3NhZ2VcbiAgICpcbiAgICogQHJldHVybiB2b2lkXG4gICAqL1xuXG4gIGZvcm1DaGVjayhpbnB1dCwgY2FsbGJhY2spIHtcbiAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgbGV0ICRpbnB1dEVsZW1lbnQgPSAkKCcjJyArIGlucHV0KTtcbiAgICBsZXQgJGlucHV0UGFyZW50ID0gJGlucHV0RWxlbWVudC5jbG9zZXN0KHNlbGYuc2V0dGluZ3MuZmllbGRDb250YWluZXIpO1xuICAgIGxldCAkaW5wdXRFcnJvckNvbnRhaW5lcjtcblxuICAgIGlmICgkKCcjJyArIGlucHV0ICsgJy1lcnJvcicpLmxlbmd0aCA+IDApIHtcbiAgICAgICRpbnB1dEVycm9yQ29udGFpbmVyID0gJCgnIycgKyBpbnB1dCArICctZXJyb3InKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJGlucHV0UGFyZW50LmFwcGVuZCgnPGRpdiBjbGFzcz1cIicgKyBzZWxmLnNldHRpbmdzLm1zZ0Vycm9yQ2xhc3MgKyAnXCIgaWQ9XCInICsgaW5wdXQgKyAnLWVycm9yXCIgLz4nKTtcbiAgICAgICRpbnB1dEVycm9yQ29udGFpbmVyID0gJCgnIycgKyBpbnB1dCArICctZXJyb3InKTtcbiAgICB9XG5cbiAgICBsZXQgcmVxdWlyZU1zZztcbiAgICBpZiAoJGlucHV0RWxlbWVudC5hdHRyKCdkYXRhLW1zZy1yZXF1aXJlZCcpKSB7XG4gICAgICByZXF1aXJlTXNnID0gJGlucHV0RWxlbWVudC5hdHRyKCdkYXRhLW1zZy1yZXF1aXJlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXF1aXJlTXNnID0gc2VsZi5zZXR0aW5ncy5kZWZhdWx0UmVxdWlyZWRNc2c7XG4gICAgfVxuICAgIGxldCBlcnJvck1zZztcbiAgICBpZiAoJGlucHV0RWxlbWVudC5hdHRyKCdkYXRhLW1zZy1lcnJvcicpKSB7XG4gICAgICBlcnJvck1zZyA9ICRpbnB1dEVsZW1lbnQuYXR0cignZGF0YS1tc2ctZXJyb3InKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXJyb3JNc2cgPSBzZWxmLnNldHRpbmdzLmRlZmF1bHRFcnJvck1zZztcbiAgICB9XG5cbiAgICAkaW5wdXRFbGVtZW50LmF0dHIoJ2FyaWEtaW52YWxpZCcsICEkaW5wdXRFbGVtZW50WzBdLmNoZWNrVmFsaWRpdHkoKSk7XG5cbiAgICBpZiAoJGlucHV0RWxlbWVudC5hdHRyKCdkYXRhLXB3ZCcpID09PSAnY29uZmlybWF0aW9uJykge1xuICAgICAgbGV0IHBhc3N3b3JkMSA9ICQoJ1tkYXRhLXB3ZD1cImluaXRpYWxcIl0nKS52YWwoKTtcbiAgICAgIGxldCBwYXNzd29yZDIgPSAkaW5wdXRFbGVtZW50LnZhbCgpO1xuICAgICAgaWYgKHBhc3N3b3JkMiAhPT0gcGFzc3dvcmQxIHx8ICFwYXNzd29yZDIpIHtcbiAgICAgICAgJGlucHV0UGFyZW50LmFkZENsYXNzKHNlbGYuc2V0dGluZ3MuaW52YWxpZENsYXNzKS5yZW1vdmVDbGFzcyhzZWxmLnNldHRpbmdzLnZhbGlkQ2xhc3MpO1xuICAgICAgICBpZiAoISRpbnB1dEVycm9yQ29udGFpbmVyLmxlbmd0aCkge1xuICAgICAgICAgICRpbnB1dFBhcmVudC5hcHBlbmQoJzxkaXYgY2xhc3M9XCInICsgc2VsZi5zZXR0aW5ncy5tc2dFcnJvckNsYXNzICsgJ1wiIGlkPVwiJyArIGlucHV0ICsgJy1lcnJvclwiPicgKyBzZWxmLnNldHRpbmdzLnB3ZG1zZ0Vycm9yICsgJzwvZGl2PicpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkaW5wdXRQYXJlbnQuYWRkQ2xhc3Moc2VsZi5zZXR0aW5ncy52YWxpZENsYXNzKS5yZW1vdmVDbGFzcyhzZWxmLnNldHRpbmdzLmludmFsaWRDbGFzcyk7XG4gICAgICAgICRpbnB1dEVycm9yQ29udGFpbmVyLnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoISRpbnB1dEVsZW1lbnRbMF0uY2hlY2tWYWxpZGl0eSgpKSB7IC8vIFNpIGNoZWNrVmFsaWRpdHkgcmVudm9pZSBmYWxzZSA6IGludmFsaWRlXG5cbiAgICAgICAgaWYgKCRpbnB1dEVsZW1lbnQudmFsKCkgPT09ICcnKSB7XG4gICAgICAgICAgJGlucHV0RXJyb3JDb250YWluZXIuaHRtbChyZXF1aXJlTXNnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkaW5wdXRFcnJvckNvbnRhaW5lci5odG1sKGVycm9yTXNnKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRpbnB1dFBhcmVudC5hZGRDbGFzcyhzZWxmLnNldHRpbmdzLmludmFsaWRDbGFzcykucmVtb3ZlQ2xhc3Moc2VsZi5zZXR0aW5ncy52YWxpZENsYXNzKTtcbiAgICAgICAgJGlucHV0RWxlbWVudC5hdHRyKCdhcmlhLWRlc2NyaWJlZGJ5JywgaW5wdXQgKyAnLWVycm9yJyk7XG4gICAgICB9IGVsc2UgeyAvLyBTaSBjaGVja1ZhbGlkaXR5IHJlbnZvaWUgdHJ1ZSA6IHZhbGlkZVxuICAgICAgICBpZiAoJGlucHV0RXJyb3JDb250YWluZXIubGVuZ3RoID4gMCkge1xuICAgICAgICAgICRpbnB1dEVycm9yQ29udGFpbmVyLmh0bWwoJycpO1xuICAgICAgICB9XG4gICAgICAgICRpbnB1dFBhcmVudC5hZGRDbGFzcyhzZWxmLnNldHRpbmdzLnZhbGlkQ2xhc3MpLnJlbW92ZUNsYXNzKHNlbGYuc2V0dGluZ3MuaW52YWxpZENsYXNzKTtcbiAgICAgICAgJGlucHV0RWxlbWVudC5hdHRyKCdhcmlhLWRlc2NyaWJlZGJ5JywgZmFsc2UpO1xuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgICpcbiAgICogQmluZCBVSSBBY3Rpb25zXG4gICAqXG4gICAqL1xuXG4gIGJpbmRVSUFjdGlvbnMoKSB7XG4gICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICQoJ2JvZHknKS5vbignYmx1cicsIHNlbGYuc2V0dGluZ3MuY29udGFpbmVyICsgJyAnICsgc2VsZi5zZXR0aW5ncy5pbnB1dCwgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5mb3JtQ2hlY2sodGhpcy5pZCk7XG4gICAgfSk7XG5cblxuLy8gT24gU1VCTUlUIDpcblxuICAgICQoJy52YWxpZC1mb3JtJykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAkKHNlbGYuc2V0dGluZ3MuY29udGFpbmVyKS5hZGRDbGFzcygnYXMtLXN1Ym1pdGVkJyk7XG4gICAgICBjb25zdCBpTGVuZ3RoID0gJChzZWxmLnNldHRpbmdzLmlucHV0KS5sZW5ndGg7XG4gICAgICAkKHNlbGYuc2V0dGluZ3MuaW5wdXQpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIHNlbGYuZm9ybUNoZWNrKCQodGhpcylbMF0uaWQpO1xuICAgICAgICBpZiAoaW5kZXggPj0gaUxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBjb25zdCBpbnZhbGlkSW5wdXRzID0gJCgnW2FyaWEtaW52YWxpZD1cInRydWVcIl0nKTtcbiAgICAgICAgICBpZiAoaW52YWxpZElucHV0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpbnZhbGlkSW5wdXRzWzBdLmZvY3VzKCk7XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBzZWxmLnNldHRpbmdzLnZhbGlkYXRlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkKHRoaXMpWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2ludmFsaWQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIXNlbGYuc2V0dGluZ3MudmFsaWRhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuXG4vLyBPbiBSRVNFVCA6XG4gICAgLyokKHNlbGYuc2V0dGluZ3MuY29udGFpbmVyKS5vbignY2xpY2snLCBzZWxmLnNldHRpbmdzLnJlc2V0QnRuLCBmdW5jdGlvbiAoZSkge1xuICAgICAgJChzZWxmLnNldHRpbmdzLmNvbnRhaW5lcikuY2xhc3NMaXN0LnJlbW92ZSgnYXMtLXN1Ym1pdGVkJyk7XG4gICAgICBpbnB1dHMuZm9yRWFjaChpbnB1dCA9PiB7XG4gICAgICAgIGxldCBpbnB1dFBhcmVudCA9IGlucHV0LmNsb3Nlc3QoJy5mb3JtLWZpZWxkJyk7XG4gICAgICAgIC8vaW5wdXRzWzBdLmZvY3VzKCk7XG4gICAgICAgIGlucHV0UGFyZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXZhbGlkJyk7XG4gICAgICAgIGlucHV0UGFyZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWludmFsaWQnKTtcbiAgICAgIH0pO1xuICAgICAgbGV0IG1zZ0Vycm9ycyA9ICQoJy5mb3JtLW1zZy1lcnJvcicpO1xuICAgICAgbXNnRXJyb3JzLmZvckVhY2gobXNnRXJyb3IgPT4ge1xuICAgICAgICBtc2dFcnJvci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG1zZ0Vycm9yKTtcbiAgICAgIH0pO1xuICAgIH0pOyovXG5cbiAgfVxuXG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFZhbGlkRm9ybTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLypnbG9iYWwgTW9kZXJuaXpyICovXG5pbXBvcnQgc3RvcmUgZnJvbSAnLi9fc3RvcmUnO1xuaW1wb3J0IGhlbHBlcnMgZnJvbSAnLi9faGVscGVycyc7XG5pbXBvcnQgUmVzcG9uc2l2ZURlYnVnIGZyb20gJy4vY2xhc3MvUmVzcG9uc2l2ZURlYnVnJztcbmltcG9ydCBDb2xsYXBzaWJsZSBmcm9tICcuL2NsYXNzL0NvbGxhcHNpYmxlJztcbmltcG9ydCBTY3JvbGxBbmNob3IgZnJvbSAnLi9jbGFzcy9TY3JvbGxBbmNob3InO1xuaW1wb3J0IFNob3dQYXNzd29yZCBmcm9tICcuL2NsYXNzL1Nob3dQYXNzd29yZCc7XG5pbXBvcnQgQ2xlYXJJbnB1dCBmcm9tICcuL2NsYXNzL0NsZWFySW5wdXQnO1xuaW1wb3J0IERldGVjdEJyb3dzZXIgZnJvbSAnLi9jbGFzcy9EZXRlY3RCcm93c2VyJztcbmltcG9ydCBDb29raWVzIGZyb20gJy4vY2xhc3MvQ29va2llcyc7XG5pbXBvcnQgQmFubmVyTWVzc2FnZXMgZnJvbSAnLi9jbGFzcy9CYW5uZXJNZXNzYWdlcyc7XG5pbXBvcnQgVmFsaWRGb3JtIGZyb20gJy4vY2xhc3MvVmFsaWRGb3JtJztcbi8vIGltcG9ydCBBbmltYXRlZExhYmVsRmllbGQgZnJvbSAnLi9jbGFzcy9BbmltYXRlZExhYmVsRmllbGQnO1xuLy9pbXBvcnQgQ29sb3Jib3ggZnJvbSAnLi9jbGFzcy9Db2xvcmJveCc7XG5cblxuLyoqXG4gKlxuICogQXBwXG4gKiBNYWluIENvbnRyb2xsZXJcbiAqXG4gKiBAYXV0aG9yIGFjdGlcbiAqICh2aW5jZWdvYmVsaW5zLCBtaGEsIGVmciwgLi4uKVxuICovXG5cbmNvbnN0IGFwcCA9IHtcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIGlmKCQoJy5vbmx5TWFybWl0ZScpLmxlbmd0aCkge1xuICAgICAgY29uc29sZS53YXJuKCcvIVxcXFwgSWYgeW91IHNlZSB0aGlzIHdhcm5pbmcgbWVzc2FnZSwgaXQgbWVhbnMgdGhhdCB5b3VyIGFyZSBpbiBNYXJtaXRlIFN0eWxlZ3VpZGUuXFxuJyArXG4gICAgICAgICdJZiBpdFxcJ3Mgbm90IHRoZSBjYXNlLCBpdCBtZWFucyB0aGF0IHNvbWVvbmUgaGFzIGZvcmdvdCB0byByZW1vdmUgdGhlIGNsYXNzIC5vbmx5TWFybWl0ZSBpbiBkZXYgdGVtcGxhdGVcXG4nICtcbiAgICAgICAgJ2FuZCBtYW55IGpzIGRldiBjb2RlIHdvblxcJ3Qgd29yayBwcm9wZXJseS4gOlxcJygnICk7XG4gICAgfVxuXG4gICAgdGhpcy5iaW5kVUkoKTtcblxuICAgIC8qLS0tIGluaXRpYWxpc2F0aW9uIGRlcyB0YWlsbGVzIGRlIHZpZXdwb3J0IC0tLSovXG4gICAgc3RvcmUuY3VycmVudFdpZHRoID0gc3RvcmUud1dpZHRoID0gaGVscGVycy52aWV3cG9ydCgpLndpZHRoO1xuICAgIHN0b3JlLmN1cnJlbnRIZWlnaHQgPSBzdG9yZS53SGVpZ2h0ID0gaGVscGVycy52aWV3cG9ydCgpLmhlaWdodDtcblxuICAgIHN0b3JlLndTY3JvbGwgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cbiAgICBsZXQgc2VsZiA9IHRoaXM7XG5cblxuICAgIC8qLS0tIHJlc3BvbnNpdmUtZGVidWcgLS0tKi9cbiAgICBsZXQgcmVzcG9uc2l2ZURlYnVnID0gbmV3IFJlc3BvbnNpdmVEZWJ1ZygpO1xuXG4gICAgLyotLS0gZGV0ZWN0QnJvd3NlciAtLS0qL1xuICAgIGxldCBkZXRlY3RCcm93c2VyID0gbmV3IERldGVjdEJyb3dzZXIoKTtcblxuICAgIC8qLS0tIFZhbGlkYXRpb24gRm9ybSAtLS0qL1xuICAgIGxldCB2YWxpZEZvcm0gPSBuZXcgVmFsaWRGb3JtKHtcbiAgICAgIC8qY29udGFpbmVyOiAnLnZhbGlkLWZvcm0nLFxuICAgICAgZmllbGRDb250YWluZXI6ICcuZm9ybS1maWVsZCcsXG4gICAgICB2YWxpZENsYXNzOiAnYXMtLXZhbGlkJyxcbiAgICAgIGludmFsaWRDbGFzczogJ2FzLS1pbnZhbGlkJyxcbiAgICAgIG1zZ0Vycm9yQ2xhc3M6ICdmb3JtLW1zZy1lcnJvcicsKi9cbiAgICB9KTtcblxuICAgIC8qLS0tIGNvb2tpZXMgLS0tKi9cbiAgICBzdG9yZS5jb29raWVzID0gbmV3IENvb2tpZXMoKTtcblxuICAgIC8qLS0tIEJhbm5lciBtZXNzYWdlcyAoY29va2llcyBjb25zZW50IC8gd2FybmlnIC8gbmV3cy4uLikgLS0tKi9cbiAgICBjb25zdCBtZXNzYWdlc0Jhbm5lciA9IG5ldyBCYW5uZXJNZXNzYWdlcygvKntcbiAgICAgIC8vY2FwaW5nOiAzLFxuICAgIH0qLyk7XG5cbiAgICAvKi0tLSBTa2lwIGxpbmtzIC0tLSovXG4gICAgbGV0IHNraXAgPSBuZXcgQ29sbGFwc2libGUoe1xuICAgICAgY29udGFpbmVyOiAnLnNraXAnLFxuICAgICAgY3RhOiAnLnNraXAtY3RhJyxcbiAgICAgIGNsYXNzTmFtZTogJ2FzLS1mb2N1c2VkJyxcbiAgICAgIG9wdGlvbkhvdmVyOiB0cnVlXG4gICAgfSk7XG5cbiAgICAvKi0tLSBjb2xvcmJveCAtLS0qL1xuICAgIC8qbGV0IGNvbG9yYm94ID0gbmV3IENvbG9yYm94KCk7Ki9cblxuICAgIC8qLS0tIGFuaW1hdGlvbiBzY3JvbGwgLS0tKi9cbiAgICAvKiBVc2UgJy5qcy1zY3JvbGwtYW5jaG9yJyBjbGFzcyB0byB0cmlnZ2VyIHNtb290aCBhbmNob3Igc2Nyb2xsKi9cbiAgICBzdG9yZS5zY3JvbGxBbmNob3IgPSBuZXcgU2Nyb2xsQW5jaG9yKCk7XG5cbiAgICAvKi0tLSBwYXNzd29yZCAtLS0qL1xuICAgIGxldCBzaG93UGFzc3dvcmQgPSBuZXcgU2hvd1Bhc3N3b3JkKCk7XG5cbiAgICAvKi0tLSBjbGVhciBpbnB1dCAtLS0qL1xuICAgIGxldCBjbGVhcklucHV0ID0gbmV3IENsZWFySW5wdXQoKTtcblxuICAgIC8qLS0tIGFuaW1hdGVkIGxhYmVsIC0tLSovXG4gICAgLy8gbGV0IGZvcm0gPSBuZXcgQW5pbWF0ZWRMYWJlbEZpZWxkKCk7XG5cbiAgICAvLyByZXNwb25zaXZlXG4gICAgc2VsZi5vblJlc2l6ZSgpO1xuICB9LFxuXG4gIGNoZWNrTW9iaWxlOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKC9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfEJsYWNrQmVycnl8V2luZG93cyBQaG9uZXxPcGVyYSBNaW5pfElFTW9iaWxlfE1vYmlsZS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSxcblxuICBvblJlc2l6ZTogZnVuY3Rpb24gKCkge1xuICAgIGxldCBzZWxmID0gdGhpcztcbiAgfSxcblxuICBvblNjcm9sbDogZnVuY3Rpb24gKCkge1xuICAgIGxldCBzZWxmID0gdGhpcztcbiAgfSxcblxuICBiaW5kVUk6IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoTW9kZXJuaXpyLm1xKCdvbmx5IGFsbCcpKSB7XG4gICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc3RvcmUud1dpZHRoID0gaGVscGVycy52aWV3cG9ydCgpLndpZHRoO1xuICAgICAgICBzdG9yZS53SGVpZ2h0ID0gaGVscGVycy52aWV3cG9ydCgpLmhlaWdodDtcbiAgICAgICAgaWYgKHN0b3JlLmN1cnJlbnRIZWlnaHQgIT09IHN0b3JlLndIZWlnaHQgfHwgc3RvcmUuY3VycmVudFdpZHRoICE9PSBzdG9yZS53V2lkdGgpIHtcbiAgICAgICAgICBzdG9yZS5jdXJyZW50SGVpZ2h0ID0gc3RvcmUud0hlaWdodDtcbiAgICAgICAgICBzdG9yZS5jdXJyZW50V2lkdGggPSBzdG9yZS53V2lkdGg7XG4gICAgICAgICAgLyotLS0gdGltZXIgcG91ciBsZSByZWRpbWVuc2lvbm5lbWVudCBkJ2VjcmFuIC0tLSovXG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHN0b3JlLnRpbWVyUmVzcG9uc2l2ZSk7XG4gICAgICAgICAgc3RvcmUudGltZXJSZXNwb25zaXZlID0gc2V0VGltZW91dChzZWxmLm9uUmVzaXplLmJpbmQoc2VsZiksIDMwMCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGRvY3VtZW50Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XG4gICAgICAgIHNlbGYub25SZXNpemUoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLyotLS0gZm9uY3Rpb25zIGF1IHNjcm9sbCAtLS0qL1xuICAgICQod2luZG93KS5vbignc2Nyb2xsJywgZnVuY3Rpb24gKCkge1xuICAgICAgc3RvcmUud1Njcm9sbCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcblxuICAgICAgc2VsZi5vblNjcm9sbCgpO1xuICAgIH0pO1xuXG4gICAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKCcobWluLXdpZHRoOiA4OTZweCknKS5tYXRjaGVzKSB7XG4gICAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuYm9keTtcbiAgICAgIGNvbnN0IHNjcm9sbFVwID0gJ3Njcm9sbC11cCc7XG4gICAgICBjb25zdCBzY3JvbGxEb3duID0gJ3Njcm9sbC1kb3duJztcbiAgICAgIGxldCBsYXN0U2Nyb2xsID0gMDtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRTY3JvbGwgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgICAgIGlmIChjdXJyZW50U2Nyb2xsIDw9IDEpIHtcbiAgICAgICAgICBib2R5LmNsYXNzTGlzdC5yZW1vdmUoc2Nyb2xsVXApO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGN1cnJlbnRTY3JvbGwgPCAxKXtcbiAgICAgICAgICBib2R5LmNsYXNzTGlzdC5yZW1vdmUoc2Nyb2xsRG93bik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3VycmVudFNjcm9sbCA+IGxhc3RTY3JvbGwgJiYgIWJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKHNjcm9sbERvd24pKSB7XG4gICAgICAgICAgLy8gZG93blxuICAgICAgICAgIGJvZHkuY2xhc3NMaXN0LnJlbW92ZShzY3JvbGxVcCk7XG4gICAgICAgICAgYm9keS5jbGFzc0xpc3QuYWRkKHNjcm9sbERvd24pO1xuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRTY3JvbGwgPCBsYXN0U2Nyb2xsICYmIGJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKHNjcm9sbERvd24pKSB7XG4gICAgICAgICAgLy8gdXBcbiAgICAgICAgICBib2R5LmNsYXNzTGlzdC5yZW1vdmUoc2Nyb2xsRG93bik7XG4gICAgICAgICAgYm9keS5jbGFzc0xpc3QuYWRkKHNjcm9sbFVwKTtcbiAgICAgICAgfVxuICAgICAgICBsYXN0U2Nyb2xsID0gY3VycmVudFNjcm9sbDtcbiAgICAgIH0pO1xuXG4gICAgICAkKCcuZmlyc3QtbHZsID4gbGknKVxuICAgICAgICAubW91c2VlbnRlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ2hhcy1zdWJtZW51JykpIHtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2lzLWhvdmVyJyk7XG4gICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2lzLWhvdmVyJyk7XG4gICAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ292ZXJsYXktb3BlbicpO1xuICAgICAgICAgIH1cblxuICAgICAgICB9KVxuICAgICAgICAubW91c2VsZWF2ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdvdmVybGF5LW9wZW4nKTtcbiAgICAgICAgICAkKCcuZmlyc3QtbHZsIGxpJykucmVtb3ZlQ2xhc3MoJ2lzLWhvdmVyJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAkKCcuYnVyZ2VyLW1lbnUnKS5vbignY2xpY2snLCAnLmJ1cmdlcicsIGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJyNuYXYtaWNvbicpLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XG4gICAgICAgICQoJy5idXJnZXItbWVudScpLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XG4gICAgICAgICQoJ2JvZHknKS50b2dnbGVDbGFzcygnb3ZlcmxheS1vcGVuJyk7XG5cbiAgICAgIH0pO1xuXG4gICAgfWVsc2V7XG5cblxuICAgIH1cblxuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoISQoZS50YXJnZXQpLmNsb3Nlc3QoJyNoZWFkZXInKS5sZW5ndGggKSB7XG4gICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnb3ZlcmxheS1vcGVuJyk7XG4gICAgICAgICQoJy5idXJnZXItbWVudScpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICAgICQoJyNuYXYtaWNvbicpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZigkKCcuc3dpdGNoLWJsb2NrJykubGVuZ3RoKXtcbiAgICAgICQoJy5zd2l0Y2gtYnV0dG9ucycpLm9uKCdjbGljaycsICdwJywgZnVuY3Rpb24oKXtcbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICQodGhpcykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG5cbiAgICAgICAgbGV0IGJ1dHRvbkRhdGEgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtc3dpdGNoJyk7XG4gICAgICAgICQoJy5zd2l0Y2gtYmxvY2snKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgbGV0IGJsb2NrRGF0YSA9ICQodGhpcykuYXR0cignZGF0YS1zd2l0Y2gnKTtcbiAgICAgICAgICBpZihidXR0b25EYXRhID09PSBibG9ja0RhdGEpe1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcuY2FyZHMnKS5hZGRDbGFzcygnaXMtdmlzaWJsZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoJCgnLnNsaWRlci1pbWcnKS5sZW5ndGgpIHtcbiAgICAgIGxldCAkc2xpZGVyID0gJCgnLnNsaWRlci1pbWcnKTtcbiAgICAgIHZhciAkc3RhdHVzID0gJCgnLmNvdW50ZXItc2xpZGVyJyk7XG5cbiAgICAgICRzbGlkZXIub24oJ2luaXQgcmVJbml0IGFmdGVyQ2hhbmdlJywgZnVuY3Rpb24gKGV2ZW50LCBzbGljaywgY3VycmVudFNsaWRlLCBuZXh0U2xpZGUpIHtcbiAgICAgICAgdmFyIGkgPSAoY3VycmVudFNsaWRlID8gY3VycmVudFNsaWRlIDogMCkgKyAxO1xuICAgICAgICAkc3RhdHVzLmh0bWwoJzxzcGFuIGNsYXNzPVwiY3VycmVudF9zbGlkZVwiPicgKyBpICsgJzwvc3Bhbj48c3BhbiBjbGFzcz1cInNsYXNoXCI+Lzwvc3Bhbj48c3BhbiBjbGFzcz1cInRvdGFsX3NsaWRlc1wiPicgKyBzbGljay5zbGlkZUNvdW50ICsgJzwvc3Bhbj4nKTtcbiAgICAgIH0pO1xuXG4gICAgICAkc2xpZGVyLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgJCh0aGlzKS5maW5kKCcuc2xpZGVyLXdyYXAnKS5zbGljayh7XG4gICAgICAgICAgaW5maW5pdGU6IHRydWUsXG4gICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxuICAgICAgICAgIGRvdHM6IGZhbHNlLFxuICAgICAgICAgIGFycm93OiB0cnVlLFxuICAgICAgICAgIHByZXZBcnJvdzogJCh0aGlzKS5jbG9zZXN0KCcuc2xpZGVyLWltZycpLnNpYmxpbmdzKCcud2hpdGUtYmxvY2ssIC50cmlhbmdsZS1jb3VudGVyJykuZmluZCgnLnNsaWNrLXByZXYnKSxcbiAgICAgICAgICBuZXh0QXJyb3c6ICQodGhpcykuY2xvc2VzdCgnLnNsaWRlci1pbWcnKS5zaWJsaW5ncygnLndoaXRlLWJsb2NrLCAudHJpYW5nbGUtY291bnRlcicpLmZpbmQoJy5zbGljay1uZXh0JyksXG4gICAgICAgICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBicmVha3BvaW50OiAxNDAwLFxuICAgICAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcbiAgICAgICAgICAgICAgICBzd2lwZTp0cnVlLFxuICAgICAgICAgICAgICAgIGRyYWdnYWJsZTp0cnVlLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoJCgnLnNsaWRlci1wcm9kdWN0cycpLmxlbmd0aCkge1xuICAgICAgbGV0ICRzbGlkZXIgPSAkKCcuc2xpZGVyLXByb2R1Y3RzJyk7XG5cbiAgICAgICRzbGlkZXIub24oJ2luaXQgcmVJbml0IGFmdGVyQ2hhbmdlJywgZnVuY3Rpb24gKGV2ZW50LCBzbGljaywgY3VycmVudFNsaWRlLCBuZXh0U2xpZGUpIHtcbiAgICAgICAgbGV0ICRTbGlja1ByZXZBY3RpdmUgPSAkKCcuc2xpZGVyLXByb2R1Y3RzIC5zbGljay1hY3RpdmUnKS5wcmV2KCkuZmluZCgnLnNsaWRlJykuYXR0cignZGF0YS1jYXRlZ29yaWUnKTtcbiAgICAgICAgbGV0ICRTbGlja05leHRBY3RpdmUgPSAkKCcuc2xpZGVyLXByb2R1Y3RzIC5zbGljay1hY3RpdmUnKS5uZXh0KCkuZmluZCgnLnNsaWRlJykuYXR0cignZGF0YS1jYXRlZ29yaWUnKTtcbiAgICAgICAgJCgnLmNhdGVnb3JpZS1wcmV2JykudGV4dCgkU2xpY2tQcmV2QWN0aXZlKTtcbiAgICAgICAgJCgnLmNhdGVnb3JpZS1uZXh0JykudGV4dCgkU2xpY2tOZXh0QWN0aXZlKTtcbiAgICAgIH0pO1xuXG4gICAgICAkc2xpZGVyLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgJCh0aGlzKS5maW5kKCcuc2xpZGVyLXdyYXAnKS5zbGljayh7XG4gICAgICAgICAgaW5maW5pdGU6IHRydWUsXG4gICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxuICAgICAgICAgIGRvdHM6IGZhbHNlLFxuICAgICAgICAgIGFycm93OiB0cnVlLFxuICAgICAgICAgIHByZXZBcnJvdzogJCh0aGlzKS5jbG9zZXN0KCcuZnVsbC1ibG9jay1ob21lJykuZmluZCgnLnNsaWNrLXByZXYnKSxcbiAgICAgICAgICBuZXh0QXJyb3c6ICQodGhpcykuY2xvc2VzdCgnLmZ1bGwtYmxvY2staG9tZScpLmZpbmQoJy5zbGljay1uZXh0JyksXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCQoJy5zbGlkZXItcGFydG5lcnMnKS5sZW5ndGgpIHtcbiAgICAgIGxldCAkc2xpZGVyID0gJCgnLnNsaWRlci1wYXJ0bmVycycpO1xuXG4gICAgICAkc2xpZGVyLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgJCh0aGlzKS5maW5kKCcuc2xpZGVyLXdyYXAnKS5zbGljayh7XG4gICAgICAgICAgaW5maW5pdGU6IHRydWUsXG4gICAgICAgICAgc2xpZGVzVG9TaG93OiAzLFxuICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxuICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IHRydWUsXG4gICAgICAgICAgZG90czogZmFsc2UsXG4gICAgICAgICAgYXJyb3c6IHRydWUsXG4gICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlLFxuICAgICAgICAgIHByZXZBcnJvdzogJCh0aGlzKS5jbG9zZXN0KCcuYmxvY2stcGFydG5lcnMnKS5maW5kKCcuc2xpY2stcHJldicpLFxuICAgICAgICAgIG5leHRBcnJvdzogJCh0aGlzKS5jbG9zZXN0KCcuYmxvY2stcGFydG5lcnMnKS5maW5kKCcuc2xpY2stbmV4dCcpLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICgkKCcuc2xpZGVyLWFjdHVzJykubGVuZ3RoKSB7XG4gICAgICBsZXQgJHNsaWRlciA9ICQoJy5zbGlkZXItYWN0dXMnKTtcblxuICAgICAgJHNsaWRlci5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICQodGhpcykuZmluZCgnLnNsaWRlci13cmFwJykuc2xpY2soe1xuICAgICAgICAgIGluZmluaXRlOiB0cnVlLFxuICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcbiAgICAgICAgICBmYWRlOiB0cnVlLFxuICAgICAgICAgIHNwZWVkOiA5MDAsXG4gICAgICAgICAgZG90czogZmFsc2UsXG4gICAgICAgICAgYXJyb3c6IHRydWUsXG4gICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlLFxuICAgICAgICAgIHByZXZBcnJvdzogJCh0aGlzKS5jbG9zZXN0KCcuYmxvY2stYWN0dXMnKS5maW5kKCcuc2xpY2stcHJldicpLFxuICAgICAgICAgIG5leHRBcnJvdzogJCh0aGlzKS5jbG9zZXN0KCcuYmxvY2stYWN0dXMnKS5maW5kKCcuc2xpY2stbmV4dCcpLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIGlmKCQoJy5saXN0LXRvLXNob3cnKS5sZW5ndGgpe1xuICAgIC8vICAgbGV0IGNvdW50Q2FyZHMgPSAwO1xuICAgIC8vICAgJCgnLnByb2R1aXQnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgLy8gICAgIGlmKGNvdW50Q2FyZHMgPCA2KXtcbiAgICAvLyAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdpcy12aXNpYmxlJyk7XG4gICAgLy8gICAgICAgY291bnRDYXJkcysrO1xuICAgIC8vICAgICB9XG4gICAgLy8gICB9KTtcbiAgICAvL1xuICAgIC8vICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAvLyAgICAgaWYoJCgnLnByb2R1aXQnKS5sZW5ndGggPCA2KXtcbiAgICAvLyAgICAgICAkKCcuc2VlLW1vcmUnKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgIC8vICAgICB9XG4gICAgLy8gICB9LCAxMDApO1xuICAgIC8vXG4gICAgLy8gICAkKCcubGlzdC10by1zaG93Jykub24oJ2NsaWNrJywgJy5zZWUtbW9yZScsIGZ1bmN0aW9uKCl7XG4gICAgLy8gICAgIGNvdW50Q2FyZHMgPSAwO1xuICAgIC8vICAgICAkKCcucHJvZHVpdDpub3QoLmlzLXZpc2libGUpJykuZWFjaChmdW5jdGlvbigpe1xuICAgIC8vICAgICAgIGlmKGNvdW50Q2FyZHMgPCA2KXtcbiAgICAvLyAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2lzLXZpc2libGUnKTtcbiAgICAvLyAgICAgICAgIGNvdW50Q2FyZHMrKztcbiAgICAvLyAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAvLyAgICAgICAgICAgaWYoJCgnLnByb2R1aXQnKS5sZW5ndGggPT09ICQoJy5pcy12aXNpYmxlJykubGVuZ3RoKXtcbiAgICAvLyAgICAgICAgICAgICAkKCcuc2VlLW1vcmUnKS5mYWRlT3V0KCk7XG4gICAgLy8gICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgIH0sIDEwMCk7XG4gICAgLy8gICAgICAgfVxuICAgIC8vICAgICB9KTtcbiAgICAvLyAgIH0pO1xuICAgIC8vIH1cblxuICAgIGlmICgkKCcucG9wLWluLWJ1dHRvbicpLmxlbmd0aCkge1xuICAgICAgJCgnLnBvcC1pbi1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuICAgICAgICBsZXQgdGFyZ2V0ID0gJCh0aGlzKS5hdHRyKCdkYXRhLXRhcmdldCcpO1xuICAgICAgICAkKHRhcmdldCkuYWRkQ2xhc3MoJ2lzLXNob3cnKTtcbiAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdvdmVybGF5LXNob3cnKTtcbiAgICAgIH0pO1xuICAgICAgJChkb2N1bWVudCkubW91c2V1cChmdW5jdGlvbihlKXtcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9ICQoJy5wb3AtaW4sIC5wb3AtaW4tYnV0dG9uJyk7XG4gICAgICAgIGlmICghY29udGFpbmVyLmlzKGUudGFyZ2V0KSAmJiBjb250YWluZXIuaGFzKGUudGFyZ2V0KS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBjb250YWluZXIucmVtb3ZlQ2xhc3MoJ2lzLXNob3cnKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ292ZXJsYXktc2hvdycpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgICQoJy5wb3AtaW4gLmNsb3NlJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLnBvcC1pbicpLnJlbW92ZUNsYXNzKCdpcy1zaG93Jyk7XG4gICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnb3ZlcmxheS1zaG93Jyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoJCgnLnNsaWRlci1oZXhhZ29uZScpLmxlbmd0aCAmJiB3aW5kb3cubWF0Y2hNZWRpYSgnKG1heC13aWR0aDogODk2cHgpJykubWF0Y2hlcykge1xuICAgICAgJCgnLnNsaWRlci1oZXhhZ29uZScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgJCh0aGlzKS5maW5kKCcuc2xpZGVyLXdyYXAnKS5zbGljayh7XG4gICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxuICAgICAgICAgIHNsaWRlc1RvU2hvdzogMyxcbiAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcbiAgICAgICAgICBkb3RzOiBmYWxzZSxcbiAgICAgICAgICBhcnJvdzogZmFsc2UsXG4gICAgICAgICAgdmFyaWFibGVXaWR0aDogdHJ1ZSxcbiAgICAgICAgICByZXNwb25zaXZlOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDg5NixcbiAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXG4gICAgICAgICAgICAgICAgc3dpcGU6dHJ1ZSxcbiAgICAgICAgICAgICAgICBkcmFnZ2FibGU6dHJ1ZSxcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gIH1cbn07XG5cbmFwcC5pbml0KCk7XG5cbi8vIGdsb2JhbCBjdXN0b20gZnVuY3Rpb25zLCB0aGV5IGNhbiBiZSBjYWxsZWQgZnJvbSBhbnl3aGVyZSB3aXRoaW4gdGhlIHByb2plY3QgKHVzZWZ1bCBmb3IgdGhlIGJhY2stZW5kIGRldmVsb3BlcnMpXG5sZXQgY3VzdG9tRnVuY3Rpb25zID0ge1xuICAvLyBnbG9iYWwgY3VzdG9tIGZ1bmN0aW9uIGV4YW1wbGVcbiAgLy8gdG8gY2FsbCBpdCBmcm9tIGFueXdoZXJlIDogZ2xvYmFsLmN1c3RvbUZ1bmN0aW9uLmFmdGVyQWpheEV4YW1wbGUoKTtcbiAgLyphZnRlckFqYXhFeGFtcGxlOiBmdW5jdGlvbigpIHtcbiAgIGhlbHBlcnMucmVzaXplSW1nKCcubWVkaWEtYmxvY2stbmV3cycpO1xuICAgfSovXG59O1xuLy8gZXhwb3J0cyB0aGUgZWxlbWVudHMgdGhhdCBuZWVkIHRvIGJlIGFjY2Vzc2VkIGZyb20gc29tZXdoZXJlIGVsc2UgKGluIHRoZSBcImdsb2JhbFwiIHN0YW5kYWxvbmUgb2JqZWN0LCBjZi4gZ3VscGZpbGUpXG5tb2R1bGUuZXhwb3J0cyA9IGN1c3RvbUZ1bmN0aW9ucztcbiJdfQ==
