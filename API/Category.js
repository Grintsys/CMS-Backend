module.exports = (app, sql, sqlConfig, upload) => {

    app.post('/category/add', upload.single('file'), (req, res, next) => {

        const pool = new sql.ConnectionPool(sqlConfig, function(){

                var name = req.body.name;
                var file = req.file.filename;

                var queryText = "";

                if (req.file)
                {
                    queryText = `insert into dbo.Categories([Name], [ImageUrl], CreatedAt) \
                    values('${name}', '${file}', getdate())`;
                } else{
                    queryText = `insert into dbo.Categories([Name], CreatedAt) \
                    values('${name}', getdate())`;
                }

                var request = pool.request();
                
                request.query(queryText);

                request.on('done', result => {
                        var data = {
                            success: true,
                            message: 'category added',
                            category: name,
                            image: file,
                            rowsAffected: result.rowsAffected
                        }
                        res.send(data);
                })
        })
    });

    app.get('/category/remove/:id', function(req, res){
        console.log('call to api/category/remove');
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var id = req.params.id;

                var request = pool.request();
                
                var queryText = `delete from dbo.Categories where dbo.Categories.CategoryId = ${id}`;

                    request.query(queryText, (err, recordset) => {
                            
                            if(err) 
                            { 
                                console.log(err);
                                var data = {
                                    success: false,                             
                                    message: 'error on delete',
                                }                             
                                res.send(data);
                            }
                            else {
                                var data = {
                                    success: true,
                                    message: 'category deleted',
                                    rowsAffected: recordset.rowsAffected
                                }                             
                                res.send(data);
                            }
                   
                    })
        });
        
        pool.on('error', err => {
            res.send({error: err, success:false});
        });
    })

    app.post('/category/edit', upload.single('file'), function (req, res) {

        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var id = req.body.id;
                var name = req.body.name;
                var file = req.file.filename;

                let editCommand = "";

                if (req.file)
                {
                    editCommand = `, [ImageUrl] = '${file}'`
                }

                var request = pool.request();
                
                var queryText = `update dbo.Categories 
                                    set [Name] = '${name}'
                                    ${editCommand}
                                where [CategoryId] = '${id}'`;
                //console.log(queryText);

                    request.query(queryText, (err, recordset) => {
                            if(err) console.log(err);

                            var data = {
                                success: true,
                                message: 'category updated',
                                category: name,
                                image: file,
                                rowsAffected: recordset.rowsAffected
                            }

                            res.send(data);
                    })
        });
        
        pool.on('error', err => {
            res.send({error: err, success:false});
        });
    });

    app.get('/category/all', function(req, res, next){
        console.log(`${new Date()}: get all categories`);

        new sql.ConnectionPool(sqlConfig).connect().then(pool => {
            return pool.query(`select * from dbo.Categories`)
        }).then(result => {
            var data = {
               success: true,
               message: '',
               data: result.recordset
            }
            res.send(data);
        }).catch(err => {
            res.send({ success: false, message: err });
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
}