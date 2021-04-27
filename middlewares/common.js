const express = require("express");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const morgan = require("morgan");


module.exports = function CommonMiddleware(app){

    app.use(
        express.json({
          limit: "10mb",
        })
    );

    app.use(
        express.urlencoded({
            limit: "10mb",
            extended: false,
            parameterLimit: 10000,
            })
    );


    //HTTP headers
    app.use(helmet());

    //Enable cors
    app.use(cors());

    //Against brute attack
    const rateLimiter = rateLimit({
    max: 200,
    windowMs: 60 * 60 * 1000,
    message: "Too many request from this IP, please try again in an hour!",
    });

    //rate liniter
    app.use("/api", rateLimiter);

    //NoSQL query injection - Data Sanitization
    app.use(mongoSanitize());

    //xss attack - Data Sanitization
    app.use(xss());

    //HTTP parament pollution
    app.use(hpp());

    app.use(morgan("common"));
}