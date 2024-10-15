export interface UserInfo {
  username: string;
  age: number;
  hobbies: string[];
}

export interface User extends UserInfo {
  id: string;
}

export interface UserResponse {
  data: User[] | User;
}

export enum Methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum StatusCodes {
  NotFound = 404,
  Created = 201,
  Ok = 200,
  ServerError = 500,
  Deleted = 204,
  BadRequest = 400,
}

export enum Endpoints {
  users = '/api/users',
  user = '/api/users/',
}
