'use strict';

const { default: mongoose } = require("mongoose");
const Issue = require('../models/issue')

function logger(req) {
  console.log(req.url)
  console.log(req.method)
  console.log(req.params)
  console.log(req.query)
}

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      logger(req)
      let project = req.params.project;
      res.sendFile(process.cwd() + '/views/issue.html', {project: project});
    })
    
    .post( async (req, res) => {
      logger(req)
      let project = req.params.project;
      let {issue_title, issue_text, created_by, assigned_to, status_text} = req.body;

      //if one of the required field is empty
      if(issue_title === '' || issue_text === '' || created_by === '') {
        res.send({error: 'required field(s) missing'})
      }

      let newIssue = new Issue({
        project: project,
        issue_title: issue_title,
        issue_text: issue_text,
        created_on: new Date(),
        created_by: created_by,
        assigned_to: assigned_to,
        status_text: status_text,
      })

      try {
        let result = await newIssue.save();
        console.log(result);
        let obj = {
          issue_title: result.issue_title,
          issue_text: result.issue_text,
          created_on: result.created_on,
          created_by: result.created_by,
          updated_on: result.updated_on,
          assigned_to: result.assigned_to,
          open: result.open,
          status_text: result.status_text,
          _id: result.id
        }
        res.json(result)
      } catch (err) {
        return res.send(err)
      }
    })
    
    .put(function (req, res){
      logger(req)
      let project = req.params.project;
      res.send('Put here')
      
    })
    
    .delete(function (req, res){
      logger(req)
      let project = req.params.project;
      res.send('Delete here')
      
    });
    
};
