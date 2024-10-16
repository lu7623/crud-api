import { IncomingMessage, ServerResponse } from 'http';
import { Endpoints, Methods, StatusCodes, User, UserInfo } from './types';
import { messages } from './messages';
import { urlParse } from '../utils/urlParse';
import { usersDatabase } from './userDatabase';
import { isUserInfo } from 'src/utils/typeGuard';
import { v4 as uuidv4 } from 'uuid';
import { validate as uuidValidate } from 'uuid';

export const handler = (req: IncomingMessage, res: ServerResponse) => {
  const reqData = urlParse(req);
  try {
    if (reqData) {
      const { url, method, id } = reqData;
      if (url.startsWith(Endpoints.user)) {
        if (method === Methods.GET && id) {
          if (!uuidValidate(id)) {
            res.statusCode = StatusCodes.BadRequest;
            res.end(JSON.stringify(messages.invalidId));
          } else {
            let user = usersDatabase.find((x) => x.id === id);
            if (user) {
              res.statusCode = StatusCodes.Ok;
              res.write(JSON.stringify({ data: user }));
              res.end();
            } else {
              res.statusCode = StatusCodes.NotFound;
              res.end(JSON.stringify(messages.notFoundUser));
            }
          }
        } else if (method === Methods.PUT && id) {
          if (!uuidValidate(id)) {
            res.statusCode = StatusCodes.BadRequest;
            res.end(JSON.stringify(messages.invalidId));
          } else {
            let userIndex = usersDatabase.findIndex((x) => x.id === id);
            if (userIndex) {
              let bodyData = '';
              req.on('data', function (data) {
                bodyData += data;
              });

              req.on('end', function () {
                const body = JSON.parse(bodyData);
                if (isUserInfo(body)) {
                  let updateUser: User = Object.assign(body, { id: id });
                  usersDatabase[userIndex] = updateUser;
                  res.statusCode = StatusCodes.Ok;
                  res.write(JSON.stringify({ data: updateUser }));
                  res.end(JSON.stringify(messages.successUpdate));
                } else {
                  res.statusCode = StatusCodes.BadRequest;
                  res.end(JSON.stringify(messages.invalidFields));
                }
              });
            } else {
              res.statusCode = StatusCodes.NotFound;
              res.end(JSON.stringify(messages.notFoundUser));
            }
          }
        } else if (method === Methods.DELETE && id) {
          if (!uuidValidate(id)) {
            res.statusCode = StatusCodes.BadRequest;
            res.end(JSON.stringify(messages.invalidId));
          } else {
            let userIndex = usersDatabase.findIndex((x) => x.id === id);
            if (userIndex) {
              usersDatabase.splice(userIndex, 1);
              res.statusCode = StatusCodes.Deleted;
              res.end(JSON.stringify(messages.successDelete));
            } else {
              res.statusCode = StatusCodes.NotFound;
              res.end(JSON.stringify(messages.notFoundUser));
            }
          }
        } else {
          res.statusCode = StatusCodes.BadRequest;
          res.end(JSON.stringify(messages.wrongMethod));
        }
      } else if (url === Endpoints.users) {
        if (method === Methods.GET) {
          res.statusCode = StatusCodes.Ok;
          res.write(JSON.stringify({ data: usersDatabase }));
          res.end();
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
              res.statusCode = StatusCodes.Created;
              res.write(JSON.stringify({ data: newUser }));
              res.end(JSON.stringify(messages.successCreate));
            } else {
              res.statusCode = StatusCodes.BadRequest;
              res.end(JSON.stringify(messages.invalidFields));
            }
          });
        } else {
          res.statusCode = StatusCodes.BadRequest;
          res.end(JSON.stringify(messages.wrongMethod));
        }
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
