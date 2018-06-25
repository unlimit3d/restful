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
        db.query('SELECT * FROM patient', function(err, result){
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

router.get('/autoid', function(req, res, next) {
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        db.query('SELECT MAX(HN) AS HN FROM patient', function(err, result){
            console.log(result);
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

router.post('/find', function(req, res, next) {   //find
    try{
        const hn = req.body.hn;
        const name = req.body.name;
        const sname = req.body.sname;
        // console.log(hn);
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        var sql = "SELECT * FROM patient ";

        if(hn != "-" && name != "-" && sname != "-") sql += "WHERE HN LIKE '%"+hn+"%' AND Name LIKE '%"+name+"%' AND Surname LIKE '%"+sname+"%'";

        if(hn != "-" && name == "-" && sname == "-") sql += "WHERE HN LIKE '%"+hn+"%'";
        if(hn == "-" && name != "-" && sname == "-") sql += "WHERE Name LIKE '%"+name+"%'";
        if(hn == "-" && name == "-" && sname != "-") sql += "WHERE Surname LIKE '%"+sname+"%'";

        if(hn != "-" && name != "-" && sname == "-") sql += "WHERE HN LIKE '%"+hn+"%' AND Name LIKE '%"+name+"%'";
        if(hn == "-" && name != "-" && sname != "-") sql += "WHERE Name LIKE '%"+name+"%' AND Surname LIKE '%"+sname+"%'";
        if(hn != "-" && name == "-" && sname != "-") sql += "WHERE HN LIKE '%"+hn+"%' AND Surname LIKE '%"+sname+"%'";

        sql += ' ORDER BY PtRecordID DESC'

        // console.log(sql);

        db.query(sql, function(err, result){
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


router.get('/:hn', (req, res, next) => {
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const hn = req.params.hn;

        db.query('SELECT * FROM patient WHERE HN = ?',[hn], function(err, result){
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

        const HN = req.body.HN;
        const ID = req.body.ID;
        const Name = req.body.Name;
        const Surname = req.body.Surname;
        const Nickname = req.body.Nickname;
        const BirthDate = req.body.BirthDate;
        const Address = req.body.Address;
        const Ampure = req.body.Ampure;
        const Province = req.body.Province;
        const Nation1 = req.body.Nation1;
        const Nation2 = req.body.Nation2;
        const Tel1 = req.body.Tel1;
        const Tel2 = req.body.Tel2;
        const drug = req.body.drug;
        const disease = req.body.disease;

        // console.log(HN+' '+ID+' '+Name+' '+Surname+' '+Nickname+' '+BirthDate+' '+Address+' '+Ampure+' '+Province+' '+Nation1+' '+Nation2+' '+Tel1+' '+Tel2+' '+drug+' '+disease);

        db.query('INSERT INTO patient (HN, ID, `Name`, Surname, Nickname, BirthDate, Address, Ampure, Province, Nation1, Nation2, Tel1, Tel2, drug, disease, DateInput) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())', [HN, ID, Name, Surname, Nickname, BirthDate, Address, Ampure, Province, Nation1, Nation2, Tel1, Tel2, drug, disease], function(err, result){
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

router.patch('/:PtRecordID', (req, res, nex) => {
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const PtRecordID = req.params.PtRecordID;
        const updateOps = {};
        var chkState = true;
        for(const ops of req.body.eData){
            updateOps[ops.propName] = ops.value;
            db.query("UPDATE patient SET "+ops.propName+" = ? WHERE PtRecordID = ?",[ops.value, PtRecordID], function(err, result){
                if(err != null){
                    chkState = false;
                }
            });
        }

        if(chkState){
            res.status(200).json({
                massage :  "update ok"
            });
        }

    }catch(er){
        return res.status(401).json({
            message: "Auth failed",
        });
    }

});

router.delete('/:PtRecordID', (req, res, nex) => {

    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const PtRecordID = req.params.PtRecordID;

        db.query("DELETE FROM patient WHERE PtRecordID = ?",[PtRecordID], function(err, result){
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