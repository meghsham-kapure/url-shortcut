import 'dotenv/config';
import app from './app.js';
import getTimestamp from './utils/getTimestamp.util.js';
const PORT = process.env.PORT ?? 5050;

app.listen(PORT, () => console.info(`${getTimestamp()} Server running on port ${PORT}`));
