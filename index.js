                                        // require global variables
require("dotenv").config({ path: __dirname + "/.env" });

const databaseUtil = require("./utils/database");
                                        // mongodb connection
databaseUtil.initializeDB().then(() => {
                                        // execute script
    const syncScript = require("./scripts/sync");
    syncScript.init();
}).catch(error => {
    console.log("mongodb connection error >> ", error);
});
