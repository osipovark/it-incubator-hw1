const db = require("../db/db");

exports.deleteSingleVideoController = (req, res) => {
  const videoIndex = db.videos.findIndex((v) => v.id === +req.params.id);

  if (videoIndex === -1) {
    console.log("404");
    res.sendStatus(404);
  } else {
    db.videos.splice(videoIndex, 1);
    res.sendStatus(204);
  }
};
