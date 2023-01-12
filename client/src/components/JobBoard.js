import { useQuery } from "@apollo/client";
import { JOBS_QUERY } from "../graphql/queries";
import JobList from "./JobList";

function JobBoard() {
  const { data, loading, error } = useQuery(JOBS_QUERY, {
    fetchPolicy: "network-only",
  });

  if (loading) {
    return <p>Loading ...</p>;
  }

  if (error) {
    return <p>Sorry, something went wrong.</p>;
  }

  return (
    <div>
      <h1 className="title">Job Board</h1>
      <JobList jobs={data.jobs} />
    </div>
  );
}

export default JobBoard;
