const GraphQL = require('graphql');
const express = require('express');
const graphqlHTTP = require('express-graphql');

let resolver;

const User = new GraphQL.GraphQLObjectType({
    name: 'User',
    fields:{
        id: {
            type: GraphQL.GraphQLID,
        },
        first_name: {
            type: GraphQL.GraphQLString,
        },

        is_bot: {
            type: GraphQL.GraphQLBoolean
        },

        language_string: {
            type: GraphQL.GraphQLString
        },

        last_name: {
            type: GraphQL.GraphQLString
        },

        username: {
            type: GraphQL.GraphQLString
        }
    }
});

const schema = new GraphQL.GraphQLSchema({
    query: new GraphQL.GraphQLObjectType({
        name: 'Query',
        fields: {
            user: {
                type: User,
                args: {
                    id: {type: GraphQL.GraphQLID}
                },
                resolve: async (parent, args, context, info)=>{
                    return await resolver.fetchUser(args.id);
                }
            }
        }
    })
});

const setResolver = (resolv)=>{
    resolver = resolv;
}

module.exports.schema = schema;
module.exports.setResolver = setResolver;
