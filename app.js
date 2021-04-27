const express = require("express");
const mongoose = require("mongoose");
const Middleware = require("./middlewares/common");
require("dotenv").config();
const chalk = require('chalk');
const Response = require('./helpers/Response');
const DB = require('./config/config')

const userRoutes = require("./routes/user");

const port = process.env.PORT || 3000;


const app = express();
Middleware(app);


//REGISTER ROUTES HERE
app.use("/api/v1/user", userRoutes);

app.get("/", (req, res) => {
    const response = new Response(
        true,
        200,
        `Welcome to Node Auth Template Mongodb ${port}`,
      );
    res.status(response.code).json(response);
});


//Handling unhandle routes
app.all("*", (req, res, next) => {
    const response = new Response(
        false,
        404,
        `Page not found. Can't find ${req.originalUrl} on this server`,
      );
    return res.status(response.code).json(response);
});

// Database Connection

const connect = async() => {
    try {
        const connection = await mongoose
      .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      console.log(chalk.green("Database Connected Succesfully"))
    }catch(err){
      console.log(chalk.red("Error connecting to database"));
    }
}

connect();



//listening to port
app.listen(port, () => {
    console.log(`Welcome to Node Auth Template Mongodb running on port ${port}`);
});


