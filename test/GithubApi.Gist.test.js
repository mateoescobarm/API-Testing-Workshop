const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect, assert } = chai;
const urlBase = 'https://api.github.com';


describe('creating a gist on github', () => {
  let creatingAGist;
  let gistUrl;
  const gist = {
    description: 'Hello World Examples',
    public: true,
    files: {
      'hello_world.txt': {
        content: 'this is a text file for gists api'
      },
      'hola_mundo.js': {
        content: 'this is an other test file'
      }
    }
  };

  before(() => agent.post(`${urlBase}/gists`)
    .auth('token', process.env.ACCESS_TOKEN)
    .send(gist)
    .then((response) => {
      creatingAGist = response;
      gistUrl = response.body.url;
    }));

  it('then a gist should be created', () => {
    expect(creatingAGist.status).to.equal(statusCode.CREATED);
    expect(creatingAGist.body).to.containSubset(gist);
  });

  describe('when we have a gist', () => {
    let previouslyCreatedGist;

    before(() => agent.get(gistUrl)
      .auth('token', process.env.ACCESS_TOKEN)
      .then((response) => {
        previouslyCreatedGist = response;
      }));

    it('then the gist should exist', () => {
      assert.exists(previouslyCreatedGist);
      expect(previouslyCreatedGist.body).to.containSubset(gist);
    });

    describe('when we delete a gist', () => {
      let deleteResponse;

      before(() => agent.del(gistUrl)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          deleteResponse = response;
        }));

      it('then the gist should be deleted', () => {
        expect(deleteResponse.status).to.equal(statusCode.NO_CONTENT);
      });

      describe('when we look for the gist again', () => {
        let gistAfterDelete;

        before(() => agent.get(gistUrl)
          .auth('token', process.env.ACCESS_TOKEN)
          .then((response) => {
            gistAfterDelete = response;
          }).catch((error) => {
            gistAfterDelete = error;
          }));

        it.only('then the gist should not exist', () => {
          assert.notExists(gistAfterDelete.body);
          expect(gistAfterDelete.status).to.equal(statusCode.NOT_FOUND);
        });
      });
    });
  });
});
