'use strict';

const server = require('../lib/server');
const superagent = require('superagent');
const cowsay = require('cowsay');

beforeAll(() => server.start(5000));
afterAll(() => server.stop());

describe('VALID request to the API', () => {
  describe('GET /api/cowsay', () => {
    it('should response with a status 200', () => {
      return superagent.get(':5000/api/cowsay?text=poop')
        .then((res) => {
          console.log(res.body, '-------response body');
          console.log(res.content, '-------response content');
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('content');
        });
    });
  });
  
  describe('GET /cowsay', () => {
    const mockCow = cowsay.say({ text: 'Hello World' });
    const mockHtml = `<section><h3><a href="/time">Click here for current time</a></h3><pre>${mockCow}</pre></section>`;
    it('should respond with status 200 and return cow HTML', () => {
      return superagent.get(':5000/cowsayPage')
        .query({ text: 'Hello World' })
        .then((res) => {
          expect(res.status).toEqual(200);
          expect(res.text).toEqual(mockHtml);
        });
    });
  });
  
  describe.only('POST /api/cowsay', () => {
    // const mockCow = cowsay.say({ text: 'poop' });
    it('should return status 200 for successful post', () => {
      return superagent.post(':5000/api/cowsay')
      // .set('Content-Type', 'application/json')
        .send({ text: 'poop' })
        .send({ content: 'COW' })
        .then((res) => {
            console.log(res.body, 'RES BODY');
          expect(res.body.text).toEqual('poop');
          expect(res.body.content).toEqual('COW');
          expect(res.status).toEqual(200);
        });
    });
  });
});
  
describe('INVALID request to the API', () => {
  describe('GET /cowsayPage', () => {
    it('should err out with 400 status code for not sending text in query', () => {
      return superagent.get(':5000/cowsayPage')
        .query({})
        .then(() => {})
        .catch((err) => {
          expect(err.status).toEqual(400);
          expect(err).toBeTruthy();
        });
    });
  });
});
  
