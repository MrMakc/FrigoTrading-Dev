import store from '../_store';
/**
 *
 * Inview
 * Generic class for inview elements
 *
 * @author sdi
 */

class Inview {

  /**
   *
   * Constructor
   *
   * @param block String Block to display
   * @param className String Class active
   */

  constructor(options = {}) {

    let defaults = {
      item: '.item-inview',
      class: 'is-inview'
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

  bindUIActions() {
    let self = this;

    if ($.event.special.inview) {
      if (window.matchMedia(store.mq3).matches) {
        $(self.settings.item).addClass(self.settings.class);
      } else {
        $(self.settings.item).each(function () {
          $(this).bind('inview', function (event, visible) {

            if (visible) {
              $(this).addClass(self.settings.class);
            } /*else {
             $(this).removeClass(self.settings.class);
             }*/
          });
        });
      }
    } else {
      $(self.settings.item).addClass(self.settings.class);
    }
  }
}


module.exports = Inview;
