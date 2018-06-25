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

router.get('/', function(req, res, next) {   //, checkAuth
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        db.query('SELECT roommap.Registdate, room.roomcode, provider.ProviderID, room.roomname,provider.`Name`, provider.Surname FROM roommap INNER JOIN room ON roommap.Roomcode = room.roomcode INNER JOIN provider ON roommap.ProviderID = provider.ProviderID WHERE roommap.Registdate=?', [today], function(err, result){
            // db.query('SELECT * from roommap WHERE Registdate=?', [today], function(err, result){
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

router.get('/:registDate', function(req, res, next) {   //, checkAuth
    try{
        const registDate = req.params.registDate;
        // console.log(registDate);

        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        db.query('SELECT roommap.Registdate, room.roomcode, provider.ProviderID, room.roomname,provider.`Name`, provider.Surname FROM roommap INNER JOIN room ON roommap.Roomcode = room.roomcode INNER JOIN provider ON roommap.ProviderID = provider.ProviderID WHERE roommap.Registdate=?', [registDate], function(err, result){
            // db.query('SELECT * from roommap WHERE Registdate=?', [today], function(err, result){
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

router.get('/:registDate/:roomCode', (req, res, next) => {
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const registDate = req.params.registDate;
        const roomCode = req.params.roomCode;

        db.query('SELECT roommap.Registdate, room.roomcode, provider.ProviderID, room.roomname,provider.`Name`, provider.Surname FROM roommap INNER JOIN room ON roommap.Roomcode = room.roomcode INNER JOIN provider ON roommap.ProviderID = provider.ProviderID WHERE roommap.Registdate = ? AND roommap.Roomcode = ?',[registDate, roomCode], function(err, result){
            res.status(200).json({
                data: result
            });
        });
    }catch(error){
        return res.status(401).json({
            message: "Auth failed"
        })
    }
});

router.post('/', (req, res, next) => {
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        // const roomcode = req.body.roomcode;
        const Registdate = req.body.Registdate;
        const Roomcode = req.body.Roomcode;
        const ProviderID = req.body.ProviderID;

        // console.log(Registdate+' '+Roomcode+' '+ProviderID);

        db.query('INSERT INTO roommap (Registdate, Roomcode, ProviderID) VALUES(?, ?, ?)',[Registdate, Roomcode, ProviderID], function(err, result){
            console.log(result);
            if(err == null){
                res.status(200).json({
                    massage :  "insert ok",
                });
            }else{
                res.status(400).json({
                    massage :  "insert error",
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

router.patch('/:Registdate/:Roomcode', (req, res, nex) => {
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const Registdate = req.params.Registdate;
        const Roomcode = req.params.Roomcode;

        const ProviderID = req.body.ProviderID;

        // console.log(Registdate);
        // console.log(Roomcode);
        // console.log(ProviderID);

        db.query("UPDATE roommap SET ProviderID = ? WHERE Roomcode = ? AND Registdate = ?",[ProviderID, Roomcode, Registdate], function(err, result){
            if(err == null){
                res.status(200).json({
                    massage :  "update ok",
                });
            }else{
                res.status(400).json({
                    massage :  "update error",
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

router.delete('/:Registdate/:Roomcode', (req, res, nex) => {

    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const Registdate = req.params.Registdate;
        const Roomcode = req.params.Roomcode;

        // console.log(Registdate);
        // console.log(Roomcode);


        db.query("DELETE FROM roommap WHERE Roomcode = ? AND Registdate = ?",[Roomcode, Registdate], function(err, result){
            if(err == null){
                res.status(200).json({
                    massage :  "DELETE ok",
                });
            }else{
                res.status(400).json({
                    massage :  "DELETE error",
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