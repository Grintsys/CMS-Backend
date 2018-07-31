module.exports = function(app, sql, sqlConfig){

    app.post('/user/login', function(req, res, next){
        console.log('call to api/user/login');
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                console.log(req.body);
                var user = req.body.User;
                var password = req.body.Password;

                console.log("U: "+user+" P: "+password);

                var request = pool.request();
                
                var queryText = `select top 1 *
                                   from dbo.Users a 
                                  where a.Email = '${user}'  
                                    and a.[Password] = '${password}'`;

                console.log(queryText);

                    request.query(queryText, (err, recordset) => {
                            if(err) console.log(err);

                            let data = [];

                            if(recordset.rowsAffected > 0){
                                data = {
                                    success: true,
                                    message: 'user loged',
                                }    
                            } else {
                                data = {
                                    success: false,
                                    message: 'No Se puede iniciar sesion usuario o contrasena incorrectos',
                                }
                            }

                            res.send(data);
                    })
        });
        
        pool.on('error', err => {
            res.send({error: err, success:false});
        });
    })

    app.get('/user/add/:email.:password', function(req, res){
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var email = req.params.email;
                var password = req.params.password;

                var request = pool.request();
                
                var queryText = `insert into dbo.Users(Email, [Password], LastLogin, LoginAttempts, CreatedAt) \
                                    values('${email}', '${password}', null, 0, getdate())`;

                    request.query(queryText, (err, recordset) => {
                            if(err) console.log(err);

                            var data = {
                                success: true,
                                message: 'added user',
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

    app.get('/user/remove/:id', function(req, res){
        console.log('call to api/user/remove');
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var id = req.params.id;

                var request = pool.request();
                
                var queryText = `delete from dbo.Users where dbo.Users.UserId = ${id}`;

                    request.query(queryText, (err, recordset) => {
                            if(err) console.log(err);

                            var data = {
                                success: true,
                                message: 'user deleted',
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

    app.get('/user/all', function(req, res){
        console.log(`${new Date()}: get all users`);
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var request = pool.request();
                
                var queryText = `select * from dbo.Users`;

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

    app.get('/user/:id', function(req, res){
        console.log(`${new Date()}: get a user`);
        const pool = new sql.ConnectionPool(sqlConfig, err => {
                if(err) console.log(err);

                var id = req.params.id;

                var request = pool.request();
                
                var queryText = `select * from dbo.Users where UserId = ${id}`;

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