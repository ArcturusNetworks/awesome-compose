require("./config/config");

const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const moment = require('moment');
const mongoose = require("mongoose");
const service = require('feathers-mongoose');
const path = require("path");

const db = require("./db");
const iotg = require("./iotg");
const { Device } = require("./models/devices/device");

const app = express(feathers());


// Parse JSON
app.use(express.json());
// Config scket.io realtime APIs
app.configure(socketio());
// Enable REST services
app.configure(express.rest());
// Register services
app.use(express.errorHandler());
app.use(express.static(path.join(__dirname, "public")));

// New connections connect to stream channel
app.on('connection', conn => app.channel('stream').join(conn));
// Publish events to stream
app.publish(data => app.channel('stream'));

// Connect to MongoDB
db.connect(app);

// Connect to IoTG
app.on('db-ready', () => {
  Device.deleteMany({}, () => {
    console.log("Deleted all stored devices")
  })
  app.use('/devices', service({ Model: Device }));
  iotg.connect(app);
})

app.on('iotg-ready', () => {
  const PORT = process.env.PORT || 3030;
  app
    .listen(PORT)
    .on('listening', () => 
      console.log(`Realtime server running on ${PORT}`)
    );
})

// app
//  .service('devices')
//  .create({
//    duid: 'a5e68c9c-38b6-44e3-aca8-f161e31d3ed5',
//    serviceName: 'Site Controller',
//    time: moment().format('hh:mm:ss')
//  });