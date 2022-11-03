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

      $('.first-lvl > li')
        .mouseenter(function () {
          if ($(this).hasClass('has-submenu')) {
            $(this).addClass('is-hover');
            $(this).siblings().removeClass('is-hover');
            $('body').addClass('overlay-open');
          }

        })
        .mouseleave(function () {
          $('body').removeClass('overlay-open');
          $('.first-lvl li').removeClass('is-hover');
        });

      $('.burger-menu').on('click', '.burger', function(){
        $('#nav-icon').toggleClass('open');
        $('.burger-menu').toggleClass('open');
        $('body').toggleClass('overlay-open');

      });

    }else{


    }

    $('body').on('click', function(e) {
      if (!$(e.target).closest('#header').length ) {
        $('body').removeClass('overlay-open');
        $('.burger-menu').removeClass('open');
        $('#nav-icon').removeClass('open');
      }
    });

    if($('.switch-block').length){
      $('.switch-buttons').on('click', 'p', function(){
        $(this).addClass('is-active');
        $(this).siblings().removeClass('is-active');

        let buttonData = $(this).attr('data-switch');
        $('.switch-block').each(function(){
          let blockData = $(this).attr('data-switch');
          if(buttonData === blockData){
            $(this).addClass('is-active');
            $(this).siblings().removeClass('is-active');
            $(this).find('.cards').addClass('is-visible');
          }
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
          prevArrow: $(this).closest('.slider-img').siblings('.white-block, .triangle-counter').find('.slick-prev'),
          nextArrow: $(this).closest('.slider-img').siblings('.white-block, .triangle-counter').find('.slick-next'),
          responsive: [
            {
              breakpoint: 1400,
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
        });
      });
    }

    // if($('.list-to-show').length){
    //   let countCards = 0;
    //   $('.produit').each(function(){
    //     if(countCards < 6){
    //       $(this).addClass('is-visible');
    //       countCards++;
    //     }
    //   });
    //
    //   setTimeout(function() {
    //     if($('.produit').length < 6){
    //       $('.see-more').css('display', 'none');
    //     }
    //   }, 100);
    //
    //   $('.list-to-show').on('click', '.see-more', function(){
    //     countCards = 0;
    //     $('.produit:not(.is-visible)').each(function(){
    //       if(countCards < 6){
    //         $(this).addClass('is-visible');
    //         countCards++;
    //         setTimeout(function(){
    //           if($('.produit').length === $('.is-visible').length){
    //             $('.see-more').fadeOut();
    //           }
    //         }, 100);
    //       }
    //     });
    //   });
    // }

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

    if ($('.slider-hexagone').length && window.matchMedia('(max-width: 896px)').matches) {
      $('.slider-hexagone').each(function(){
        $(this).find('.slider-wrap').slick({
          infinite: false,
          slidesToShow: 3,
          slidesToScroll: 1,
          dots: false,
          arrow: false,
          variableWidth: true,
          responsive: [
            {
              breakpoint: 896,
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
