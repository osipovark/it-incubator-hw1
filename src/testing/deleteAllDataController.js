const db = require("../db/db");

exports.deleteAllDataController = (req, res) => {
  for (const prop of Object.getOwnPropertyNames(db)) {
    delete db[prop];
  }
  res.sendStatus(204);
};
