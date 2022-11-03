import store from '../_store';
/**
 *
 * BannerMessages
 * Generic class for messages elements : cookies / warning / news
 *
 * @author efr
 */


class BannerMessages {

  /**
   *
   * Constructor
   *
   * @param {Object} options - List of settings
   * @param {string} options.project - Project name in camelCase witch prefix the coockie name
   * @param {number} options.caping - Speccify the number of time the banner display
   * @param {string} options.container - The selector of the banner
   */

  constructor(options = {}) {

    const defaults = {
      project: store.projectJsName,
      bannerName: '',
      hideJs: true, // if hideJs == true, hideClass is note needed
      hideClass: 'hide-banner', // class to animate the hide if hideJs = false
      hiddenClass: 'as--hidden', // class to remove when banner is hidden by default
      caping: 0,
      container: '.c-banner-messages',
      durationLife: 365+30,
      remove: true,
    };
    const privatesOptions = {
      reset: '.sg-banner-messages-reset', // /!\ use only in styles.twig
    };

    // fusionne les options renseignees avec celles par defaut pour creer l'objet settings
    this.settings = $.extend({}, defaults, options, privatesOptions);

    this.bindUI();
  }

  /**
   *
   * hideBanner
   */

  hideBanner($banner, accept) {
    //console.log('hideBanner : ', $banner);
    const self = this;
    const acceptCooky = accept || false;
    const settings = $banner.data('banner-settings');
    const bannerCookyName = settings.bannerCookyName;
    //console.log('$banner : ', $banner);
    //console.log('bannerCookyName : ', bannerCookyName);
    if(acceptCooky === true) {
      store.cookies.setCookie(bannerCookyName,true,settings.durationLife);
    }
    if(settings.hideJs === true) {
      $banner.animate({height:'hide', paddingTop: 0, paddingBottom: 0}, 350, function () {
        $banner.remove();
      });
    } else {
      $banner.addClass(settings.hideClass);
    }
    sessionStorage.setItem(bannerCookyName, 1);
    // show delete cookies button only in styles.twig
    $(self.settings.reset).parent('p').removeClass('as--hidden');
  }

  /**
   *
   * bindUI
   */

  bindUI() {
    const self = this;
    const aExistingCookies = [];
    /* Banner messages */
    $(self.settings.container).each(function () {
      const $banner = $(this);
      const projectBannerName = self.settings.project;
      const settings = $.extend({}, self.settings, $(this).data('banner-options') ||{});
      const bannerName = settings.bannerName;
      //console.log('settings : ', settings);
      if(bannerName === '') {
        console.error('BannerMessages - You must set the "bannerName" in data-banner-options - camelCase only');
      }
      const bannerCookyName = settings.bannerCookyName = projectBannerName + 'BannerMessages' + bannerName;
      const bannerCookyNameCaping = settings.bannerCookyNameCaping = projectBannerName + 'BannerMessagesCaping' + bannerName;
      aExistingCookies.push(bannerCookyName);
      if($.inArray(aExistingCookies, bannerCookyName) !== -1) {
        console.error('BannerMessages - "bannerName : ' + bannerName + '" is already set for an other banner - camelCase only');
      }

      let bannerMessages = store.cookies.getCookie(bannerCookyName);
      if(settings.hideJs === false) {
        $banner.addClass('has-transition');
      }
      if(typeof settings.caping === 'number' && settings.caping > 0) {
        let bannerMessagesCaping = sessionStorage.getItem(bannerCookyNameCaping);
        //console.log('bannerMessagesCaping : ', bannerMessagesCaping);
        if(bannerMessagesCaping !== null) {
          //console.log('setItem descrease');
          if (parseInt(bannerMessagesCaping,10) > 0) {
            bannerMessagesCaping--;
            sessionStorage.setItem(bannerCookyNameCaping, bannerMessagesCaping);
            //console.log('bannerMessagesCaping : ', bannerMessagesCaping);
          }
        }else {
          //console.log('setItem init');
          sessionStorage.setItem(bannerCookyNameCaping, settings.caping);
        }
        if(parseInt(bannerMessagesCaping,10) === 0) {
          //console.log('force');
          bannerMessages = '1';
        }
      }
      if(bannerMessages === '') {
        bannerMessages = sessionStorage.getItem(bannerCookyName) || '';
      }
      //console.log(bannerCookyName + 'BannerMessages : ', bannerMessages);
      if(bannerMessages !== '') {
        if(settings.hideJs === true) {
          $banner.remove();
        }
        $(self.settings.reset).parent('p').removeClass('as--hidden');
      } else {
        $banner.removeClass(self.settings.hiddenClass);
      }
      /*--- Banner messages : accept / close  ---*/
      /*$(settings.container + ' .js-banner-btn-close, ' + settings.container + ' .js-banner-btn-accept').data({
        container: settings.container,
        bannerCookyName: bannerCookyName
      });*/
      $banner.data({
        'banner-settings': settings
      });


      $banner.find('.js-banner-btn-close').on('click',function (event) {
        const $banner = $(this).closest('[data-banner-options]');
        self.hideBanner($banner);
      });
      $banner.find('.js-banner-btn-accept').on('click',function (event) {
        // name / value / duration day validity (13 month max)
        const $banner = $(this).closest('[data-banner-options]');
        self.hideBanner($banner, true);
      });

      if($(self.settings.reset).data('aBannersCookiesName')) {
        const aBannersCookiesName = $(self.settings.reset).data('aBannersCookiesName');
        const aBannersCookiesNameCaping = $(self.settings.reset).data('aBannersCookiesNameCaping');
        aBannersCookiesName.push(bannerCookyName);
        aBannersCookiesNameCaping.push(bannerCookyNameCaping);
        $(self.settings.reset).data('aBannersCookiesName', aBannersCookiesName);
        $(self.settings.reset).data('aBannersCookiesNameCaping', aBannersCookiesNameCaping);
      } else {
        $(self.settings.reset).data('aBannersCookiesName', [bannerCookyName]);
        $(self.settings.reset).data('aBannersCookiesNameCaping', [bannerCookyNameCaping]);
      }
    });
    // delete only available in styles.twig
    $('body').on('click',self.settings.reset,function (event) {
      event.stopPropagation();
      event.preventDefault();
      const aBannersCookiesName = $(self.settings.reset).data('aBannersCookiesName');
      const aBannersCookiesNameCaping = $(self.settings.reset).data('aBannersCookiesNameCaping');
      //console.log('aBannersCookiesName : ', aBannersCookiesName);
      //console.log('aBannersCookiesNameCaping : ', aBannersCookiesNameCaping);
      $.each(aBannersCookiesName,function (i,cookyName) {
        store.cookies.deleteCookie(cookyName);
        sessionStorage.removeItem(cookyName);
      });
      $.each(aBannersCookiesNameCaping, function (i,cookyName) {
        sessionStorage.removeItem(cookyName);
      });
      setTimeout(function () {
        window.location.href = 'components.html?r='+Math.ceil(Math.random()*1000000)+'#sg-banner-messages';
      },500);
    });
  }
}


module.exports = BannerMessages;
