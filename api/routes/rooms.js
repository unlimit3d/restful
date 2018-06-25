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
        db.query('SELECT * from room', function(err, result){
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

router.get('/:productId', (req, res, next) => {
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const id = req.params.productId;
        db.query('SELECT * from room where roomcode=?',[id], function(err, result){
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

        const roomname = req.body.roomname;

        db.query('INSERT INTO room (roomname) VALUES(?)',[roomname], function(err, result){
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

router.patch('/:roomcode', (req, res, nex) => {
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const id = req.params.roomcode;
        db.query("UPDATE room SET roomname = ? WHERE roomcode=?",[req.body.roomname, id], function(err, result){
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

router.delete('/:roomcode', (req, res, nex) => {
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const id = req.params.roomcode;

        db.query("DELETE FROM room WHERE roomcode=?",[id], function(err, result){
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