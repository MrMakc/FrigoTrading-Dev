/**
 *
 * Autocomplete
 * Generic class for autocomplete for search form
 *
 * @author mha
 */

/**
 *
 * HTML minimal example template
 *
 * .form-search
 *  .input-text
 *  .autocomplete
 *    .item-autocomplete
 *      .block-autocomplete
 *  a.esc-form-search[tabindex="-1"]
 */

class Autocomplete {

  /**
   *
   * Constructor
   *
   * @param options Object settings
   */

  constructor(options = {}) {

    let defaults = {
      container: '.form-search',
      className: 'as--focused',
      input: '.input-text',
      containerAutocomplete: '.autocomplete',
      itemAutocomplete: '.item-autocomplete',
      blockAutocomplete: '.block-autocomplete',
      classNameActive: 'as--active',
      esc: '.esc-form-search'
    };

    // fusionne les options renseignees avec celles par defaut pour creer l'objet settings
    this.settings = $.extend({}, defaults, options);

    this.contentInput = '';

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
    let self = this;

    $(elem).addClass(self.settings.className);
  }

  /**
   *
   * Hide
   *
   * @param elem Object element to close
   */

  hide(elem) {
    let self = this;

    $(elem).removeClass(self.settings.className);
    $(elem).find(self.settings.containerAutocomplete).removeClass(self.settings.classNameActive);
  }

  /**
   *
   * KeepValue
   *
   * @param input Object input element for which to keep the value
   */

  keepValue(input) {
    const self = this;

    const text = $(input).val();
    self.contentInput = text;
  }

  /**
   *
   * ActiveAutocomplete
   *
   * @param container Object container
   * @param direction Integer next (1) or previous (-1) in the list
   */

  activeAutocomplete(container, direction = 1) {
    const self = this;

    const containerAutocomplete = $(container).find(self.settings.containerAutocomplete);
    let index = -1;
    const activeItem = $(containerAutocomplete).find(self.settings.itemAutocomplete + '.' + self.settings.classNameActive);
    if (activeItem.length > 0) {
      index = $(activeItem).index();
    }

    $(activeItem).removeClass(self.settings.classNameActive);

    const newIndex = index + direction;

    if (newIndex >= 0 && newIndex < $(containerAutocomplete).find(self.settings.itemAutocomplete).length) {
      // if new active element is within the autocomplete list, change the value of input and the highlight in the list

      const newItem = $(containerAutocomplete).find(self.settings.itemAutocomplete).eq(newIndex);

      $(newItem).addClass(self.settings.classNameActive);

      const text = $(newItem).find(self.settings.blockAutocomplete).text();
      $(container).find(self.settings.input).val(text);
    } else {
      // else, get back the typed value in the input kept in memory
      $(container).find(self.settings.input).val(self.contentInput);
    }
  }

  /**
   *
   * Bind UI Actions
   *
   */

  bindUIActions() {
    const self = this;


    // On focus in : open
    $(self.settings.container).on('focusin', function (event) {
      event.stopImmediatePropagation();
      const elem = event.target;
      const container = $(elem).closest(self.settings.container);
      self.show(container);
    });

    // On focus somewhere else : close
    $('#body').on('click focusin', function (event) {
      const target = event.target;
      if ($(target).closest(self.settings.container).length === 0 && !$(target).is(self.settings.container)) {
        const elem = $(self.settings.container);
        self.hide(elem);
      }
    });

    // On focus in input
    $(self.settings.container).on('focusin', self.settings.input, function (event) {
      self.keepValue(this);
    });

    // On keyboard interaction
    $(self.settings.container).on('keyup', self.settings.input, function (event) {
      const key = event.which;
      const target = event.target;
      const container = $(this).closest(self.settings.container);
      const input = $(container).find(self.settings.input);
      switch(key) {
          // On Escape key : close and put focus at the end
        case 27:
          $(container).find(self.settings.esc).focus();
          self.hide(container);
          break;
          // On Up arrow
        case 38:
          self.activeAutocomplete(container, -1);
          break;
          // On Down arrow
        case 40:
          self.activeAutocomplete(container);
          break;
          // On any other key : keep in memory the typed value
        default:
          self.keepValue(input);
          break;
      }
    });

    // On click in list of suggestions
    $(self.settings.container).on('click', self.settings.blockAutocomplete, function (event) {
      const elem = this;
      const container = $(elem).closest(self.settings.container);
      const containerAutocomplete = $(container).find(self.settings.containerAutocomplete);
      const input = $(container).find(self.settings.input);
      const activeItem = $(containerAutocomplete).find(self.settings.itemAutocomplete + '.' + self.settings.classNameActive);

      $(activeItem).removeClass(self.settings.classNameActive);

      const newItem = $(elem).closest(self.settings.itemAutocomplete);

      $(newItem).addClass(self.settings.classNameActive);

      const text = $(elem).text();
      $(input).val(text);

      $(input).focus();

      $(containerAutocomplete).removeClass(self.settings.classNameActive);
    });

  }

}


module.exports = Autocomplete;
