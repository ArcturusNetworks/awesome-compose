import React from "react";

export default class DeviceList extends React.Component {
  constructor(props) {
    super(props);
  }

  renderDevices(devices) {
    return (
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th scope="col" rowSpan="2">Service Type</th>
            <th scope="col" rowSpan="2">Service Name</th>
            <th scope="col" rowSpan="2">DUID</th>
            <th scope="col" rowSpan="1" colSpan="3" className="text-center">Firmware</th>
            <th scope="col" rowSpan="1" colSpan="2" className="text-center">IP Addresses</th>
          </tr>
          <tr>
            <th>P0</th>
            <th>P1</th>
            <th>P2</th>
            <th>Public</th>
            <th>Internal</th>
          </tr>
        </thead>
        <tbody>
        {devices.map((device, i) => (
          <tr>
            <td><span className="badge badge-success">Registrar</span></td> 
            <td><span className="lead">{device.serviceName}</span></td> 
            <td><span className="text-monospace">{device.DUID}</span></td> 
            <td>{device.sysP0Ver}</td> 
            <td>{device.sysP1Ver}</td> 
            <td>{device.sysP2Ver}</td> 
            <td>{device.IPAddr0}</td> 
            <td>{device.IPAddr1}</td> 
          </tr>
        ))}
        </tbody>
      </table>
    );
  }

  render() {
    let { devices } = this.props;
    return devices.length > 0 ? (
      this.renderDevices(devices)
    ) : (
      <div className="alert alert-primary" role="alert">
        No Devices to display
      </div>
    );
  }
}
