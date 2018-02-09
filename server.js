const GraphQL = require('graphql');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const r = require('rethinkdb');

let conn = {open: false};

/**
 * connect to rethinkdb
 * @param {object} dbconfig
 * @param {string} dbconfig.user
 * @param {string} dbconfig.password
 * @param {string} dbconfig.host
 * @param {number} dbconfig.port
 * @param {string} dbconfig.db
 */

let connect = async (dbconfig)=>{
    let {user = 'admin', password = 'password', host = 'localhost', port = 28015, db = 'nodebot'} = dbconfig;
    let dbconn = await r.connect({user: user, password: password, host: host, port: port, db: db});
    if(dbconn.open){
        conn = dbconn;
    } else {
        console.error('Error: ',dbconn);
    }
}

/**
 * fetch user from database
 * @param {number} id
 */

let fetchUser = async (id)=>{
    let cursor = await r.table('users').run(conn);
    let data = await cursor.toArray();
    let index = data.findIndex((user)=>{
        return (user.id != id)? false : true;
    });
    return (index != -1)? data[index] : null;
}

const UserType = new GraphQL.GraphQLObjectType({
    name: 'User',
    fields: {
        id: {
            type: GraphQL.GraphQLID,
            resolve: (parent, args, context, info)=>{
                return parent.id;
            }
        },
        first_name: {
            type: GraphQL.GraphQLString
            // resolve: (parent, args, context, info)=>{
            //     return parent.first_name;
            // }
        },
        is_bot: {
            type: GraphQL.GraphQLBoolean,
            resolve: (parent, args, context, info)=>{
                return parent.is_bot;
            }
        },
        language_code: {
            type: GraphQL.GraphQLString,
            resolve: (parent, args, context, info)=>{
                return parent.language_code;
            }
        },
        last_name: {
            type: GraphQL.GraphQLString,
            resolve: (parent, args, context, info)=>{
                return parent.last_name;
            }
        },
        username: {
            type: GraphQL.GraphQLString,
            resolve: (parent, args, context, info)=>{
                return parent.username;
            }
        }
    }
});


const schema = new GraphQL.GraphQLSchema({
    query: new GraphQL.GraphQLObjectType({
        name: 'Query',
        fields: {
            user: {
                type: UserType,
                args: {
                    id: {type: GraphQL.GraphQLID}
                },
                resolve: async(parent, args, context, info)=>{
                    return await fetchUser(args.id);
                }
            }
        }
    })
});

const app= express();
app.use('/', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

let start = async()=>{
    console.log('Connecting to database...')
    await connect({host: '127.0.0.1', db: 'database'});
    console.log('connected');
    console.log(`==== GraphQL started ====`);
    console.log(`current schema: `, GraphQL.printSchema(schema));
}

start();

app.listen(4000);
