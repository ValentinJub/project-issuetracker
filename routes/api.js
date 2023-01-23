'use strict';

var express = require('express')
var router = express.Router()
var Issue = require('../models/issue');
const mongoose = require('mongoose');

function logger(req) {
  console.log("Req URL is")
  console.log(req.url)
  console.log("Req Body is")
  console.log(req.body)
  console.log("Req Method is")
  console.log(req.method)
  console.log("Req Params is")
  console.log(req.params)
  console.log("Req Query is")
  console.log(req.query)
}

function queryParser(query, fields, obj = {}) {
  fields.forEach((e) => {
    if(query[e]) {
      obj[e] = query[e];
    }
  })
  return obj;
}

router.get('/:project', async (req, res) => {
  let fields = ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'open', 'created_on', 'updated_on'];
  let query = queryParser(req.query,fields);
  //we do query.project so we can also query mongoose against project name
  query.project = req.params.project;
  //You can send a GET request to /api/issues/{projectname}
  //for an array of all issues for that specific projectname,
  // with all the fields present for each issue.

  if(req.query._id){
    query._id=mongoose.Types.ObjectId(req.query._id);
  }
  try {
    let R = await Issue.find(query)
    res.json(R)
  } catch(e) {
      console.error("Error caught while finding Issues, details below:")
      console.error(e)
      return res.send(err)
    }
  })

router.post('/:project', async (req, res) => {
  // logger(req)
  let project = req.params.project;
  let {issue_title, issue_text, created_by, assigned_to, status_text} = req.body;

  //if one of the required field is empty string or undefined
  if(issue_title === '' || issue_title === undefined || issue_text === '' || issue_text === undefined || created_by === '' || created_by === undefined) {
    return res.send({error: 'required field(s) missing'})
  }

  let newIssue = new Issue({
    project: project,
    issue_title: issue_title,
    issue_text: issue_text,
    created_on: new Date(),
    updated_on: new Date(),
    created_by: created_by,
    assigned_to: assigned_to,
    status_text: status_text
  })

  try {
    let R = await newIssue.save();
    // console.log("the issue sent in the POST request is the below: ")
    // console.log(R)
    return res.send(R)
  }
  catch(e) {
    console.error(e)
    return res.send({errror: "database logical error"})
  }
})

router.put('/:project', async (req, res) => {
  // logger(req)
  let fields = ["_id", 'issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text'];
  let query = queryParser(req.body, fields)
  
  if(!query._id) {
    return res.send({
      error: 'missing _id'
    });
  } 

  if(Object.keys(query).length < 2) {
    return res.send({
    error: 'no update field(s) sent',
      _id: query._id
    })
  }

  try {
    let issue = await Issue.findOne({_id: query._id});
    // (e) => { console.error(e) ; return res.send({error:'could not update', _id:query._id})},
    
    // delete query._id;
    
    if(issue) {
      Object.keys(query).forEach(key=>{
        issue[key]=query[key];
        issue.markModified('key');
      })
      issue.updated_on = new Date();

      let updatedIssue = await issue.save();
      return res.send({
        result: 'successfully updated', 
        '_id': updatedIssue._id
      })
    }
    else {
      return res.send({
        error: 'could not update', 
        _id: query._id
      })
    }
  } 
  catch(e) {
    console.error(e); 
    return res.send({
      error: 'could not update', 
      _id: query._id
    })
  } 
});

router.delete('/:project', async (req, res) => {
  // logger(req);

  //check we have an _id
  if(!req.body._id) {
    return res.send({error: 'missing _id'})
  }

  let _id = req.body._id;
  // console.log(_id)

  //we want to make sure we search with a mongoose objectID
  //we need to be aware that inputting a valid objectID WILL NOT result in an error
  if(mongoose.Types.ObjectId.isValid(_id)) {
    await Issue.deleteOne({_id: _id}, (err, result) => {
      //we manage the error here
      if(err) {
        console.error(err);
        return res.send({
          error: 'could not delete',
          '_id': _id
        })
      }
      // console.log(result)
      //we make sure we actually deleted something
      if(result.deletedCount > 0) {
        return res.send({
          result: 'successfully deleted',
          '_id': _id
        })
      }
      //if we didn't delete anything 
      else {
        return res.send({
          error: 'could not delete',
          '_id': _id
        })
      }
    })
  }
  //if the id passed IS NOT a valid mongoose ObjectID
  else {
    return res.send({
      error: 'could not delete',
      '_id': _id
    })
  }
})

module.exports = router;