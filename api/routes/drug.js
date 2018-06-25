const express = require('express');
const router = express.Router();

const db = require('../dbconnection');

function padLeft(data,size,paddingChar) {
    return (new Array(size + 1).join(paddingChar || '0') + String(data)).slice(-size);
}


const jwt = require('jsonwebtoken');

router.get('/', function(req, res, next) {
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        db.query('SELECT CODE_DRUG, NAME_DRUG, Price, NAME_DRUG AS id, NAME_DRUG AS `text` FROM drug ORDER BY NAME_DRUG ASC', function(err, result){
            res.status(200).json({
                data: result
            });
        });
    }catch(error){
        return res.status(401).json({
            message: "Auth failed"
        });
    }
});

router.get('/drug', function(req, res, next) {
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        db.query('SELECT CODE_DRUG, NAME_DRUG, Price FROM drug WHERE MTYPE =\'DRUG\' ORDER BY NAME_DRUG ASC', function(err, result){
            res.status(200).json({
                data: result
            });
        });
    }catch(error){
        return res.status(401).json({
            message: "Auth failed"
        });
    }
});

router.get('/oper', function(req, res, next) {
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        db.query('SELECT CODE_DRUG, NAME_DRUG, Price FROM drug WHERE MTYPE =\'OPER\' ORDER BY NAME_DRUG ASC', function(err, result){
            res.status(200).json({
                data: result
            });
        });
    }catch(error){
        return res.status(401).json({
            message: "Auth failed"
        });
    }
});


module.exports = router;