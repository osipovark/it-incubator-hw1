const db = require("../db/db");

exports.deleteAllDataController = (req, res) => {
  db = {};
  res.sendStatus(204);
};
