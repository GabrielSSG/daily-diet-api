import "knex";

declare module "knex/types/tables" {
  export interface Tables {
    users: {
      id: string;
      name: string;
      email: string;
      session_id: string;
    };

    meals: {
      id: string;
      name: string;
      description: string;
      date: Date;
      on_diet: boolean;
      user_id: string;
    };
  }
}
