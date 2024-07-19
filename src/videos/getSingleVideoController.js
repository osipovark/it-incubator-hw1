const db = require("../db/db");

exports.getSingleVideoController = (req, res) => {
  const video = db.videos.find((v) => v.id === +req.params.id);
  if (video) {
    res.status(200).send(video);
  } else {
    res.sendStatus(404);
  }
};
