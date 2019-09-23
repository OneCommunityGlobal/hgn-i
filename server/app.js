//"use strict";

// Module dependencies
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var fs = require('fs');

var config = require('./config/config.json');

var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
//Alternatives to making db global ?
db = null;

// Loading middleware
// app.use(bodyParser.urlencoded({ extended: true }));
//Wrap bodyParser so it will respond more gracefully if sent bad JSON
app.use((req, res, next) => {
    bodyParser.json()(req, res, err => {
        if (err) {
            console.error(err);
            return res.sendStatus(400);
        }

        next();
    });
});

var routes = require('./routes/router');

app.use(function (req, res, next) {
    //TODO if CORS problem then set these :
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
    next();
});

app.use(routes);

(async function () {
    const client = new MongoClient(config.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    app.locals.mongoClient = client;

    try {
        await client.connect();
        console.log("Connected to MongoDB server");

        //TODO decide how to best pass db down thru app to models
        db = client.db(config.database);
        app.locals.db = db;

        app.listen(config.port);
        console.log("Listening on port:", config.port);
    } catch (err) {
        console.log(err.stack);
    }
})();
