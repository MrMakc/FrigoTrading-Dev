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

class ScrollAnchor {

  /**
   *
   * Constructor
   *
   * @param options Object settings
   */

  constructor(options = {}) {

    const defaults = {
      container: '#body',
      cta: 'a.js-scroll-anchor', //was  'a[href^="#"]:not([href="#"])' / solution CPE : 'a[href^="#"]:not([href="#"]):not(.no-scroll-to)'
      mode: 'easeInOutQuad', // animation type
      delay: 300, // animation duration
      target : null,
      durationMax: 1000,
      distanceMax :1000,
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

  scroll(target) {
    const self = this;

    let targetScroll = 0;
    let iHeaderHeight = 0; // edit this code if u have sticky header
    if (typeof target === 'string'){
      targetScroll = $(target).offset().top - iHeaderHeight;
    } else if (typeof target === 'number'){
      targetScroll = target;
    } else if (typeof target === 'object' && target.length){
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

  bindUIActions() {
    const self = this;
    $(self.settings.container).on('click', self.settings.cta, function (event) {
      event.preventDefault();
      const target = $(this).attr('href');
      self.scroll(target);
      return false;
    });
  }


}

module.exports = ScrollAnchor;
