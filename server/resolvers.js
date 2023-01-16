import { db } from "./db.js";
import { nanoid } from "nanoid";

function rejectIf(condition) {
  if (condition) {
    throw new Error("Unauthorized");
  }
}

export const resolvers = {
  Query: {
    // the resolver func can be asynchronous, which is useful if we want to fetch data from a database
    jobs: async () => await db.select().from("jobs"),
    job: (_root, args) => {
      const id = args.id;
      return db.select().from("jobs").where("id", id).first();
    },
    company: async (_root, { id }) =>
      await db.select().from("companies").where("id", id).first(),
  },

  Job: {
    // first argument is the parent object, in thi case a job
    company: (job) => {
      // console.log(`resolving company for job:`, job);
      return db.select().from("companies").where("id", job.companyId).first();
    },
  },

  Company: {
    jobs: (company) => db.select().from("jobs").where("companyId", company.id),
  },

  Mutation: {
    createJob: async (_root, args, context) => {
      const { user } = context;
      rejectIf(!user);
      const { companyId } = user;
      const { input } = args;
      const job = { id: nanoid(), companyId, ...input };
      await db.insert(job).into("jobs");
      return job;
    },
    deleteJob: async (_root, { id }, context) => {
      const { user } = context;
      rejectIf(!user);
      const job = await db.select().from("jobs").where("id", id).first();
      rejectIf(job.companyId !== user.companyId);
      await db("jobs").where("id", id).del();
      return;
    },

    updateJob: async (_root, { input }, context) => {
      const { user } = context;
      rejectIf(!user);
      const job = await db.select().from("jobs").where("id", input.id).first();
      rejectIf(job.companyId !== user.companyId);
      const updatedJob = { ...input, companyId: job.companyId };
      await db("jobs").update(updatedJob).where("id", input.id);
      return updatedJob;
    },
  },
};

// GraphQL has a 'resolution chain', it works like a tree from top to button
// First it starts at the Query object and we can writing specific resolvers as needed
