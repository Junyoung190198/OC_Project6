// mongodb+srv://Kev:VqlX1NEKRURXMzHm@cluster0.8xlhv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://Kev:EqRxQtMp0eLoCtaR@cluster0.8xlhv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(()=>{
        console.log('Well connected to the mongoDB Atlas');
    })
    .catch((error)=>{
        console.log('Unable to connect to mongoDB Atlas');
        console.log(error);
});    








module.exports = app;
