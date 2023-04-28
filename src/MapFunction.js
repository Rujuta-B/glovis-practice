import React, { useState, useRef, useEffect } from "react";
import H from "@here/maps-api-for-javascript";
import onResize from "simple-element-resize-detector";

const Map = (props) => {
  const [map, setMap] = useState(null);
  const [timeout, setTimeout] = useState(null);
  const [latt, setLet] = useState("");
  const [long, setLong] = useState("");
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const { lat, lng, zoom } = props;
  let ref = useRef();
  const shouldLog = useRef(true);

  function addSVGMarkers(map) {
    //Create the svg mark-up
    var svgMarkup =
      '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">' +
      '<rect stroke="black" fill="${FILL}" x="1" y="1" width="22" height="22" />' +
      '<text x="12" y="18" font-size="12pt" font-family="Arial" font-weight="bold" ' +
      'text-anchor="middle" fill="${STROKE}" >A</text></svg>';
    // Add the first marker
    let bearsIcon = new H.map.Icon(
        svgMarkup.replace("${FILL}", "blue").replace("${STROKE}", "red")
      ),
      africa = new H.map.Marker(
        { lat: 11.8625, lng: -17.6166 }
        // { icon: bearsIcon }
      );
    map.addObject(africa);
    // Add the second marker.
    let cubsIcon = new H.map.Icon(
        svgMarkup.replace("${FILL}", "pink").replace("${STROKE}", "black")
      ),
      india = new H.map.Marker(
        { lat: 20.5937, lng: 78.9629 }
        // { icon: cubsIcon }
      );
    map.addObject(india);

    //add the third marker
    let abcIcon = new H.map.Icon(
        svgMarkup.replace("${FILL}", "white").replace("${STROKE}", "orange")
      ),
      australia = new H.map.Marker(
        { lat: -28.86944, lng: 153.04453 }
        // { icon: abcIcon }
      );
    map.addObject(australia);

    //group all markers
    let group = new H.map.Group();
    group.addObjects([africa, india, australia]);
    map.addObject(group);

    // get geo bounding box for the group and set it to the map
    map.getViewModel().setLookAtData({
      bounds: group.getBoundingBox(),
    });

    australia.addEventListener(
      "tap",
      function (evt) {
        // event target is the marker itself, group is a parent event target
        // for all objects that it contains
        console.log(evt);
        setIsOpenFilter(true);
        // var bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
        //   // read custom data
        //   content: evt.target.getData(),
        // });
        // // show info bubble
        // H.ui.addBubble(bubble);
      },
      false
    );
  }

  //tracking line from origin to destination
  const addPolylineToMap = (map) => {
    var lineString = new H.geo.LineString();

    lineString.pushPoint({ lat: 11.8625, lng: -17.6166 });
    lineString.pushPoint({ lat: 20.5937, lng: 78.9629 });
    lineString.pushPoint({ lat: -28.86944, lng: 153.04453 });
    // lineString.pushPoint({lat:52.5166, lng:13.3833});

    map.addObject(
      new H.map.Polyline(lineString, {
        style: { lineWidth: 5, lineColor: "red" },
      })
    );
  };

  //drop pin and get LAT and LONG
  const setUpClickListener = (map) => {
    // Attach an event listener to map display
    // obtain the coordinates and display in an alert box.
    map.addEventListener("tap", function (evt) {
      var coord = map.screenToGeo(
        evt.currentPointer.viewportX,
        evt.currentPointer.viewportY
      );
      dynamicPin(coord.lat, coord.lng, map);
      setLet(coord.lat);
      setLong(coord.lng);

      //   console.log(
      //     "Clicked at " +
      //       Math.abs(coord.lat.toFixed(4)) +
      //       (coord.lat > 0 ? "N" : "S") +
      //       " " +
      //       Math.abs(coord.lng.toFixed(4)) +
      //       (coord.lng > 0 ? "E" : "W")
      //   );
    });
  };
  const dynamicPin = (latt, long, map) => {
    let svgMarkup = `<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">' +
      '<rect stroke="black" fill="pink" x="1" y="1" width="22" height="22" />' +
      '<text x="12" y="18" font-size="12pt" font-family="Arial" font-weight="bold" ' +
      'text-anchor="middle" fill="black" >${10}</text></svg>`;

    var manualMarkerIcon = new H.map.Icon(
        svgMarkup.replace("${FILL}", "pink").replace("${STROKE}", "black")
      ),
      manualMarker = new H.map.Marker(
        { lat: latt, lng: long },
        { icon: manualMarkerIcon }
      );
    map.addObject(manualMarker);
  };

  useEffect(() => {
    if (shouldLog.current) {
      if (!map) {
        shouldLog.current = false;
        console.log("herer");
        // instantiate a platform, default layers and a map as usual
        const platform = new H.service.Platform({
          apikey: "KhMSKvQ8SQplClcz_4wM0f0BU0GBuuXqxXlF57a4OOY",
        });

        const layers = platform.createDefaultLayers();
        console.log("layers ----->", layers);
        const map = new H.Map(ref.current, layers.raster.terrain.map, {
          pixelRatio: window.devicePixelRatio || 1,
          center: { lat: 0, lng: 0 },
          zoom: 1,
        });
        // onResize(ref.current, () => {
        //   map.getViewPort().resize();
        // });

        //make map draggable
        new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

        setMap(map);
        addSVGMarkers(map);
        addPolylineToMap(map);
        // setUpClickListener(map);
      }
    }
    // if (map) {
    //   clearTimeout(timeout);
    //   setTimeout(() => {
    //     map.setZoom(zoom);
    //     map.setCenter({ lat, lng });
    //   }, 100);
    // }
  }, []);
  console.log(latt, long);
  return (
    <>
      <div
        style={{ position: "relative", width: "1000", height: "1000px" }}
        ref={ref}
      />
      {isOpenFilter && (
        <div
          style={{
            position: "absolute",
            width: "400px",
            height: "200px",
            backgroundColor: "blue",
          }}
        ></div>
      )}
    </>
  );
};

export default Map;
