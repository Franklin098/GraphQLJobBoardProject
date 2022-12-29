import { Job, Company, User } from "./db.js";

function rejectIf(condition) {
  if (condition) {
    throw new Error("Unauthorized");
  }
}

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
    createJob: async (_root, args, context) => {
      const { user } = context;
      rejectIf(!user);
      const { companyId } = user;
      const { input } = args;
      const job = await Job.create({ ...input, companyId });
      return job;
    },
    deleteJob: async (_root, { id }, context) => {
      const { user } = context;
      rejectIf(!user);
      const job = await Job.findById(id);
      rejectIf(job.companyId !== user.companyId);
      return Job.delete(id);
    },

    updateJob: async (_root, { input }, context) => {
      const { user } = context;
      rejectIf(!user);
      const job = await Job.findById(input.id);
      rejectIf(job.companyId !== user.companyId);
      return Job.update({ ...input, companyId: job.companyId });
    },
  },
};

// GraphQL has a 'resolution chain', it works like a tree from top to button
// First it starts at the Query object and we can writing specific resolvers as needed
