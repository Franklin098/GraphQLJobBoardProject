import knex from "knex";
import DataLoader from "dataloader";

export const db = knex({
  client: "better-sqlite3",
  connection: {
    filename: "./data/db.sqlite3",
  },
  useNullAsDefault: true,
});

db.on("query", ({ sql, bindings }) => {
  console.log("[db] query:", sql, bindings);
});

export function createCompanyLoader() {
  return new DataLoader(async (companyIds) => {
    console.log("[companyLoader] companyIds: ", companyIds);
    const companies = await db
      .select()
      .from("companies")
      .whereIn("id", companyIds);

    // we must ensure that we return in the same order as in the input array
    return companyIds.map((companyId) => {
      return companies.find((company) => company.id === companyId);
    });
  });
}
