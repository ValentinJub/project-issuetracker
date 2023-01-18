var express = require('express')
var router = express.Router()
var Issue = require('../models/issue');

// simple logger for this router's requests
// all requests to this router will first hit this middleware
router.get('/', async (req, res) => {
  logger(req);
  let issues;
  try {
    issues = await Issue.find().limit(10).exec();
    console.log(issues)
    res.render('index', {
      issues: issues
    });
  } catch (err) {
    issues = [];
    console.error(err)
    res.render('index', {
      issues: [],
      errorMessage: err
    })
  }
})

function logger(req) {
  console.log('%s %s %s', req.method, req.url, req.path);
}

module.exports = router