const express = require('express');
const {Resolver} = require('./resolvers');
const graphqlHTTP = require('express-graphql');
const GQTools = require('graphql-tools');
const typeDefs = require('./schema');

let config = {
    host: 'localhost',
    db: 'database01',
    user: 'admin',
    password: 'password'
};

const db = new Resolver(config);
const app = express();

let start = async ()=>{
    await db.open();
    (!db.conn.open)? process.exit(1) : null;
    let resolvers = await db.resolvers();
    console.log(resolvers);
    let schema = await GQTools.makeExecutableSchema({typeDefs, resolvers});
    await app.use('/', graphqlHTTP({
        schema: schema,
        graphiql: true
    }))
    app.listen(8000);
    await db.logger.info('=== Application Started ===');
}
start()
