const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const chai = require('chai');

const expect = chai.expect;

describe('First Api Test', () => {

  it('Consume GET Service', () => {
    return agent.get('https://httpbin.org/ip').then((response) => {
      expect(response.status).to.equal(statusCode.OK);
      expect(response.body).to.have.property('origin');
    });
  });

  it('Consume GET service with query parameters', () => {
    const query = {
      name: 'john',
      age: '31',
      city: 'New York'
    };

    return agent
      .get('https://httpbin.org/get')
      .query(query)
      .then((response) => {
        expect(response.status).to.equal(statusCode.OK)
        expect(response.body.args).to.eql(query);
      });
  });

  const body = {
    name: 'John',
    age: 31,
    city: 'New York'
  };

  it('Consume POST service', () => {
    return agent
      .post('https://httpbin.org/post')
      .send(body)
      .then((response) => {
        expect(response.status).to.equal(statusCode.OK);
        expect(response.body.json).to.eql(body);
      });
  });

  it('Consume PUT service', () => {
    return agent
      .put('https://httpbin.org/put')
      .send(body)
      .then((response) => {
        expect(response.status).to.equal(statusCode.OK);
        expect(response.body.json).to.eql(body);
      });
  });

  it('Consume PATCH service', () => {

    return agent
      .patch('https://httpbin.org/patch')
      .send(body)
      .then((response) => {
        expect(response.status).to.equal(statusCode.OK);
        expect(response.body.json).to.eql(body);
      });
  });

  it('Consume HEAD service', () => {
    return agent
      .head('https://httpbin.org/headers')
      .query(body)
      .then((response) => {
        expect(response.status).to.equal(statusCode.OK);
        expect(response.body).to.eql({})
      });
  });

  it('Consume DELETE service', () => {
    return agent
      .del('https://httpbin.org/delete')
      .send(body)
      .then((response) => {
        expect(response.status).to.equal(statusCode.OK);
        expect(response.body.json).to.eql(body);
      });
  });
});
