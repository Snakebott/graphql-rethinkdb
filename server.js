
const express = require('express');
const {Resolver} = require('./resolvers');
const graphqlHTTP = require('express-graphql');
const {schema, setResolver} = require('./schema');

let config = {
    host: 'localhost',
    db: 'databas01',
    user: 'admin',
    password: 'password'
};

const db = new Resolver(config);
const app = express();

let start = async ()=>{
    await db.open();
    (!db.conn.open)? process.exit(1) : null;
    setResolver(db);
    await app.use('/', graphqlHTTP({
        schema: schema,
        graphiql: true
    }))
    app.listen(8000);
    await db.logger.info('=== Application Started ===');
}
start()
