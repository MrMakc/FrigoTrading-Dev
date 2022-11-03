'use strict';

/**
*
* Global helper functions
* They can be called from any JS Class, provided they are imported
*
* @author mha
*/

const helpers = {
    // get viewport size, without scrollbar
    // to call it from anywhere else than here : global.helpers.viewport() (ex :  global.helpers.viewport().width )
    viewport: function () {
        var e = window, a = 'inner';
        if (!('innerWidth' in window)) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        return {
            width: e[ a + 'Width' ],
            height: e[ a + 'Height' ]
        };
    }
};

module.exports = helpers;
