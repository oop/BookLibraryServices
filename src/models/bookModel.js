const userModel = require('./userModel');

async function getAllBooks() {
    const payload = await global
        .db
        .collection('books')
        .aggregate([
            { $match: {} },
            {
                $project: {
                    id: '$_id',
                    name: '$name',
                    score: 1,
                    _id: 0
                }
            }
        ])
        .toArray();
    if (!payload) return [];
    return payload;
}

async function getBook(id) {
    const payload = await global
        .db
        .collection('books')
        .aggregate([
            {
                $match: {
                    _id: id
                }
            },
            {
                $lookup: {
                    from: "ownership",
                    let: { "id": "$bookId" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$returned", 1] } } },
                        { $project: { score: 1, _id: 0 } }
                    ],
                    as: "scores"
                }
            }
        ])
        .toArray();
    if (!payload || payload.length === 0) return false;
    let avgScore = payload[0].scores.map(s => s.score);
    if(avgScore.length > 0) {
        avgScore = Number((avgScore.reduce((a, b) => a + b) / avgScore.length).toFixed(1));
    } else {
        avgScore = 0;
    }
    const { name, _id } = payload[0];
    dummyPayload = {
        id: _id,
        name,
        score: avgScore
    }
    if (!dummyPayload) return [];
    return dummyPayload;
}

async function createBook(name) {
    const payload = await global
        .db
        .collection('books')
        .insertOne({
            name
        });
    if (payload && payload.insertedCount > 0) return payload.insertedId;
    return false;
}

async function borrowBook(u_id, b_id) {
    const user = await userModel.getUser(u_id);
    if (!user) return false;
    const book = await getBook(b_id);
    if (!book) return false;
    const { ObjectID } = global.mongoTypes;

    const payload = await global
        .db
        .collection('ownership')
        .updateOne(
            { bookId: ObjectID(book.id), userId: ObjectID(user.userInfo.id) }
            , {
                $set: {
                    bookId: ObjectID(book.id),
                    userId: ObjectID(user.userInfo.id),
                    score: 0,
                    returned: 0
                }
            }, { upsert: true })
    if (!payload) return false;
    return true;
}

async function returnBook(u_id, b_id, score) {
    const user = await userModel.getUser(u_id);
    if (!user) return false;
    const book = await getBook(b_id);
    if (!book) return false;
    const { ObjectID } = global.mongoTypes;

    const payload = await global
        .db
        .collection('ownership')
        .updateOne(
            { bookId: ObjectID(book.id), userId: ObjectID(user.userInfo.id) }
            , {
                $set: {
                    bookId: ObjectID(book.id),
                    userId: ObjectID(user.userInfo.id),
                    score,
                    returned: 1,
                } 
            })
    if (!payload) return false;
    return true;
}

module.exports = {
    getAllBooks,
    getBook,
    createBook,
    borrowBook,
    returnBook,
}