module.exports = function(app, sql, sqlConfig){
    app.get('/subcategory/add/:name.:parentId', function(req, res){
        console.log('call to api/subcategory/add');
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var name = req.params.name;
                var parentId = req.params.parentId;

                var request = pool.request();
                
                var queryText = `insert into dbo.SubCategories([Name], CreatedAt, CategoryId) \
                                    values('${name}', getdate(), ${parentID})`;

                    request.query(queryText, (err, recordset) => {
                            if(err) console.log(err);

                            var data = {
                                success: true,
                                message: 'added subcategory',
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

    app.get('/subcategory/remove/:id', function(req, res){
        console.log('call to api/subcategory/remove');
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

    app.get('/subcategory/update/:id.:name', function(req, res){
        console.log('call to api/subcategory/update');
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var id = req.params.id;
                var name = req.params.name;

                var request = pool.request();
                
                var queryText = `update dbo.SubCategories set [Name] = '${name}'
                                where [SubCategoryId] = '${id}'`;

                    request.query(queryText, (err, recordset) => {
                            if(err) console.log(err);

                            var data = {
                                success: true,
                                message: 'subcategory updated',
                                device: name,
                                rowsAffected: recordset.rowsAffected
                            }

                            res.send(data);
                    })
        });
        
        pool.on('error', err => {
            res.send({error: err, success:false});
        });
    })

    app.get('/subcategory/all', function(req, res){
        console.log(`${new Date()}: get all subcategories`);
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var category = req.params.categoryId;

                var request = pool.request();
                
                var queryText = `select * from dbo.SubCategories`;

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

    app.get('/subcategory/:id', function(req, res){
        console.log(`${new Date()}: get a subcategory`);
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var id = req.params.id;

                var request = pool.request();
                
                var queryText = `select * from dbo.SubCategories where SubCategoryId = ${id}`;

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

    
    app.get('/subcategory/parent/:id', function(req, res){
        console.log(`${new Date()}: get by subcategory parent`);
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var id = req.params.id;

                var request = pool.request();
                
                var queryText = `select * from dbo.SubCategories where CategoryId = ${id}`;

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