const apollo = require('apollo-server-core');
const graphiQL = require('apollo-server-module-graphiql');
const graphql_tools = require('graphql-tools');


//import { GraphQLOptions, HttpQueryError, runHttpQuery } from 'apollo-server-core';
//import * as GraphiQL from 'apollo-server-module-graphiql';

exports.install = function() {
	F.route('/graphql', graphql,['get','post']);
    F.route('/graphiql', graphiql,['query']);

};

const typeDefs = `
type Query {
  testString: String
  
}
`;

const mocks = {
    String: function(){return 'It works!'}
};

// graphql options
//var options = graphql_tools.makeExecutableSchema({ typeDefs,resolvers });;
var schema = graphql_tools.makeExecutableSchema({ typeDefs });
graphql_tools.addMockFunctionsToSchema({ schema, mocks });

var options = { schema };

function graphql() {
	var self = this;
	var req = self.req;
	var res = self.res;
    apollo.runHttpQuery([req, res], {
        method: req.method,
        options: options,
        query: req.method === 'POST' ? req.body : req.query,
    }).then(function(gqlResponse) {
        self.content(gqlResponse,'application/json');
    }, function(error) {
        if ( error.headers ) {
            Object.keys(error.headers).forEach(function(header) {
                res.setHeader(header, error.headers[header]);
            });
        }

        self.status = error.statusCode;
        self.content(error.message);
    });
};

function graphiql() {
    var self = this;
    var req = self.req;
    var res = self.res;
    var graphiqlOptions= { endpointURL: '/graphql' };
    //const query = req.url && url.parse(req.url, true).query;
    graphiQL.resolveGraphiQLString(self.query, graphiqlOptions, req)
        .then(function(graphiqlString) {
            res.setHeader('Content-Type', 'text/html');
            res.write(graphiqlString);
            res.end();
        }, function(error) {
            res.write(error);
            res.end();
        });
}