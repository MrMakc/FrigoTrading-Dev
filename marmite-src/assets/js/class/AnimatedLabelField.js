/*global Tab*/
/*global Collapsible*/
/**
 *
 * TabSelect
 * Tab element via a pseudo-select
 *
 * @author sdi
 */

class AnimatedLabelField {
  /**
   *
   * Constructor
   *
   * @param options Object List of settings
   */

   constructor(options = {}) {

    const defaults = {
      container: '.field-animated',
      cta: 'input',
      className: 'as--focused'
    };

    // fusionne les options renseignees avec celles par defaut pour creer l'objet settings
    this.settings = $.extend({}, defaults, options);

    this.timer = null;

    // evenements par utilisateur ex scroll hover clic touch
    this.bindUIActions();
  }

  /**
   *
   * Show
   *
   * @param elem Object element to open
   */

  show(elem) {
    const self = this;

    $(elem).addClass(self.settings.className);
  }

  /**
   *
   * Hide
   *
   * @param elem Object element to close
   */

  hide(elem) {
    const self = this;

    $(elem).removeClass(self.settings.className);
  }

  /**
   *
   * Bind UI Actions
   *
   */

  bindUIActions() {


    const self = this;

      // check at load

      var intervalId = 0;
      var checkInputValue = function ($input) {
        var $field = $input.closest(self.settings.container);
        $field.addClass('no-transition');
        setTimeout(function () {
          var sValue = $input.val();
          if( sValue.trim() !== '' ) {
            const container = $field;
            self.show(container);
          }
          setTimeout(function () {
            $field.removeClass('no-transition');
          },100);
        },10);
      };

      var checkInputsValue = function () {
        $(self.settings.container + ' ' + self.settings.cta).each(function () {
          checkInputValue($(this));
        });
      };

      checkInputsValue();

      if (navigator.userAgent.toLowerCase().indexOf('chrome') >= 0) {
        intervalId = setInterval(function () { // << somehow  this does the trick!
          if ($(self.settings.container + ' ' + self.settings.cta + ':-webkit-autofill').length > 0) {
            clearInterval(intervalId);
            setTimeout(function () {
              checkInputsValue();
            },200);
          }
        }, 1);
      } else {
        setTimeout(function () {
          checkInputsValue();
        },1000);
      }

      $('body').on('focus', self.settings.container + ' ' + self.settings.cta,function(){
        const elem = event.target;
        const container = $(elem).closest(self.settings.container);
        self.show(container);
      });


      $('body').on('blur',self.settings.container + ' ' + self.settings.cta,function(){
        var sValue = $(this).val();
        if( sValue.trim() === '' ) {
          const elem = event.target;
          const container = $(elem).closest(self.settings.container);
          self.hide(container);
        }
      });
  }

}

module.exports = AnimatedLabelField;
