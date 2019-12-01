async function getAllUsers() {
    const payload = await global
        .db
        .collection('users')
        .aggregate([
            { $match: {} },
            {
                $project: {
                    id: '$_id',
                    name: '$name',
                    _id: 0
                }
            }
        ])
        .toArray();
    if (!payload) return [];
    return payload;
}

async function getUserBooks(id) {
    const { ObjectID } = global.mongoTypes;
    const payload = await global
        .db
        .collection('ownership')
        .aggregate([
            {
                $match: {
                    userId: ObjectID(id)
                }
            },
            {
                $lookup:
                {
                    from: 'books',
                    localField: 'bookId',
                    foreignField: '_id',
                    as: 'book'
                }
            }
        ])
        .toArray();
    if (!payload) return [];
    return payload;
}

async function getUser(id) {
    let aggr = {
        userInfo: {},
        borrowedBooks: [],
        returnedBooks: []
    };
    const userPayload = await global
        .db
        .collection('users')
        .aggregate([
            {
                $match: {
                    _id: id
                }
            },
            {
                $project: {
                    id: '$_id',
                    name: '$name',
                    _id: 0
                }
            }
        ])
        .toArray();        
    const bookPayload = await getUserBooks(id);
    aggr.userInfo = userPayload[0];
    for(let b in bookPayload) {
        if(bookPayload[b].returned === 0) aggr.borrowedBooks.push(bookPayload[b].book[0])
        if(bookPayload[b].returned === 1) aggr.returnedBooks.push(bookPayload[b].book[0])
    }
    if (!aggr) return [];
    return aggr;
}

async function createUser(name) {
    const payload = await global
        .db
        .collection('users')
        .insertOne({
            name
        });
    if(payload && payload.insertedCount > 0) return payload.insertedId;
    return false;
}

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    getUserBooks,
}