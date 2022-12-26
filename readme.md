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

### Resolution Chain

GraphQL has a 'resolution chain', it works like a tree from top to button.

First it starts at the Query object and we can writing specific resolvers as needed for every type in our schema.

### Query Arguments

To pass in information, for example get a specific item by its ID.

Client Query:

```
query{
  job(id: "soP9m8MdKeQX_ZXZOCSaL") {
    id
    title
  }
}
```

Server schema definition:

```
type Query {
  jobs: [Job!]
  job(id: ID!): Job # return a single job
}
```

### Query Variables

We can name a query

Client side query:

```
query JobQuery {

}
```

Then using parenthesis we can pass it variables, variables starts with a dollar $ sign.

Client side query:

```
query JobQuery($id: ID!){
  job(id: $id) {
    id
    title
    description
    company {
      id
      name
    }
  }
}
```

Then in the GraphQL Sandbox we can add the value of the variable in the "Variables" tab, but now without dollar $ sign.

```
{
  "id": "soP9m8MdKeQX_ZXZOCSaL"
}
```

It is a good practice to always name your queries, makes debugging easier.

### Object Graph Navigation

With GraphQL we can create associations between objects in both directions, and easy navigate between them.

Server side schema:

```
type Query {
  jobs: [Job!]
  job(id: ID!): Job # return a single job
  company(id: ID!): Company
}

type Job {
  id: ID!
  title: String!
  description: String
  company: Company!
}

type Company {
  id: ID!
  name: String!
  description: String
  jobs: [Job!]
}

```

When requesting a single job or a list of jobs, we get the company data for each job.

And also, when requesting a single company, we can then navigate and get data of multiple jobs.

Server side resolvers:

```
export const resolvers = {
  Query: {
    jobs: async () => Job.findAll(),
    job: (_root, args) => {
      const id = args.id;
      return Job.findById(id);
    },
    company: (_root, { id }) => Company.findById(id),
  },

  Job: {
    company: (job) => {
      return Company.findById(job.companyId);
    },
  },

  Company: {
    jobs: (company) => Job.findAll((job) => job.companyId === company.id),
  },
};
```

We can even have **recursive** nested queries:

```
query CompanyQuery ($id: ID!){
  company(id: $id) { # getting Company
    name
    description
    jobs {  # getting Job
      title
      id
      company {  # getting Company Again !
        id
        name
      }
    }
  }
}
```

**GraphQL will resolve the client query using the resolvers recursively.**

Facebook created GraphQL to easy traverse graphs, if you think about it, Facebook network is a big graph between friends relationships.

### Error Handling
