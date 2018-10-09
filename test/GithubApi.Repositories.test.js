const agent = require('superagent-promise')(require('superagent'), Promise);
const chai = require('chai');

const { expect, assert } = chai;

const urlBase = 'https://api.github.com';

describe('Given a user is logged in Github', () => {
  const githubUserName = 'aperdomob';

  describe('User info', () => {
    let userInfo;

    before(() => agent.get(`${urlBase}/users/${githubUserName}`)
      .auth('token', process.env.ACCESS_TOKEN)
      .then((response) => { userInfo = response.body; }));

    it(`Then ${githubUserName} info should be returned`, () => {
      expect(userInfo.name).to.equal('Alejandro Perdomo');
      expect(userInfo.company).to.equal('PSL');
      expect(userInfo.location).to.equal('Colombia');
    });

    describe(`when GET ${githubUserName} repositories`, () => {
      let repositorie;
      const expectedRepository = 'jasmine-awesome-report';


      before(() => agent.get(userInfo.repos_url)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          repositorie = response.body
            .find(repos => repos.name === expectedRepository);
        }));

      it(`Then ${expectedRepository} exist`, () => {
        assert.exists(repositorie);
        expect(repositorie.full_name).to.equal('aperdomob/jasmine-awesome-report');
        expect(repositorie.private).to.equal(false);
        expect(repositorie.description).to.equal('An awesome html report for Jasmine');
      });
    });
  });
});
