import { ErrorResponse, StatusCodes, UserResponse } from './types';
import { ServerResponse } from 'http';

export const makeResponse = ({
  res,
  code,
  error,
  data,
}: {
  res: ServerResponse;
  code: StatusCodes;
  error?: ErrorResponse;
  data?: UserResponse;
}) => {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json');
  if (error) {
    res.write(JSON.stringify(error));
  }
  if (data) {
    res.write(JSON.stringify(data));
  }
  res.end()
};
