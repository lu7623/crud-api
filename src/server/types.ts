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

export enum Endpoints {
  users = '/api/users',
  user = '/api/users/',
}
