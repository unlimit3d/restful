const express = require('express');
const router = express.Router();
// const mongoose = require('mongoose');

// const Product = require('../models/product');
const db = require('../dbconnection');

// const checkAuth = require('../auth/check-auth');
const jwt = require('jsonwebtoken');

function padLeft(data,size,paddingChar) {
    return (new Array(size + 1).join(paddingChar || '0') + String(data)).slice(-size);
}

const dd = new Date();
const year = dd.getFullYear()+543;
const month = dd.getMonth()+1;
const day = dd.getDate();
const today = ''+year + padLeft(month, 2,"0") + padLeft(day, 2,"0");



router.get('/:registDate', function(req, res, next) {   //, checkAuth
    try{
        const registDate = req.params.registDate;
        // console.log(registDate);

        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        db.query("SELECT appoint.Time,appoint.HN,appoint.PtName,appoint.DDS,treatmentphase.TreatmentPhaseName,treatmentphase.TreatmentPhaseCode, provider.`Name`,provider.Surname FROM appoint LEFT JOIN provider ON appoint.DDS = provider.ProviderID LEFT JOIN treatmentphase ON appoint.TreatmentCode = treatmentphase.TreatmentPhaseCode WHERE appoint.HN IS NOT NULL AND appoint.AppD = ? ORDER BY	appoint.ID", [registDate], function(err, result){
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