# What is GraphQL?

GraphQL is a query language for APIs

Another query language is SQL, so think about some things you can do with SQL.

Why use GraphQL instead of Rest APIs?

## Ask what you need, get exactly that.

Send a GraphQL query to you API and get exactly what you need, nothing more and nothing less.

Apps using GraphQL are fast and stable because they control the data they get, not the server.

The Client has full control of what data do it needs from the server.

With Rest APIs you don't have control of what data do you want or not. You can get too much data, data that you don't use.

In Rest if you want data from 2 different resources, then you need to perform 2 separate API calls. With GraphQL you can fetch data from different resources in one call.

GraphQL resolves under fetching and over fetching of data.

## Describe what's possible with a type system

GraphQL is schema first approach.

You can create faster powerful developer tools.

Bring your own data and code, you can use GraphQL on top of your existing system, you don't need to rewrite everything.

Facebook created GraphQL you power up their mobile apps, they were too slow because they were doing too many API calls.

## Apollo Server

Easy way to setup a GraphQL server

## Queries

When we do a query, we always use the POST method, and the body is a json with the query itself.

By default the apollo graphql sandbox has schema polling enable.

At the end of the day all graphQL Clients create HTTP request for doing queries, so you can use GraphQL in any programming language and framework.
