const express = require('express');
const router = express.Router();
const db = require('../dbconnection');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

router.post('/signup', (req, res, next) => {
    db.query("SELECT * FROM user WHERE username = ?",[req.body.username], function(err, result){
        if(result.length <1){
            bcrypt.hash(req.body.password, 10,(err, hash)=>{
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                }else{
                    const username = req.body.username;
                    const password = hash;
                    const fname = req.body.fname;
                    const lname = req.body.lname;

                    db.query("INSERT INTO user(username, password, fname, lname) VALUES(?, ?, ?, ?)",[username, password, fname, lname], function(errs, result){
                        if(errs != null){
                            res.status(500).json({
                                error : errs
                            });
                        }else{
                            res.status(200).json({
                                massage : "Signup complete"
                            });
                        }
                    });
                }
            });
        }else{
            return res.status(409).json({
                massage: 'Username exists'
            });
        }
    });



});

router.delete('/:uid', (req, res, next) =>{
    db.query("DELETE FROM user WHERE uid=?",[req.params.uid], function(err, result){

        res.status(200).json({
            massage : "User deleted ",
            error: err
        });


    });
});

router.post('/login', (req, res, next) => {

    // const roomcode = req.body.roomcode;
    // const username = req.body.username;
    // const password = req.body.password;
// try{
    db.query("SELECT * FROM user WHERE username = ?",[req.body.username], function(err, result){
        console.log(req.body.username);
        if(result){
            // console.log("Res");

        if(result.length < 1){
           return res.status(200).json({
               message: "โปรดตรวจสอบ Username หรือ Password"
           });
        }
        // console.log(result);

            bcrypt.compare(req.body.password, result[0].password, (err, result2)=>{
                        if(err){
                            return res.status(200).json({
                                message: "โปรดตรวจสอบ Username หรือ Password"
                            });
                        }

                        if(result2){
                            const token = jwt.sign({
                                username: result[0].username
                            },
                            process.env.JWT_KEY,
                            {
                                expiresIn: "8h"
                            }
                            );
                            return res.status(200).json({
                                message: "Auth successful",
                                token: token
                            });
                        }

                        return res.status(200).json({
                            message: "โปรดตรวจสอบ Username หรือ Password"
                        });
                    });

                }else{
                    return res.status(200).json({
                        message: "โปรดตรวจสอบ Username หรือ Password"
                    });
                }


    });
//  }catch(err){
//             return res.status(200).json({
//                 message: "โปรดตรวจสอบ Username หรือ Password"
//             });
//         }

});

// router.patch('/:roomcode', (req, res, nex) => {
//     const id = req.params.roomcode;
//     db.query("UPDATE roommap SET roomname = ? WHERE roomcode=?",[req.body.roomname, id], function(err, result){
//         if(err == null){
//             res.status(200).json({
//                 massage :  "ok",
//             });
//         }else{
//             res.status(400).json({
//                 massage :  "error",
//                 error: err
//             });
//         }
//     });
// });

// router.delete('/:roomcode', (req, res, nex) => {
//     const id = req.params.roomcode;

//     db.query("DELETE FROM roommap WHERE roomcode=?",[id], function(err, result){
//         if(err == null){
//             res.status(200).json({
//                 massage :  "ok",
//             });
//         }else{
//             res.status(400).json({
//                 massage :  "error",
//                 error: err
//             });
//         }
//     });
// });

module.exports = router;