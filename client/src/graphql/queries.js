import { ApolloClient, gql, InMemoryCache } from "@apollo/client"; // similar to graph-ql request, but provides more tools. Parses and validates from the client
import { getAccessToken } from "../auth";

const GRAPHQL_URL = "http://localhost:9000/graphql";

export const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache(), // cache the queries, avoids multiple request for the same query with an expiring policy
  defaultOptions: {
    query: {
      fetchPolicy: "cache-first",
    },
  },
});

const JOB_DETAIL_FRAGMENT = gql`
  fragment JobDetail on Job {
    id
    title
    description
    company {
      id
      name
    }
  }
`;

export const JOB_QUERY = gql`
  query JobQuery($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }

  # insert expression here, like a string
  ${JOB_DETAIL_FRAGMENT}
`;

// A good practice while using ApolloClient is to always fetch the ID of every object, even if we don't use it.
// It can helps with caching. ApolloClient normalizes data to avoid having duplicate data, it uses the ID to do it.
export const JOBS_QUERY = gql`
  query JobQuery {
    jobs {
      id
      title
      company {
        id
        name
      }
    }
  }
`;

export const CREATE_JOB_MUTATION = gql`
  mutation CreateJoMutation($input: CreateJobInput!) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }

  # insert expression here, like a string
  ${JOB_DETAIL_FRAGMENT}
`;

export const COMPANY_QUERY = gql`
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

export async function getJobs() {
  const result = await client.query({
    JOBS_QUERY,
    fetchPolicy: "network-only",
  }); // no-cache and network-only are similar, but network-only still stores in the cache
  const { data } = result;
  return data.jobs;
}

export async function getJob(id) {
  const variables = { id };
  const result = await client.query({ query: JOB_QUERY, variables });
  const { data } = result;
  return data.job;
}

export async function getCompany(id) {
  const variables = { id };
  const result = await client.query({ COMPANY_QUERY, variables });
  const {
    data: { company },
  } = result;
  return company;
}

export async function createJob(input) {
  const variables = { input };
  const headers = { Authorization: `Bearer ${getAccessToken()}` };

  const result = await client.mutate({
    mutation: CREATE_JOB_MUTATION,
    variables,
    context: { headers },

    // executes after the mutation
    update: (cache, { data: { job } }) => {
      // store the data in the cache to avoid doing a new request when navigating to the Job detail page
      cache.writeQuery({
        query: JOB_QUERY,
        variables: { id: job.id },
        data: { job },
      });
    },
  });

  const {
    data: { job },
  } = result;

  return job;
}
