/**
 *
 * ValidForm
 * A litte class which provide form validation on the fly be-passing html5 validation
 *
 * @author Laurent GUITTON
 */

import store from '../_store';

class ValidForm {

  /**
   *
   * Constructor
   *
   * @param exemple String Exemple string
   */

  constructor(options = {}) {

    let defaults = {
      container: '.valid-form',
      fieldContainer: '.form-field',
      input: 'input[required],select[required],textarea[required]',
      validClass: 'as--valid',
      invalidClass: 'as--invalid',
      msgErrorClass: 'form-msg-error',
      submitBtn: '[submit]',
      resetBtn: '[reset]',
      defaultRequiredMsg: store.defaultRequiredMsg,
      defaultErrorMsg: store.defaultErrorMsg,
      defaultPwdErrorMsg: store.defaultPwdErrorMsg,
      validate: false
    };

    // fusionne les options renseignees avec celles par defaut pour creer l'objet settings
    this.settings = $.extend({}, defaults, options);

    // evenements par utilisateur ex scroll hover clic touch
    this.bindUIActions();
  }

  /**
   *
   * Show message
   *
   * @return void
   */

  formCheck(input, callback) {
    let self = this;
    let $inputElement = $('#' + input);
    let $inputParent = $inputElement.closest(self.settings.fieldContainer);
    let $inputErrorContainer;

    if ($('#' + input + '-error').length > 0) {
      $inputErrorContainer = $('#' + input + '-error');
    } else {
      $inputParent.append('<div class="' + self.settings.msgErrorClass + '" id="' + input + '-error" />');
      $inputErrorContainer = $('#' + input + '-error');
    }

    let requireMsg;
    if ($inputElement.attr('data-msg-required')) {
      requireMsg = $inputElement.attr('data-msg-required');
    } else {
      requireMsg = self.settings.defaultRequiredMsg;
    }
    let errorMsg;
    if ($inputElement.attr('data-msg-error')) {
      errorMsg = $inputElement.attr('data-msg-error');
    } else {
      errorMsg = self.settings.defaultErrorMsg;
    }

    $inputElement.attr('aria-invalid', !$inputElement[0].checkValidity());

    if ($inputElement.attr('data-pwd') === 'confirmation') {
      let password1 = $('[data-pwd="initial"]').val();
      let password2 = $inputElement.val();
      if (password2 !== password1 || !password2) {
        $inputParent.addClass(self.settings.invalidClass).removeClass(self.settings.validClass);
        if (!$inputErrorContainer.length) {
          $inputParent.append('<div class="' + self.settings.msgErrorClass + '" id="' + input + '-error">' + self.settings.pwdmsgError + '</div>');
        }
      } else {
        $inputParent.addClass(self.settings.validClass).removeClass(self.settings.invalidClass);
        $inputErrorContainer.remove();
      }
    } else {
      if (!$inputElement[0].checkValidity()) { // Si checkValidity renvoie false : invalide

        if ($inputElement.val() === '') {
          $inputErrorContainer.html(requireMsg);
        } else {
          $inputErrorContainer.html(errorMsg);
        }

        $inputParent.addClass(self.settings.invalidClass).removeClass(self.settings.validClass);
        $inputElement.attr('aria-describedby', input + '-error');
      } else { // Si checkValidity renvoie true : valide
        if ($inputErrorContainer.length > 0) {
          $inputErrorContainer.html('');
        }
        $inputParent.addClass(self.settings.validClass).removeClass(self.settings.invalidClass);
        $inputElement.attr('aria-describedby', false);
        if (callback) {
          callback();
        }
      }
    }
  }


  /**
   *
   * Bind UI Actions
   *
   */

  bindUIActions() {
    let self = this;
    $('body').on('blur', self.settings.container + ' ' + self.settings.input, function () {
      self.formCheck(this.id);
    });


// On SUBMIT :

    $('.valid-form').on('submit', function (e) {
      $(self.settings.container).addClass('as--submited');
      const iLength = $(self.settings.input).length;
      $(self.settings.input).each(function (index) {
        self.formCheck($(this)[0].id);
        if (index >= iLength - 1) {
          const invalidInputs = $('[aria-invalid="true"]');
          if (invalidInputs.length > 0) {
            invalidInputs[0].focus();
          }else{
            self.settings.validate = true;
          }
        }

        $(this)[0].addEventListener('invalid', function (event) {
          event.preventDefault();
        });
      });

      if (!self.settings.validate) {
        return false;
      }
    });

// On RESET :
    /*$(self.settings.container).on('click', self.settings.resetBtn, function (e) {
      $(self.settings.container).classList.remove('as--submited');
      inputs.forEach(input => {
        let inputParent = input.closest('.form-field');
        //inputs[0].focus();
        inputParent.classList.remove('is-valid');
        inputParent.classList.remove('is-invalid');
      });
      let msgErrors = $('.form-msg-error');
      msgErrors.forEach(msgError => {
        msgError.parentNode.removeChild(msgError);
      });
    });*/

  }


}


module.exports = ValidForm;
