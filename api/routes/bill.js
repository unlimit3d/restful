const express = require('express');
const router = express.Router();

const db = require('../dbconnection');

const jwt = require('jsonwebtoken');

router.get('/:ID/', function(req, res, next) {
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const ID = req.params.ID;

        db.query('SELECT * FROM bill_d WHERE ID = ? ORDER BY Bill_no ASC', [ID], function(err, result){
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

router.get('/:ID/:type', function(req, res, next) {
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const ID = req.params.ID;
        const type = req.params.type;

        // console.log(type);

        db.query('SELECT * FROM bill_d WHERE ID = ? AND mtype = ? ORDER BY Bill_no ASC', [ID, type], function(err, result){
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
        var chkState = true;

        var i=1;
        for(const ops of req.body.bData){
            db.query("INSERT INTO `bill_d`(HN, ID, Bill_no, TreatmentCode, Fee, amount, mtype, usetype, once, usetimes, note, pertimes) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",[ops.HN, ops.ID, i, ops.TreatmentCode, ops.Fee, ops.amount, ops.mtype, ops.usetype, ops.once, ops.usetimes, ops.note, ops.pertimes], function(err, result){
                if(err != null){
                    chkState = false;
                }
            });
            i++;
        }

        res.status(200).json({
            massage :  "INSERT ok"
        });
    }catch(error){
        return res.status(401).json({
            message: "Auth failed"
        });
    }
});


module.exports = router;