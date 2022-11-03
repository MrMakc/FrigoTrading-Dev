import store from '../_store';
/**
 *
 * ProgressBar
 * Generic class for progressbar elements
 *
 * @author sdi
 */

class ProgressBar {

  /**
   *
   * Constructor
   *
   * @param block String Block to display
   * @param className String Class active
   */

  constructor(options = {}) {

    const defaults = {
      progressBar: '.progress-bar',
      object: 'scale'
    };

    // fusionne les options renseignees avec celles par defaut pour creer l'objet settings
    this.settings = $.extend({}, defaults, options);

    // evenements par utilisateur ex scroll hover clic touch
    this.progress();
  }

  /**
   *
   * Progress Bar
   *
   */

  progress() {
    const self = this;

    const windowWidth = $(window).width();
    const windowHeight = $(window).height();
    const pageHeight = $('#body').height();
    const scale = store.wScroll / (pageHeight - windowHeight);


    $(self.settings.progressBar).css({
      '-webkit-transform': self.settings.object + '('+ scale +')',
      '-moz-transform': self.settings.object + '('+ scale +')',
      '-o-transform': self.settings.object + '('+ scale +')',
      'transform': self.settings.object + '('+ scale +')'
    });
  }
}


module.exports = ProgressBar;
