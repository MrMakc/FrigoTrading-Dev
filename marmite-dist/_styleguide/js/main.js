(function ($, window, document, undefined) {
    'use strict';

    $(function () {

        /* Set Nav state from localStorage
         ========================================================================== */
        if (localStorage && localStorage.getItem('styleguide-nav-state')) {
            var sgnav = localStorage.getItem('styleguide-nav-state');
            if (sgnav == 1) {
                $('.sg-body').addClass('sg-nav-is-opened');
            } else {
                $('.sg-body').removeClass('sg-nav-is-opened');
            }
            setTimeout(function () {
                $('.sg-body').addClass('has-transition');
                $(window).trigger('resize');
            }, 100);
        }


        /* Nav show/hide
         ========================================================================== */
        $('.sg-nav-trigger').on('click', function () {
            console.log('sg-nav-trigger');
            $('.sg-body').toggleClass('sg-nav-is-opened sg-nav-mobile-is-opened');
            //set localstorage
            if ($('.sg-body').hasClass('sg-nav-is-opened')) {
                localStorage.setItem('styleguide-nav-state', 1);
            } else {
                localStorage.setItem('styleguide-nav-state', 0);
            }
            setTimeout(function () {
                $(window).trigger('resize');
            }, 500);
        })


        /* Nav accordion
         ========================================================================== */
        $('.sg-nav span').on('click', function () {
            $(this).toggleClass('is-opened').next().slideToggle();
        })


        /* Nav auto Scrolling
         ========================================================================== */
        $('.sg-nav a[href^="#"]').on('click', function (e) {
            e.preventDefault();
            var scrollOffset = -60,
                target = $(this).attr('href'),
                scrollPosition = $(target).offset().top + scrollOffset;
            document.location.hash = target;
            $('html,body').scrollTop(scrollPosition);
        });

        $('#sgAddValidationForm').on('change', function(){
          if($(this).is(':checked')){
            $('#formSG').addClass('valid-form');
          }else{
            $('#formSG').removeClass('valid-form');
          }
        });

        /* XrayHTML
         ========================================================================== */
        if ($("[data-xrayhtml]").length) {
            //Prism
            $("[data-xrayhtml]").find("code").addClass("language-markup");
            Prism.highlightAll();

            //Show/hide Code
            $('.xrayhtml .snippet').append("<span class='sg-toggleCode'></span>");
            $('.sg-toggleCode').on('click', function () {
                $(this).toggleClass('is-opened').parent().next().slideToggle();
            })

        }
      (function(){
        if (typeof self === 'undefined' || !self.Prism || !self.document) {
          return;
        }

        if (!Prism.plugins.toolbar) {
          console.warn('Copy to Clipboard plugin loaded before Toolbar plugin.');

          return;
        }

        var ClipboardJS = window.ClipboardJS || undefined;

        if (!ClipboardJS && typeof require === 'function') {
          ClipboardJS = require('clipboard');
        }

        var callbacks = [];

        if (!ClipboardJS) {
          var script = document.createElement('script');
          var head = document.querySelector('head');

          script.onload = function() {
            ClipboardJS = window.ClipboardJS;

            if (ClipboardJS) {
              while (callbacks.length) {
                callbacks.pop()();
              }
            }
          };

          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js';
          head.appendChild(script);
        }
        var linkCopy = document.createElement('a');

        function registerClipboard() {
          var clip = new ClipboardJS(linkCopy, {
            'text': function () {
              return env.code;
            }
          });

          clip.on('success', function() {
            linkCopy.textContent = 'Copied!';

            resetText();
          });
          clip.on('error', function () {
            linkCopy.textContent = 'Press Ctrl+C to copy';

            resetText();
          });
        }

        function resetText() {
          setTimeout(function () {
            linkCopy.textContent = 'Copy';
          }, 5000);
        }

        Prism.plugins.toolbar.registerButton('copy-to-clipboard', function (env) {
          linkCopy.textContent = 'Copy';

          if (!ClipboardJS) {
            callbacks.push(registerClipboard);
          } else {
            registerClipboard();
          }

          return linkCopy;


        });
      })();


        /* Markdown viewer
         ========================================================================== */
        var converter = new Showdown.converter(),
            jqxhr,
            sMdFile,
            $mdViewer;

        $(".md-viewer").each(function () {
            $mdViewer = $(this);
            sMdFile = $mdViewer.data('file');
            jqxhr =
                $.ajax({
                    async: false, //Make ajax requests synchronously = wait for the previous to finish
                    url: sMdFile,
                    data: 'text'
                })
                    .done(function (data) {
                        var ret = converter.makeHtml(data);
                        $mdViewer.html(ret);
                    })
        });


        /* Render list page / popin
         ========================================================================== */
        $('.sg-index-ul[data-list]').each(function () {
            var $list = $(this);
            var list = $list.data('list');
            console.log(list);
            var tpl = $list.find('template').html();
            var directory = '../' + list + '/';
            // get auto-generated page
            $.ajax({url: "../"+list+"/"+list+".json"}).then(function (url) {
                url.forEach(function (url) {
                    $list.append(tpl.split('%%pageUrl%%').join(directory+url).split('%%pageName%%').join(url));
                });
            });
        });

      new ClipboardJS('.btn-copy');

    });

})(jQuery, window, document);
