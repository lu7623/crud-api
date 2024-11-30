import { IncomingMessage } from 'http';
import { Endpoints } from '../server/types';
import url from 'url';

type RequestData = {
  url: string;
  method: string;
  id?: string;
} | null;

export const urlParse = (req: IncomingMessage): RequestData => {
  if (req.url && req.method) {
    const parsed = url.parse(req.url, true);
    const reqUrl = parsed.pathname;
    const method = req.method.toUpperCase();
    if (!reqUrl) return null;

    if (reqUrl.startsWith(Endpoints.user)) {
      const urlpath = reqUrl.split('/').filter(Boolean);
      if (urlpath.length !== 3) return null;
      const id = urlpath[urlpath.length - 1];
      return { url: reqUrl, method: method, id: id };
    } else if (reqUrl.startsWith(Endpoints.users)) {
      return { url: reqUrl, method: method };
    } else return null;
  }
  return null;
};
