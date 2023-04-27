import React from "react";
import H from "@here/maps-api-for-javascript";
import onResize from "simple-element-resize-detector";

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    // the reference to the container
    this.ref = React.createRef();
    // reference to the map
    this.map = null;
    this.state = { 
      lat: "", 
      long: "",
      isOpenFilter: false
    };
  }

  handleOpenModal = () => {
    this.setState({isOpenFilter: true})
  }

  addSVGMarkers = (map) => {
    //Create the svg mark-up
    var svgMarkup =
      '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">' +
      '<rect stroke="black" fill="${FILL}" x="1" y="1" width="22" height="22" />' +
      '<text x="12" y="18" font-size="12pt" font-family="Arial" font-weight="bold" ' +
      'text-anchor="middle" fill="${STROKE}" >C</text></svg>';
    // Add the first marker
    var bearsIcon = new H.map.Icon(
        svgMarkup.replace("${FILL}", "blue").replace("${STROKE}", "red")
      ),
      bearsMarker = new H.map.Marker(
        { lat: 11.8625, lng: -17.6166 },
        { icon: bearsIcon }
      );
    map.addObject(bearsMarker);
    // Add the second marker.
    var cubsIcon = new H.map.Icon(
        svgMarkup.replace("${FILL}", "pink").replace("${STROKE}", "black")
      ),
      cubsMarker = new H.map.Marker(
        { lat: 20.5937, lng: 78.9629 },
        { icon: cubsIcon }
      );
    map.addObject(cubsMarker);

    //add the third marker
    var abcIcon = new H.map.Icon(
        svgMarkup.replace("${FILL}", "white").replace("${STROKE}", "orange")
      ),
      abcMarker = new H.map.Marker(
        { lat: -28.86944, lng: 153.04453 },
        { icon: abcIcon }
      );
    map.addObject(abcMarker);

    abcMarker.addEventListener(
      "tap",
      function (evt){
        // event target is the marker itself, group is a parent event target
        // for all objects that it contains
        this.handleOpenModal()
        // var bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
        //   // read custom data
        //   content: evt.target.getData(),
        // });
        // // show info bubble
        // H.ui.addBubble(bubble);
      },
      false
    );

    //
    var manualMarkerIcon = new H.map.Icon(
        svgMarkup.replace("${FILL}", "pink").replace("${STROKE}", "black")
      ),
      manualMarker = new H.map.Marker(
        { lat: this.state.lat, lng: this.state.long },
        { icon: manualMarkerIcon }
      );
    map.addObject(manualMarker);
  }

  addPolylineToMap(map) {
    var lineString = new H.geo.LineString();

    lineString.pushPoint({ lat: 11.8625, lng: -17.6166 });
    lineString.pushPoint({ lat: 20.5937, lng: 78.9629 });
    lineString.pushPoint({ lat: -28.86944, lng: 153.04453 });
    // lineString.pushPoint({lat:52.5166, lng:13.3833});

    map.addObject(new H.map.Polyline(lineString, { style: { lineWidth: 4 } }));
  }

  setUpClickListener(map) {
    // Attach an event listener to map display
    // obtain the coordinates and display in an alert box.
    map.addEventListener("tap", function (evt) {
      var coord = map.screenToGeo(
        evt.currentPointer.viewportX,
        evt.currentPointer.viewportY
      );
      this.setState({ lat: coord.lat, long: coord.lng });

      console.log(
        "Clicked at " +
          Math.abs(coord.lat.toFixed(4)) +
          (coord.lat > 0 ? "N" : "S") +
          " " +
          Math.abs(coord.lng.toFixed(4)) +
          (coord.lng > 0 ? "E" : "W")
      );
    });
  }

  componentDidMount() {
    if (!this.map) {
      const platform = new H.service.Platform({
        apikey: "KhMSKvQ8SQplClcz_4wM0f0BU0GBuuXqxXlF57a4OOY",
      });
      const layers = platform.createDefaultLayers();
      const map = new H.Map(this.ref.current, layers.vector.normal.map, {
        pixelRatio: window.devicePixelRatio,
        center: { lat: 0, lng: 0 },
        zoom: 2,
      });

      //make map draggable
      new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

      // onResize(this.ref.current, () => {
      //   map.getViewPort().resize();
      // });
      this.map = map;
      this.addSVGMarkers(map);
      this.addPolylineToMap(map);
      // this.setUpClickListener(map);
    }
  }

  componentDidUpdate() {
    const { lat, lng, zoom } = this.props;

    if (this.map) {
      // prevent the unnecessary map updates by debouncing the
      // setZoom and setCenter calls
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.map.setZoom(zoom);
        this.map.setCenter({ lat, lng });
      }, 100);
    }
  }

  render() {
    return <div style={{ width: "100%", height: "1000px" }} ref={this.ref} />;
  }
}
