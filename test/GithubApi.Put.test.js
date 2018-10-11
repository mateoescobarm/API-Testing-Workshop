const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect } = chai;

describe('following a user on github', () => {
  let followingResponse;

  before(() => agent.put('https://api.github.com/user/following/aperdomob')
    .auth('token', process.env.ACCESS_TOKEN)
    .then((response) => {
      followingResponse = response;
    }));

  it('Then aperdomob should be followed', () => {
    expect(followingResponse.status).to.equal(statusCode.NO_CONTENT);
    expect(followingResponse.body).to.eql({});
  });

  describe('finding a followed user', () => {
    let followedUsersResponse;

    before(() => agent.get('https://api.github.com/user/following')
      .auth('token', process.env.ACCESS_TOKEN)
      .then((response) => {
        followedUsersResponse = response.body;
      }));

    it('then user is already followed', () => {
      expect(followedUsersResponse).to.containSubset([{ login: 'aperdomob' }]);
    });

    describe('when i follow again aperdomob', () => {
      let followingResponseRevisited;

      before(() => agent.put('https://api.github.com/user/following/aperdomob')
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          followingResponseRevisited = response;
        }));

      it('aperdomob should be followed again without errors', () => {
        expect(followingResponseRevisited.status).to.equal(statusCode.NO_CONTENT);
        expect(followingResponseRevisited.body).to.eql({});
      });

      describe('finding a followed user', () => {
        let followedUsersResponseRevisited;

        before(() => agent.get('https://api.github.com/user/following')
          .auth('token', process.env.ACCESS_TOKEN)
          .then((response) => {
            followedUsersResponseRevisited = response.body;
          }));

        it('then user is alrready followed', () => {
          expect(followedUsersResponseRevisited).to.containSubset([{ login: 'aperdomob' }]);
        });
      });
    });
  });
});
