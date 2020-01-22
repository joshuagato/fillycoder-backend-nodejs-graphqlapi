const Post = require('../models/post');


module.exports = {

    // The resolver(method) for creating a new post
    createPost: async function({ postInput }, req) {

        const post = await new Post({
            username: postInput.username,
            message: postInput.message
        });

        // save the post in the database
        const createdPost = await post.save();

        return {
            ...createdPost.dataValues,
            createdAt: createdPost.dataValues.createdAt.toISOString(),
            updatedAt: createdPost.dataValues.updatedAt.toISOString()
        };
    },

    // The resolver(method) for fetching posts
    posts: async function(_, req) {

        const posts = await Post.findAll({ order: [['createdAt', 'DESC']] });

        if(!posts) {
            const error = new Error('No posts found');
            error.statusCode = 404;
            throw error;
        }
        else {
            const fetchedPosts = posts.map(result => {
                const post = result.dataValues;
                return { ...post, createdAt: post.createdAt.toISOString(), updatedAt: post.updatedAt.toISOString()  };
            });

            return fetchedPosts;
        }
    },

    // The resolver(method) for fetching a single posts
    post: async function({ postId }, req) {

        // const post = await Post.findByPk(postId);
        const post = await Post.findOne({ where: { id: postId } });

        if(!post) {
            const error = new Error('No posts found');
            error.statusCode = 404;
            throw error;
        }
        else {
            // return post.dataValues; //this line also works perfectly
            return post;
        }
    },

    // The resolver(method) for deleting a single post
    deletePost: async function({ postId }, req) {

        const post = await Post.findByPk(postId);

        if(!post) {
            const error = new Error('No post found');
            error.statusCode = 404;
            throw error;
        }
        else {
            post.destroy();

            return true;
        }
    },

    // The resolver(method) for editing a single post
    editPost: async function({ postInput }, req) {

        const post = await Post.findByPk(postInput.postId);

        if(!post) {
            const error = new Error('No post found');
            error.statusCode = 404;
            throw error;
        }
        else {
            post.username = postInput.username;
            post.message = postInput.message;

            await post.save();

            return true;
        }
    }
};
