const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');

// Router
const patientRoutes = require('./api/routes/patients');
const roomRoutes = require('./api/routes/rooms');
const roommapsRoutes = require('./api/routes/roommaps');
const providerRoutes = require('./api/routes/providers');
const productsRoutes = require('./api/routes/products');
const userRoutes = require('./api/routes/user');
const basicRoutes = require('./api/routes/basic');
const authRoutes = require('./api/routes/auth');
const appointRoutes = require('./api/routes/appoint');
const registerRoutes = require('./api/routes/register');
const drugRoutes = require('./api/routes/drug');
const billRoutes = require('./api/routes/bill');

// mongoose.connect('mongodb+srv://' + process.env.MONGO_ATLAS_US + ':' + process.env.MONGO_ATLAS_PW + '@node-rest-shop-rlxqx.mongodb.net/test?retryWrites=false');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*") //* ทุกเว็บ, http://xxxx.com;
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, token"
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/patients', patientRoutes);
app.use('/rooms', roomRoutes);
app.use('/roommaps', roommapsRoutes);
app.use('/providers', providerRoutes);
app.use('/products', productsRoutes);
app.use('/user', userRoutes);
app.use('/basic', basicRoutes);
app.use('/auth', authRoutes);
app.use('/appoint', appointRoutes);
app.use('/register', registerRoutes);
app.use('/drug', drugRoutes);
app.use('/bill', billRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;

// app.use((req, res, next) => {
//     res.status(200).json({
//         message: 'It works!'
//     });
// });