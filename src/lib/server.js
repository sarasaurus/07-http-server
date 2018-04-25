'use strict';

const http = require('http');
const cowsay = require('cowsay');
const bodyParser = require('./body-parser');
const faker = require('faker');

const server = module.exports = {};

const app = http.createServer((req, res) => {
  bodyParser(req)
    .then((parsedRequest) => {
    //   if (parsedRequest.method === 'GET' && parsedRequest.url.pathname === '/time') {
    //     res.writeHead(200, { 'Content-Type': 'application/json' });
    //     res.write(JSON.stringify({
    //       date: new Date(),
    //     }));
    //     res.end();
    //     return undefined;
    //   }// if GET

      if (parsedRequest.method === 'GET' && parsedRequest.url.pathname === '/cowsay') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        const cowsayText = cowsay.say({ text: parsedRequest.url.query.text });
        res.write(`<section><pre>${cowsayText}</pre></section>`);
        res.end();
        return undefined;
      }// this one is working

      if (parsedRequest.method === 'GET' && parsedRequest.url.pathname === '/api/cowsay') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const cowsayText = cowsay.say({ text: parsedRequest.url.query.text });
        res.write(JSON.stringify({
          content: `${cowsayText}`,
        }));
        res.end();
        return undefined;
      }// this one is working

      if (parsedRequest.method === 'POST' && parsedRequest.url.pathname === '/api/cowsay') {
        console.log('server log', parsedRequest.body);// 
        if (!parsedRequest.body.text) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify({ error: 'invalid request: text query required' }));
          res.end();
          return undefined;  
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(parsedRequest.body));// defining the object we recieve
        // res.write(JSON.stringify(parsedRequest.body.content));
        
        const cowsayText = cowsay.say({ text: parsedRequest.body.text });// selecting the part of that object we want
        res.write(JSON.stringify({
          content: `${cowsayText}`,
        }));
        
        console.log('server log', parsedRequest.body);// 
        // console.log('server log cow ', cowsayText);
        res.end();
        return undefined;
      }// api post is working
      
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('NOT FOUND');
      res.end();
      return undefined;
    })// then
    .catch((err) => {
      if (err instanceof SyntaxError) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ error: 'invalid request: body required' }));
        res.end();
        return undefined;  
      }
        console.log(err instanceof SyntaxError, 'error');
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.write('BAD REQUEST', err);
      res.end();
      return undefined;
    });
});// closing server


server.start = (port, callback) => app.listen(port, callback);
server.stop = callback => app.close(callback);
