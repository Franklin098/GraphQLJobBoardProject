# Apollo Client

We can manually create GraphQL queries and use the graphql-request library.

Apollo Client is another library build by the Apollo team which provides powerful tools for consuming GraphQL APIs, for example: Caching, which helps to avoid unnecessary API calls.

Imagine a List of Jobs, if you then navigate to a particular Job Detail page and then return to the List of Jobs view, then probably you don't want to do another API request for getting the same List of Jobs.

For React it provides very useful hooks.

We can even use Apollo Client as a **local state management system.**, so we can use it as the only source of truth in our application.

### Installing Apollo Client for our UI

```
npm i -S @apollo/client graphql
```

### Apollo Client Dev Tools - Chrome Extension

Useful for debugging graphql apps, specially for looking at how the Apollo Cache is working.

## Fragment

A part of an object that we can reuse in a query or in a mutation.

```
 query JobQuery($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }

  fragment JobDetail on Job {
    id
    title
    description
    company {
      id
      name
    }
  }
```
