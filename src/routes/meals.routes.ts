import { randomUUID } from "crypto";
import { FastifyInstance, FastifyPluginCallback } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export const mealsRoutes: FastifyPluginCallback = async (
  app: FastifyInstance,
  _opts,
  done
) => {
  app.get(
    "/",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const meals = await knex("meals")
        .where("user_id", request.user?.id)
        .orderBy("date", "desc");

      return reply.status(200).send({ meals });
    }
  );

  app.get(
    "/:id",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const getMealParams = z.object({
        id: z.string().uuid(),
      });

      const { id } = getMealParams.parse(request.params);

      const meal = await knex("meals").where("id", id).first();
      if (!meal) {
        return reply.status(404).send("Meal not found");
      }
      return reply.status(200).send({ meal });
    }
  );

  app.get(
    "/metrics",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const meals = await knex("meals").where("user_id", request.user?.id);

      const totalMeals = meals.length;

      const totalMealsOnDiet = meals.filter((meal) => meal.on_diet).length;
      const totalMealsOffDiet = totalMeals - totalMealsOnDiet;

      const bestSequence = meals.reduce(
        (acc, meal) => {
          if (meal.on_diet) {
            acc.currentSequence += 1;

            if (acc.currentSequence > acc.bestOnDietSequence) {
              acc.bestOnDietSequence = acc.currentSequence;
            }
          } else {
            acc.currentSequence = 0;
          }
          return acc;
        },
        {
          bestOnDietSequence: 0,
          currentSequence: 0,
        }
      );

      return reply.status(200).send({
        totalMeals,
        totalMealsOnDiet,
        totalMealsOffDiet,
        bestOnDietSequence: bestSequence.bestOnDietSequence,
      });
    }
  );

  app.post(
    "/",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const createMealBody = z.object({
        name: z.string(),
        description: z.string(),
        date: z.string(),
        on_diet: z.boolean(),
      });

      const { name, description, date, on_diet } = createMealBody.parse(
        request.body
      );

      await knex("meals").insert({
        id: randomUUID(),
        name,
        description,
        date: new Date(date),
        on_diet,
        user_id: request.user?.id,
      });

      return reply.status(201).send();
    }
  );

  app.put(
    "/:id",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const updateMealParams = z.object({
        id: z.string().uuid(),
      });

      const { id } = updateMealParams.parse(request.params);

      const updateMealBody = z.object({
        name: z.string(),
        description: z.string(),
        date: z.string(),
        on_diet: z.boolean(),
      });

      const { name, description, date, on_diet } = updateMealBody.parse(
        request.body
      );

      const meal = await knex("meals").where({ id }).first();

      if (!meal) {
        return reply.status(404).send("Meal not found");
      }

      await knex("meals")
        .update({
          name,
          description,
          date: new Date(date),
          on_diet,
        })
        .where({ id });

      return reply.status(204).send();
    }
  );

  app.delete(
    "/:id",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const deleteMealParams = z.object({
        id: z.string().uuid(),
      });

      const { id } = deleteMealParams.parse(request.params);

      const meal = await knex("meals").where({ id }).first();

      if (!meal) {
        return reply.status(404).send("Meal not found");
      }

      await knex("meals").where({ id }).del();

      return reply.status(204).send();
    }
  );

  done();
};
