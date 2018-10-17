const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect, assert } = chai;

describe('having a logged user', () => {
  let userInfo;
  const userName = 'mateoescobarm';
  const urlBase = 'https://api.github.com';

  before(() => agent.get(`${urlBase}/user`)
    .auth('token', process.env.ACCESS_TOKEN)
    .then((response) => {
      userInfo = response.body;
    }));

  it('should have at least 1 public repo', () => {
    expect(userInfo.public_repos).to.be.at.least(1);
  });

  describe(`GET list of ${userName} repositories`, () => {
    let repository;
    const expectedRepository = 'API-Testing-Workshop';

    before(() => agent.get(userInfo.repos_url)
      .auth('token', process.env.ACCESS_TOKEN)
      .then((response) => {
        repository = response.body
          .find(repos => repos.name === expectedRepository);
      }));

    it(`Then ${expectedRepository} exist`, () => {
      assert.exists(repository);
      expect(repository.full_name).to.equal(`${userName}/API-Testing-Workshop`);
      expect(repository.private).to.equal(false);
      expect(repository.description).to.equal('this is a workshop about API testing');
    });

    describe('when we create a new issue', () => {
      let issueCreated;
      let issueNumber;
      const issue = { title: 'first issue' };

      before(() => agent.post(`${urlBase}/repos/${userName}/${expectedRepository}/issues`)
        .auth('token', process.env.ACCESS_TOKEN)
        .send(issue)
        .then((response) => {
          issueCreated = response;
          issueNumber = response.body.number;
        }));

      it('then an issue should be created', () => {
        expect(issueCreated.status).to.equal(statusCode.CREATED);
        expect(issueCreated.body.body).to.equal(null);
      });

      describe('then we can edit the issue', () => {
        let editedIssue;
        const issueBody = { body: 'this is the issue body' };


        before(() => agent.patch(`${urlBase}/repos/${userName}/${expectedRepository}/issues/${issueNumber}`)
          .auth('token', process.env.ACCESS_TOKEN)
          .send(issueBody)
          .then((response) => {
            editedIssue = response;
          }));

        it.only('then the issue should be modified', () => {
          expect(editedIssue.status).to.equal(statusCode.OK);
          expect(editedIssue.body).to.containSubset(issue);
          expect(editedIssue.body).to.containSubset(issueBody);
        });
      });
    });
  });
});
