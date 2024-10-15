import { IncomingMessage, ServerResponse } from 'http';
import { Endpoints, StatusCodes } from './types';
import { messages } from './messages';
import { urlParse } from '../utils/urlParse';

export const handler = (req: IncomingMessage, res: ServerResponse) => {
  const reqData = urlParse(req);
  try {
    if (reqData) {
      const { url, method, id } = reqData;
      if (url.startsWith(Endpoints.user)) {
        res.statusCode = 200;
        res.write(JSON.stringify(`Hello from ${id}`));
        res.end();
      } else if (url === Endpoints.users) {
        res.statusCode = 200;
        res.write(JSON.stringify('Hello from all users'));
        res.end();
      }
    } else {
      res.statusCode = StatusCodes.NotFound;
      res.end(JSON.stringify(messages.notFoundEndpoint));
    }
  } catch {
    res.statusCode = StatusCodes.ServerError;
    res.end(JSON.stringify(messages.serverError));
  }
};
