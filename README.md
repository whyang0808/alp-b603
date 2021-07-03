# ALP-B603

## Setup env file
Create a .env file in the root directory and placed the following variables in the file.

```
NODE_ENV=local
PORT=8000
DATABASE_CONNECTION_STRING=mongodb://localhost:27017
DATABASE=alp-b603-local
JWT_SECRET=<use whatever you want>
FRONTEND_BASE_URL=http://localhost:3000
```
You can generate a JWT_SECRET by running `openssl rand -base64 172 | tr -d '\n'` in the command line.
## Run project

1. After setting up your env variables, run `yarn install`. Make sure you are in the root directory of the project.
2. After the packages are installed, run `yarn start`.
3. Create a database with name `alp-b603-local` in your local db. This name can be anything as long as its the same in the `.env` file.

## Project structure
The requests flow:
> `Routes` => `Controller` => `Service` => `Model`

Services should contain most of the db logic/query and if best should be reusable, controllers contain the business logic and should trigger the services and not trigger the models directly.

Enums, interfaces, and types should be defined in `/types` directory.

## Tools
Database Tool: Any mongodb GUI, recommended [NoSQLBooster](https://www.nosqlbooster.com/).

## Documentation
You can include new API documentation in the `apidocs.yaml` file in the root directory. Additionally, visit http://localhost:8000/api-docs to view the documentation

## Production setup
To be changed.
1. Run `yarn build`