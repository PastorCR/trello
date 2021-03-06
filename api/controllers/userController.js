const mongoose = require('mongoose');
const User = mongoose.model('User');
const md5 = require('crypto-js/md5');
const jwt = require('jsonwebtoken');
const { generateToken, verifyToken } = require('../auth');
const { sendErrorResponse, sendJsonResponse, saveModel } = require('../apiUtils');

const getAll = (req, res) => {
    User.find().exec()
        .then(data => sendJsonResponse(res, data, '200'))
        .catch(err => sendErrorResponse(res, err, '500'));
};

const signup = (req, res) => {
    const body = req.body;
    const hash = md5(body.password.trim());
    const user = new User(Object.assign({}, body, { password: hash }))
    user.save()
        .then(data => {
            const token = generateToken(user);
            sendJsonResponse(res, { user, token }, '201');
        })
        .catch(err => sendErrorResponse(res, err, '500'));
};

const signin = (req, res) => {
    const body = req.body;
    User.findOne({ email: body.email })
        .then(user => {
            if (!user) {
                sendErrorResponse(res, {
                    error: true,
                    message: 'Username or Password is Wrong'
                });
            } else {
                const hash = md5(body.password.trim());
                if (hash != user.password) {
                    sendErrorResponse(res, {
                        error: true,
                        message: 'Username or Password is Wrong'
                    });
                } else {
                    const token = generateToken(user);
                    sendJsonResponse(res, { user, token }, '200');
                }
            }

        })
        .catch(err => {
            sendErrorResponse(res, {
                error: true,
                message: 'Username or Password is Wrong'
            });
        });
};

const reAuthenticate = (req, res) => {
    const user = { user: req.user };
    const token = generateToken(user);
    sendJsonResponse(res, { user, token }, '201');
}

const getBoards = (req, res) => {
    const { params, body } = req;
    User.findById(params.id)
        .populate({
            path: 'boards',
            model: 'Board',
        })
        .exec()
        .then(data => sendJsonResponse(res, data.boards, '200'))
        .catch(err => sendErrorResponse(res, err, '500'))
};

const setBoards = (req, res) => {
    const { params, body } = req;
    User.findByIdAndUpdate(params.id,
        { "$push": { "boards": body.board } }

    )
        .exec()
        .then(data => sendJsonResponse(res, data, '250'))
        .catch(err => sendErrorResponse(res, err, '500'))
};



const Users = {
    getAll,
    signup,
    signin,
    reAuthenticate,
    getBoards,
    setBoards
};

module.exports = Users;