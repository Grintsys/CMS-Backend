module.exports = function(app, sql, sqlConfig){
    app.get('/productattributevalue/add/:name', function(req, res){
        console.log('call to api/productattribute/add');
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var attibuteId = req.params.attibuteId;
                var productId = req.params.productId;
                var value = req.params.value;

                var request = pool.request();
                
                var queryText = `insert into dbo.ProductAttributeValues(ProductAttributeId, ProductId, [Value], CreatedAt) \
                                 values(${attibuteId}, ${productId}, ${value}, getdate())`;

                    request.query(queryText, (err, recordset) => {
                            if(err) console.log(err);

                            var data = {
                                success: true,
                                message: 'added productattributevalue',
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

    app.get('/productattributevalue/remove/:id', function(req, res){
        console.log('call to api/productattributevalue/remove');
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var id = req.params.id;

                var request = pool.request();
                
                var queryText = `delete from dbo.ProductAttributeValues where dbo.ProductAttributeValues.ProductAttributeValuesId = ${id}`;

                    request.query(queryText, (err, recordset) => {
                            if(err) console.log(err);

                            var data = {
                                success: true,
                                message: 'ProductAttributeValues deleted',
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

    app.get('/productattributevalue/update/:id.:vale', function(req, res){
        console.log('call to api/productattributevalue/update');
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var id = req.params.id;
                var value = req.params.value;

                var request = pool.request();
                
                var queryText = `update dbo.ProductAttributeValues set [Value] = '${name}'
                                where [ProductAttributeValueId] = '${value}'`;

                    request.query(queryText, (err, recordset) => {
                            if(err) console.log(err);

                            
                            if(recordset.recordset.length > 0)
                            {
                                console.log("Success Login for student "+username);

                                var result = {
                                    success: true, 
                                    users: recordset.recordset
                                }; 

                                res.send(result);
            
                            } else {

                                var data = {
                                    success: false,
                                    message: 'Wrong username or password',
                                    device: name,
                                    rowsAffected: recordset.rowsAffected
                                };

                                res.send(data);
                            }
                    })
        });
        
        pool.on('error', err => {
            res.send({error: err, success:false});
        });
    })

    app.get('/productattributevalue/all', function(req, res){
        console.log(`${new Date()}: get all productattributevalues`);
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var request = pool.request();
                
                var queryText = `select * from dbo.ProductAttributeValues`;

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

    app.get('/productattributevalue/:id', function(req, res){
        console.log(`${new Date()}: get a productattributevalues`);
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var id = req.params.id;

                var request = pool.request();
                
                var queryText = `select * from dbo.ProductAttributeValues where ProductAttributeValueId = ${id}`;

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