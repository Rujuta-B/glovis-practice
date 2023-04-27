import React from "react";
import Map from "./Map";
import MapPosition from "./MapPosition";
import MapFunction from "./MapFunction";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 0,
      lat: 0,
      lng: 0,
    };
  }

  handleInputChange = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  render() {
    const { zoom, lat, lng } = this.state;
    return (
      <div className="App">
        <MapFunction />
        {/* <MapPosition
          lat={lat}
          lng={lng}
          onChange={this.handleInputChange}
          zoom={zoom}
        /> */}
      </div>
    );
  }
}
