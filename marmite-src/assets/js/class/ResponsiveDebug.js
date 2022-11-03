/**
 *
 * ResponsiveDebug
 * shows current breakpoint in bottom left corner on resize
 * if localstorage 'responsive-debug' is true
 *
 * @author efr
 */

class ResponsiveDebug {

  /**
   *
   * Constructor
   *
   * @param options Object settings
   */

  constructor(options = {}) {

    const defaults = {};

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

  doneResizing() {
    const self = this;
    self.$responsiveHelper.removeClass('as--visible');

  }


  /**
   *
   * Bind UI Actions
   *
   */

  bindUIActions() {
    const self = this;
    if(localStorage.getItem('responsive-debug')){
      self.$responsiveHelper = $('<div/>');
      let resizeId;
      self.$responsiveHelper.addClass('responsive-helper').appendTo($('body'));
      $(window).on('resize',function() {
        self.$responsiveHelper.addClass('as--visible');
        clearTimeout(resizeId);
        resizeId = setTimeout(function () {
          self.doneResizing();
        }, 500);
      });
    }


  }

}


module.exports = ResponsiveDebug;
