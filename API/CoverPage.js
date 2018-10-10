module.exports = function(app, sql, sqlConfig, upload){
    
    app.post('/coverpage/add', upload.single('file'), function (req, res, next) {
        console.log('call to api/conver/add');
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var header = req.body.HeaderText;
                var subheader = req.body.SubHeaderText;
                var pos = req.body.Position;
                var file = req.file.filename;               

                var request = pool.request();

                var queryText = `insert into dbo.CoverPage([HeaderText], SubHeaderText, Position) \
                    values('${header}', '${subheader}', ${pos})`;

                if (req.file)
                {
                    queryText = `insert into dbo.CoverPage([HeaderText], SubHeaderText, ImageUrl, Position) \
                    values('${header}', '${subheader}', '${file}', ${pos})`;
                }

                console.log(queryText);

                var request = pool.request();
                
                    request.query(queryText, (err, recordset) => {
                            if(err) console.log(err);

                            var data = {
                                success: true,
                                message: 'conver added',
                                conver: header,
                                //image: file,
                                //rowsAffected: recordset.rowsAffected
                            }

                            res.send(data);
                    })
        });
        
        pool.on('error', err => {
            res.send({error: err, success:false});
        });
    });

    app.post('/coverpage/edit', upload.single('file'), function (req, res, next) {
        console.log('call to api/cover/edit');
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var id = req.body.FrontCoverPageId;
                var header = req.body.HeaderText;
                var subheader = req.body.SubHeaderText;
                var pos = req.body.Position;   
                var file = '';           

                var request = pool.request();

                var queryText = `update dbo.CoverPage
                                    set [HeaderText] = '${header}', SubHeaderText = '${subheader}', Position = ${pos} \
                                  where [FrontCoverPageId] = ${id}`;

                if (req.file)
                {
                    file = req.file.filename; 
                    queryText = `update dbo.CoverPage
                                    set [HeaderText] = '${header}', SubHeaderText = '${subheader}', Position = ${pos}, ImageUrl = '${file}' \
                                  where [FrontCoverPageId] = ${id}`;
                }

                console.log(queryText);

                var request = pool.request();
                
                    request.query(queryText, (err, recordset) => {
                            if(err) console.log(err);

                            var data = {
                                success: true,
                                message: 'conver edited',
                                conver: header,
                                image: file,
                                //rowsAffected: recordset.rowsAffected
                            }

                            res.send(data);
                    })
        });
        
        pool.on('error', err => {
            res.send({error: err, success:false});
        });
    });

    app.get('/coverpage/remove/:id', function(req, res){
        console.log('call to api/coverpage/remove');
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var id = req.params.id;

                var request = pool.request();
                
                var queryText = `delete from dbo.CoverPage where dbo.CoverPage.[FrontCoverPageId] = ${id}`;

                    request.query(queryText, (err, recordset) => {
                            if(err) console.log(err);

                            var data = {
                                success: true,
                                message: 'coverpage deleted',
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

    app.get('/coverpage/all', function(req, res){
        console.log(`get all covers`);
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var request = pool.request();
                
                var queryText = `select top 100 * from dbo.CoverPage a order by a.[Position] asc`;

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

    app.get('/coverpage/:id', function(req, res){
        console.log(`${new Date()}: get a coverpage`);
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var id = req.params.id;

                var request = pool.request();
                
                var queryText = `select * from dbo.CoverPage where CoverPageId = ${id}`;

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