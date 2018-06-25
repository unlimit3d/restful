const express = require('express');
const router = express.Router();
const db = require('../dbconnection');


router.get('/province', function(req, res, next) {
    db.query('SELECT * from province ORDER BY PROVINCE_NAME', function(err, result){
        res.status(200).json({
            data: result
        });
    });
});

router.get('/amphur/:PROVINCE_ID', (req, res, next) => {

    const PROVINCE_ID = req.params.PROVINCE_ID;

    db.query('SELECT * from amphur where PROVINCE_ID=? ORDER BY AMPHUR_NAME',[PROVINCE_ID], function(err, result){
        res.status(200).json({
            data: result
        });
    });
});

router.get('/nation', (req, res, next) => {
    db.query('SELECT * from nation ORDER BY NationName', function(err, result){
        res.status(200).json({
            data: result
        });
    });
});

router.get('/treatmentphase', (req, res, next) => {
    db.query('SELECT * from treatmentphase ORDER BY TreatmentPhaseCode', function(err, result){
        res.status(200).json({
            data: result
        });
    });
});

router.get('/cametype', (req, res, next) => {
    db.query('SELECT * from cametype ORDER BY CameTypeCode', function(err, result){
        res.status(200).json({
            data: result
        });
    });
});

router.get('/druglabel', (req, res, next) => {
    db.query('SELECT * from druglabel', function(err, result){
        res.status(200).json({
            data: result
        });
    });
});



module.exports = router;