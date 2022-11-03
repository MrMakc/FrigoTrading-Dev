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
class ShowPassword {

  /**
   *
   * Constructor
   *
   * @param options Object settings
   */

  constructor(options = {}) {

    let defaults = {
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

  show(elem) {
    let self = this;

    $(elem).addClass(self.settings.className);
    $(elem).find(self.settings.input).attr('type', 'text');
  }

  /**
   *
   * Hide
   *
   * @param elem Object element to hide
   */

  hide(elem) {
    let self = this;

    $(elem).removeClass(self.settings.className);
    $(elem).find(self.settings.input).attr('type', 'password');
  }

  /**
   *
   * Toggle
   *
   * @param elem Object element to toggle
   */

  toggle(elem) {
    let self = this;

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

  bindUIActions() {
    let self = this;

    $(self.settings.container).on('click', self.settings.cta, function () {
      let elem = $(this).closest(self.settings.container);
      self.toggle(elem);
    });
  }

}


module.exports = ShowPassword;
