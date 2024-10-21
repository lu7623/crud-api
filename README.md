# Simple CRUD API

[Task requirements](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md)

#### Installation

```bash
$ git clone https://github.com/lu7623/crud-api.git
```

```bash
$ cd crud-api
```

```bash
$ git checkout develop
```

```bash
$ npm install
```

#### Running the app
Start server in dev mode:
```
$ npm run start:dev
```
Build and start production server:
```
$ npm run start:prod
```
Run tests
```
$ npm run test
```

#### Endpoints

  - **GET** `api/users` is used to get all persons
    - Response: `status code` **200** and all users records
  - **GET** `api/users/${userId}`
    - Response: `status code` **200** and and record with `id === userId` if it exists
    - Response: `status code` **400** and message `Invalid user id` if provided id is not valid uuid
    - Response: `status code` **404** and message `User not found`
  - **POST** `api/users` is used to create record about new user and store it in database
    - Response: `status code` **201** and newly created record
    - Response: `status code` **400** and message `Bad request` if request `body` does not contain **required** fields
  - **PUT** `api/users/{userId}` is used to update existing user
    - Response: ` status code` **200** and updated record
    - Response: ` status code` **400** and message `Invalid user id` if provided id is not valid uuid
    - Response: ` status code` **404** and and message `User not found`
  - **DELETE** `api/users/${userId}` is used to delete existing user from database
    - Response: `status code` **204** if the record is found and deleted
    - Response: ` status code` **400** and message `Invalid user id` if provided id is not valid uuid
    - Response: ` status code` **404** and and message `User not found`

Users are stored as objects that have following properties:
- id — unique identifier (string, uuid) generated on server side
- username — user's name (string, required)
- age — user's age (number, required)
- hobbies — user's hobbies (array of strings or empty array, required)

Requests to non-existing endpoints (e.g. `some-non/existing/resource`) Response: `status code` **404** `Not found`)

Errors on the server side that occur during the processing of a request should be handled and processed correctly (server should answer with status code 500 and corresponding human-friendly message)
