import React from "react";
import axios from "axios";
import client from './feathers';
import "./App.scss";
import DeviceList from "./components/DeviceList";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      devices: {},
    };
  }

  componentDidMount() {
    const stream = client.on('stream', (data) => {
      console.log(`stream: ${data}`);
    });
    const devices = client.service('devices');
    devices
      .find()
      .then((response) => {
        console.log(response)
        this.setState({
          devices: response
        })
      })
      .catch((e) => console.log("Error : ", e));

    devices.on('created', (device) => {
      this.state.devices.concat(device);
    })
  }

  render() {
    return (
      <div className="App container">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 offset-xs-0 offset-md-0">
              <h1 class="display-4">System Manager</h1>
              <p className="lead">List of devices currently registered on iotg.sipgear.net</p>
              <div className="text-left">
                <DeviceList devices={this.state.devices} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
