var express = require('express'); // Web Framework
var cors = require('cors');
var app = express();
var sql = require('mssql'); // MS Sql Server client
var path = require('path'); //library to handle extensions
//const uuidv4 = require('uuid/v4');

var bodyParser = require('body-parser');
var dotenv = require('dotenv');
const result = dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var multer  = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+'.'+getExtension(file.originalname))
    }
  })
  
var upload = multer({ storage: storage })

app.use('/', express.static(path.join(__dirname, 'uploads/')));
app.use(logError);
app.use(clientErrorHandler);
app.use(errorHandler);

//Configuraciona
const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),
    debug: true,
    options: {
        encrypt: true,
        //instanceName: 'SQLEXPRESS'
    }
};

function logError(err, res, req, next){
  console.log(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}

function getExtension(filename) {
    var ext = path.extname(filename||'').split('.');
    return ext[ext.length - 1];
}

var server = app.listen(parseInt(process.env.APP_PORT), function () {

    if (result.error) {
      if (result.error.code === "ENOENT") {
        console.info("expected this error because we are in production without a .env file")
      } else {
        throw result.error
      }
    }

    var host = server.address().address
    var port = server.address().port

    console.log("inplas API listening at http://%s:%s", host, port)
});

require("./Category")(app, sql, sqlConfig, upload);
require("./Product")(app, sql, sqlConfig, upload);
require("./SubCategory")(app, sql, sqlConfig);
require("./Brand")(app, sql, sqlConfig);
require("./ProductAttribute")(app, sql, sqlConfig);
require("./ProductAttributesValue")(app, sql, sqlConfig);
require("./Company")(app, sql, sqlConfig);
require("./CoverPage")(app, sql, sqlConfig, upload);
require("./User")(app, sql, sqlConfig);