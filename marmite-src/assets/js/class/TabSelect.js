/*global Tab*/
/*global Collapsible*/
/**
 *
 * TabSelect
 * Tab element via a pseudo-select
 *
 * @author sdi
 */

class TabSelect extends Tab {
  /**
   *
   * Constructor
   *
   * @param options Object List of settings
   */

  constructor(options = {}) {
    const defaults = {
      selectSettings: {}
    };

    // fusionne les options renseignees avec celles par defaut pour creer l'objet settings
    const extendedOptions = $.extend({}, defaults, options);

    super(extendedOptions);

    const self = this;

    self.initCollapsible();

    $(self.settings.container).each(function() {
      self.updateTitle(this);
    });
  }

  /**
   *
   * Create the collapsible element to open/close
   *
   * @return void
   */

  initCollapsible() {
    const self = this;

    const calculatedSettings = {
      container: '.collapsible-tab',
      cta: '.cta-open-collapsible-tab',
      optionCloseAll: true, // to close all others when opens one
      optionCloseOnBody: true // to close all when click somewhere else
    };

    // fusionne les options calculees avec celles renseignees par defaut pour creer l'objet currentSettings
    const currentSettings = $.extend({}, calculatedSettings, self.settings.selectSettings);

    self.collapsible = new Collapsible(currentSettings);
  }

  /**
   *
   * Change the title with the name of the selected tab
   *
   * @return void
   */

  updateTitle(container) {
    const self = this;
    const activeItem = $(container).find(self.settings.item + '.' + self.settings.className);
    const title = $(activeItem).find(self.settings.cta).text();

    $(container).find(self.settings.selectSettings.cta).text(title);
  }

  /**
   *
   * Bind UI Actions
   *
   */

  bindUIActions() {
    super.bindUIActions();

    const self = this;

    $(self.settings.container).on('click', self.settings.cta, function () {
      const elem = $(this).closest(self.settings.container);
      self.updateTitle(elem);

      self.collapsible.hide(self.settings.selectSettings.container);
    });
  }

}


module.exports = TabSelect;
