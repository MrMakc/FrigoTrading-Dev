/**
 *
 * ActiveCheck
 * Generic class to toggle class on element if an input is checked inside
 *
 * @author mha
 */

/**
 *
 * HTML minimal example template
 *
 * .form
 *  .choice
 *    input[type="radio"] (or input[type="checkbox"])
 *    (optional .cta-choice)
 */

class ActiveCheck {

  /**
   *
   * Constructor
   *
   * @param options Object settings
   */

  constructor(options = {}) {

    let defaults = {
      container: '.form',
      item: '.choice',
      input: 'input[type="radio"], input[type="checkbox"]',
      className: 'as--active',
      optionCta: false, // if there is a button to check the input
      cta: '.cta-choice' // only if optionCta == true
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
   * @param elem Object element to open
   */

  activate(elem) {
    let self = this;

    $(elem).addClass(self.settings.className);
  }

  /**
   *
   * Hide
   *
   * @param elem Object element to close
   */

  deactivate(elem) {
    let self = this;

    $(elem).removeClass(self.settings.className);
  }

  /**
   *
   * Toggle
   *
   * @param elem Object element to toggle
   */

  toggle(elem) {
    let self = this;

    if ($(elem).hasClass(self.settings.className)) {
      self.deactivate(elem);
    } else {
      self.activate(elem);
    }
  }

  /**
   *
   * Bind UI Actions
   *
   */

  bindUIActions() {
    let self = this;

    $(self.settings.container).on('change', self.settings.input, function (event) {
      let elem = $(this).closest(self.settings.item);
      if ($(this).is(':checked')) {
        self.activate(elem);
        if ($(this).attr('type') === 'radio') { // if it's a radio button, it must update the classes on all the other elements
          $(self.settings.container).find(self.settings.input).not(this).trigger('change');
        }
      } else {
        self.deactivate(elem);
      }
    });

    if (self.settings.optionCta === true) {
      $(self.settings.container).on('click', self.settings.cta, function (event) {
        event.preventDefault();
        let elem = $(this).closest(self.settings.item);
        let input = $(elem).find(self.settings.input);
        if ($(input).is(':checked')) {
          $(input).prop('checked', false);
        } else {
          $(input).prop('checked', true);
        }
        $(input).trigger('change');
      });
    }

  }

}


module.exports = ActiveCheck;
