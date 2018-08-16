module.exports = function(app, sql, sqlConfig, upload){

    app.post('/product/add', upload.single('file'), function (req, res, next) {
        console.log('call to api/product/add');
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var subCategory = req.body.SubCategoryId;
                var brandId = req.body.BrandId;
                var partNumber = req.body.PartNumber;
                var name = req.body.Name;
                var description = req.body.Description;
                var qty = req.body.Qty;
                var price = req.body.Price;
                var file = req.file.filename;               

                var request = pool.request();
                
                var queryText = `insert into dbo.Products([SubCategoryId], BrandId, PartNumber, [Name], [Description], [Qty], [Price], IsActive, CreatedAt) \
                                                  values (${subCategory}, ${brandId}, ${partNumber}, '${name}', '${description}', ${qty}, ${price}, 1, getdate())`;

                if (req.file)
                {
                    queryText = `insert into dbo.Products(ImageUrl, [SubCategoryId], BrandId, PartNumber, [Name], [Description], [Qty], [Price], IsActive, CreatedAt) \
                                                  values ('${file}', ${subCategory}, ${brandId}, '${partNumber}', '${name}', '${description}', ${qty}, ${price}, 1, getdate())`;
                }

                console.log(queryText);

                var request = pool.request();
                
                    request.query(queryText, (err, recordset) => {
                            if(err) console.log(err);

                            var data = {
                                success: true,
                                message: 'product added',
                                product: name,
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

    app.post('/product/edit', upload.single('file'), function (req, res, next) {
        console.log('call to api/product/add');
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var productId = req.body.ProductId;
                var subCategory = req.body.SubCategoryId;
                var brandId = req.body.BrandId;
                var partNumber = req.body.PartNumber;
                var name = req.body.Name;
                var description = req.body.Description;
                var qty = req.body.Qty;
                var price = req.body.Price;
                var file = req.file.filename;               

                var request = pool.request();
                
                var queryText = `update dbo.Products \
                    set BrandId = ${brandId}, 
                    SubCategoryId = ${subCategory},
                    PartNumber = '${partNumber}', 
                    [Name] = '${name}', 
                    [Description] = '${description}', 
                    [Qty] = ${qty}, 
                    [Price] = ${price}
                    where dbo.Products.ProductId = ${productId}`

                if (req.file)
                {
                    queryText = `update dbo.Products \
                    set BrandId = ${brandId}, 
                    SubCategoryId = ${subCategory},
                    PartNumber = '${partNumber}', 
                    [Name] = '${name}', 
                    [Description] = '${description}', 
                    [Qty] = ${qty}, 
                    [Price] = ${price},
                    [ImageUrl] = '${file}'
                    where dbo.Products.ProductId = ${productId}`
                }

                console.log(queryText);

                var request = pool.request();
                
                    request.query(queryText, (err, recordset) => {
                            if(err) console.log(err);

                            var data = {
                                success: true,
                                message: 'product edited',
                                product: name,
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
 
    app.get('/product/remove/:id', function(req, res){
        console.log('call to api/product/remove');
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var id = req.params.id;

                var request = pool.request();
                
                var queryText = `delete from dbo.Products where dbo.Products.ProductId = ${id}`;

                    request.query(queryText, (err, recordset) => {
                            if(err) console.log(err);

                            var data = {
                                success: true,
                                message: 'product deleted',
                                productId: id,
                                rowsAffected: recordset.rowsAffected
                            }

                            res.send(data);
                    })
        });
        
        pool.on('error', err => {
            res.send({error: err, success:false});
        });
    })

    
    app.get('/product/all', function(req, res){
        console.log(`${new Date()}: get all products`);
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 12;

                var request = pool.request();
                
                var queryText = `select top ${limit} a.ProductId,
                a.PartNumber,
                a.ImageUrl,
                a.Price,
                a.[Qty],
                a.[Name],
                a.[Description],
                b.[Name] Subcategory,
                a.SubCategoryId,
                c.[Name] Category,
                d.[Name] Brand,
                a.BrandId
            from dbo.Products a
                    left join dbo.Subcategories b on a.SubCategoryId = b.SubCategoryId
                    left join dbo.Categories c on c.CategoryId = b.CategoryId
                    left join dbo.Brands d on d.BrandId = a.BrandId
            where a.IsActive = 1`;

                request.query(queryText, (err, recordset) => {
                    if(err) {
                        console.log(err);                               
                        var data = {
                            success: false,
                            message: err,
                        }
                        res.send(data);
                    } else {
                        var data = {
                            success: true,
                            message: '',
                            data: recordset.recordset
                        }
                        res.send(data);
                    }
                })
        });
        
        pool.on('error', err => {
            res.send({error: err, success:false});
        });
    })

    app.get('/product/search/:keyword', function(req, res){
        console.log(`${new Date()} search products`);
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var keyword = req.params.keyword;
                var limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 12;

                var request = pool.request();
                
                var queryText = 
                `select top ${limit} a.ProductId,
                a.PartNumber,
                a.ImageUrl,
                a.Price,
                a.[Qty],
                a.[Name],
                a.[Description],
                b.[Name] Subcategory,
                a.SubCategoryId,
                c.[Name] Category,
                d.[Name] Brand,
                a.BrandId
            from dbo.Products a
                 left join dbo.Subcategories b on a.SubCategoryId = b.SubCategoryId
                 left join dbo.Categories c on c.CategoryId = b.CategoryId
                 left join dbo.Brands d on d.BrandId = a.BrandId
           where a.IsActive = 1
	     	 and (a.PartNumber like '%${keyword}%' 
			  or a.[Name] like '%${keyword}%'
			  or a.[Description] like '%${keyword}%'
			  or b.[Name] like '%${keyword}%'
			  or c.[Name] like '%${keyword}%'
			  or d.[Name] like '%${keyword}%')`;

                request.query(queryText, (err, recordset) => {
                            if(err) {
                                console.log(err);                               
                                var data = {
                                    success: false,
                                    message: err,
                                }
                                res.send(data);
                            } else {
                                var data = {
                                    success: true,
                                    message: '',
                                    data: recordset.recordset
                                }
                                res.send(data);
                            }
                })
        });
        
        pool.on('error', err => {
            var data = {
                success: false,
                message: err,
            }
            res.send(data);
        });
    })

    app.get('/product/:id', function(req, res){
        console.log(`${new Date()}: get a product`);
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var id = req.params.id;

                var request = pool.request();
                
                var queryText = `select * from dbo.Products where ProductId = ${id}`;

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