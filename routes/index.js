var express = require('express')
var router = express.Router()
var Issue = require('../models/issue');


// simple logger for this router's requests
// all requests to this router will first hit this middleware
router.get('/', async (req, res) => {
  console.log('%s %s %s', req.method, req.url, req.path)
  let issues;
  try {
    issues = await Issue.find().limit(10).exec();
    console.log(issues)
    res.render('index', {
      logs: issues
    });
  } catch (err) {
    issues = [];
    console.error(err)
    res.render('index', {
      logs: [],
      errorMessage: err
    })
  }
})

// this will only be invoked if the path starts with /bar from the mount point (/foo)
router.get('/bar', function (req, res, next) {
  // ... maybe some additional /bar logging ...
  res.send("Arrived to /bar")
  next()
})

module.exports = router