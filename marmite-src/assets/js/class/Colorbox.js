'use strict';

import store from '../_store';
/**
 *
 * Colorbox
 * Generic class for colorbox elements
 *
 * @author sdi
 */
class Colorbox {

  /**
   *
   * Constructor
   *
   * @param options Object settings
   */

  constructor(options = {}) {
    const self = this;

    const defaults = {
      colorboxClassName: '.colorbox',
      galleryClassName: '.colorbox-gal',
      pageClassName: '.colorbox-page',
      colorboxSettings: {},
      gallerySettings: {},
      pageSettings: {},
      resizeSettings: {},
      mq: store.mq3
    };

    self.settings = $.extend({}, defaults, options);

    self.opened = false;

    self.initColorbox();
    self.initGallery();
    self.initPage();
  }

  /**
   *
   * init basic colorbox
   *
   */
  initColorbox() {
    const self = this;

    const calculatedSettings = {
      maxWidth: '90%',
      maxHeight: '90%',
      close: 'Fermer',
      previous: 'Précédent',
      next: 'Suivant',
      fixed: true,
      onComplete: () => {
        self.onComplete();
      },
      onClosed: () => {
        self.onClosed();
      }
    };

    // fusionne les options calculees avec celles renseignees par defaut pour creer l'objet currentSettings
    const currentSettings = $.extend({}, calculatedSettings, self.settings.colorboxSettings);

    $(self.settings.colorboxClassName).colorbox(currentSettings);
  }

  /**
   *
   * init gallery colorbox
   *
   */
  initGallery() {
    const self = this;

    const calculatedSettings = {
      rel: self.settings.galleryClassName,
      maxWidth: '90%',
      maxHeight: '90%',
      close: 'Fermer',
      previous: 'Précédent',
      next: 'Suivant',
      current: false,
      fixed: true,
      onComplete: () => {
        self.onComplete();
      },
      onClosed: () => {
        self.onClosed();
      }
    };

    // fusionne les options calculees avec celles renseignees par defaut pour creer l'objet currentSettings
    const currentSettings = $.extend({}, self.settings.gallerySettings, calculatedSettings);

    $(self.settings.galleryClassName).colorbox(currentSettings);
  }

  /**
   *
   * init gallery colorbox
   *
   */
  initPage() {
    const self = this;

    const calculatedSettings = {
      href: function() {
        const url = $(this).attr('href') + ' #main-content';
        return url;
      },
      maxWidth: '90%',
      maxHeight: '90%',
      close: 'Fermer',
      previous: 'Précédent',
      next: 'Suivant',
      fixed: true,
      onComplete: () => {
        self.onComplete();
      },
      onClosed: () => {
        self.onClosed();
      }
    };

    // fusionne les options calculees avec celles renseignees par defaut pour creer l'objet currentSettings
    const currentSettings = $.extend({}, self.settings.pageSettings, calculatedSettings);

    $(self.settings.pageClassName).colorbox(currentSettings);
  }


  /**
   *
   * onComplete
   *
   */
  onComplete() {
    const self = this;

    self.opened = true;
  }


  /**
   *
   * onComplete
   *
   */
  onClosed() {
    const self = this;

    self.opened = false;
  }


  /**
   *
   * on resize
   *
   */
  onResize() {
    const self = this;

    if (window.matchMedia(self.settings.mq).matches) {
      $.colorbox.remove();
    } else {
      // if it was opened, re-opens the current colorbox at the good size
      if (typeof $.colorbox !== 'undefined' && self.opened === true) {
        $.colorbox.element()[0].click();
      }
    }
  }
}


module.exports = Colorbox;
