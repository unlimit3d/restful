const express = require('express');
const router = express.Router();
// const mongoose = require('mongoose');

// const Product = require('../models/product');
const db = require('../dbconnection');


router.get('/', function(req, res, next) {
    db.query('SELECT * from patient', function(err, result){
        res.status(200).json({
            data: result
        });
    });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    db.query('SELECT * from patient where HN=?',[id], function(err, result){
        res.status(200).json({
            data: result
        });
    });
});


module.exports = router;