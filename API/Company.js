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

    updateAddress = (company, address, number) => {

        var queryText = `update [dbo].[CompanyAddress]
                            set [Address] = '${address}' 
                    where [dbo].[CompanyAddress].[companyId] = '${company}'
                      and [dbo].[CompanyAddress].[CompanyAdressId] = ${number}`;

        new sql.ConnectionPool(sqlConfig).connect().then(pool => {
            return pool.query(queryText)
        }).then(phones => {
            return true;
        }).catch(err => {
            return next(err);
        });
    }

    updateProne = (company, phone, number) => {

        var queryText = `update [dbo].[CompanyPhones]
                            set [Phone] = '${phone}' 
                    where [dbo].[CompanyPhones].[CompanyId] = '${company}'
                      and [dbo].[CompanyAddress].[CompanyPhoneId] = ${number}`;

        new sql.ConnectionPool(sqlConfig).connect().then(pool => {
            return pool.query(queryText)
        }).then(phones => {
            return true;
        }).catch(err => {
            return next(err);
        });
    }

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
        let id = req.params.id;

        if(!id){
            res.status(401).send({ success: false, message: 'error no id is specified'});
        }

        new sql.ConnectionPool(sqlConfig).connect().then(pool => {
            return pool.query(`select top 1 * from [dbo].[Company] where CompanyId = ${id}`)
        }).then(result => {

            var data = {
                success: true,
                message: '',
                data: result.recordset.length > 0 ? result.recordset[0]: null,
             }

             res.send(data);
           
        }).catch(err => {
            res.send({ success: false, message: err });
        });
    })

    app.post('/company/:id/edit', function(req, res){
        console.log('call to api/company/edit');

        var id = req.params.id;
        var name = req.body.name;
        var rtn = req.body.rtn;
        var email = req.body.email;
        var tel_principal = req.body.tel_principal;
        var tel_alterno = req.body.tel_alterno;
        var tel_secundario = req.body.tel_secundario;
        var address1 = req.body.address1;
        var address2 = req.body.address2;

        var attributes = '';

        if(!name){
            res.status(401).send({ message: 'missing name parameter'});
        }

        if(rtn){
            attributes += `, [RTN] = ${rtn}`;
        }

        if(email){
            attributes += `, [Email] = ${email}`;
        }

        if(tel_principal){
            updateProne(1, tel_principal, 1);
        }

        if(tel_secundario){
            updateProne(1, tel_secundario, 2);
        }

        if(tel_alterno){
            updateProne(1, tel_alterno, 3);
        }

        if(address1){
            updateAddress(1, address1, 1);
        }

        if(address2){
            updateAddress(1, address2, 1);
        }

        var queryText = `update [dbo].[Company]
                                set [Name] = '${name}' 
                                ${attributes}
                        where [dbo].[Company].[companyId] = '${id}'`;

        new sql.ConnectionPool(sqlConfig).connect().then(pool => {
            return pool.query(queryText)
        }).then(phones => {
            phoneslist = phones.recordset;

            var data = {
                success: true,
                message: '',
                data: {
                    company: result.recordset,
                    addesses: addresslist,
                    phones: phoneslist,
                }
             }
             res.send(data);
        }).catch(err => {
            res.send({ success: false, message: err });
        });
    })

    app.get('/company/:id/address', function(req, res){
        console.log(`${new Date()}: get a company`);

        let addresslist = [];
        let id = req.params.id;

        if(!id){
            res.status(401).send({ success: false, message: 'error no id is specified'});
        }

        new sql.ConnectionPool(sqlConfig).connect().then(pool => {
            return pool.query(`select * from [dbo].[CompanyAddress] where CompanyId = ${id}`)
        }).then(address => {
            addresslist = address.recordset;

            var data = {
                success: true,
                message: '',
                data: addresslist,
             }

             res.send(data);
        }).catch(err => {
            res.send({ success: false, message: err });
        });
    })

    app.get('/company/:id/phones', function(req, res){
        console.log(`${new Date()}: get a company`);

        let id = req.params.id;

        if(!id){
            res.status(401).send({ success: false, message: 'error no id is specified'});
        }

        new sql.ConnectionPool(sqlConfig).connect().then(pool => {
            return pool.query(`  SELECT a.CompanyId,
                                        a.Phone,
                                        b.[Name] [Type]
                                FROM [dbo].[CompanyPhones] a
                                        inner join [dbo].[PhoneTypes] b on a.PhoneTypeId = b.PhoneTypeId
                                        where a.CompanyId = ${id}`)
        }).then(phones => {
            var data = {
                success: true,
                message: '',
                data: phones.recordset,
             }
             res.send(data);
        }).catch(err => {
            res.send({ success: false, message: err });
        });
    })

    app.get('/company/:id/all', function(req, res){
        console.log(`${new Date()}: get a company`);

        let addresslist = [];
        let phoneslist = [];

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
            }).then(address => {
                addresslist = address.recordset;

                new sql.ConnectionPool(sqlConfig).connect().then(pool => {
                    return pool.query(`  SELECT a.CompanyId,
                                                a.Phone,
                                                b.[Name] [Type]
                                        FROM [dbo].[CompanyPhones] a
                                                inner join [dbo].[PhoneTypes] b on a.PhoneTypeId = b.PhoneTypeId
                                                where a.CompanyId = ${id}`)
                }).then(phones => {
                    phoneslist = phones.recordset;
    
                    var data = {
                        success: true,
                        message: '',
                        data: {
                            company: result.recordset,
                            addesses: addresslist,
                            phones: phoneslist,
                        }
                     }
                     res.send(data);
                }).catch(err => {
                    res.send({ success: false, message: err });
                });
            }).catch(err => {
                res.send({ success: false, message: err });
            });
        }).catch(err => {
            res.send({ success: false, message: err });
        });
    })
}