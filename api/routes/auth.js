const express = require('express');
const router = express.Router();
const db = require('../dbconnection');

const jwt = require('jsonwebtoken');

router.get('/', function(req, res, next) {
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        res.status(200).json({
            message: "Auth success"
        });
    }catch(error){
        return res.status(401).json({
            message: "Auth failed"
        });
    }
});



module.exports = router;