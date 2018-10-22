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

  describe('when i try to get 10 user per page', () => {
    const tenUsersQuery = { per_page: 10 };
    let userList;

    before(() => agent.get(`${urlBase}`)
      .query(tenUsersQuery).then((response) => {
        userList = response;
      }));

    it('then there must be 10 users', () => {
      expect(userList.body.length).to.equal(tenUsersQuery.per_page);
    });
    describe('when i try to get 50 user per page', () => {
      const fiftenUsersQuery = { per_page: 50 };

      before(() => agent.get(`${urlBase}`)
        .query(fiftenUsersQuery).then((response) => {
          userList = response;
        }));

      it('then there must be 50 users', () => {
        expect(userList.body.length).to.equal(fiftenUsersQuery.per_page);
      });
    });
  });
});
