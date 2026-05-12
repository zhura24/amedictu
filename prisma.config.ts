// prisma.config.ts
// Letakkan file ini di ROOT folder project (sejajar dengan package.json)

import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
});
