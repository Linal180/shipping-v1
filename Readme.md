# Nodejs FES Template

# Environment vars
Need to add required environment variables

# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) version > 18.0.0


# Getting started
- Clone the repository
- Install dependencies
```
cd <project_name>
npm install
```
- Build and run the project
```
npm run build
npm start
```
  Navigate to `http://localhost:3001`

- API Document endpoints
For Authentication
- POST {{BASE_API_URL}}/auth/sign-up
- POST {{BASE_API_URL}}/auth/sign-in

For Labels
- GET {{BASE_API_URL}}/shipping/rates
- POST {{BASE_API_URL}}/shipping/create-label
- POST {{BASE_API_URL}}/shipping/get-labels?page=1&limit=10


## Project Structure
The folder structure of this app is explained below:

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **dist**                 | Contains the distributable (or output) from your TypeScript build.  |
| **node_modules**         | Contains all  npm dependencies                                                            |
| **src**                  | Contains  source code that will be compiled to the dist dir                               |
| **configuration**        | Application configuration including environment-specific configs
| **src/controllers**      | Controllers define functions to serve various express routes.
| **src/lib**              | Common libraries to be used across your app.
| **src/middlewares**      | Express middlewares which process the incoming requests before handling them down to the routes
| **src/routes**           | Contain all express routes, separated by module/area of application
| **src/models**           | Models define schemas that will be used in storing and retrieving data from Application database  |
| **src/configuration/database**      | Prometheus metrics |
| package.json             | Contains npm dependencies as well as [build scripts](

## Building the project
### Configuring TypeScript compilation
```json
{
  "compilerOptions": {
      "module": "commonjs",
      "esModuleInterop": true,
      "allowSyntheticDefaultImports": true,
      "target": "es6",
      "noImplicitAny": true,
      "moduleResolution": "node",
      "sourceMap": true,
      "outDir": "dist",
      "baseUrl": ".",
      "paths": {
          "*": ["node_modules/*", "src/types/*"]
      }
  },
  "include": ["./src/**/*"]
  }

```

### Running the build
All the different build steps are orchestrated via [npm scripts](https://docs.npmjs.com/misc/scripts).
Npm scripts basically allow us to call (and chain) terminal commands via npm.

| Npm Script | Description |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `start`                   | Runs full build and runs node on dist/index.js. Can be invoked with `npm start`                  |
| `build`                   | create a latest build in dist      |
| `ts-check`                   | Check for typescript issues - if any       |
| `add-build`                   | Add all latest changes for dist in git commit     |

