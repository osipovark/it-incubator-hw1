const db = require("../db/db");

exports.getAllVideosController = (req, res) => {
  const videos = db.videos;
  res.status(200).send(videos);
};
