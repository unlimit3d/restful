const express = require('express');
const router = express.Router();
// const mongoose = require('mongoose');
const multer = require('multer');

const jwt = require('jsonwebtoken');

const checkAuth = require('../auth/check-auth');


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString()+file.originalname);
    }
});

const upload = multer({storage: storage});


// const Product = require('../models/product');
var db = require('../dbconnection');


router.get('/', checkAuth, function(req, res, next) {  
    db.query('SELECT * from pateint', function(err, result){
        res.status(200).json({
            data: result
        });
    });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    db.query('SELECT * from pateint where HN=?',[id], function(err, result){
        res.status(200).json({
            data: result
        });
    });
});

router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
    const username = req.body.username;
    // console.log(req.file);
    res.status(200).json({
        massage: 'POST request to /products',
        InData: username
    });
});
// router.post('/', (req, res, next) => {
//     // const product = {
//     //     name: req.body.name,
//     //     price: req.body.price
//     // };
//     const product = new Product({
//         _id: new mongoose.Types.ObjectId(),
//         name: req.body.name,
//         price: req.body.price
//     });
//     product
//         .save()
//         .then(result =>{
//             console.log(result);
//             res.status(200).json({
//                 massage: 'POST request to /products',
//                 createdProduct: result
//             });
//         }).catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             })
//         });
//     //
// });

// router.get('/:productId', (req, res, next) => {
//     const id = req.params.productId;
//     Product.findById(id).
//     exec().
//     then(doc =>{
//         console.log("From database", doc);
//         if(doc){
//             res.status(200).json(doc);
//         }else{
//             res.status(404).json({
//                 massage: 'Not found ID!'
//             })
//         }

//     }).catch(err => {
//         console.log(err)
//         res.status(500).json({
//             error: err
//         })
//     });

//     // if(id === 'special'){
//     //     res.status(200).json({
//     //         massage: 'Special ID',
//     //         id: id
//     //     });
//     // }else{
//     //     res.status(200).json({
//     //         massage: 'Passes an ID'
//     //     });
//     // }
// });

// router.patch('/:productId', (req, res, nex) => {
//     // res.status(200).json({
//     //     massage: 'Updated product!'
//     // });
//     const id = req.params.productId;
//     const updateOps = {};

//     for(const ops of req.body){
//         updateOps[ops.propName] = ops.value;
//     }

//     Product.update({ _id: id }, { $set: updateOps })
//     .exec()
//     .then(result =>{
//         console.log(result);
//         res.status(200).json(result);
//     }).catch(err=>{
//         console.log(err);
//         res.status(500).json({
//             error: err
//         });
//     });
// });

// router.delete('/:productId', (req, res, nex) => {
//     // res.status(200).json({
//     //     massage: 'Deleted product!'
//     // });
//     const id = req.params.productId;

//     Product.remove({ _id: id }).exec().then(result =>{
//         res.status(200).json(result);
//     }).catch(err =>{
//         console.log(err);
//         res.status(500).json({
//             error: err
//         });
//     });
// });

module.exports = router;