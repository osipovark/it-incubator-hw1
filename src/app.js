// import express from "express";
// import cors from "cors";
// import { SETTINGS } from "./settings";
const express = require("express");
const cors = require("cors");
const SETTINGS = require("./settings");
const db = require("./db/db");

const { getAllVideosController } = require("./videos/getAllVideosController");
const {
  getSingleVideoController,
} = require("./videos/getSingleVideoController");
const {
  postSingleVideoController,
} = require("./videos/postSingleVideoController");
const {
  putSingleVideoController,
} = require("./videos/putSingleVideoController");
const {
  deleteSingleVideoController,
} = require("./videos/deleteSingleVideoController");
const {
  deleteAllDataController,
} = require("./testing/deleteAllDataController");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ version: "1.0" });
});

app.get(SETTINGS.PATH.VIDEOS, getAllVideosController);
app.get(SETTINGS.PATH.VIDEOS + "/:id", getSingleVideoController);

app.post(SETTINGS.PATH.VIDEOS, postSingleVideoController);

app.put(SETTINGS.PATH.VIDEOS + "/:id", putSingleVideoController);

app.delete(SETTINGS.PATH.VIDEOS + "/:id", deleteSingleVideoController);

app.delete(SETTINGS.PATH.ALLDATA, deleteAllDataController);

module.exports = app;
