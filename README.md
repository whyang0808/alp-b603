# ALP-B603

## Setup env file
Create a .env file in the root directory and placed the following variables in the file.

```
NODE_ENV=local
PORT=8000
DATABASE_CONNECTION_STRING=mongodb://localhost:27017
DATABASE=alp-b603-local
JWT_SECRET=<use whatever you want>
```
You can generate a JWT_SECRET by running `openssl rand -base64 172 | tr -d '\n'` in the command line.
## Run project

1. After setting up your env variables, run `yarn install`. Make sure you are in the root directory of the project.
2. After the packages are installed, run `yarn start`.

## Production setup
To be changed.
1. Run `yarn build`