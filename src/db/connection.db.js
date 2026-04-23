import 'dotenv/config';

import { drizzle } from 'drizzle-orm/node-postgres';
import getTimestamp from '../utils/getTimestamp.util.js';
import { sql } from 'drizzle-orm';

let dbConnection;
try {
  dbConnection = drizzle(process.env.DATABASE_URL);
  await dbConnection.execute(sql`SELECT 1`);
  console.info(`${getTimestamp()} Database connection established successfully`);
} catch (error) {
  console.error(`ERROR : Failed to establish database connection ${error.message}`);
  console.error(error);
  throw new Error(`ERROR : Failed to establish database connection ${error.message}`);
}
export default dbConnection;
