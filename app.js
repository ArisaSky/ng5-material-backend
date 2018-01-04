// environment
const env = process.env.NODE_ENV || 'development';
// express
const express = require('express');
const app = express();
// socket
const server = require('http').Server(app);
const io = require('socket.io')(server);
// body parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
// mongoose
const mongoose = require('mongoose');
const config = require('./config/database');
// connect to mongoose
mongoose.connect(config.database, {
  useMongoClient: true
});

var db = mongoose.connection;
// db connected
db.on('connected', () => {
  console.log('Connected to database: ' + config.database);
});
// db error
db.on('error', (err) => {
  console.log('Database error: ' + err);
});
// API TEST
const endpoint = '/api';
app.get('/', (req, res) => res.send('Please use /api as endpoint.'));
app.get(endpoint, (req, res) => res.send('API is working.'));
// morgan logger
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');
const logDirectory = path.join(__dirname, 'log');
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
// create a rotating write stream
const accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  compress: 'gzip', // compress rotated files
  path: logDirectory
});
// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));
// cors
const cors = require('cors');
app.use(cors());
// winston logger
const winston = require('winston');
const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'info'
    }),
    new (require('winston-daily-rotate-file'))({
      filename: `${logDirectory}/-results.log`,
      timestamp: tsFormat,
      datePattern: 'yyyy-MM-dd',
      prepend: true,
      level: env === 'development' ? 'verbose' : 'info'
    })
  ]
});
// ROUTES
// tasklist
var tasklist = require('./routes/tasklist');
app.use(endpoint + '/tasklist', tasklist);
// SOCKETS
// tasklist
require('./socket/tasklist')(io);
// error handling
app.use(logErrors);
app.use(errorHandler);
// console error
function logErrors (err, req, res, next) {
  logger.error(err);
  console.error(err);
  next(err);
}
// response loggin error
function errorHandler (err, req, res, next) {
  res.status(500).send({error: err});
}
// listen
server.listen(config.port, () => console.log('Connected on port ' + config.port));