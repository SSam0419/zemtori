import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "turso",
  schema: "./drizzle-schemas.ts",
  dbCredentials: {
    url: "libsql://osb-schema-ssam0419.turso.io",
    authToken:
      "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE3MzMwMjkwOTAsImlhdCI6MTczMjk0MjY5MCwiaWQiOiJhYmYwZjhlMi0zYTJiLTQwYzctYTYyMS1mMTgyNGJkY2FhYzgifQ.hN_6dWruGc4csJkuyuOW5xwxfEqkaS7F-81x-3415fD5s91VZ-XygUl6AL_TSog9zlMUaK8KFSV-T0pG764ZAg",
    // url: "libsql://yesy-ssam0419.turso.io",
    // authToken:
    //   "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE3MzMwMjkyOTUsImlhdCI6MTczMjk0Mjg5NSwiaWQiOiI0YmFhYTgxMC04NmRmLTRiMzItOGZmNC1iMDQxMjVjYjc2YTUifQ.npFJ2XJ7vDqbIlBJXC_USx5LhvpXSFc3YUNhNue2eh1KafMgprMgXbSTmsZuggwPUmIcawctTZUPMgO-o7w2Dw",
  },
  out: "./drizzle",
});
