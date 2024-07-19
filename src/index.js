// import { app } from "./app";
// import { SETTINGS } from "./settings";
const app = require("./app");
const SETTINGS = require("./settings");

app.listen(SETTINGS.PORT, () => {
  console.log(`server started in port ${SETTINGS.PORT}`);
});
