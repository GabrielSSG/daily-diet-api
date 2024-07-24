import { execSync } from "node:child_process";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app";

describe("Users routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  });

  it("Should be able to create a new user", async () => {
    const userResponse = await request(app.server)
      .post("/users")
      .send({
        name: "Gabriel Santos",
        email: "xK5zK@example.com",
      })
      .expect(201);

    const cookies = userResponse.get("Set-Cookie");
    expect(cookies).toEqual(
      expect.arrayContaining([expect.stringContaining("sessionId")])
    );
  });
});
