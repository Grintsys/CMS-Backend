process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let server = 'http://localhost:8090';

chai.use(chaiHttp);

describe('Products', () => {
    describe('/GET products', () => {
        it('it should GET all the products', (done) => {
          chai.request('http://localhost:8090')
              .get('/product/all')
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                done();
              });
        });
    });
});