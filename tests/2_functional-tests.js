const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { test } = require('mocha');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(5000);
  test('', (done) => {
    chai
      .request(server)
      .get('/api/')
  })
});
