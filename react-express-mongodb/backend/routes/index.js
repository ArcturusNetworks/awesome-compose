const express = require("express");
const serverResponses = require("../utils/helpers/responses");
const messages = require("../config/messages");
const { Device } = require("../models/devices/device");

const routes = (app) => {
  const router = express.Router();

  router.post("/devices", (req, res) => {
    const device = new Device({
      DUID: req.body.DUID,
      serviceName: req.body.serviceName
    });

    device
      .save()
      .then((result) => {
        serverResponses.sendSuccess(res, messages.SUCCESSFUL, result);
      })
      .catch((e) => {
        serverResponses.sendError(res, messages.BAD_REQUEST, e);
      });
  });

  router.get("/", (req, res) => {
    Device.find({}, { __v: 0 })
      .then((devices) => {
        serverResponses.sendSuccess(res, messages.SUCCESSFUL, devices);
      })
      .catch((e) => {
        serverResponses.sendError(res, messages.BAD_REQUEST, e);
      });
  });

  //it's a prefix before api it is useful when you have many modules and you want to
  //differentiate b/w each module you can use this technique
  app.use("/api", router);
};
module.exports = routes;
