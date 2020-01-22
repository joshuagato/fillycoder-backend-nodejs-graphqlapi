const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Post {
        id: ID!
        username: String!
        message: String!
        createdAt: String!
        updatedAt: String!
    }

    input PostInputData {
        postId: Int
        username: String!
        message: String!
    }


    type RootQuery {
        posts: [Post]!
        post(postId: Int!): Post!
    }
    type RootMutation {
        createPost(postInput: PostInputData): Post!
        editPost(postInput: PostInputData): Boolean
        deletePost(postId: Int!): Boolean
    }


    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
