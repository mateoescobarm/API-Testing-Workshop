const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect } = chai;
const urlBase = 'https://github.com/aperdomob';

describe('when we have a redirect', () => {
  let redirectResponse;
  const redirectURL = `${urlBase}/redirect-test`;
  const urlAfterRedirect = `${urlBase}/new-redirect-test`;

  before(() => agent.head(`${redirectURL}`)
    .catch((error) => {
      redirectResponse = error;
    }));

  it('then status should be 301, redirected', () => {
    expect(redirectResponse.status).to.equal(statusCode.MOVED_PERMANENTLY);
    expect(redirectResponse.response.headers.location).to.equal(urlAfterRedirect);
  });

  describe('when i try to GET the new url with the redirect url', () => {
    let newUrlResponse;

    before(() => agent.get(redirectURL)
      .then((response) => {
        newUrlResponse = response;
      }));

    it('then status should be OK', () => {
      expect(newUrlResponse.status).to.equal(statusCode.OK);
    });
  });
});
