'use strict';

/*global Modernizr */
import store from './_store';
import helpers from './_helpers';
import ResponsiveDebug from './class/ResponsiveDebug';
import Collapsible from './class/Collapsible';
import ScrollAnchor from './class/ScrollAnchor';
import ShowPassword from './class/ShowPassword';
import ClearInput from './class/ClearInput';
import DetectBrowser from './class/DetectBrowser';
import Cookies from './class/Cookies';
import BannerMessages from './class/BannerMessages';
import ValidForm from './class/ValidForm';
// import AnimatedLabelField from './class/AnimatedLabelField';
//import Colorbox from './class/Colorbox';


/**
 *
 * App
 * Main Controller
 *
 * @author acti
 * (vincegobelins, mha, efr, ...)
 */

const app = {
  init: function () {
    if($('.onlyMarmite').length) {
      console.warn('/!\\ If you see this warning message, it means that your are in Marmite Styleguide.\n' +
        'If it\'s not the case, it means that someone has forgot to remove the class .onlyMarmite in dev template\n' +
        'and many js dev code won\'t work properly. :\'(' );
    }

    this.bindUI();

    /*--- initialisation des tailles de viewport ---*/
    store.currentWidth = store.wWidth = helpers.viewport().width;
    store.currentHeight = store.wHeight = helpers.viewport().height;

    store.wScroll = $(window).scrollTop();

    let self = this;


    /*--- responsive-debug ---*/
    let responsiveDebug = new ResponsiveDebug();

    /*--- detectBrowser ---*/
    let detectBrowser = new DetectBrowser();

    /*--- Validation Form ---*/
    let validForm = new ValidForm({
      /*container: '.valid-form',
      fieldContainer: '.form-field',
      validClass: 'as--valid',
      invalidClass: 'as--invalid',
      msgErrorClass: 'form-msg-error',*/
    });

    /*--- cookies ---*/
    store.cookies = new Cookies();

    /*--- Banner messages (cookies consent / warnig / news...) ---*/
    const messagesBanner = new BannerMessages(/*{
      //caping: 3,
    }*/);

    /*--- Skip links ---*/
    let skip = new Collapsible({
      container: '.skip',
      cta: '.skip-cta',
      className: 'as--focused',
      optionHover: true
    });

    /*--- colorbox ---*/
    /*let colorbox = new Colorbox();*/

    /*--- animation scroll ---*/
    /* Use '.js-scroll-anchor' class to trigger smooth anchor scroll*/
    store.scrollAnchor = new ScrollAnchor();

    /*--- password ---*/
    let showPassword = new ShowPassword();

    /*--- clear input ---*/
    let clearInput = new ClearInput();

    /*--- animated label ---*/
    // let form = new AnimatedLabelField();

    // responsive
    self.onResize();
  },

  checkMobile: function () {
    if (/Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent)) {
      return true;
    }
  },

  onResize: function () {
    let self = this;
  },

  onScroll: function () {
    let self = this;
  },

  bindUI: function () {
    let self = this;

    if($('.js-item-inview').length){
      $('.js-item-inview').each(function (i, itemInview) {
        const $itemView = $(itemInview);
        $itemView.one('inview', function (event, isInView) {
          if (isInView) {
            $itemView.addClass('is-inview');
          }
        });
      });
    }

    if (Modernizr.mq('only all')) {
      $(window).on('resize', function () {
        store.wWidth = helpers.viewport().width;
        store.wHeight = helpers.viewport().height;
        if (store.currentHeight !== store.wHeight || store.currentWidth !== store.wWidth) {
          store.currentHeight = store.wHeight;
          store.currentWidth = store.wWidth;
          /*--- timer pour le redimensionnement d'ecran ---*/
          clearTimeout(store.timerResponsive);
          store.timerResponsive = setTimeout(self.onResize.bind(self), 300);
        }
      });
    }

    document.onreadystatechange = function () {
      if (document.readyState === 'complete') {
        self.onResize();
      }
    };

    /*--- fonctions au scroll ---*/
    $(window).on('scroll', function () {
      store.wScroll = $(window).scrollTop();

      self.onScroll();
    });

    if (window.matchMedia('(min-width: 896px)').matches) {
      const body = document.body;
      const scrollUp = 'scroll-up';
      const scrollDown = 'scroll-down';
      let lastScroll = 0;
      window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll <= 1) {
          body.classList.remove(scrollUp);
          return;
        }
        else if(currentScroll < 1){
          body.classList.remove(scrollDown);
        }

        if (currentScroll > lastScroll && !body.classList.contains(scrollDown)) {
          // down
          body.classList.remove(scrollUp);
          body.classList.add(scrollDown);
        } else if (currentScroll < lastScroll && body.classList.contains(scrollDown)) {
          // up
          body.classList.remove(scrollDown);
          body.classList.add(scrollUp);
        }
        lastScroll = currentScroll;
      });

      $('.burger-menu .switch-buttons p:first-of-type').addClass('is-active');
      $('.burger-menu .switch-content .switch-block:first-of-type').addClass('is-active');


      let timer;
      const $firstLevelItem = $('.first-lvl > li.has-submenu');

      $firstLevelItem.mouseenter(function () {
           clearTimeout(timer);
           $(this).addClass('is-hover').siblings('li').removeClass('is-hover');
          $('body').addClass('overlay-open');
        })
        .mouseleave(function () {
          timer = setTimeout(function(){
            $('body').removeClass('overlay-open');
            $firstLevelItem.removeClass('is-hover');
          },480);
        });

      $('.burger-menu').on('click', '.burger', function(){
        $('#nav-icon').toggleClass('open');
        $('.burger-menu').toggleClass('open');
        $('body').toggleClass('overlay-open');
      });

    }else{

      $('.burger-resp').on('click', '.burger', function(){
        $('#nav-icon').toggleClass('open');
        $('.burger-resp').toggleClass('open');
        $('.menu-resp').toggleClass('is-open');
      });

      $('.menu-resp .has-submenu>a').on('click', function(){
        $(this).next('.second-lvl-resp').addClass('is-open');
      });

      $('.close-resp').on('click', function(){
        $(this).closest('.second-lvl-resp').removeClass('is-open');
      });

      let height = $('.menu-resp').height();
      $('.second-lvl-resp').css('height',height-232+'px');

    }

    $('body').on('click', function(e) {
      if (!$(e.target).closest('#header').length ) {
        $('body').removeClass('overlay-open');
        $('.burger-menu').removeClass('open');
        $('#nav-icon').removeClass('open');
      }
    });

    if ($('.slider-multimedia').length) {
      if($('.overlay').length){
        $('.slider-multimedia .overlay').on('click', function(){
          $(this).fadeOut('slow');
        });
      }
      let $slider = $('.slider-multimedia');
      $slider.each(function(){
        $(this).find('.slider-wrap').slick({
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          fade: true,
          speed: 2000,
          dots: false,
          useCSS: true,
          arrow: true,
          adaptiveHeight: true,
          pauseOnHover: true,
          prevArrow: $(this).closest('.slider-multimedia').find('.slick-prev'),
          nextArrow: $(this).closest('.slider-multimedia').find('.slick-next'),
          responsive: [
            {
              breakpoint: 896,
              settings: {
                swipe:true,
                draggable:true,
                adaptiveHeight: true,
              }
            }
          ],
        });
      });
    }

    if ($('.slider-key-number').length) {
      let $slider = $('.slider-key-number');
      $slider.each(function(){
        $(this).find('.slider-wrap').slick({
          infinite: true,
          slidesToShow: 3,
          slidesToScroll: 1,
          speed: 1000,
          dots: false,
          arrow: true,
          pauseOnHover: true,
          prevArrow: $(this).closest('.slider-key-number').find('.slick-prev'),
          nextArrow: $(this).closest('.slider-key-number').find('.slick-next'),
          responsive: [
            {
              breakpoint: 1200,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                swipe:true,
                draggable:true,
              }
            }
          ],
        });
      });
    }

    if($('.switch-block').length){
      $('.switch-container').each(function () {
        let $this = $(this);
        $this.find('.switch-buttons').on('click', 'p', function(){
          $(this).addClass('is-active');
          $(this).siblings().removeClass('is-active');

          let buttonData = $(this).attr('data-switch');
          $this.find('.switch-block').each(function(){
            let blockData = $(this).attr('data-switch');
            if(buttonData === blockData){
              $(this).addClass('is-active');
              $(this).siblings().removeClass('is-active');
            }
          });
        });
      });
    }

    if ($('.slider-img').length) {
      let $slider = $('.slider-img');
      var $status = $('.counter-slider');

      $slider.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
        var i = (currentSlide ? currentSlide : 0) + 1;
        $status.html('<span class="current_slide">' + i + '</span><span class="slash">/</span><span class="total_slides">' + slick.slideCount + '</span>');
      });

      $slider.each(function(){
        $(this).find('.slider-wrap').slick({
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
          arrow: true,
          autoplay: true,
          autoplaySpeed: 8000,
          prevArrow: $(this).closest('.slider-img').siblings('.white-block, .triangle-counter').find('.slick-prev'),
          nextArrow: $(this).closest('.slider-img').siblings('.white-block, .triangle-counter').find('.slick-next'),
        });
      });
    }

    if ($('.slider-products').length) {
      let $slider = $('.slider-products');

      $slider.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
        let $SlickPrevActive = $('.slider-products .slick-active').prev().find('.slide').attr('data-categorie');
        let $SlickNextActive = $('.slider-products .slick-active').next().find('.slide').attr('data-categorie');
        $('.categorie-prev').text($SlickPrevActive);
        $('.categorie-next').text($SlickNextActive);
      });

      $slider.each(function(){
        $(this).find('.slider-wrap').slick({
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 8000,
          dots: false,
          arrow: true,
          prevArrow: $(this).closest('.full-block-home').find('.slick-prev'),
          nextArrow: $(this).closest('.full-block-home').find('.slick-next'),
        });
      });
    }

    if ($('.slider-partners').length) {
      let $slider = $('.slider-partners');

      $slider.each(function(){
        $(this).find('.slider-wrap').slick({
          infinite: true,
          slidesToShow: 3,
          slidesToScroll: 1,
          variableWidth: true,
          dots: false,
          arrow: true,
          draggable: true,
          prevArrow: $(this).closest('.block-partners').find('.slick-prev'),
          nextArrow: $(this).closest('.block-partners').find('.slick-next'),
          responsive: [
            {
              breakpoint: 1200,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                swipe:true,
                draggable:true,
                variableWidth: false,
              }
            }
          ],
        });
      });
    }

    if ($('.slider-actus').length) {
      let $slider = $('.slider-actus');

      $slider.each(function(){
        $(this).find('.slider-wrap').slick({
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          fade: true,
          speed: 900,
          dots: false,
          arrow: true,
          draggable: true,
          prevArrow: $(this).closest('.block-actus').find('.slick-prev'),
          nextArrow: $(this).closest('.block-actus').find('.slick-next'),
          responsive: [
            {
              breakpoint: 1200,
              settings: {
                adaptiveHeight: true,
                speed: 300,
              }
            }
          ],
        });
      });
    }

    // if($('.list-to-show').length){
    //   let countCards = 0;
    //   $('.card').each(function(){
    //     if(countCards < 6){
    //       $(this).addClass('is-visible');
    //       countCards++;
    //     }
    //   });
    //
    //   setTimeout(function() {
    //     if($('.card').length < 6){
    //       $('.see-more').css('display', 'none');
    //     }
    //   }, 100);
    //
    //   $('.list-to-show').on('click', '.see-more', function(){
    //     countCards = 0;
    //     $('.card:not(.is-visible)').each(function(){
    //       if(countCards < 6){
    //         $(this).addClass('is-visible');
    //         countCards++;
    //         setTimeout(function(){
    //           if($('.card').length === $('.is-visible').length){
    //             $('.see-more').fadeOut();
    //           }
    //         }, 100);
    //       }
    //     });
    //   });
    // }

    if($('.block-accordeon').length){
      $('.block-accordeon').each(function(){
        let thisAccordeon = $(this);
        thisAccordeon.on('click', 'input[type=checkbox]', function(){
          $(this).closest('.tab').siblings().find('input[type=checkbox]').prop('checked',false);
        });
      });
    }

    if ($('.pop-in-button').length) {
      $('.pop-in-button').on('click', function(){
        let target = $(this).attr('data-target');
        $(target).addClass('is-show');
        $('body').addClass('overlay-show');
      });
      $(document).mouseup(function(e){
        var container = $('.pop-in, .pop-in-button');
        if (!container.is(e.target) && container.has(e.target).length === 0) {
          container.removeClass('is-show');
          $('body').removeClass('overlay-show');
        }
      });
      $('.pop-in .close').on('click', function(){
        $('.pop-in').removeClass('is-show');
        $('body').removeClass('overlay-show');
      });
    }

    if ($('.slider-hexagone').length && window.matchMedia('(max-width: 1200px)').matches) {
      $('.slider-hexagone').each(function(){
        $(this).find('.slider-wrap').slick({
          slidesToShow: 1,
          centerMode: true,
          variableWidth: true,
          dots: true,
          arrow: false,
          swipeToSlide: true,
          swipe:true,
          initialSlide : 1,
        });
      });
    }

  }
};

app.init();

// global custom functions, they can be called from anywhere within the project (useful for the back-end developers)
let customFunctions = {
  // global custom function example
  // to call it from anywhere : global.customFunction.afterAjaxExample();
  /*afterAjaxExample: function() {
   helpers.resizeImg('.media-block-news');
   }*/
};
// exports the elements that need to be accessed from somewhere else (in the "global" standalone object, cf. gulpfile)
module.exports = customFunctions;
