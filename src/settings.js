// import { config } from "dotenv";
const { config } = require("dotenv");
config();

module.exports = {
  PORT: process.env.port || 3003,
  PATH: {
    VIDEOS: "/videos",
    ALLDATA: "/testing/all-data",
  },
};
