import { execSync } from "node:child_process";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import { app } from "../src/app";

describe("Meals routes", () => {
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

  it("should be able to create a new meal", async () => {
    const userResponse = await request(app.server)
      .post("/users")
      .send({
        name: "Gabriel Santos",
        email: "xK5zK@example.com",
      })
      .expect(201);

    await request(app.server)
      .post("/meals")
      .set("Cookie", userResponse.get("Set-Cookie")!)
      .send({
        name: "Bolo de cenoura",
        description: "Bolo recheado com cenoura",
        date: "2022-10-10",
        on_diet: true,
      })
      .expect(201);
  });

  it("should be able to edit a meal", async () => {
    const userResponse = await request(app.server)
      .post("/users")
      .send({
        name: "Gabriel Santos",
        email: "xK5zK@example.com",
      })
      .expect(201);

    await request(app.server)
      .post("/meals")
      .set("Cookie", userResponse.get("Set-Cookie")!)
      .send({
        name: "Bolo de cenoura",
        description: "Bolo recheado com cenoura",
        date: "2022-10-10",
        on_diet: true,
      })
      .expect(201);

    const mealsResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", userResponse.get("Set-Cookie")!)
      .expect(200);

    const mealId = mealsResponse.body.meals[0].id;

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set("Cookie", userResponse.get("Set-Cookie")!)
      .send({
        name: "Dinner",
        description: "It's a dinner",
        on_diet: true,
        date: "2022-10-10",
      })
      .expect(204);
  });

  it("should be able to delete a meal", async () => {
    const userResponse = await request(app.server)
      .post("/users")
      .send({
        name: "Gabriel Santos",
        email: "xK5zK@example.com",
      })
      .expect(201);

    await request(app.server)
      .post("/meals")
      .set("Cookie", userResponse.get("Set-Cookie")!)
      .send({
        name: "Bolo de cenoura",
        description: "Bolo recheado com cenoura",
        date: "2022-10-10",
        on_diet: true,
      })
      .expect(201);

    const mealsResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", userResponse.get("Set-Cookie")!)
      .expect(200);

    const mealId = mealsResponse.body.meals[0].id;

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set("Cookie", userResponse.get("Set-Cookie")!)
      .expect(204);
  });

  it("should be able to list all meals", async () => {
    const userResponse = await request(app.server)
      .post("/users")
      .send({
        name: "Gabriel Santos",
        email: "xK5zK@example.com",
      })
      .expect(201);

    await request(app.server)
      .post("/meals")
      .set("Cookie", userResponse.get("Set-Cookie")!)
      .send({
        name: "Bolo de cenoura",
        description: "Bolo recheado com cenoura",
        date: "2022-10-10",
        on_diet: true,
      })
      .expect(201);

    const mealsResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", userResponse.get("Set-Cookie")!)
      .expect(200);

    expect(mealsResponse.body.meals).toHaveLength(1);
  });

  it("Should be able to get a meal by id", async () => {
    const userResponse = await request(app.server)
      .post("/users")
      .send({
        name: "Gabriel Santos",
        email: "xK5zK@example.com",
      })
      .expect(201);

    await request(app.server)
      .post("/meals")
      .set("Cookie", userResponse.get("Set-Cookie")!)
      .send({
        name: "Bolo de cenoura",
        description: "Bolo recheado com cenoura",
        date: "2022-10-10",
        on_diet: true,
      })
      .expect(201);

    const mealsResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", userResponse.get("Set-Cookie")!)
      .expect(200);

    const mealId = mealsResponse.body.meals[0].id;

    await request(app.server)
      .get(`/meals/${mealId}`)
      .set("Cookie", userResponse.get("Set-Cookie")!)
      .expect(200);
  });

  it("should be able to get metrics from a user", async () => {
    const userResponse = await request(app.server)
      .post("/users")
      .send({ name: "John Doe", email: "johndoe@gmail.com" })
      .expect(201);

    await request(app.server)
      .post("/meals")
      .set("Cookie", userResponse.get("Set-Cookie")!)
      .send({
        name: "Breakfast",
        description: "It's a breakfast",
        on_diet: true,
        date: "2022-10-10",
      })
      .expect(201);

    await request(app.server)
      .post("/meals")
      .set("Cookie", userResponse.get("Set-Cookie")!)
      .send({
        name: "Lunch",
        description: "It's a lunch",
        on_diet: false,
        date: "2022-10-10",
      })
      .expect(201);

    await request(app.server)
      .post("/meals")
      .set("Cookie", userResponse.get("Set-Cookie")!)
      .send({
        name: "Snack",
        description: "It's a snack",
        on_diet: true,
        date: "2022-10-10",
      })
      .expect(201);

    await request(app.server)
      .post("/meals")
      .set("Cookie", userResponse.get("Set-Cookie")!)
      .send({
        name: "Dinner",
        description: "It's a dinner",
        on_diet: true,
        date: "2022-10-10",
      });

    await request(app.server)
      .post("/meals")
      .set("Cookie", userResponse.get("Set-Cookie")!)
      .send({
        name: "Breakfast",
        description: "It's a breakfast",
        on_diet: true,
        date: "2022-10-10",
      });

    const metricsResponse = await request(app.server)
      .get("/meals/metrics")
      .set("Cookie", userResponse.get("Set-Cookie")!)
      .expect(200);

    expect(metricsResponse.body).toEqual({
      totalMeals: 5,
      totalMealsOnDiet: 4,
      totalMealsOffDiet: 1,
      bestOnDietSequence: 3,
    });
  });
});
