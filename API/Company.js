module.exports = function(app, sql, sqlConfig){
    app.get('/company/add/:name', function(req, res){
        console.log('call to api/company/add');
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
                                message: 'added company',
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

    app.get('/company/remove/:id', function(req, res){
        console.log('call to api/company/remove');
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var id = req.params.id;

                var request = pool.request();
                
                var queryText = `delete from dbo.Categories where dbo.Categories.companyId = ${id}`;

                    request.query(queryText, (err, recordset) => {
                            if(err) console.log(err);

                            var data = {
                                success: true,
                                message: 'company deleted',
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

    app.get('/company/update/:id.:name', function(req, res){
        console.log('call to api/company/update');
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var id = req.params.id;
                var name = req.params.name;

                var request = pool.request();
                
                var queryText = `update dbo.Categories set [Name] = '${name}'
                                where [companyId] = '${id}'`;

                    request.query(queryText, (err, recordset) => {
                            if(err) console.log(err);

                            var data = {
                                success: true,
                                message: 'company updated',
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

    app.get('/company/all', function(req, res){
        console.log(`${new Date()}: get all companies`);
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var company = req.params.companyId;

                var request = pool.request();
                
                var queryText = `select * from Companies`;

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

    app.get('/company/:id', function(req, res){
        console.log(`${new Date()}: get a company`);

        let addresslist = [];

        let id = req.params.id;

        if(!id){
            res.status(401).send({ success: false, message: 'error no id is specified'});
        }

        new sql.ConnectionPool(sqlConfig).connect().then(pool => {
            return pool.query(`select top 1 * from [dbo].[Company] where CompanyId = ${id}`)
        }).then(result => {
            if(result.recordset.length == 0){
                res.status(401).send({ success: false, message: 'error no record found'});
            }
            new sql.ConnectionPool(sqlConfig).connect().then(pool => {
                return pool.query(`select * from [dbo].[CompanyAddress] where CompanyId = ${id}`)
            }).then(result => {
                addresslist = result.recordset;
            }).catch(err => {
                res.send({ success: false, message: err });
            });

            var data = {
               success: true,
               message: '',
               data: {
                   company: result.recordset,
                   addesses: addresslist
               }
            }
            res.send(data);
        }).catch(err => {
            res.send({ success: false, message: err });
        });
    })
}