var express = require('express'); // Web Framework
var cors = require('cors');
var app = express();
var sql = require('mssql'); // MS Sql Server client
//const fileUpload = require('express-fileupload');
const uuidv4 = require('uuid/v4');
//const fileUpload = require('express-fileupload');
var bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
//app.use(fileUpload());
//app.use('/upload', express.static(__dirname + '/upload'));
//const fileUpload = require('express-fileupload');
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
//app.use('/static', app.static(__dirname + '/uploads'))
//app.use(express.static('public'));
app.use('/', express.static(path.join(__dirname, 'uploads/')));

//Configuraciona
const sqlConfig = {
    user: 'inplas',
    password: 'inplas2018',
    server: 'localhost',
    database: 'inplas',
    port: 1433,
    debug: true,
    options: {
        encrypt: false,
        instanceName: 'SQLEXPRESS'
    }
};

function getExtension(filename) {
    var ext = path.extname(filename||'').split('.');
    return ext[ext.length - 1];
}

var server = app.listen(8090, function () {
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