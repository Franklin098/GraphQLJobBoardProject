import { useMutation, useQuery } from "@apollo/client";
import { getAccessToken } from "../auth";
import {
  COMPANY_QUERY,
  CREATE_JOB_MUTATION,
  JOBS_QUERY,
  JOB_QUERY,
} from "./queries";

export function useJobs() {
  const { data, loading, error } = useQuery(JOBS_QUERY, {
    fetchPolicy: "network-only",
  });

  return {
    jobs: data?.jobs,
    loading,
    error: Boolean(error),
  };
}

export function useJob(id) {
  const { data, loading, error } = useQuery(JOB_QUERY, {
    variables: { id },
  });

  return {
    job: data?.job,
    loading,
    error: Boolean(error),
  };
}

export function useCompany(id) {
  const { data, loading, error } = useQuery(COMPANY_QUERY, {
    variables: { id },
  });

  return {
    company: data?.company,
    loading,
    error: Boolean(error),
  };
}

export function useJobMutation() {
  const [mutate, result] = useMutation(CREATE_JOB_MUTATION);
  const { loading } = result;

  const callJobMutation = async (input) => {
    const response = await mutate({
      variables: { input },
      context: {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      },
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
    const { job } = response.data;
    return job;
  };

  return {
    callJobMutation,
    job: result?.data,
    loading,
  };
}
