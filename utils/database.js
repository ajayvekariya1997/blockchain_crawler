const mongoose = require("mongoose");

function initializeDB(){
    return new Promise((resolve, reject) => {
        try {
			const dbHost = process.env.DB_HOST;
			const dbPort = process.env.DB_PORT;
			const dbName = process.env.DB_NAME;

										// mongodb://host:port/database
										// mongodb://username:password@host:port/database
			const url = `mongodb://${dbHost}:${dbPort}/${dbName}`;

            const options = {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
            mongoose.connect(url, options);

            // on connect
            mongoose.connection.on("connected", () => {
                console.log("mongoose connected at >>", new Date());
                return resolve();
            });

            // on disconnect
            mongoose.connection.on("disconnected", () => {
                console.log("mongoose disconnected at >>", new Date());
				return reject();
            });

            // on error
            mongoose.connection.on("error", (error) => {
                console.log("mongoose connection error >>", error, " >> at >>", new Date()); 
				return reject(error);
            });
        } catch (error) {
            return reject(error);
        }
    })
}

module.exports = { initializeDB };
