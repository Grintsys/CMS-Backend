process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
let server = 'http://localhost:8090';

chai.use(chaiHttp);

describe('Products', () => {
    describe('/GET products', () => {
        it('it should GET all the products', (done) => {
          chai.request(server)
              .get('/product/all')
              .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('object');
                    expect(res.body.success).to.be.eq(true);
                    expect(res.body.data).to.be.an('array');
                done();
              });
        });
    });

    describe('/POST products', () => {
        it('it should POST a new product', (done) => {
          chai.request(server)
              .post('/product/add')
              .type('form')
              .send({
                    SubCategoryId: 1,
                    BrandId: 1,
                    PartNumber: 123,
                    Name: 'Prueba producto',
                    Description: 'Prueba descripcion',
                    Qty: 0,
                    Price: 0,
                    file: ''
               })
              .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('object');
                    expect(res.body.success).to.be.eq(true);
                    expect(res.body.data).to.be.an('array');
                done();
              });
        });
    });
});