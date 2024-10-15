import 'dotenv/config';
import { createServer } from 'node:http';
import { handler } from './server/handler';

const port = process.env.PORT || 4000;

const server = createServer(handler);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
