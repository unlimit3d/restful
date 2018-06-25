const express = require('express');
const router = express.Router();
// const mongoose = require('mongoose');

// const Product = require('../models/product');
const db = require('../dbconnection');
const jwt = require('jsonwebtoken');

router.get('/', function(req, res, next) {
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        db.query('SELECT * from provider', function(err, result){
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

router.get('/:ProviderID', (req, res, next) => {
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const id = req.params.ProviderID;
        db.query('SELECT * from provider where ProviderID=?',[id], function(err, result){
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

router.post('/', (req, res, next) => {
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const ProviderID = req.body.ProviderID;
        const Prefix = req.body.Prefix;
        const Name = req.body.Name;
        const Surname = req.body.Surname;
        const LicenseNo = req.body.LicenseNo;

        db.query('INSERT INTO provider (ProviderID, Prefix, Name, Surname, LicenseNo) VALUES(?, ?, ?, ?, ?)',[ProviderID, Prefix, Name, Surname, LicenseNo], function(err, result){
            if(err == null){
                res.status(200).json({
                    massage :  "ok",
                });
            }else{
                res.status(400).json({
                    massage :  "error",
                    error: err
                });
            }

        });
    }catch(error){
        return res.status(401).json({
            message: "Auth failed"
        });
    }
});

router.patch('/:ProviderID', (req, res, nex) => {
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const id = req.params.ProviderID;
        db.query("UPDATE provider SET roomname = ? WHERE ProviderID=?",[req.body.roomname, id], function(err, result){
            if(err == null){
                res.status(200).json({
                    massage :  "ok",
                });
            }else{
                res.status(400).json({
                    massage :  "error",
                    error: err
                });
            }
        });
    }catch(error){
        return res.status(401).json({
            message: "Auth failed"
        });
    }
});

router.delete('/:ProviderID', (req, res, nex) => {
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const id = req.params.ProviderID;

        db.query("DELETE FROM provider WHERE ProviderID=?",[id], function(err, result){
            if(err == null){
                res.status(200).json({
                    massage :  "ok",
                });
            }else{
                res.status(400).json({
                    massage :  "error",
                    error: err
                });
            }
        });
    }catch(error){
        return res.status(401).json({
            message: "Auth failed"
        });
    }
});

module.exports = router;