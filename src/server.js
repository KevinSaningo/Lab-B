const express = require('express');
const config = require('./config/config');
const morgan = require('morgan');
const winston = require('winston');
const db = require('./models');

const app = express();
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const customerRoutes = require('./routes/customers');
const staffRoutes = require('./routes/staff');
const feedbackRoutes = require('./routes/feedback');


const { combine, timestamp, json } = winston.format;
const logger = winston.createLogger({
  level: 'http',
  format: combine(timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A'}), json()),
  transports: [ new winston.transports.Console(), new winston.transports.File({ filename: 'log' })],
});


const morganMiddleware = morgan(
  function (tokens, req, res) {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: tokens.status(req, res),
      content_length: tokens.res(req, res, 'content-length'),
      response_time: Number.parseFloat(tokens['response-time'](req, res)),
      response_time_ms: tokens['response-time'](req, res) + 'ms',
      remote_address: tokens['remote-address'](req, res),
      remote_user: tokens['remote-user'](req, res),
      date: tokens.date(req, res),
      http_version: tokens['http-version'](req, res),
      user_agent: tokens['user-agent'](req, res),
      referrer: tokens.referrer(req, res),
    })
  },
  {
    stream: {
      write: (message) => {
        const data = JSON.parse(message);
        logger.http('incoming-request', data);
      }
    }
  }
);

app.use(morganMiddleware);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/staff', staffRoutes);
app.use('/api/v1/feedback', feedbackRoutes);



db.sequelize.sync().then(() => {
  app.listen(config.port);
});
