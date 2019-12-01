const userModel = require('../models/userModel');
const { validationResult } = require('express-validator');

async function get(req, res) {
    try {
        validationResult(req).throw();
        const payload = await userModel.getUser(global.mongoTypes.ObjectID(req.params.id));
        return res.json({ success: true, payload });
    } catch (ex) {
        return global.exceptionHandler(ex, req, res);
    }
}

async function getAll(req, res) {
    try {
        validationResult(req).throw();
        const payload = await userModel.getAllUsers();
        return res.json({ success: true, payload });
    } catch (ex) {
        return global.exceptionHandler(ex, req, res);
    }
}

async function create(req, res) {
    try {
        validationResult(req).throw();
        const payload = await userModel.createUser(req.body.name);
        if (!payload) return res.json({ success: false });
        return res.json({ success: true, payload: { id: payload } });
    } catch (ex) {
        return global.exceptionHandler(ex, req, res);
    }
}

module.exports = {
    getAll,
    get,
    create
}