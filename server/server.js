import cors from "cors";
import express from "express";
import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";
import { createCompanyLoader, db } from "./db.js";
import { ApolloServer } from "apollo-server-express";
import { readFileSync } from "fs";
import { resolvers } from "./resolvers.js";

const PORT = 9000;
const JWT_SECRET = Buffer.from("Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt", "base64");

const app = express();

// middleware it is applied to every request we receive
app.use(
  cors(),
  express.json(),
  expressjwt({
    algorithms: ["HS256"],
    credentialsRequired: false,
    secret: JWT_SECRET,
  })
);

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await db.select().from("users").where("email", email).first();
  if (user && user.password === password) {
    const token = jwt.sign({ sub: user.id }, JWT_SECRET);
    res.json({ token });
  } else {
    res.sendStatus(401);
  }
});

// import the schema definition
const typeDefs = readFileSync("./schema.graphql", { encoding: "utf-8" });

const context = async ({ req, res }) => {
  const companyLoader = createCompanyLoader();

  if (req.auth) {
    const user = await db
      .select()
      .from("users")
      .where("id", req.auth.sub)
      .first();
    return { user, companyLoader };
  }
  return { companyLoader };
};

const apolloServer = new ApolloServer({ typeDefs, resolvers, context });

await apolloServer.start();

// we are going to handle graphql request in the /graphql path
apolloServer.applyMiddleware({ app, path: "/graphql" });

// you can support other Rest and GraphQL request in the same server
app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
