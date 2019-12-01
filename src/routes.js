const { SCORE_LIMIT } = require('../config');
const { check } = require('express-validator');
const requireDir = require('require-dir');
const controllers = requireDir('./controllers');

module.exports = (app) => {
    app.get('/users', controllers.user.getAll);
    app.get('/users/:id', check('id').exists().isMongoId().withMessage('user id is incorrect'), controllers.user.get);
    app.post('/users', check('name').exists().isLength({ min: 3, max: 25 }).withMessage('user name is incorrect'), controllers.user.create);

    app.get('/books', controllers.book.getAll);
    app.get('/books/:id', check('id').exists().isMongoId().withMessage('book id is incorrect'), controllers.book.get);
    app.post('/books', check('name').exists().isLength({ min: 3, max: 25 }).withMessage('book name is incorrect'), controllers.book.create);

    app.post('/users/:u_id/borrow/:b_id',
        [
            check('u_id').exists().isMongoId().withMessage('user id is incorrect'),
            check('b_id').exists().isMongoId().withMessage('book id is incorrect')
        ],
        controllers.book.borrow);

    app.post('/users/:u_id/return/:b_id',
        [
            check('u_id').exists().isMongoId()
                .withMessage('user id is incorrect'),
            check('b_id').exists().isMongoId()
                .withMessage('book id is incorrect'),
            check('score').exists().isNumeric()
                .withMessage('score is incorrect').custom((s) => s < SCORE_LIMIT.MAX && s > SCORE_LIMIT.MIN)
                .withMessage('you can give a score from 1 to 9 point system')
        ],
        controllers.book.returnBook);
};