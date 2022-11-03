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


class ClearInput {

  /**
   *
   * Constructor
   *
   * @param options Object List of settings
   */

  constructor(options = {}) {

    const defaults = {
      container: '.as--btn-clear',
      cta: '[data-js-clear-field]',
      className: 'as--not-empty',
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
    const self = this;
    //console.log('ClearInput : ', self.settings);


    $('body').on('input', self.settings.container + ' input', function () {
      //console.log('val : ', $(this).val());
      if($(this).val() !== '') {
        $(this).closest(self.settings.container).addClass(self.settings.className);
      } else {
        $(this).closest(self.settings.container).removeClass(self.settings.className);
      }
    });
    $('body').on('click', self.settings.cta, function () {
      $(this).closest(self.settings.container)
        .removeClass(self.settings.className)
        .find('input')
        .val('')
        .trigger('change')
        .trigger('focus');
    });
  }

}


module.exports = ClearInput;
