const config = require('../config');
const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = express();
const port = config.PORT;

global.exceptionHandler = (ex, req, res) => {
    if (ex.errors && ex.errors.length > 0) {
        let errArr = [];
        for (let x in ex.errors) {
            errArr.push(ex.errors[x].msg) 
        }
        return res.status(500).json({ success: false, message: errArr.toString()});
    }
    return res.status(500).json({success: false, exception: ex.toString()});
}

/**
 * @function Initializing
 * @description Making DB connection and launching Express server.
 */
(async () => {
    const url = `${config.DB_URI}/${config.DB}`;
    const dbName = config.DB;
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        //start db connection
        await client.connect();

        //global db objects
        global.db = client.db(dbName);
        global.mongoTypes = {
            ObjectID: (i) => new mongodb.ObjectID(i),
            NumberInt: (i) => new mongodb.NumberInt(i)
        }

        //middlewares
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());

        //initialize routes
        routes(app);

        //listen
        app.listen(port, () => console.log(`Server started [${port}]`));
    } catch (err) {
        //close connection if anything goes bad
        //await db.close();
        console.log(err.stack);
    }
})();