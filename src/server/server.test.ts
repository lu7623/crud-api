
import "../index";
import {server} from "../index";
import { messages } from "./messages";
import { User, UserInfo } from "./types";

let response: Response;
const mockUser:UserInfo= {
  "username": "Sherlock Holmes",
  "age": 60,
  "hobbies": ["tobacco", "violin"]
}
const mockUser1:UserInfo= {
  "username": "John  Watson",
  "age": 46,
  "hobbies": ["medicine", "bird-watching"]
}
const baseUrl= "http://localhost:4000/api/users"
let savedUserRecord: User;

afterAll(()=>{
  server.close();
})

describe("Testing server status codes", () => {
  test("Should have response status 200 if Ok", async () => {
    response = await fetch(baseUrl);

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/json");
  });

  test("Should have 400 when using an unsupported method", async () => {
    response = await fetch(baseUrl, {
      method: "PATCH",
    });
    const body = (await response.json()) as unknown as { error: string };

    expect(response.status).toBe(400);
    expect(body.error).toBe(messages.wrongMethod);
  });

  test("Should have 404 on incorrect endpoint", async () => {
    response = await fetch("http://localhost:4000/api/some/endpoint");
    const body = (await response.json()) as unknown as { error: string };

    expect(response.status).toBe(404);
    expect(body.error).toBe(messages.notFoundEndpoint);
  });
});

describe("Testing CRUD operations", () => {
  test("Get all records with a GET api/users request (an empty array is expected)", async () => {
    response = await fetch(baseUrl);
    const body = (await response.json()) as unknown as object;

    expect(body).toEqual({ data: [] });
  });

  test("A new object is created by a POST api/users request (a response containing newly created record is expected)", async () => {
    response = await fetch(baseUrl, {
      method: "POST",
      body: JSON.stringify(mockUser),
    });
    expect(response.status).toBe(201);
    const body = (await response.json()) as unknown as { data: User };
    savedUserRecord = { ...body.data };

    expect(body.data.age).toEqual(mockUser.age);
    expect(body.data.hobbies).toEqual(mockUser.hobbies);
    expect(body.data.username).toEqual(mockUser.username);
  });

  test("We try to update the created record with a PUT api/users/{userId}request (a response is expected containing an updated object with the same id)", async () => {
    response = await fetch( `${baseUrl}/${savedUserRecord.id}`, {
      method: "PUT",
      body: JSON.stringify(mockUser1),
    });
   
    const body = (await response.json()) as unknown as { data: User };

    expect(response.status).toBe(200);
    expect(body.data.age).toEqual(mockUser1.age);
    expect(body.data.hobbies).toEqual(mockUser1.hobbies);
    expect(body.data.username).toEqual(mockUser1.username);
  });

  test("Should return all records with a GET api/users request (an array with one record expected)", async () => {
    response = await fetch(baseUrl);
    const body = (await response.json()) as unknown as { data: User[] };

    expect(body.data.length).toEqual(1);
  });

  test("With a DELETE api/users/{userId} request, we delete the created object by id (confirmation of successful deletion is expected)", async () => {
    response = await fetch(
      `${baseUrl}/${savedUserRecord.id}`,
      { method: "DELETE" },
    );

    expect(response.status).toEqual(204);
  });

  test("With a GET api/users/{userId} request, we are trying to get a deleted object by id (expected answer is that there is no such object)", async () => {
    response = await fetch(
      `${baseUrl}/${savedUserRecord.id}`,
    );
    const body = (await response.json()) as unknown as { error: string };

    expect(response.status).toEqual(404);
    expect(body.error).toBe(messages.notFoundUser);
  });
});