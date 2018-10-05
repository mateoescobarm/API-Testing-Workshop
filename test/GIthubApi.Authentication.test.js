const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';
const githubUserName = 'mateoescobarm';
const repository = 'API-Testing-Workshop';

describe('Github Api Test', () => {
  describe('Authentication', () => {
    it('Via OAuth2 Tokens by Header', () => {
      agent.get(`${urlBase}/repos/${githubUserName}/${repository}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((reponse) => {
          expect(reponse.status).to.equal(statusCode.OK);
          expect(reponse.body.description).equal('this is a workshop about API testing');
        });
    });
    it('Via OAuth2 Tokens by parameter', () => {
      agent.get(`${urlBase}/repos/${githubUserName}/${repository}`)
        .query(`access_token=${process.env.ACCESS_TOKEN}`)
        .then((response) => {
          expect(response.status).to.equal(statusCode.OK);
          expect(response.body.description).equal('This is a Workshop about Api Testing in JavaScript');
        });
    });
  });
});
