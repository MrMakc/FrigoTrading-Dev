/**
 *
 * DetectBrowser
 * Generic class for drag'n'drop input file multiple
 *
 * @author efr
 */

class DetectBrowser {

  /**
   *
   * Constructor
   *
   * @param options Object settings
   */

  constructor(options = {}) {
    //console.log('DetectBrowser');

    let defaults = {
    };

    // fusionne les options renseignees avec celles par defaut pour creer l'objet settings
    this.settings = $.extend({}, defaults, options);


    this.init();
  }

  /**
   *
   * Init dropzone
   *
   */

  init() {
    const self = this;
    const browsers = {};


    // Opera 8.0+
    browsers.isOpera = (!!window.opr && !!window.opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

    // Firefox 1.0+
    browsers.isFirefox = typeof InstallTrigger !== 'undefined';

    // Safari 3.0+ "[object HTMLElementConstructor]"
    browsers.isSafari = /constructor/i.test(window.HTMLElement) ||
      (function (p) { return p.toString() === '[object SafariRemoteNotification]'; })(!window.safari ||
        (typeof window.safari !== 'undefined' && window.safari.pushNotification));

    // Internet Explorer 6-11
    browsers.isIE = /*@cc_on!@*/false || !!document.documentMode;

    // Edge 20+
    browsers.isEdge = !browsers.isIE && !!window.StyleMedia;

    // Chrome 1+
    browsers.isChrome = !!window.chrome && !!window.chrome.webstore;

    // Blink engine detection
    browsers.isBlink = (browsers.isChrome || browsers.isOpera) && !!window.CSS;

    //console.log('browsers : ', browsers);

    if(browsers.isOpera) {
      $('html').addClass('is-opera');
    } else if(browsers.isFirefox) {
      $('html').addClass('is-firefox');
    } else if(browsers.isSafari) {
      $('html').addClass('is-safari');
    } else if(browsers.isIE) {
      $('html').addClass('is-ie');
    } else if(browsers.isEdge) {
      $('html').addClass('is-edge');
    } else if(browsers.isChrome) {
      $('html').addClass('is-chrome');
    } else if(browsers.isBlink) {
      $('html').addClass('is-blinkra');
    }
  }


  /**
   *
   * Bind UI Actions
   *
   */

  bindUIActions() {
    const self = this;

  }
}


module.exports = DetectBrowser;
