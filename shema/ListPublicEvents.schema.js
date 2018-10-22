const listPublicEventsSchema = {
  title: 'Public event Schema V1.0.0',
  type: 'object',
  requiered: ['status'],
  properties: {
    status: {
      type: 'number',
      enum: [200]
    },
    body: {
      title: 'Public event Schema V1.0.0',
      type: 'object',
      requiered: ['status'],
      properties: {
        status: {
          type: 'number',
          enum: [200]
        },
        body: {
          type: 'array',
          items: {
            tytpe: 'object',
            properties: {
              id: {type: 'string'},
              type: ["PullRequestEvent", "PushEvent", "CreateEvent", "IssueCommentEvent", "IssuesEvent",],
              public: {type: 'boolean'},
              created_at: {type: 'string'},
              actor: {
                type: 'object',
                id: {type: 'number'},
                login: {type: 'string'},
                display_login: {type: 'string'},
                gravatar_id: {type: 'string'},
                url: {type: 'string'},
                avatar_url: {type: 'string'}
              },
              repo: {
                type: 'object',
                id: {type: 'number'},
                name: {type: 'string'},
                url: {type: 'string'}
              },
              payload: {
                type: 'object',
                push_id: {type: 'number'},
                size: {type: 'number'},
                distinct_size: {type: 'number'},
                ref: {type: 'string'},
                head: {type: 'string'},
                before: {type: 'string'},
                commits: [
                    {
                        sha: "dc83fae00993b79c881291e86b2ba6971f835e4c",
                        author: {
                            email: "gabriellopesmonteiro41@gmail.com",
                            name: "gabriellm1"
                        },
                        message: "Update README.md",
                        distinct: true,
                        url: "https://api.github.com/repos/gabriellm1/P2_TecWeb/commits/dc83fae00993b79c881291e86b2ba6971f835e4c"
                    }
                ]
              }
            }
          }
        }
      }
    }
  }
};

exports.listPublicEventsSchema = listPublicEventsSchema;