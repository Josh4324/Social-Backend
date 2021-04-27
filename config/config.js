require('dotenv').config()

let DB;

if (process.env.NODE_ENV === "development"){
    //connection url
    DB = process.env.MONGOLAB_URI_DEV;
}else {
    DB = process.env.MONGOLAB_URI_PROD;
}

module.exports = DB;