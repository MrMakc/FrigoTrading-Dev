/**
 *
 * Cookies
 * Generic class for cookies elements
 *
 * @author efr
 */


class Cookies {

  /**
   *
   * Constructor
   *
   * @param options Object List of settings
   */

  constructor(options = {}) {

    const defaults = {
    };

    // fusionne les options renseignees avec celles par defaut pour creer l'objet settings
    this.settings = $.extend({}, defaults, options);

  }

  /**
   *
   * set Cookie
   */

  setCookie(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    const expires = 'expires='+ d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  }

  /**
   *
   * delete Cookie
   */

  deleteCookie(cname) {
    document.cookie = cname + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
    console.log('deleteCookie');
  }

  /**
   *
   * get Cookie
   */

  getCookie(cname) {
    const name = cname + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }



}


module.exports = Cookies;
