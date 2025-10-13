# gmaps.map_types

gmaps.js module to create custom map types.

## Install

For using with bundlers (as Browserify or Webpack):

`npm install gmaps.map_types --save`

Before `require()` this module you need to `require('gmaps.core')`.

For using directly in the browser, download the `gmaps.map_types.js` (or `gmaps.map_types.min.js`) in `dist`.

## Usage

You need to register a `<script>` tag with the Google Maps JavaScript API, then import gmaps.core.

Every Google Maps map needs a container (`<div id="map"></div>` in this demo), which needs to have width and height, and be visible (without `display: none`, for example):

```
<!DOCTYPE html>
<html>
<head>
  <title>Test</title>
  <script src="http://maps.google.com/maps/api/js?sensor=true"></script>
  <script src="gmaps.core.js"></script>
  <script src="gmaps.map_types.js"></script>
  <style type="text/css">
    #map {
      width: 400px;
      height: 400px;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = new GMaps({
      el : '#map',
      lat: -12.0433,
      lng: -77.0283,
      zoom: 12,
      mapTypeControlOptions: {
        mapTypeIds : ['hybrid', 'roadmap', 'satellite', 'terrain', 'osm']
      }
    });

    map.addMapType('osm', {
      getTileUrl: function(coord, zoom) {
        return 'https://a.tile.openstreetmap.org/' + zoom + '/' + coord.x + '/' + coord.y + '.png';
      },
      tileSize: new google.maps.Size(256, 256),
      name: 'OpenStreetMap',
      maxZoom: 18
    });
  </script>
</body>
</html>
```

For more examples you can check the tests in this repo.

## Documentation

### `addMapType(mapTypeId, options)`

Add a new map type into the `mapTypes` property of the map. This map type must have a unique identifier (`mapTypeId`) and have a `getTileUrl` method.

To show the new map type in the map types list you need to add the new `mapTypeId` into the `mapTypeIds` array, in the `mapTypeControlOptions`, in the GMaps constructor:


```
  new GMaps({
    // ...
    mapTypeControlOptions: {
      mapTypeIds : ['hybrid', 'roadmap', 'satellite', 'terrain', myMapTypeId]
    }
  });
```

The `options` object must have a `getTileUrl` method, and accepts all the options from the [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/reference#ImageMapTypeOptions).

### `addOverlayMapType(options)`

Add a new overlay map type into the `overlayMapTypes` property of the map. The main difference between a map type and an overlay map type is that an overlay map type is shown above the selected map type.

The `options` object must have a `getTile` method, and should contain:

* `index` (number): The index of the overlay map type in the `overlayMapTypes` array. If is not defined, the overlay map type will be added at the end of the list.

Also, the `options` object accepts all the options from the [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/reference#MapType).

### `removeOverlayMapType(overlayMapTypeIndex)`

Remove a previously added overlay map type, using the same `index` from `addOverlayMapType`.

### `removeOverlayMapTypes()`

Remove all the overlay map types.

---

### Events

The following methods trigger custom events. You need to add the `gmaps.events` module before using this module to work with those events:

| Method | Event |
| ------ | ----- |
| `addMapType` | `map_type_added` |
| `addOverlayMapType` | `overlay_map_type_added` |
| `removeOverlayMapType` | `overlay_map_type_removed` |

## Changelog

For pre 0.5.0 versions, check [gmaps.js changelog](https://github.com/hpneo/gmaps#changelog)

### 0.5.0

* Node module format (CommonJS)

## License

MIT License. Copyright 2015 Gustavo Leon. http://github.com/hpneo

Permission is hereby granted, free of charge, to any
person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the
Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice
shall be included in all copies or substantial portions of
the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.