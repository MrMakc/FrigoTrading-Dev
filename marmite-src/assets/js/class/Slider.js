/**
 *
 * Slider
 * Generic class for slider
 *
 * @author mha
 */

class Slider {

  /**
   *
   * Constructor
   *
   * @param options Object settings
   */

  constructor(options = {}) {

    let defaults = {
      container: '.slider',
      list: '.list-slider',
      item: '.item-slider',
      bxSettings: {},
      numSlides: 1,
      activeClassName: 'as--active',
      // placer les controls avant la liste dans le HTML
      optionControlsBefore: false
    };

    // fusionne les options renseignees avec celles par defaut pour creer l'objet settings
    this.settings = $.extend({}, defaults, options);

    this.slider = null;

    this.timerDisabled = null;

    let self = this;

    $(self.settings.container).find(self.settings.list).imagesLoaded( function () {
      self.reloadSlider();
    });

    this.bindUIActions();
  }

  /**
   *
   * Reload or init the slider
   *
   * @param numSlides Int total number of slides
   */

  reloadSlider(numSlides = this.settings.numSlides) {
    let self = this;

    let calculatedSettings = {
      minSlides: numSlides,
      maxSlides: numSlides,
      slideWidth: self.getWidth(numSlides),
      prevText: 'Précédent',
      nextText: 'Suivant',
      hideControlOnEnd: true,
      startText: 'Relancer le carrousel',
      stopText: 'Stopper le carrousel',
      autoControls: true,
      autoControlsCombine: true,
      autoHover: true,
      stopAutoOnClick: true,
      onSlideBefore: (current) => {
        self.onSlideBefore(current);
      },
      onSlideAfter: (current, oldIndex, newIndex) => {
        self.onSlideAfter(current, oldIndex, newIndex);
      },
      onSliderLoad: (currentIndex) => {
        self.onSliderLoad(currentIndex);
      }
    };

    // fusionne les options calculees avec celles renseignees par defaut pour creer l'objet currentSettings
    let currentSettings = $.extend({}, calculatedSettings, self.settings.bxSettings);

    // assigne le nouveau nombre aux settings
    self.settings.numSlides = numSlides;

    if (self.slider !== null) {
      if (typeof self.slider !== 'undefined') {
        if ($(self.settings.container).find(self.settings.item + ':not(.bx-clone)').length > numSlides) {
          self.slider.reloadSlider(currentSettings);
        } else {
          self.slider.destroySlider();
        }
      }
    } else {
      if ($(self.settings.container).find(self.settings.item).length > numSlides) {
        self.slider = $(self.settings.container).find(self.settings.list).bxSlider(currentSettings);
      }
    }
  }

  /**
   *
   * Redraw the slider (for example on resize)
   *
   */
  redrawSlider() {
    let self = this;

    if (self.slider !== null) {
      self.slider.redrawSlider();
    }
  }

  /**
   *
   * Slide before callback
   *
   * @param current Object current slide
   */

  onSlideBefore(current) {
    let self = this;

    self.removeActiveClass(current);
  }

  /**
   *
   * Slide after callback
   *
   * @param current Object current slide
   * @param oldIndex Int slide old index
   * @param newIndex Int slide new index
   */

  onSlideAfter(current, oldIndex, newIndex) {
    let self = this;

    self.setActiveClass(current);
    self.updateDisabled();
  }

  /**
   *
   * Fully loaded slider callback
   *
   * @param currentIndex Int current slide index
   */

  onSliderLoad(currentIndex) {
    let self = this;

    const controls = $(self.settings.container).find('.bx-controls');

    // si optionControlsBefore = true, mettre les controles avant bx-viewport dans la structure
    if (self.settings.optionControlsBefore === true) {
      const viewport = $(self.settings.container).find('.bx-viewport');
      $(controls).insertBefore(viewport);
    }

    self.removeActiveClass();

    const current = $(self.settings.container).find(self.settings.item + ':not(.bx-clone)').eq(currentIndex);
    self.setActiveClass(current);

    self.updateDisabled();

    if (self.timerDisabled !== null) {
      clearTimeout(self.timerDisabled);
    }
    // timeout pour laisser le temps a l'initialisation de bxSlider
    self.timerDisabled = setTimeout(function() {
      self.updateDisabled();

      // redraw pour recalculer la taille en cas de transition sur des elements a l'interieur
      self.redrawSlider();
    }, 500);

  }

  /**
   *
   * Bind UI Actions
   *
   */

  bindUIActions() {
    let self = this;

    // on (keyboard) focus inside slide, go to this slide
    $(self.settings.container).on('focusin', self.settings.item, function (event) {

      //event.preventDefault();
      const currentSlide = self.slider.getCurrentSlide();
      const index = $(this).index(self.settings.item + ':not(.bx-clone)');

      if (index !== currentSlide) {
        self.slider.goToSlide(index);
      }
      $('html, body').animate({
        scrollLeft:0
      }, 0);
    });
  }

  /**
   *
   * Calc width
   *
   * @param numSlides Int total number of slides
   */

  getWidth(numSlides = this.settings.numSlides) {
    let self = this;

    let width = $(self.settings.list).width() / numSlides;
    return width;
  }

  /**
   *
   * Set/remove disabled attribute on control buttons
   *
   */

  updateDisabled() {
    let self = this;

    const controls = $(self.settings.container).find('.bx-controls');

    $(controls).find('.disabled').attr('disabled', 'disabled');
    $(controls).find(':not(.disabled)').removeAttr('disabled');
  }

  /**
   *
   * Set active class on current slide
   *
   * @param elem Object current slide
   */

  setActiveClass(elem) {
    let self = this;

    $(elem).addClass(self.settings.activeClassName);
  }

  /**
   *
   * Remove active class on current slide
   *
   */

  removeActiveClass() {
    let self = this;
    $(self.settings.container).find(self.settings.item).removeClass(self.settings.activeClassName);
  }
}
