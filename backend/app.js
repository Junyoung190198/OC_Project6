// mongodb+srv://Kev:<db_password>@cluster0.8xlhv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauce');

const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://Kev:EqRxQtMp0eLoCtaR@cluster0.8xlhv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(()=>{
        console.log('Well connect to the database');
    })
    .catch((error)=>{
        console.log('Enable to connect to the database');
        console.error(error);
});

app.use(cors());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);


module.exports = app;