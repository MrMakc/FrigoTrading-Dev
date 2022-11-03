import store from '../_store';
/**
 *
 * Parallax
 * Generic class for parallax elements
 *
 * @author sdi
 */

class Parallax {

  /**
   *
   * Constructor
   *
   * @param block String Block to display
   * @param className String Class active
   *
   * Instructions
   * Ajouter data-speedx="" et/ou data-speedy="" dans la balise html qui subi l'effet de parallax
   */

  constructor(options = {}) {

    let defaults = {
      block: '#body .parallax', // ajouter sur le conteneur de l'objet
      object: '.object-parallax' // ajouter la classe sur l'objet qui subi l'animation
    };

    // fusionne les options renseignees avec celles par defaut pour creer l'objet settings
    this.settings = $.extend({}, defaults, options);

    this.reset();

    // evenements par utilisateur ex scroll hover clic touch
    this.position();
  }

  reset() {
    let self = this;

    $(self.settings.object).removeAttr('style');
  }

  /**
   *
   * Animation type position X or Y to this element
   *
   */

  position() {
    let self = this;
    $(self.settings.block).each(function (index) {
      const hChild = $(this).find(self.settings.object);
      const parentTop = $(this).offset().top;

      hChild.each(function (index) {
        const speed = $(this).data('speed');

        let speedX = 0;
        let speedY = 0;
        if ($(this).data('speedx')) {
          speedX = $(this).data('speedx');
        }
        if ($(this).data('speedy')) {
          speedY = $(this).data('speedy');
        }

        const x = -(store.wScroll * speedX);
        const y = -(store.wScroll * speedY);

        $(this).css({
          '-webkit-transform': 'translate(' + x + 'px, ' + y + 'px)',
          '-moz-transform': 'translate(' + x + 'px, ' + y + 'px)',
          '-o-transform': 'translate(' + x + 'px, ' + y + 'px)',
          'transform': 'translate(' + x + 'px, ' + y + 'px)'
        });
      });
    });
  }
}


module.exports = Parallax;
