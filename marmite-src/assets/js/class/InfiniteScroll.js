/**
 *
 * InfiniteScroll
 * Generic class for infinite scroll comportment, with a button to load more
 *
 * @author mha
 */

class InfiniteScroll {

  /**
   *
   * Constructor
   *
   * @param options Object settings
   */

  constructor(options = {}) {

    const defaults = {
      container: '.list-infinite',
      pager: '.pager',
      maxScroll: 0,
      infscrSettings: {
        // display debug information
        //debug: true,*
        // automatically loads next page elements to fill the screen without scrolling
        //prefill: true,
        // paging selector (so it can hide it)
        navSelector: '.pager',
        // next page selector (so it can get the url of the next page to load)
        nextSelector: '.item-pager.type-next .cta-pager',
        // element selector (so it knows which elements to load)
        itemSelector: '.item-infinite',
        loading: {
          img: '',
          msgText: '<p class="msg-loading">Chargement...<p>',
          finishedMsg: '<p class="msg-finished">Il n\'y a plus de contenu &agrave; charger.</p>',
          // selecteur de la div qui recoit les infos "chargement..." ou "plus de contenu a charger"
          selector: '.msg-infscr'
        },
        // if there is an error or there is no other elements to load
        errorCallback: function () {
          $('.more-infscr').hide();
          $('.msg-infscr').hide();
          $('.finished-infscr').addClass('as--visible');
        }
      }
    };

    // merges the given options with the default ones to create a settings object

    // merges the infinitescroll options with the default ones to create a new object
    this.settings = $.extend({}, defaults, options);
    this.settings.infscrSettings = $.extend({}, defaults.infscrSettings, options.infscrSettings);

    // on init, it hasn't scrolled yet
    this.currentScroll = 0;

    // on init, it's on first page
    this.countPager = 1;

    this.totalPager = $(this.settings.pager).attr('data-total');
    if (typeof totalPager === 'undefined') { // if we can't get the total number of pages
      if ($('.item-pager').length > 1 || $(this.settings.pager).find('.wp-pagenavi').length > 0) {
        // if there is a paging, we arbitrarily fix the pages limit at 10
        this.totalPager = 10;
      } else {
        // if there is no paging, there is only 1 page
        this.totalPager = 1;
      }
    }

    this.initInfscr();

    // user events, ex: scroll hover click touch
    this.bindUIActions();
  }

  /**
   *
   * Init Infinitescroll
   *
   */

  initInfscr() {
    const self = this;

    $(self.settings.container).imagesLoaded(function () {
      $(self.settings.container).infinitescroll(
          self.settings.infscrSettings,
          function (newElements) {
            self.countPager++;
            self.currentScroll++;
            if (self.currentScroll > self.settings.maxScroll) {
              // affiche bouton "more" seulement s'il y a d'autres pages derriere
              if (self.countPager < self.settings.totalPager) {
                $('.more-infscr').show();
              } else {
                $('.more-infscr').hide();
              }
              $(self.settings.container).infinitescroll('pause');
            }

            // cache les nouveaux elements en attendant que leurs images soient chargees
            const $newElems = $(newElements).hide();

            $newElems.imagesLoaded(function () {
              $newElems.fadeIn();
            });
          });
      if (self.settings.maxScroll === 0) {
        $(self.settings.container).infinitescroll('unbind');
      }
    });

    // affiche bouton "more" seulement s'il y a d'autres pages
    if (self.totalPager > 1) {
      $('.more-infscr').show();
      $('.more-infscr').on('click', '.cta-more-infscr', function () {
        self.currentScroll = 0;
        // charge les elements de la page suivante
        $(self.settings.container).infinitescroll('retrieve');
      });
    }
    $(this.settings.pager).hide();
  }

  /**
   *
   * Bind UI Actions
   *
   */

  bindUIActions() {
    const self = this;
  }

}


module.exports = InfiniteScroll;
