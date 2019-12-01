const config = require('../config');
const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const port = process.env.NODE_ENV === 'production' ? 80 : config.PORT;
const app = require('./server');

global.exceptionHandler = (ex, req, res) => {
    if (ex.errors && ex.errors.length > 0) {
        let errArr = [];
        for (let x in ex.errors) {
            errArr.push(ex.errors[x].msg)
        }
        return res.status(500).json({ success: false, message: errArr.toString() });
    }
    return res.status(500).json({ success: false, exception: ex.toString() });
}

/**
 * @function Initializing
 * @description Making DB connection and launching Express server.
 */
module.exports = (async () => {
    const dbName = config.DB;
    const client = new MongoClient(config.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        //start db connection
        await client.connect();

        //global db objects
        global.db = client.db(dbName);
        global.mongoTypes = {
            ObjectID: (i) => new mongodb.ObjectID(i)
        }


        if (process.env.NODE_ENV !== 'test') {
            //listen
            app.listen(port, () => console.log(`Server started [${port}]`));
        }
        return app;
    } catch (err) {
        //close connection if anything goes bad
        //await db.close();
        console.log(err.stack);
    }
})();