const config = require('./config');
const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;

/**
 * @function Initializing
 * @description Making DB connection and removing old test data.
 */
module.exports = (async () => {
    const dbName = config.DB;
    const client = new MongoClient(config.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        //start db connection
        await client.connect();

        //global db objects
        global.db = client.db(dbName);

        await global.db.collection('users').deleteMany({});
        await global.db.collection('books').deleteMany({});
        await global.db.collection('ownership').deleteMany({});
        process.exit();
    } catch (err) {
        //close connection if anything goes bad
        //await db.close();
        console.log(err.stack);
    }
})();