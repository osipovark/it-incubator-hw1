const db = require("../db/db");

exports.postSingleVideoController = (req, res) => {
  if (JSON.stringify(db) === "{}") {
    db.videos = [];
  }
  const newVideo = {
    id: db.videos.length > 0 ? Math.max(...db.videos.map((v) => v.id)) + 1 : 0,
  };
  const error = { errorsMessages: [] };

  if (!req.body.title) {
    error.errorsMessages.push({
      message: "You have not specified a title for the new video",
      field: "title",
    });
  } else if (typeof req.body.title !== "string") {
    error.errorsMessages.push({
      message:
        "Value of field title for the new video is of an incorrect type. Please specify value of string type",
      field: "title",
    });
  } else if (req.body.title.length > 40) {
    error.errorsMessages.push({
      message:
        "Value of field title for the new video exceeds the length of 40 characters",
      field: "title",
    });
  } else {
    newVideo.title = req.body.title;
  }

  if (!req.body.author) {
    error.errorsMessages.push({
      message: "You have not specified an author for the new video",
      field: "author",
    });
  } else if (typeof req.body.author !== "string") {
    error.errorsMessages.push({
      message:
        "Value of field author for the new video is of an incorrect type. Please specify value of string type",
      field: "author",
    });
  } else if (req.body.author.length > 20) {
    error.errorsMessages.push({
      message:
        "Value of field author for the new video exceeds the length of 20 characters",
      field: "author",
    });
  } else {
    newVideo.author = req.body.author;
  }

  if (req.body.canBeDownloaded === undefined) {
    newVideo.canBeDownloaded = false;
  } else if (typeof req.body.canBeDownloaded === "boolean") {
    newVideo.canBeDownloaded = req.body.canBeDownloaded;
  } else {
    error.errorsMessages.push({
      message:
        "You have specified a value of incorrect type for canBeDownloaded field of the new video",
      field: "canBeDownloaded",
    });
  }

  if (req.body.minAgeRestriction == undefined) {
    newVideo.minAgeRestriction = null;
  } else if (isNaN(req.body.minAgeRestriction)) {
    error.errorsMessages.push({
      message:
        "Value that you have specified for minAgeRestriction field of the new video is of an incorrect type. Please specify value of number type.",
      field: "minAgeRestriction",
    });
  } else if (
    +req.body.minAgeRestriction < 1 ||
    +req.body.minAgeRestriction > 18
  ) {
    error.errorsMessages.push({
      message:
        "Value for minAgeRestriction field of the new video must not be less than 1 or greater than 18",
      field: "minAgeRestriction",
    });
  } else if (!Number.isInteger(+req.body.minAgeRestriction)) {
    error.errorsMessages.push({
      message:
        "Value for minAgeRestriction field of the new video must be an integer",
      field: "minAgeRestriction",
    });
  } else {
    newVideo.minAgeRestriction = +req.body.minAgeRestriction;
  }

  newVideo.createdAt = new Date();

  if (!req.body.publicationDate) {
    const publicationDate = new Date(newVideo.createdAt);
    publicationDate.setDate(publicationDate.getDate() + 1);
    newVideo.publicationDate = publicationDate;
  } else if (isNaN(Date.parse(req.body.publicationDate))) {
    error.errorsMessages.push({
      message:
        "Specified value for publicationDate field of the new video is not a valid date",
      field: "publicationDate",
    });
  } else if (Date.parse(req.body.publicationDate) < newVideo.createdAt) {
    error.errorsMessages.push({
      message: "Video could not have been created after it was published",
      field: "publicationDate",
    });
  } else {
    newVideo.publicationDate = new Date(req.body.publicationDate).toISOString();
  }

  newVideo.createdAt = newVideo.createdAt.toISOString();

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
    Array.isArray(req.body.availableResolutions) &&
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
  } else if (req.body.availableResolutions !== undefined) {
    error.errorsMessages.push({
      message:
        "You have not specified any available resolutions for the new video",
      field: "availableResolutions",
    });
  }
  */

  /**********************************************************************************/

  if (error.errorsMessages.length === 0) {
    db.videos.push(newVideo);
    res.status(201).send(newVideo);
  } else {
    res.status(400).send(error);
  }
};
