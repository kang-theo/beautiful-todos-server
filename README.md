# Beautiful TODOs API Server

## Features

- ✔ Express framework
- ✔ MVC architecture
- ✔ TypeScript support
- ✔ Prisma ORM (MySQL)
- ✔ Customize error, log and catch all error
- Swagger document support
- Zod schema validation
- Rate limit
- Schema validation with zod
- Jest unit test

## How to run?

### Setup

Pull the code and create `.env` in server root directory, the content likes below

```.env
DATABASE_URL="mysql://{username}:{password}@localhost:3306/beautiful-todos?connection_limit=5"
```

If you use Postgres, please change the connection link

### Install

Enter the server directory and execute the below command

```bash
npm install
```

### Run the application

Enter the server directory and execute the below command

```bash
npm start
```

# Initialize the project from scratch

## NPM, Typescript and Express

* npm init -y
* npm install express
* npm i -D typescript ts-node nodemon @types/node @types/express
* npx tsc --init
* touch index.ts

## Prisma

* npm install -D prisma
* npm install prisma-client | npx prisma generate
* npx prisma db push: Outside prisma migration system)
* npx prisma migrate dev --name <your_migration_name>: After updating the Prisma schema, generate a new migration
* npx prisma migrate deploy: Apply the generated migration to bring your database schema in sync
* npx prisma migrate dev: Check if the drift issue persists
* npx prisma generate: Regenerate the Prisma Client to reflect the changes in your schema
