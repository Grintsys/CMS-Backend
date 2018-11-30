
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index');
var should = chai.should();

chai.use(chaiHttp);

describe('Inplas', () => {
    it('Deberia de mostrar todos los productos en GET: /api/product/all', (done) => {
        chai.request(server)
        .get('/product/all')
        .end(function(err, res){
           // res.should.have.status(200);
            done();
        })
    })
    it('Deberia de crear un nuevo producto en POST: /api/product/create')
    it('Deberia de eliminar un producto en DELETE: /api/product/:id/remove')
})