import { drizzle } from 'drizzle-orm/node-postgres';
import getTimestamp from '../utils/getTimestamp.util.js';

async function connectDatabase() {
  try {
    const dbConnection = drizzle(process.env.DATABASE_URL);
    console.info(`${getTimestamp()} Database connection established successfully`);
    return dbConnection;
  } catch (error) {
    console.error(`ERROR : Failed to establish database connection ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

const databaseConnection = await connectDatabase();

export default databaseConnection;
