/**
 *
 * Exemple
 * Exemple class
 *
 * @author vincegobelins
 */

class Nav {

  /**
   *
   * Constructor
   *
   * @param exemple String Exemple string
   */

  constructor(options = {}) {

    let defaults = {
      container: '.nav-principal',
      item1: '.item-nav-principal-level-1',
      cta1: '.cta-nav-principal-level-1',
      list2: '.list-nav-principal-level-2',
      item2: '.item-nav-principal-level-2',
      cta2: '.cta-nav-principal-level-2',
      classState: 'as--open',
      classHasChild: 'as--submenu',
      delay: 300
    };

    // fusionne les options renseignees avec celles par defaut pour creer l'objet settings
    this.settings = $.extend({}, defaults, options);

    this.timer = null;

    // evenements par utilisateur ex scroll hover clic touch
    this.bindUIActions();
  }

  /**
   *
   * Show nav
   *
   * @return
   */

  showMenu(elem) {
    let self = this;
    $(elem).addClass(self.settings.classState);
  }

  /**
   *
   * Hide nav
   *
   * @param id Int Unique event id
   * @return
   */

  hideMenu() {
    let self = this;
    $(self.settings.item1).removeClass(self.settings.classState);
  }

  /**
   *
   * Bind UI Actions
   *
   */

  bindUIActions() {
    let self = this;

    $(self.settings.container).on('mouseenter focusin touchstart', self.settings.item1, function (event) {
      event.stopImmediatePropagation();
      window.clearTimeout(self.timer);
      const elem = event.target;
      if ($(this).find($(self.settings.list2)).length > 0) {
        if (
            event.type === 'touchstart' &&
            $(this).hasClass(self.settings.classState) &&
            !$(elem).is($(self.settings.item2)) &&
            $(elem).closest($(self.settings.item2)).length === 0
        ) {
          self.hideMenu();
        } else {
          const item = this;
          self.timer = window.setTimeout(function() {
            self.hideMenu();
            self.showMenu($(item));
          }, self.settings.delay);
        }
        if ($(elem).is($(self.settings.cta1)) || $(elem).closest($(self.settings.cta1)).length > 0) {
          return false;
        }
      } else {
        self.timer = window.setTimeout(function() {
          self.hideMenu();
        }, self.settings.delay);
      }
    });

    $(self.settings.container).on('mouseleave', function () {
      window.clearTimeout(self.timer);
      self.timer = window.setTimeout(function() {
        self.hideMenu();
      }, self.settings.delay);

    });

  }

}


module.exports = Nav;
