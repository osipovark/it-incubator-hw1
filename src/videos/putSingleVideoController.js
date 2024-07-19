const db = require("../db/db");

exports.putSingleVideoController = (req, res) => {
  const error = { errorsMessages: [] };

  const videoIndex = db.videos.findIndex((v) => v.id === +req.params.id);

  if (videoIndex === -1) {
    console.log("404");
    res.sendStatus(404);
  }

  const newVideo = { ...db.videos[videoIndex] };

  if (typeof req.body.title !== "string") {
    error.errorsMessages.push({
      message:
        "Value of field title for the new video is of an incorrect type. Please specify value of string type",
      field: "title",
    });
  } else if (req.body.title.length > 40) {
    error.errorsMessages.push({
      message:
        'Value of field "title" for the proposed new video exceeds the length of 40 characters',
      field: "title",
    });
  } else {
    newVideo.title = req.body.title;
  }

  if (typeof req.body.author !== "string") {
    error.errorsMessages.push({
      message:
        "Value of field author for the new video is of an incorrect type. Please specify value of string type",
      field: "author",
    });
  } else if (req.body.author.length > 20) {
    error.errorsMessages.push({
      message:
        'Value of field "author" for the proposed new video exceeds the length of 20 characters',
      field: "author",
    });
  } else {
    newVideo.author = req.body.author;
  }

  if (typeof req.body.canBeDownloaded === "boolean") {
    newVideo.canBeDownloaded = req.body.canBeDownloaded;
  } else if (req.body.canBeDownloaded === undefined) {
    newVideo.canBeDownloaded = false;
  } else {
    error.errorsMessages.push({
      message:
        "You have specified a value of incorrect type for canBeDownloaded field of the new video",
      field: "canBeDownloaded",
    });
  }

  if (!isNaN(req.body.minAgeRestriction)) {
    if (req.body.minAgeRestriction === null) {
      newVideo.minAgeRestriction = req.body.minAgeRestriction;
    } else if (
      Number.parseInt(req.body.minAgeRestriction) !==
      +req.body.minAgeRestriction
    ) {
      error.errorsMessages.push({
        message:
          "Value of minAgeRestriction field for the new video must be integer",
        field: "minAgeRestriction",
      });
    } else if (
      +req.body.minAgeRestriction > 18 ||
      +req.body.minAgeRestriction < 1
    ) {
      error.errorsMessages.push({
        message:
          "Value for minAgeRestriction field of the new video must not be less than 1 or greater than 18",
        field: "minAgeRestriction",
      });
    } else {
      newVideo.minAgeRestriction = req.body.minAgeRestriction;
    }
  } else if (req.body.minAgeRestriction !== undefined) {
    error.errorsMessages.push({
      message:
        "Value of minAgeRestriction field for the new video must be a number",
      field: "minAgeRestriction",
    });
  }

  if (
    req.body.publicationDate !== undefined &&
    isNaN(Date.parse(req.body.publicationDate))
  ) {
    error.errorsMessages.push({
      message:
        "Specified value for publicationDate field of the new video is not a valid date",
      field: "publicationDate",
    });
  } else if (
    Date.parse(req.body.publicationDate) < Date.parse(newVideo.createdAt)
  ) {
    error.errorsMessages.push({
      message: "Video could not have been created after it was published",
      field: "publicationDate",
    });
  } else {
    newVideo.publicationDate = new Date(req.body.publicationDate).toISOString();
  }

  if (Array.isArray(req.body.availableResolutions)) {
    if (req.body.availableResolutions.length !== 0) {
      const availableResolutions = [
        "P144",
        "P240",
        "P360",
        "P480",
        "P720",
        "P1080",
        "P1440",
        "P2160",
      ];

      const nonexistentResolutionIndex =
        req.body.availableResolutions.findIndex(
          (r) => !availableResolutions.includes(r)
        );

      if (nonexistentResolutionIndex === -1) {
        newVideo.availableResolutions = req.body.availableResolutions;
      } else {
        error.errorsMessages.push({
          message: `Invalid resolution format at index ${nonexistentResolutionIndex}`,
          field: "availableResolutions",
        });
      }
    } else {
      error.errorsMessages.push({
        message:
          "You have not specified any available resolutions for the new video",
        field: "availableResolutions",
      });
    }
  } else if (req.body.availableResolutions !== undefined) {
    error.errorsMessages.push({
      message:
        "Value for availableResolutions field of the new video must be an array",
      field: "availableResolutions",
    });
  }
  /*
  if (
    req.body.availableResolutions &&
    req.body.availableResolutions.length !== 0
  ) {
    const availableResolutions = [
      "P144",
      "P240",
      "P360",
      "P480",
      "P720",
      "P1080",
      "P1440",
      "P2160",
    ];

    const nonexistentResolutionIndex = req.body.availableResolutions.findIndex(
      (r) => !availableResolutions.includes(r)
    );

    if (nonexistentResolutionIndex === -1) {
      newVideo.availableResolutions = req.body.availableResolutions;
    } else {
      error.errorsMessages.push({
        message: `Invalid resolution format at index ${nonexistentResolutionIndex}`,
        field: "availableResolutions",
      });
    }
  } else {
    error.errorsMessages.push({
      message:
        "You have not specified any available resolutions for the new video",
      field: "availableResolutions",
    });
  }
  */

  /**********************************************************************************/

  if (error.errorsMessages.length === 0) {
    db.videos.splice(videoIndex, 1, newVideo);
    res.sendStatus(204);
  } else {
    res.status(400).send(error);
  }
};
