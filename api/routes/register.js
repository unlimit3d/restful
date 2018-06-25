const express = require('express');
const router = express.Router();

const db = require('../dbconnection');

function padLeft(data,size,paddingChar) {
    return (new Array(size + 1).join(paddingChar || '0') + String(data)).slice(-size);
}


const jwt = require('jsonwebtoken');

router.get('/hn/:HN/:today', function(req, res, next) {
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const HN = req.params.HN;
        const today = req.params.today;

        db.query('SELECT visit.ID, visit.Date, visit.symptom, visit.treatment FROM visit WHERE visit.HN = ?  AND visit.Date <> ? ORDER BY visit.Date DESC', [HN, today], function(err, result){
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


router.get('/:visitDate', function(req, res, next) {
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const visitDate = req.params.visitDate;

        db.query('SELECT * FROM Visit LEFT JOIN Provider ON Visit.DDS = Provider.ProviderID LEFT JOIN cametype ON visit.CameTypeCode = cametype.CameTypeCode WHERE Visit.`Date`= ?', [visitDate], function(err, result){
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


router.get('/:visitDate/:room/:doccode', function(req, res, next) {
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const visitDate = req.params.visitDate;
        const room = req.params.room;
        const doccode = req.params.doccode;

        db.query('SELECT visit.ID, visit.Date, visit.ArriveTime, visit.AppTime, visit.DocTime, visit.FinishTime, visit.PtName, visit.HN, visit.CN, visit.Fee, visit.Paid, visit.Credit, visit.PayFlag, visit.PayDate, visit.CameTypeCode, visit.DDS, visit.TreatmentPhase, visit.Transfer, visit.NxtAppTime, visit.NxtAppDate, visit.NxtTreatment, visit.TreatmentName, visit.room, visit.appoint, visit.bill, visit.NxtApp, visit.symptom, visit.physicalExam, patient.Address, patient.disease, patient.drug, patient.Tel1, visit.treatment FROM Visit LEFT JOIN Provider ON Visit.DDS = Provider.ProviderID LEFT JOIN cametype ON visit.CameTypeCode = cametype.CameTypeCode LEFT JOIN patient ON visit.HN = patient.HN WHERE Visit.`Date`= ? AND (visit.room = ? OR visit.DDS = ?)', [visitDate, room, doccode], function(err, result){
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

// router.get('/autoid', function(req, res, next) {
//     try{
//         const token = req.headers.token;
//         const decoded = jwt.verify(token, process.env.JWT_KEY);
//         db.query('SELECT MAX(HN) AS HN FROM patient', function(err, result){
//             console.log(result);
//             res.status(200).json({
//                 data: result
//             });
//         });
//     }catch(error){
//         return res.status(401).json({
//             message: "Auth failed"
//         });
//     }
// });

// router.post('/find', function(req, res, next) {   //find
//     try{
//         const hn = req.body.hn;
//         const name = req.body.name;
//         const sname = req.body.sname;
//         // console.log(hn);
//         const token = req.headers.token;
//         const decoded = jwt.verify(token, process.env.JWT_KEY);

//         var sql = "SELECT * FROM patient ";

//         if(hn != "-" && name != "-" && sname != "-") sql += "WHERE HN LIKE '%"+hn+"%' AND Name LIKE '%"+name+"%' AND Surname LIKE '%"+sname+"%'";

//         if(hn != "-" && name == "-" && sname == "-") sql += "WHERE HN LIKE '%"+hn+"%'";
//         if(hn == "-" && name != "-" && sname == "-") sql += "WHERE Name LIKE '%"+name+"%'";
//         if(hn == "-" && name == "-" && sname != "-") sql += "WHERE Surname LIKE '%"+sname+"%'";

//         if(hn != "-" && name != "-" && sname == "-") sql += "WHERE HN LIKE '%"+hn+"%' AND Name LIKE '%"+name+"%'";
//         if(hn == "-" && name != "-" && sname != "-") sql += "WHERE Name LIKE '%"+name+"%' AND Surname LIKE '%"+sname+"%'";
//         if(hn != "-" && name == "-" && sname != "-") sql += "WHERE HN LIKE '%"+hn+"%' AND Surname LIKE '%"+sname+"%'";

//         sql += ' ORDER BY PtRecordID DESC'

//         // console.log(sql);

//         db.query(sql, function(err, result){
//             res.status(200).json({
//                 data: result
//             });
//         });
//     }catch(error){
//         return res.status(401).json({
//             message: "Auth failed"
//         });
//     }
// });


// router.get('/:hn', (req, res, next) => {
//     try{
//         const token = req.headers.token;
//         const decoded = jwt.verify(token, process.env.JWT_KEY);

//         const hn = req.params.hn;

//         db.query('SELECT * FROM patient WHERE HN = ?',[hn], function(err, result){
//             res.status(200).json({
//                 data: result
//             });
//         });
//     }catch(error){
//         return res.status(401).json({
//             message: "Auth failed"
//         })
//     }
// });

router.post('/', (req, res, next) => {
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const Dates = req.body.Date;
        const ArriveTime = req.body.ArriveTime;
        const DocTime = req.body.DocTime;
        const FinishTime = req.body.FinishTime;
        const PtName = req.body.PtName;
        const HN = req.body.HN;
        const Fee = req.body.Fee;
        const Paid = req.body.Paid;
        const Credit = req.body.Credit;
        const CameTypeCode = req.body.CameTypeCode;
        const DDS = req.body.DDS;
        const TreatmentPhase = req.body.TreatmentPhase;
        const Transfer = req.body.Transfer;
        const NxtTreatment = req.body.NxtTreatment;
        const TreatmentName = req.body.TreatmentName;
        const room = req.body.room;
        const appoint = req.body.appoint;
        const bill = req.body.bill;
        const NxtApp = req.body.NxtApp;
        const symptom = req.body.symptom;

        // console.log(HN+' '+ID+' '+Name+' '+Surname+' '+Nickname+' '+BirthDate+' '+Address+' '+Ampure+' '+Province+' '+Nation1+' '+Nation2+' '+Tel1+' '+Tel2+' '+drug+' '+disease);

        db.query('INSERT INTO visit (`Date`, ArriveTime, DocTime, FinishTime, PtName, HN, Fee, Paid, Credit, CameTypeCode, DDS, TreatmentPhase, Transfer, NxtTreatment, TreatmentName, room, appoint, bill, NxtApp, symptom) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [Dates, ArriveTime, DocTime, FinishTime, PtName, HN, Fee, Paid, Credit, CameTypeCode, DDS, TreatmentPhase, Transfer, NxtTreatment, TreatmentName, room, appoint, bill, NxtApp, symptom], function(err, result){
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

router.patch('/:ID', (req, res, nex) => {
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const ID = req.params.ID;
        const updateOps = {};
        var chkState = true;

        for(const ops of req.body.eData){
            // updateOps[ops.propName] = ops.value;
            if(ops.propName != "ID"){
                db.query("UPDATE visit SET "+ops.propName+" = ? WHERE ID = ?",[ops.value, ID], function(err, result){
                    if(err != null){
                        chkState = false;
                    }
                });
            }

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

router.delete('/:ID', (req, res, nex) => {

    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const ID = req.params.ID;

        db.query("DELETE FROM visit WHERE ID = ?",[ID], function(err, result){
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