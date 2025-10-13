describe("Map types", function() {
  var mapWithMapTypes;

  beforeEach(function() {
    mapWithMapTypes = mapWithMapTypes || new GMaps({
      el : '#map_types',
      lat: -12.0433,
      lng: -77.0283,
      zoom: 12,
      mapTypeControlOptions: {
        mapTypeIds : ['hybrid', 'roadmap', 'satellite', 'terrain', 'osm', 'cloudmade']
      }
    });
  });

  describe("OpenStreetMap Map Type", function() {
    beforeEach(function() {
      mapWithMapTypes.addMapType('osm', {
        getTileUrl: function(coord, zoom) {
          return 'http://tile.openstreetmap.org/' + zoom + '/' + coord.x + '/' + coord.y + '.png';
        },
        tileSize: new google.maps.Size(256, 256),
        name: 'OpenStreetMap',
        maxZoom: 18
      });
    });

    it("should be added in the current map", function() {
      expect(mapWithMapTypes.map.mapTypes.get('osm')).toExist();
      expect(mapWithMapTypes.map.mapTypes.get('osm').name).toEqual('OpenStreetMap');
    });
  });
});

describe("Overlay map types", function() {
  var mapWithMapTypes;

  beforeEach(function() {
    mapWithMapTypes = mapWithMapTypes || new GMaps({
      el : '#map_types',
      lat: -12.0433,
      lng: -77.0283,
      zoom: 12
    });
  });

  it("should be added in the current map", function() {
    var getTile = function(coord, zoom, ownerDocument) {
      var div = ownerDocument.createElement('div');
      
      div.innerHTML = coord;
      div.style.width = this.tileSize.width + 'px';
      div.style.height = this.tileSize.height + 'px';
      div.style.background = 'rgba(250, 250, 250, 0.55)';
      div.style.fontFamily = 'Monaco, Andale Mono, Courier New, monospace';
      div.style.fontSize = '10';
      div.style.fontWeight = 'bolder';
      div.style.border = 'dotted 1px #aaa';
      div.style.textAlign = 'center';
      div.style.lineHeight = this.tileSize.height + 'px';
      
      return div;
    };

    mapWithMapTypes.addOverlayMapType({
      index: 0,
      tileSize: new google.maps.Size(256, 256),
      getTile: getTile
    });

    expect(mapWithMapTypes.map.overlayMapTypes.getLength()).toEqual(1);
  });

  it("should be removed in the current map", function() {
    mapWithMapTypes.removeOverlayMapType(0);
    
    expect(mapWithMapTypes.map.overlayMapTypes.getLength()).toEqual(0);
  });
});