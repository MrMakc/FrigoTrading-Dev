import store from '../_store';
import helpers from '../_helpers';
/**
 *
 * Exemple
 * Exemple class
 *
 * @author vincegobelins
 */

class Exemple {

  /**
   *
   * Constructor
   *
   * @param exemple String Exemple string
   */

  constructor(message) {
    this.message = message;

    this.showMessage();
    this.bindUIActions();
  }

  /**
   *
   * Show message
   *
   * @return void
   */

  showMessage() {
    console.log(this.message);

    // send event to all app when message is showed
    const id = Math.floor(Math.random()*10);
    this.sendEvent(id);
  }

  /**
   *
   * Send event
   *
   * @param id Int Unique event id
   * @return void
   */

  sendEvent(id) {
    $('#body').trigger( 'messageDisplayed', id );
  }


  /**
   *
   * Bind UI Actions
   *
   */

  bindUIActions() {
    let self = this;
    $( '.exemple' ).on( 'click', function(e) {
      e.preventDefault();
      self.showMessage();
    });

  }


}


module.exports = Exemple;
