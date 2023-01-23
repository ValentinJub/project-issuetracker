const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { test } = require('mocha');
const Issue = require('../models/issue')
const mongoose = require('mongoose');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(50000);
  let _id, updated_on, created_on, open, status_text, assigned_to, created_by, issue_text, issue_title;
  const fakeID = new mongoose.Types.ObjectId("97c527013a3813a7558392ce");
  suite('POST Requests to /api/issues/{projectname}', () => {
    test('Create an issue with every field', (done) => {
      chai
        .request(server)
        .post('/api/issues/apitest')
        .send({
          "issue_title": "Issue testf for chai",
          "issue_text": "Issue with all fields filled for chai",
          "created_by": "Chai tester",
          "assigned_to": "chai",
          "status_text": "in dev"
        })
        .end(async (err, res) => {
          if(err) return console.error(err)
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title,'Issue testf for chai');
          assert.equal(res.body.issue_text,'Issue with all fields filled for chai');
          assert.equal(res.body.created_by,'Chai tester');
          assert.equal(res.body.assigned_to,'chai');
          assert.equal(res.body.status_text,'in dev');
          assert.equal(res.body.open,true);
          _id = res.body._id
          try {
            let issue = await Issue.findById(_id);
            ({_id, updated_on, created_on, open, status_text, assigned_to, created_by, issue_text, issue_title} = issue)
            // console.log(updated_on);
            done();
          } catch (e) {
            console.error(e);
            done();
          }
        })
    });
    test('Create an issue with only required fields', (done) => {
      chai
        .request(server)
        .post('/api/issues/apitest')
        .send({
          "issue_title": "Issue test for chai",
          "issue_text": "Issue with only required fields for chai",
          "created_by": "Chai tester",
        })
        .end((err, res) => {
          if(err) return console.error(err)
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title,'Issue test for chai');
          assert.equal(res.body.issue_text,'Issue with only required fields for chai');
          assert.equal(res.body.created_by,'Chai tester');
          assert.equal(res.body.open,true);
          done();
        })
    });
    test('Create an issue with missing required fields', (done) => {
      chai
        .request(server)
        .post('/api/issues/apitest')
        .send({
          "issue_title": "Issue missing required fields for chai",
          "created_by": "Chai tester",
        })
        .end((err, res) => {
          if(err) return console.error(err)
          assert.equal(res.status, 200);
          assert.equal(res.body.error,'required field(s) missing');
          done();
        })
    });
  });
  suite('GET Requests to /api/issues/{projectname}', () => {
    test('View issues on a project', (done) => {
      chai
        .request(server)
        .get('/api/issues/apitest')
        .end((err, res) => {
          if(err) return console.error(err)
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.property(res.body[0], 'issue_title')
          assert.property(res.body[0], 'issue_text')
          assert.property(res.body[0], 'created_on')
          assert.property(res.body[0], 'updated_on')
          assert.property(res.body[0], 'created_by')
          assert.property(res.body[0], 'assigned_to')
          assert.property(res.body[0], 'open')
          assert.property(res.body[0], 'status_text')
          assert.property(res.body[0], '_id')
          done();
        })
    });
    test('View issues on a project with a filter', (done) => {
      chai
        .request(server)
        .get('/api/issues/apitest')
        .query({issue_title: issue_title})
        .end((err, res) => {
          if(err) {
            console.error(err)
            done();
          }
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.property(res.body[0], 'issue_title')
          assert.strictEqual(res.body[0].issue_title, issue_title)
          assert.property(res.body[0], 'issue_text')
          assert.strictEqual(res.body[0].issue_text, issue_text)
          assert.property(res.body[0], 'created_on')
          assert.property(res.body[0], 'updated_on')
          assert.property(res.body[0], 'created_by')
          assert.strictEqual(res.body[0].created_by, created_by)
          assert.property(res.body[0], 'assigned_to')
          assert.strictEqual(res.body[0].assigned_to, assigned_to)
          assert.property(res.body[0], 'open')
          assert.strictEqual(res.body[0].open, open)
          assert.property(res.body[0], 'status_text')
          assert.strictEqual(res.body[0].status_text, status_text)
          assert.property(res.body[0], '_id')
          done();
        });
    });
    test('View issues on a project with multiple filters', (done) => {
      chai
        .request(server)
        .get('/api/issues/apitest')
        .query({issue_title: issue_title, issue_text: issue_text})
        .end((err, res) => {
          if(err) {
            console.error(err)
            done();
          }
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.property(res.body[0], 'issue_title')
          assert.strictEqual(res.body[0].issue_title, issue_title)
          assert.property(res.body[0], 'issue_text')
          assert.strictEqual(res.body[0].issue_text, issue_text)
          assert.property(res.body[0], 'created_on')
          assert.property(res.body[0], 'updated_on')
          assert.property(res.body[0], 'created_by')
          assert.strictEqual(res.body[0].created_by, created_by)
          assert.property(res.body[0], 'assigned_to')
          assert.strictEqual(res.body[0].assigned_to, assigned_to)
          assert.property(res.body[0], 'open')
          assert.strictEqual(res.body[0].open, open)
          assert.property(res.body[0], 'status_text')
          assert.strictEqual(res.body[0].status_text, status_text)
          assert.property(res.body[0], '_id')
          done();
        });
    });
  });
  suite('PUT Requests to /api/issues/{projectname}', () => {
    test('Update one field on an issue', (done) => {
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          _id:_id,
          issue_text: "This is a new description for my issue"
        })
        .end((err, res) => {
          let id = _id.toHexString();
          if(err) return console.error(err)
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.strictEqual(res.body.result, 'successfully updated')
          assert.strictEqual(res.body["_id"], id)
          done();
        })
    });
    test('Update multiple fields on an issue', (done) => {
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          _id:_id,
          issue_text: "This is a new description for my issue",
          issue_title: "This is a much better title now"
        })
        .end((err, res) => {
          let id = _id.toHexString();
          if(err) return console.error(err)
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.strictEqual(res.body.result, 'successfully updated')
          assert.strictEqual(res.body["_id"], id)
          done();
        })
    });
    test('Update an issue with missing _id', (done) => {
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          issue_text: "This is a new description for my issue",
          issue_title: "This is a much better title now"
        })
        .end((err, res) => {
          if(err) return console.error(err)
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.strictEqual(res.body.error, 'missing _id')
          done();
        })
    });
    test('Update an issue with no fields to update', (done) => {
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          _id: _id
        })
        .end((err, res) => {
          if(err) return console.error(err)
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.strictEqual(res.body.error, 'no update field(s) sent')
          assert.strictEqual(res.body._id, _id.toHexString())
          done();
        })
    });
    test('Update an issue with an invalid _id', (done) => {
      let fakeID = new mongoose.Types.ObjectId("97c527013a3813a7558392ce");
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          _id: fakeID,
          issue_text: "This is a failed attempt at updating an issue"
        })
        .end((err, res) => {
          let id = fakeID.toHexString()
          if(err) return console.error(err)
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.strictEqual(res.body.error, 'could not update')
          assert.strictEqual(res.body._id, id)
          done();
        })
    });
  });
  suite('DELETE Requests to /api/issues/{projectname}', () => {
    test('Delete an issue', (done) => {
      chai
        .request(server)
        .delete('/api/issues/apitest')
        .send({
          _id:_id
        })
        .end((err, res) => {
          let id = _id.toHexString();
          if(err) return console.error(err)
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.strictEqual(res.body.result, 'successfully deleted')
          assert.strictEqual(res.body["_id"], id)
          done();
        })
    });
    test('Delete an issue with an invalid _id', (done) => {
      chai
        .request(server)
        .delete('/api/issues/apitest')
        .send({
          _id: fakeID
        })
        .end((err, res) => {
          let id = fakeID.toHexString();
          if(err) return console.error(err)
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.strictEqual(res.body.error, 'could not delete')
          assert.strictEqual(res.body["_id"], id)
          done();
        })
    });
    test('Delete an issue with a missing _id', (done) => {
      chai
        .request(server)
        .delete('/api/issues/apitest')
        .send({
          _id: "" 
        })
        .end((err, res) => {
          if(err) return console.error(err)
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.strictEqual(res.body.error, 'missing _id')
          done();
        })
    });
  });
});

// test('Convert a valid input such as 10L: GET request to /api/convert', function (done) {
//   chai
//     .request(server)
//     .get('/api/convert?input=10l')
//     .end(function (err, res) {
//       if(err) return console.error(err)
//       assert.equal(res.status, 200);
//       assert.equal(res.type, "application/json");
//       assert.equal(res.body.string, "10 liters converts to 2.64172 gallons");
//       done();
//     });
// });
