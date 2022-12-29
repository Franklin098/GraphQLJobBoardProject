import { Job, Company } from "./db.js";

export const resolvers = {
  Query: {
    // the resolver func can be asynchronous, which is useful if we want to fetch data from a database
    jobs: async () => Job.findAll(),
    job: (_root, args) => {
      const id = args.id;
      return Job.findById(id);
    },
    company: (_root, { id }) => Company.findById(id),
  },

  Job: {
    // first argument is the parent object, in thi case a job
    company: (job) => {
      // console.log(`resolving company for job:`, job);
      return Company.findById(job.companyId);
    },
  },

  Company: {
    jobs: (company) => Job.findAll((job) => job.companyId === company.id),
  },

  Mutation: {
    createJob: async (_root, args) => {
      const { input } = args;
      const job = await Job.create(input);
      return job;
    },
    deleteJob: (_root, { id }) => Job.delete(id),
    updateJob: (_root, { input }) => Job.update(input),
  },
};

// GraphQL has a 'resolution chain', it works like a tree from top to button
// First it starts at the Query object and we can writing specific resolvers as needed
