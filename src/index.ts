import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import url from 'node:url';
import { Endpoints } from './server/types';
import { error } from 'node:console';
import 'dotenv/config';

const port = process.env.PORT || 4000;

// const __dirname = import.meta.dirname;

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  if (!req.url) throw error;
  const parsed = url.parse(req.url, true);
  const reqUrl = parsed.pathname;
  if (reqUrl === '/ping') {
    res.statusCode = 200;
    res.end();
  } else if (reqUrl && reqUrl.startsWith(Endpoints.user)) {
    res.statusCode = 200;
    const urlpath = reqUrl.split('/');
    const id = urlpath[urlpath.length - 1];
    res.write(JSON.stringify(`Hello from ${id}`));
    res.end();
  } else if (reqUrl === Endpoints.users) {
    res.statusCode = 200;
    res.write(JSON.stringify('Hello from all users'));
    res.end();
  } else {
    res.statusCode = 404;
    res.end('Page not found');
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
