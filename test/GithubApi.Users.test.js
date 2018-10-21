const agent = require('superagent-promise')(require('superagent'), Promise);
const responseTime = require('superagent-response-time');
const chai = require('chai');

const { expect } = chai;
const urlBase = 'https://api.github.com/users';

describe('when we look for github users', () => {
  let timeResponse;

  before(() => agent.get(`${urlBase}`)
    .use(responseTime((err, time) => {
      timeResponse = time;
    })).then(() => 0));

  it('then response time should be less than 5 seconds', () => {
    expect(timeResponse).to.be.below(5000);
  });
});
