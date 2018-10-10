module.exports = function(app, sql, sqlConfig){

    app.get('/productattributevalue/add/:productId.:attributeId.:value', function(req, res){
        console.log('call to api/productattribute/add');
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var productId = req.params.productId;
                var attributeId = req.params.attributeId;
                var value = req.params.value;

                var request = pool.request();
                
                var queryText = `insert into dbo.ProductAttributeValues(ProductId, [ProductAttributeId], [Value], CreatedAt) \
                                 values(${productId}, ${attributeId}, '${value}', getdate())`;

                    request.query(queryText, (err, recordset) => {
                            if(err) console.log(err);

                            var data = {
                                success: true,
                                message: 'added productattributevalue',
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
                            }

                            res.send(data);
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

    app.get('/productattributevalue/product/:id', function(req, res){
        console.log(`${new Date()}: get a productattributevalues`);
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var id = req.params.id;

                var request = pool.request();
                
                var queryText = `select a.ProductAttributeId, 
                                        a.ProductId,
                                        c.[Name] as [Name],
                                        b.[Name] as ProductName,
                                        a.[Value],
                                        a.CreatedAt
                                from dbo.ProductAttributeValues a
                                        inner join dbo.Products b on a.ProductId = b.ProductId
                                        inner join dbo.ProductAttributes c on c.ProductAttributeId = a.ProductAttributeId
                                where a.ProductId = ${id}`;

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