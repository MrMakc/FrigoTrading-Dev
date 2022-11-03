/**
 *
 * Collapsible
 * Generic class for collapsible elements
 *
 * @author mha
 */

/**
 *
 * HTML minimal example template
 *
 * (optional .other-collapsible)
 *   .collapsible (optional .as--open)
 *     .cta-open-collapsible (button or a)
 *     (optional .cta-close-collapsible)
 */

class Collapsible {

  /**
   *
   * Constructor
   *
   * @param options Object settings
   */

  constructor(options = {}) {

    const defaults = {
      container: '.collapsible',
      cta: '.cta-open-collapsible',
      className: 'as--open',
      optionCloseAll: false, // to close all others when opens one
      optionClose: false, // there is a button to close it
      ctaClose: '.cta-close-collapsible', // only if optionClose = true
      optionCloseOnBody: false, // to close all when click somewhere else,
      optionEsc: false, // to close with Escape key
      optionHover: false, // to open on hover / focus / touchstart
      optionFocusInput: false,
      inputContainer: '.input-text',
      delay: 300, // only if optionHover = true
      optionNoAria: false, // special option to avoid changing aria attributes (rare use cases),
      optionOtherContainer: true, // another container should change class at the same time
      otherContainer: '.other-collapsible', // only if optionOtherContainer = true
      optionFocusOnly: false // to open on focus / touchstart only
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

    if (self.settings.optionNoAria === false) {
      var cta = $(elem).find(self.settings.cta);
      if ($(cta).attr('aria-expanded')) {
        $(cta).attr('aria-expanded', 'true');
      }
    }
    if (self.settings.optionFocusInput === true) {
      setTimeout(function () {
        $(elem).find(self.settings.inputContainer).first().focus();
      }, 150);
    }

    if (self.settings.optionOtherContainer === true) {
      $(elem).closest(self.settings.otherContainer).addClass(self.settings.className);
    }

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

    if (self.settings.optionNoAria === false) {
      var cta = $(elem).find(self.settings.cta);
      if ($(cta).attr('aria-expanded')) {
        $(cta).attr('aria-expanded', 'false');
      }
    }

    if (self.settings.optionOtherContainer === true) {
      $(elem).closest(self.settings.otherContainer).removeClass(self.settings.className);
    }
  }

  /**
   *
   * Toggle
   *
   * @param elem Object element to toggle
   */

  toggle(elem) {
    const self = this;

    if ($(elem).hasClass(self.settings.className)) {
      self.hide(elem);
    } else {
      if (self.settings.optionCloseAll === true) {
        self.hide(self.settings.container);
      }
      self.show(elem);
    }
  }

  /**
   *
   * Bind UI Actions
   *
   */

  bindUIActions() {
    const self = this;

    if (self.settings.optionHover === true) {
      /*--- on hover / focus / touch ---*/
      $(self.settings.container).on('mouseenter focusin touchstart', function (event) {
        event.stopImmediatePropagation();
        window.clearTimeout(self.timerEnter);
        const elem = event.target;
        const container = $(elem).closest(self.settings.container);
        if (event.type === 'touchstart') {
          self.toggle(container);
        } else {
          if (event.type === 'mouseenter') {
            self.timerEnter = window.setTimeout(function () {
              self.hide(self.settings.container);
              self.show(container);
            }, self.settings.delay);
          } else {
            self.show(container);
          }
        }
      });
      $(self.settings.container).on('mouseleave focusout', function (event) {
        window.clearTimeout(self.timerLeave);
        const elem = this;
        if (event.type === 'mouseleave') {
          self.timerLeave = window.setTimeout(function () {
            self.hide(elem);
          }, self.settings.delay);
        } else {
          self.hide(elem);
        }
      });
    } else if (self.settings.optionFocusOnly === true) {
      $(self.settings.container).on(' focusin touchstart', function (event) {
        event.stopImmediatePropagation();
        window.clearTimeout(self.timer);
        const elem = event.target;
        const container = $(elem).closest(self.settings.container);
        if (event.type === 'touchstart') {
          self.toggle(container);
        } else {
          self.show(container);
        }
      });
      $(self.settings.container).on('focusout', function (event) {
        window.clearTimeout(self.timer);
        const elem = this;
        self.hide(elem);
      });
    } else {
      /*--- on click ---*/
      $(self.settings.container).on('click', self.settings.cta, function (event) {
        event.preventDefault();
        const elem = $(this);
        const container = $(elem).closest(self.settings.container);
        self.toggle(container);
      });
      $(self.settings.container).on('focusout', function (event) {
        var elem = $(this);
        var target = event.relatedTarget;
        if (self.settings.optionCloseAll === true) {
          if ($(target).closest(elem).length === 0) {
            setTimeout(function () { // fix click on siblings under
              self.hide(elem);
            },300);
          }
        }
      });
    }

    if (self.settings.optionClose === true) {
      $(self.settings.container).on('click', self.settings.ctaClose, function (event) {
        event.preventDefault();
        const container = $(this).closest(self.settings.container);
        self.hide(container);
      });
    }

    if (self.settings.optionCloseOnBody === true) {
      $('#body').on('click focusin', function (event) {
        const target = event.target;
        if ($(target).closest(self.settings.container).length === 0 && !$(target).is(self.settings.container)) {
          const elem = $(self.settings.container);
          self.hide(elem);
        }
      });
    }

    if (self.settings.optionEsc === true) {
      $(self.settings.container).on('keydown', 'input, button', function (event) {
        const key = event.which;
        if (key === 27) {
          const container = $(this).closest(self.settings.container);
          self.hide(container);
        }
      });
    }
  }

}


module.exports = Collapsible;
