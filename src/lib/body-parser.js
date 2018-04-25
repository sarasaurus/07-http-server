'use strict';

const url = require('url');
const queryString = require('querystring');

module.exports = function bodyParser(req) {
  return new Promise((resolve, reject) => {
    req.url = url.parse(req.url);
    req.url.query = queryString.parse(req.url.query);

    if (req.method !== 'POST' && req.method !== 'PUT') {
      return resolve(req);// if we are receiving data
    }

    let message = '';
    req.on('data', (data) => {
      message += data.toString();
    });//this we dont want to change-- data comes in in chunks, so we concatenate

    req.on('end', () => {
      try {
        req.body = JSON.parse(message);// everything together-- once all is received
        return resolve(req);
      } catch (err) {
        return reject(err);
      }
    });

    req.on('error', err => reject(err));
    return undefined;
  });
};