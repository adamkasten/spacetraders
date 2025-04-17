import express from 'express';
import session from 'express-session';
import path from 'path';
import crypto from 'crypto';
import cors from 'cors';
import logger from './server/logger.js'
import router from './routes/routes.js'
import expressWinston from 'express-winston'
import * as winston from 'winston'



const app = express();
const app_url = process.env.APP_HOST_URL;
const port = process.env.APP_HOST_PORT;
const node_env = process.env.APP_ENV;
const uuid = crypto.randomUUID();

/* app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  expressFormat: true,
  colorize: true,
  ignoreRoute: function (req, res) { return false; }
})); */

app.use(session({
  secret: `${uuid}`,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true in production (HTTPS)
}));


app.use(router);

app.use(expressWinston.errorLogger({
  winstonInstance: logger,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.prettyPrint()
  )
}));


app.use( async (err, req, res, next) => {
  if(err) {
    res.status(500).send(err.stack);
  }
})

app.listen(port, () => {
  console.log(`Example app listening on ${app_url}:${port}`);
})
