import { randomUUID } from "crypto";
import { FastifyPluginCallback } from "fastify";
import { z } from "zod";
import { knex } from "../database";

export const usersRoutes: FastifyPluginCallback = async (app, _opts, done) => {
  app.post("/", async (request, reply) => {
    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();

      reply.setCookie("sessionId", sessionId, {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });
    }

    const createUserBody = z.object({
      name: z.string(),
      email: z.string().email(),
    });

    const { name, email } = createUserBody.parse(request.body);

    const userExists = await knex("users").where({ name }).first();

    if (userExists) {
      return reply.status(409).send({
        message: "User already exists",
      });
    }

    await knex("users").insert({
      id: randomUUID(),
      name,
      email,
      session_id: sessionId,
    });

    return reply.status(201).send({
      message: "User created",
    });
  });

  done();
};
