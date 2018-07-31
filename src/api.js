var express = require('express'); // Web Framework
var cors = require('cors');
var app = express();
var sql = require('mssql'); // MS Sql Server client

app.use(cors());

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

var server = app.listen(8099, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("inplas API listening at http://%s:%s", host, port)
});

app.get('/category/add/:name', function(req, res){
    const pool = new sql.ConnectionPool(sqlConfig, err => {
            if(err) console.log(err);

            var name = req.params.name;

            var request = pool.request();
            
            var queryText = `insert into dbo.Categories([Name], CreatedAt) \
                                values('${name}', getdate())`;

                request.query(queryText, (err, recordset) => {
                        if(err) console.log(err);

                         var data = {
                            success: true,
                            message: 'added category',
                            device: name,
                            status: status,
                            rowsAffected: recordset.rowsAffected
                         }

                         res.send(data);
                })
    });
    
    pool.on('error', err => {
        res.send({error: err, success:false});
    });
})

app.get('/category/remove/:id', function(req, res){
    console.log('call to api/category/remove');
    const pool = new sql.ConnectionPool(sqlConfig, err => {
            if(err) console.log(err);

            var id = req.params.id;

            var request = pool.request();
            
            var queryText = `delete from dbo.Categories where dbo.Categories.CategoryId = ${id}`;

                request.query(queryText, (err, recordset) => {
                        if(err) console.log(err);

                         var data = {
                            success: true,
                            message: 'category deleted',
                            device: id,
                            rowsAffected: recordset.rowsAffected
                         }

                         res.send(data);
                })
    });
    
    pool.on('error', err => {
        res.send({error: err, success:false});
    });
})

app.get('/category/update/:id.name', function(req, res){
    console.log('call to api/category/update');
    const pool = new sql.ConnectionPool(sqlConfig, err => {
            if(err) console.log(err);

            var id = req.params.id;
            var name = req.params.name;

            var request = pool.request();
            
            var queryText = `update dbo.Categories set [Name] = ${name}
                             where [CategoryId] = '${id}'`;

                request.query(queryText, (err, recordset) => {
                        if(err) console.log(err);

                        var data = {
                            success: true,
                            message: 'category updated',
                            device: name,
                            status: status,
                            //rowsAffected: recordset.rowsAffected
                         }

                         res.send(data);
                })
    });
    
    pool.on('error', err => {
        res.send({error: err, success:false});
    });
})

app.get('/category/all', function(req, res){
    console.log(`${new Date()}: get all categories`);
    const pool = new sql.ConnectionPool(sqlConfig, err => {
            if(err) console.log(err);

            var category = req.params.categoryId;
            var count = req.params.count;

            var request = pool.request();
            
            var queryText = `select * from dbo.Categories`;

            request.query(queryText, (err, recordset) => {
                        if(err) console.log(err);

                         var data = {
                            success: true,
                            message: '',
                            data: recordset.recordset
                         }

                         res.send(data);
            })
    });
    
    pool.on('error', err => {
        res.send({error: err, success:false});
    });
})

app.get('/category/:id', function(req, res){
    console.log(`${new Date()}: get a category`);
    const pool = new sql.ConnectionPool(sqlConfig, err => {
            if(err) console.log(err);

            var id = req.params.id;

            var request = pool.request();
            
            var queryText = `select * from dbo.Categories where CategoryId = ${id}`;

            request.query(queryText, (err, recordset) => {
                        if(err) console.log(err);

                         var data = {
                            success: true,
                            message: '',
                            data: recordset.recordset
                         }

                         res.send(data);
            })
    });
    
    pool.on('error', err => {
        res.send({error: err, success:false});
    });
})
