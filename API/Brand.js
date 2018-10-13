module.exports = function(app, sql, sqlConfig){
    app.get('/brand/add/:name', function(req, res){
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var name = req.params.name;

                var request = pool.request();
                
                var queryText = `insert into dbo.Brands([Name]) \
                                    values('${name}')`;

                    request.query(queryText, (err, recordset) => {
                            if(err) console.log(err);

                            var data = {
                                success: true,
                                message: 'added brand'
                            }

                            res.send(data);
                    })
        });
        
        pool.on('error', err => {
            res.send({error: err, success:false});
        });
    })

    app.get('/brand/remove/:id', function(req, res){
        console.log('call to api/brand/remove');
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var id = req.params.id;

                var request = pool.request();
                
                var queryText = `delete from dbo.Brands where dbo.Brands.BrandId = ${id}`;

                    request.query(queryText, (err, recordset) => {
                            if(err) console.log(err);

                            var data = {
                                success: true,
                                message: 'brand deleted'
                            }

                            res.send(data);
                    })
        });
        
        pool.on('error', err => {
            res.send({error: err, success:false});
        });
    })

    app.get('/brand/update/:id.:name', function(req, res){
        console.log('call to api/brand/update');
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var id = req.params.id;
                var name = req.params.name;

                var request = pool.request();
                
                var queryText = `update dbo.Brands set [Name] = '${name}'
                                where [BrandId] = '${id}'`;

                    request.query(queryText, (err, recordset) => {
                            if(err) console.log(err);

                            var data = {
                                success: true,
                                message: 'brand updated'
                            }

                            res.send(data);
                    })
        });
        
        pool.on('error', err => {
            res.send({error: err, success:false});
        });
    })

    app.get('/brand/all', function(req, res){
        console.log(`${new Date()}: get all brands`);
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var request = pool.request();
                
                var queryText = `select * from dbo.Brands`;

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

    app.get('/brand/:id', function(req, res){
        console.log(`${new Date()}: get a brand`);
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var id = req.params.id;

                var request = pool.request();
                
                var queryText = `select * from dbo.Brands where BrandId = ${id}`;

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