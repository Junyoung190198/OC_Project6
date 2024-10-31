// mongodb+srv://Kev:VqlX1NEKRURXMzHm@cluster0.8xlhv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');

const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://Kev:VqlX1NEKRURXMzHm@cluster0.8xlhv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(()=>{
        console.log('Well connect to the database');
    })
    .catch((error)=>{
        console.log('Enable to connect to the database');
        console.error(error);
});


app.use('/api/auth', userRoutes);


module.exports = app;