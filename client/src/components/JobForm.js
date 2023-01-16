import { useMutation } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router";
import { getAccessToken } from "../auth";
import { CREATE_JOB_MUTATION, JOB_QUERY } from "../graphql/queries";

function JobForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mutate, result] = useMutation(CREATE_JOB_MUTATION);
  const { loading } = result;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await mutate({
      variables: { input: { title, description } },
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
    const { job } = result.data;
    navigate(`/jobs/${job.id}`);
  };

  return (
    <div>
      <h1 className="title">New Job</h1>
      <div className="box">
        <form>
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <textarea
                className="textarea"
                rows={10}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button
                className="button is-link"
                onClick={handleSubmit}
                disabled={loading}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobForm;
