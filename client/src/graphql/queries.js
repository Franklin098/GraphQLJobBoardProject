import { ApolloClient, gql, InMemoryCache } from "@apollo/client"; // similar to graph-ql request, but provides more tools. Parses and validates from the client
import { request } from "graphql-request";
import { getAccessToken } from "../auth";

const GRAPHQL_URL = "http://localhost:9000/graphql";

const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache(), // cache the queries, avoids multiple request for the same query with an expiring policy
});

export async function getJobs() {
  const query = gql`
    query JobQuery {
      jobs {
        id
        title
        company {
          name
        }
      }
    }
  `;

  const result = await client.query({ query });
  const { data } = result;
  return data.jobs;
}

export async function getJob(id) {
  const query = gql`
    query JobQuery($id: ID!) {
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
  `;
  const variables = { id };
  const result = await client.query({ query, variables });
  const { data } = result;
  return data.job;
}

export async function getCompany(id) {
  const query = gql`
    query CompanyQuery($id: ID!) {
      company(id: $id) {
        name
        description
        jobs {
          id
          title
        }
      }
    }
  `;

  const variables = { id };
  const result = await client.query({ query, variables });
  const {
    data: { company },
  } = result;
  return company;
}

export async function createJob(input) {
  const query = gql`
    mutation CreateJoMutation($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
        title
        company {
          id
          name
        }
      }
    }
  `;

  const variables = { input };
  const headers = { Authorization: `Bearer ${getAccessToken()}` };
  const data = await request(GRAPHQL_URL, query, variables, headers);
  return data.job;
}
