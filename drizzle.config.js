import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  dbCredentials:{
    url: "postgresql://neondb_owner:npg_w8U1bojOiIQG@ep-crimson-bird-a84qls2g-pooler.eastus2.azure.neon.tech/ai-interview-mocker?sslmode=require"
  }
});
