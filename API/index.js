var express = require('express'); // Web Framework
var cors = require('cors');
var app = express();
var sql = require('mssql'); // MS Sql Server client
const uuidv4 = require('uuid/v4');

var bodyParser = require('body-parser');
var dotenv = require('dotenv');
const result = dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

var multer  = require('multer')
//var upload = multer({ dest: 'uploads/' })
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+'.'+getExtension(file.originalname))
    }
  })
  
var upload = multer({ storage: storage })
var path = require('path')

app.use('/', express.static(path.join(__dirname, 'uploads/')));

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

app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
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

process.on('SIGINT', () => {
    console.info('SIGINT signal received.')
  
    // Stops the server from accepting new connections and finishes existing connections.
    server.close(function(err) {
      if (err) {
        console.error(err)
        process.exit(1)
      }
    })
  })