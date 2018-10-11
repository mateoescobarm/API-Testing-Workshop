const agent = require('superagent-promise')(require('superagent'), Promise);
const chai = require('chai');
const md5 = require('md5');

chai.use(require('chai-subset'));

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

      describe('downloading a repo', () => {
        let zip;
        const notExpectedMD5Num = '658d6cd9d627926121246ce4c0c8524p';

        before(() => agent.get(`${repositorie.svn_url}/zipball/${repositorie.default_branch}`)
          .auth('token', process.env.ACCESS_TOKEN)
          .buffer(true)
          .then((response) => { zip = response.text; }));

        it(`Then ${expectedRepository} repositorie should be downloaded`, () => {
          expect(md5(zip)).to.not.equal(notExpectedMD5Num);
        });

        describe('cheking readme file', () => {
          let readmeInfo;
          const readmeContent = {
            name: 'README.md',
            path: 'README.md',
            sha: '9bcf2527fd5cd12ce18e457581319a349f9a56f3'
          };

          before(() => agent.get(`${repositorie.url}/contents`)
            .auth('token', process.env.ACCESS_TOKEN)
            .then((response) => {
              readmeInfo = response.body.find(files => files.name === 'README.md');
            }));

          it('Then should have parameters', () => {
            expect(readmeInfo).to.containSubset(readmeContent);
          });

          describe('downloading readme file', () => {
            let readmeFile;
            const notExpectedReadmeMD5 = '8a546784ca4738447ec522e639f828bf';

            before(() => agent.get(readmeInfo.download_url)
              .auth('token', process.env.ACCESS_TOKEN)
              .buffer(true)
              .then((response) => { readmeFile = response.text; }));

            it('Then README.md should be downloaded', () => {
              expect(md5(readmeFile)).to.not.equal(notExpectedReadmeMD5);
            });
          });
        });
      });
    });
  });
});
