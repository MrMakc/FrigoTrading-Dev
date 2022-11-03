/**
 *
 * Rating Star
 * Generic class for rating elements
 *
 * @author sdi
 */

class Rating {

  /**
   *
   * Constructor
   *
   * @param block String Block to display
   * @param className String Class active
   */

  constructor(options = {}) {

    let defaults = {
      container: '.rating-choice',
      item: '.choice',
      input: 'input[type="radio"]',
      activeClassName: 'as--active',
      inactiveClassName: 'as--inactive'
    };

    // fusionne les options renseignees avec celles par defaut pour creer l'objet settings
    this.settings = $.extend({}, defaults, options);

    let self = this;

    $(self.settings.container).each(function() {
      self.update(this);
    });

    // evenements par utilisateur ex scroll hover clic touch
    self.bindUIActions();
  }

  /**
   *
   * Update
   *
   * @param container Object container
   */
  update(container) {
    let self = this;

    const activeItem = $(container).find(self.settings.input + ':checked').closest(self.settings.item);

    // remove the current classes
    $(container).find(self.settings.item).removeClass(self.settings.activeClassName + ' ' + self.settings.inactiveClassName);
    // all the previous elements get the active class
    activeItem.prevAll(self.settings.item).addClass(self.settings.activeClassName);
  }

  /**
   *
   * Bind UI Actions
   *
   */
  bindUIActions() {
    let self = this;
    // evenements au hover / focus
    $(self.settings.container).on('mouseenter focus', self.settings.item, function() {

      const container = $(this).closest(self.settings.container);

      container.find(self.settings.item).removeClass(self.settings.activeClassName + ' ' + self.settings.inactiveClassName);
      $(this).prevAll(self.settings.item).addClass(self.settings.activeClassName);
      $(this).nextAll(self.settings.item).addClass(self.settings.inactiveClassName);
      $(this).addClass(self.settings.activeClassName);
    });
    // evenements au clique ou au changement d'etat de l'input
    $(self.settings.container).on('change', self.settings.input, function() {

      const container = $(this).closest(self.settings.container);
      self.update(container);
    });
    // evenements lorsque le curseur sort de la zone
    $(self.settings.container).on('mouseleave', function() {

      const container = $(this);
      self.update(container);
    });

  }

}


module.exports = Rating;
