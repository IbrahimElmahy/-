'use strict';

var _extend = require('lodash-compat/object/extend'),
    mapTypesModule = {};

mapTypesModule.addMapType = function(mapTypeId, options) {
  var mapType;

  if (typeof options.getTileUrl === 'function') {
    options.tileSize = options.tileSize || new google.maps.Size(256, 256);

    mapType = new google.maps.ImageMapType(options);

    this.map.mapTypes.set(mapTypeId, mapType);

    if (GMaps.trigger) {
      GMaps.trigger('map_type_added', this, mapType);
    }
  }
  else {
    throw 'getTileUrl function required.';
  }
};

mapTypesModule.addOverlayMapType = function(options) {
  var overlayMapTypeIndex = options.index;

  delete options.index;

  if (typeof options.getTile === 'function') {
    if (overlayMapTypeIndex) {
      this.map.overlayMapTypes.insertAt(overlayMapTypeIndex, options);
    }
    else {
      this.map.overlayMapTypes.push(options);
    }

    if (GMaps.trigger) {
      GMaps.trigger('overlay_map_type_added', this, options);
    }
  }
  else {
    throw 'getTile function required.';
  }
};

mapTypesModule.removeOverlayMapType = function(overlayMapTypeIndex) {
  var overlayMapType = this.map.overlayMapTypes.removeAt(overlayMapTypeIndex);

  if (GMaps.trigger) {
    GMaps.trigger('overlay_map_type_removed', this, overlayMapType);
  }
};

mapTypesModule.removeOverlayMapTypes = function() {
  this.map.overlayMapTypes.clear();
};

if (window.GMaps) {
  GMaps.customEvents = GMaps.customEvents || [];
  GMaps.customEvents = GMaps.customEvents.concat([
    'map_type_added', 'overlay_map_type_added', 'overlay_map_type_removed'
  ]);

  _extend(GMaps.prototype, mapTypesModule);
}

module.exports = mapTypesModule;