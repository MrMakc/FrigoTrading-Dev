'use strict';

/**
 *
 * Global variables
 * They can be called from any JS Class, provided they are imported
 *
 * @author mha
 */
function getdata(name) {
  return $('meta[property=' + JSON.stringify(name) + ']').attr('content');
}
const store = {
  projectJsName: getdata('app:site_data:projectJsName'),
  aAvailableMarkersType: getdata('app:site_data:aAvailableMarkersType'),
  sRootPath: getdata('app:site_data:sRootPath'),
  sMarkersPath: getdata('app:site_data:sMarkersPath'),
  defaultRequiredMsg: getdata('app:site_data:defaultRequiredMsg'),
  defaultErrorMsg: getdata('app:site_data:defaultErrorMsg'),
  defaultPwdErrorMsg: getdata('app:site_data:defaultPwdErrorMsg'),
  wWidth: 0,
  wHeight: 0,
  currentWidth: 0,
  currentHeight: 0,
  timerResponsive: 0,
  wScroll: 0,
  mq1: 'only screen and (max-width: 25em)',
  mq2: 'only screen and (max-width: 32em)',
  mq3: 'only screen and (max-width: 39em)',
  mq4: 'only screen and (max-width: 52em)',
  mq5: 'only screen and (max-width: 58em)',
  mq6: 'only screen and (max-width: 70em)',
  mq7: 'only screen and (max-width: 85em)'


};

module.exports = store;
