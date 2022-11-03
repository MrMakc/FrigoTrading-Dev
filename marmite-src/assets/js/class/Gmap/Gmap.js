//import GmapMarker from './GmapMarker';
import store from '../_store';
import InfoBox from './GmapInfoBox';


/**
 *
 * Gmap
 * Generic class for gmap elements
 *
 * @author EFR
 */

class Gmap {

  /**
   *
   * Constructor
   *
   * @param options Object settings
   */

  constructor(options = {}) {
    // l'objet map jquery est obligatoire pour toutes les gmap
    // donc si il n'existe pas on ne fait rien
    let _self = this;

    if (typeof options.$map !== 'object') {
      return;
    } else {
      _self.$map = options.$map;
    }

    let defaults = {
      zoom: 5,
      center: {
        lat: 46.227638,
        lng: 2.213749000000007
      },
      makers: null
    };


    // markers
    _self.aAvailableMarkersType = store.aAvailableMarkersType;

    // default infoWindow
    _self.infoWindow = new google.maps.InfoWindow();
    // custom infoBox

    _self.infoBoxOptions = {};

    // common options fot all infoBox
    _self.infoBoxOptions.common = {
      disableAutoPan: false,
      alignBottom: true,
      maxWidth: 0,
      maxHeight: '400px',
      closeBoxMargin: '0',
      //closeBoxURL: store.sRootPath+'images/common/gmap/btn_close.png',
      isHidden: false,
      pane: 'floatPane',
      enableEventPropagation: false,
      boxClass: 'infoBox',
      infoBoxClearance: new google.maps.Size(55, 35), // marge gauche et droite , marge haut et bas par rapport aux bords de la gmap
      pixelOffset: new google.maps.Size(-105, -45) // (largeur de l'infobox + bordure)/2 , décalage par rapport au bas du marker
    };

    // options for default infoBox
    _self.infoBoxOptions.default = $.extend({}, _self.infoBoxOptions.common, {
      boxClass: 'infoBox default',
    });

    // options for other infoBox
    _self.infoBoxOptions.other = $.extend({}, _self.infoBoxOptions.common, {
      boxClass: 'infoBox other',
      pixelOffset: new google.maps.Size(-105, -50) // (largeur de l'infobox + bordure)/2 , décalage par rapport au bas du marker

    });
    _self.infoBox = new InfoBox();

    // fusionne les options renseignees avec celles par defaut pour creer l'objet settings
    _self.settings = $.extend({}, defaults, options);

    // get id map
    _self.id = _self.$map.attr('id');

    // set random id if undefined to always have unique id
    if( typeof _self.id === 'undefined' ) {
      _self.id = 'gmap' + Math.round(Math.random()*10000000000);
      _self.$map.attr({id: _self.id});
    }
    //console.log('Gmap : ', _self.id);

    //add 'html' map options
    if(typeof _self.$map.data('gmap-options') === 'object') {
      console.log('gmap-option : ', _self.$map.data('gmap-options'));
      $.extend(_self.settings, _self.$map.data('gmap-options'));
    }

    // init map
    _self.map = new google.maps.Map(document.getElementById(_self.id), _self.settings);


    //markers
    _self.markers = null;
    console.log('_self.settings.markers : ', typeof _self.settings.markers);
    if( typeof _self.settings.markers === 'object' ) {

      _self.markers = _self.settings.markers;

      // set bound if more than one marker
      _self.markersBounds = Object.keys(_self.markers).length > 1 ? new google.maps.LatLngBounds() : null;
      $.each(_self.markers, function( idMarker, marker ){
        console.log(idMarker + ': ', marker);
        const oMarkerOptions = {
          title: marker.title,
          position: new google.maps.LatLng(marker.latlng.lat, marker.latlng.lng),
          map: _self.map,
          content: typeof marker.content === 'string' ?  marker.content : null,
          infoWindowOpened: typeof marker.infoWindowOpened === 'boolean' ?  marker.infoWindowOpened : false,
          infoBox: typeof marker.infoBox === 'string' && typeof _self.infoBoxOptions[marker.infoBox] === 'object' ?  marker.infoBox : null,
          openInfoBox: function () {
            if(this.infoBox === null) {
              _self.infoWindow.setContent(this.content);
              _self.infoWindow.open(this.map, this);
            } else {
              _self.infoBox.setOptions(_self.infoBoxOptions[this.infoBox]);
              _self.infoBox.setContent(this.content);
              _self.infoBox.open(this.map, this);
            }
          }
        };
        if(typeof marker.type === 'string' && $.inArray( marker.type, _self.aAvailableMarkersType) !== -1 ) {
          console.log('custom marker : ', marker.type);
          $.extend(oMarkerOptions, {
            icon: store.sRootPath + store.sMarkersPath + marker.type,
          });
        }
        if (_self.markersBounds !== null ) {
          _self.markersBounds.extend(oMarkerOptions.position);
        }


        marker.gmarker = new google.maps.Marker(oMarkerOptions);

        if (oMarkerOptions.content !== null ) {

          marker.gmarker.addListener('click', function(e) {
            this.openInfoBox();
          });

          if(oMarkerOptions.infoWindowOpened === true) {
            marker.gmarker.openInfoBox();
          }
        }
      });
      if (_self.markersBounds !== null ) {
        _self.map.fitBounds(_self.markersBounds);
      }
    }


    _self.bindUIActions();

  }

  /**
   *
   * Bind UI Actions
   *
   */

  bindUIActions() {

    /*--- variables ---*/
    let _self = this;
  }
}


module.exports = Gmap;
