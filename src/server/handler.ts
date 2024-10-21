import { IncomingMessage, ServerResponse } from 'http';
import { Endpoints, Methods, StatusCodes, User, UserInfo } from './types';
import { messages } from './messages';
import { urlParse } from '../utils/urlParse';
import { usersDatabase } from './userDatabase';
import { isUserInfo } from '../utils/typeGuard';
import { v4 as uuidv4 } from 'uuid';
import { validate as uuidValidate } from 'uuid';
import { makeResponse } from './makeResponse';

export const handler = (req: IncomingMessage, res: ServerResponse) => {
  const reqData = urlParse(req);
  try {
    if (reqData) {
      const { url, method, id } = reqData;
      if (url.startsWith(Endpoints.user)) {
        if (method === Methods.GET && id) {
          if (!uuidValidate(id)) {
            makeResponse({
              res: res,
              code: StatusCodes.BadRequest,
              error: { error: messages.invalidId },
            });
          } else {
            let user = usersDatabase.find((x) => x.id === id);
            if (user) {
              makeResponse({ res: res, code: StatusCodes.Ok, data: { data: user } });
            } else {
              makeResponse({
                res: res,
                code: StatusCodes.NotFound,
                error: { error: messages.notFoundUser },
              });
            }
          }
        } else if (method === Methods.PUT && id) {
          if (!uuidValidate(id)) {
            makeResponse({
              res: res,
              code: StatusCodes.BadRequest,
              error: { error: messages.invalidId },
            });
          } else {
            let userIndex = usersDatabase.findIndex((x) => x.id === id);
            if (userIndex!==-1) {
              let bodyData = '';
              req.on('data', function (data) {
                bodyData += data;
              });
              req.on('end', function () {
                const body = JSON.parse(bodyData);
                if (isUserInfo(body)) {
                  let updateUser: User = Object.assign(body, { id: id });
                  usersDatabase[userIndex] = updateUser;
                  makeResponse({ res: res, code: StatusCodes.Ok, data: { data: updateUser } });
                } else {
                  makeResponse({
                    res: res,
                    code: StatusCodes.BadRequest,
                    error: { error: messages.invalidFields },
                  });
                }
              });
            } else {
              makeResponse({
                res: res,
                code: StatusCodes.NotFound,
                error: { error: messages.notFoundUser },
              });
            }
          }
        } else if (method === Methods.DELETE && id) {
          if (!uuidValidate(id)) {
            makeResponse({
              res: res,
              code: StatusCodes.BadRequest,
              error: { error: messages.invalidId },
            });
          } else {
            let userIndex = usersDatabase.findIndex((x) => x.id === id);
            if (userIndex!==-1) {
              usersDatabase.splice(userIndex, 1);
              makeResponse({ res: res, code: StatusCodes.Deleted });
            } else {
              makeResponse({
                res: res,
                code: StatusCodes.NotFound,
                error: { error: messages.notFoundUser },
              });
            }
          }
        } else {
          makeResponse({
            res: res,
            code: StatusCodes.BadRequest,
            error: { error: messages.wrongMethod },
          });
        }
      } else if (url === Endpoints.users) {
        if (method === Methods.GET) {
          makeResponse({ res: res, code: StatusCodes.Ok, data: { data: usersDatabase } });
        } else if (method === Methods.POST) {
          let bodyData = '';
          req.on('data', function (data) {
            bodyData += data;
          });

          req.on('end', function () {
            const body = JSON.parse(bodyData);
            if (isUserInfo(body)) {
              let newUser: User = Object.assign(body, { id: uuidv4() });
              usersDatabase.push(newUser);
              makeResponse({ res: res, code: StatusCodes.Created, data: { data: newUser } });
            } else {
              makeResponse({
                res: res,
                code: StatusCodes.BadRequest,
                error: { error: messages.invalidFields },
              });
            }
          });
        } else {
          makeResponse({
            res: res,
            code: StatusCodes.BadRequest,
            error: { error: messages.wrongMethod },
          });
        }
      }
    } else {
      makeResponse({
        res: res,
        code: StatusCodes.NotFound,
        error: { error: messages.notFoundEndpoint },
      });
    }
  } catch {
    makeResponse({
      res: res,
      code: StatusCodes.ServerError,
      error: { error: messages.serverError },
    });
  }
};
