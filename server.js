'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const expect      = require('chai').expect;
const cors        = require('cors');
require('dotenv').config();

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');
const mongoose          = require('mongoose')
const mongoURI          = process.env.MONGO_URI

const expressLayouts    = require('express-ejs-layouts');
const methodOverride    = require('method-override');

const indexRouter       = require('./routes/index')


let app = express();

app.use(cors({origin: '*'})); //For FCC testing purposes only
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views, __dirname + /views');
app.set('layout', 'layouts/layout');
app.use(methodOverride('_method'));
app.use(expressLayouts);
app.use(express.static('public'));

mongoose.set('strictQuery', true)

mongoose.connect(mongoURI).then(
  () => { return console.log('Connected to MongoDB') },
  (err) => { return console.error(err) }
)

//For FCC testing purposes
fccTestingRoutes(app);

// //Routing for API 
// apiRoutes(app);

app.use('/', indexRouter);
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  logger(req);
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        console.log('Tests are not valid:');
        console.error(e);
      }
    }, 3500);
  }
});

function logger(req) {
  console.log('%s %s %s', req.method, req.url, req.path);
}


module.exports = app; //for testing
