const express = require('express');
const mongoose = require('mongoose');

const sequelize = require('./util/sequelizedb');
const graphqlHttp  = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');


// Initializing express
const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if(req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Middleware for setting up the graphql endpoint
app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    formatError(err) {
        if(!err.originalError) {
          return err;
        }
        console.log(err);
        const data = err.originalError.data;
        const message = err.message || 'An error occurred.';
        const code = err.originalError.code || 500;
        return { message: message, status: code, data: data };
    }
}));


// Middleware for handling errors
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});


// Connecting the mysql database using sequelize

// sequelize.sync({ force: true }).then(result => {
sequelize.sync().then(result => {
    app.listen(4004);
}).catch(err => console.log(err));
