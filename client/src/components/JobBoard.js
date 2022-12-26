import JobList from "./JobList";
import { getJobs } from "../graphql/queries";
import { useEffect, useState } from "react";

function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const responseJobs = await getJobs();
      setJobs(responseJobs);
    } catch (error) {
      setIsError(true);
    }
  };

  if (isError) {
    return <p>Sorry, something went wrong.</p>;
  }

  return (
    <div>
      <h1 className="title">Job Board</h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default JobBoard;
