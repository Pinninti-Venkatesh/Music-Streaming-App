const { validationResult } = require("express-validator");
const users = require("../models/users");
const jsonwebtoken = require('jsonwebtoken');
const expressjwt = require('express-jwt');
exports.signUp = (req, res) => {
    const errors = validationResult(req);
    console.log('ERRORS', errors);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }
    const user = new users(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: 'unable save user in DB ' + err
            });
        }
        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        })
    });
};

exports.signIn = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }
    const { email, password } = req.body;
    users.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User does not exist'
            });
        }
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }
        const authToken = jsonwebtoken.sign({ _id: user._id }, process.env.signingKey);
        res.cookie("authToken", authToken, { expire: new Date() + 9999 });
        const { _id, name, email } = user;
        return res.json({
            authToken, user: { _id, name, email }
            // _id:_id,
            // name:name,
            // email:email,
            // role:role
        })
    });
}

exports.signout = (req, res) => {
    res.clearCookie("authToken");
    return res.json({ message: "user signedout" });
}

exports.isSignedIn = expressjwt({
    secret: process.env.signingKey,
    userProperty: "authToken",
    algorithms: ['RS256'] 
});
