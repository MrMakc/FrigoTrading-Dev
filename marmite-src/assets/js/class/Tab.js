/**
 *
 * Tab
 * Generic class for tab elements
 *
 * @author sdi
 */

/**
 *
 * HTML minimal example template
 *
 * .tab
 *   .item-tab (optional .as--active)
 *     a.cta-tab[href="#tab1"]
 *   .item-tab
 *     a.cta-tab[href="#tab2"]
 *   #tab1.content-tab (optional .as--active)
 *   #tab2.content-tab
 */

class Tab {

  /**
   *
   * Constructor
   *
   * @param options Object List of settings
   */

  constructor(options = {}) {

    const defaults = {
      container: '.tab',
      item: '.item-tab',
      cta: '.cta-tab',
      contentTab: '.content-tab',
      object: '.active-tab',
      className: 'as--active'
    };

    // fusionne les options renseignees avec celles par defaut pour creer l'objet settings
    this.settings = $.extend({}, defaults, options);

    // evenements par utilisateur ex scroll hover clic touch
    this.bindUIActions();
    this.activeTab();
  }

  /**
   *
   * Active Tab
   *
   * @return void
   */

  activeTab() {
    const self = this;

    const activeItem = $(self.settings.item + '.' + self.settings.className);

    if($(activeItem).length > 0) {
      const widthItem = $(activeItem).outerWidth();
      const posItem = $(activeItem).position().left;
      const position = posItem + (widthItem/2);

      $(self.settings.object).css({left: position + 'px'});
    }

  }

  /**
   *
   * Bind UI Actions
   *
   */

  bindUIActions() {
    const self = this;

    $(self.settings.container).on('click', self.settings.cta, function(event) {
      event.preventDefault();

      const container = $(this).closest(self.settings.container);
      const elem =  $(this).closest(self.settings.item);
      const id = $(this).attr('href');

      const activeItem = $(container).find(self.settings.item + '.' + self.settings.className);
      const activeContent = $(container).find(self.settings.contentTab + '.' + self.settings.className);

      $(activeItem).removeClass(self.settings.className);
      $(elem).addClass(self.settings.className);

      $(activeContent).removeClass(self.settings.className);
      $(id).addClass(self.settings.className);

      self.activeTab();

    });

  }

}


module.exports = Tab;
