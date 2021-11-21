const express = require('express');
const router = express.Router();
const { check } = require("express-validator");
const { signUp,signIn } = require('../controllers/authentication');

router.post('/join', [
    check("name", "should be atleast 3 characters").isLength({ min: 3 }),
    check("email", "invalid email").isEmail(),
    // check("dob", "dob is not a date").isDate(),
    check("gender", "invalid gender").isIn(["M", "F", "O"]),
    check("password", "should be alphanumeric and between 8-30 characters").isAlphanumeric().isLength({min:8,max:30})
], signUp);

router.post('/signin',[check("email","email is in bad format").isEmail(),check("password","password is not in required format").isAlphanumeric().isLength({min:8,max:30})],signIn);

module.exports=router;