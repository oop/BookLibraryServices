const bookModel = require('../models/bookModel');
const { validationResult } = require('express-validator');

async function get(req, res) {
    try {
        validationResult(req).throw();
        const payload = await bookModel.getBook(global.mongoTypes.ObjectID(req.params.id));
        if (!payload) return res.status(500).json({ success: false });
        return res.json({ success: true, payload });
    } catch (ex) {
        return global.exceptionHandler(ex, req, res);
    }
}

async function getAll(req, res) {
    try {
        validationResult(req).throw();
        const payload = await bookModel.getAllBooks();
        return res.json({ success: true, payload });
    } catch (ex) {
        return global.exceptionHandler(ex, req, res);
    }
}

async function create(req, res) {
    try {
        validationResult(req).throw();
        const payload = await bookModel.createBook(req.body.name);
        if (!payload) return res.json({ success: false });
        return res.json({ success: true, payload: { id: payload } });
    } catch (ex) {
        return global.exceptionHandler(ex, req, res);
    }
}

async function borrow(req, res) {
    try {
        validationResult(req).throw();
        const { u_id, b_id } = req.params;
        const isSuccess = await bookModel.borrowBook(global.mongoTypes.ObjectID(u_id), global.mongoTypes.ObjectID(b_id));
        if (!isSuccess) return res.json({ success: false });
        return res.json({ success: true });
    } catch (ex) {
        return global.exceptionHandler(ex, req, res);
    }
}

async function returnBook(req, res) {
    try {
        validationResult(req).throw();
        const { u_id, b_id } = req.params;
        const { score } = req.body;
        const isSuccess = await bookModel.returnBook(global.mongoTypes.ObjectID(u_id), global.mongoTypes.ObjectID(b_id), score);
        if (!isSuccess) return res.json({ success: false });
        return res.json({ success: true });
    } catch (ex) {
        return global.exceptionHandler(ex, req, res);
    }
}

module.exports = {
    getAll,
    get,
    create,
    borrow,
    returnBook
}