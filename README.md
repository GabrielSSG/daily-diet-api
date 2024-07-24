# Daily Diet API

This project is an API for daily diet control, developed as part of Challenge of the **"Creating RESTful APIs with Node.js"** module of the Ignite course by Rocketseat.

## Features

The API has the following features:

- **User Creation:** Allows the creation of a user.
- **User Identification:** Identifies the user between requests.
- **Meal Registration:** Registers meals with name, description, date and time, and whether it is within the diet or not.
- **Meal Editing:** Allows editing of all meal information.
- **Meal Deletion:** Allows deleting a meal.
- **Meal Listing:** Lists all meals of a user.
- **Meal Viewing:** Views the details of a single meal.
- **Metrics Retrieval:** Retrieves user metrics, such as total number of meals, meals within and outside the diet, and best sequence of meals within the diet.

## Business Rules

- Meals must be related to a user.
- The user can only view, edit, and delete the meals they created.

## Technologies Used

- Node.js
- Fastify
- Sqlite (or PostgreSQL in production)
- Knex
- Vitest for testing
- Supertest for API testing

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/GabrielSSG/daily-diet-api.git
   ```

2. Install dependencies:

   ```bash
   cd daily-diet-api
   npm install
   ```

3. Configure the database and environment variables. Create a `.env` file in the project root following the .env.example and .env.text.example.

4. Run database migrations:

   ```bash
   npm run knex -- migrate:latest
   ```

5. Start the server:

   ```bash
   npm run dev
   ```

## Usage

### API Routes

- **User Creation:**

  ```http
  POST /users
  ```

  Request body:

  ```json
  {
    "name": "User Name",
    "email": "email@example.com"
  }
  ```

- **Meal Registration:**

  ```http
  POST /meals
  ```

  Request body:

  ```json
  {
    "name": "Meal Name",
    "description": "Meal Description",
    "date": "2023-07-23T12:00:00Z",
    "on_diet": true
  }
  ```

- **Meal Editing:**

  ```http
  PUT /meals/:id
  ```

  Request body:

  ```json
  {
    "name": "Updated Meal Name",
    "description": "Updated Description",
    "date": "2023-07-23T13:00:00Z",
    "on_diet": true
  }
  ```

- **Meal Deletion:**

  ```http
  DELETE /meals/:id
  ```

- **Meal Listing:**

  ```http
  GET /meals
  ```

- **Meal Viewing:**

  ```http
  GET /meals/:id
  ```

- **Metrics Retrieval:**

  ```http
  GET /metrics
  ```

## Contributing

Feel free to fork this repository, submit issues and pull requests. For major changes, please open an issue first to discuss what you would like to change.

## Acknowledgements

Made with 💜 by Rocketseat.

## License

This project is licensed under the MIT License.

## Contact

For any questions or feedback, feel free to reach out via [LinkedIn](https://www.linkedin.com/in/gb1994/).
