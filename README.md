# Express-React-HMR-Boilerplate

[![Build Status](https://travis-ci.org/gocreating/express-react-hmr-boilerplate.svg?branch=master)](https://travis-ci.org/gocreating/express-react-hmr-boilerplate)
[![Dependency Status](https://david-dm.org/gocreating/express-react-hmr-boilerplate.svg)](https://david-dm.org/gocreating/express-react-hmr-boilerplate)

This is a boilerplate for scaffolding MERN stack projects with livereload feature supported.

## Demo

<https://express-react-hmr-boilerplate.herokuapp.com/>

## Techniques

- Nodejs + Express
- Reactjs + Redux + React-Router + Redux-Form + React-Intl
- Mongodb + Mongoose + MongoLab
- Livereload
- Server-Side Rendering (SSR) & State Fetching (Isomorphic)
- Webpack + Code Splitting
- ES6/7 + Babel
- Travis CI Template
- Heroku Deploy Script
- Examples
  - CSS Modules
  - Simple Todo List App
  - Passport + Jwt Authentication
  - i18n

## Installation

```
npm install -g gulp
npm install -g jscs
npm install
```

## Add `config/credentials.js`

This is where credentials are stored, so you have to provide your own. Here is the example format:

```js
module.exports = {
  mongoDbUri: {
    development: 'mongodb://<user>:<password>@<domain>:<port>/<db_development>',
    test: 'mongodb://<user>:<password>@<domain>:<port>/<db_test>',
    production: 'mongodb://<user>:<password>@<domain>:<port>/<db_production>',
  },
  jwt: {
    secret: '4df5p5xe23',
    expiresIn: 60 * 60 * 24 * 3, // in seconds
  },
};
```

## Build & Run

For development:
```
gulp
```

For production:
```
gulp build:production
npm start
```

## Test

```
npm test
```

## Deploy on heroku

Please login heroku first, and run the command

```
gulp build:production
gulp deploy [--app=<heroku_app_name>] [--create]
```

### Options

- `-a`, `--app`

  Specify new or existing app name of heroku. Default will be package name inside `package.json`.

- `-c`, `--create`

  If you want to create new app on heroku, please use this switch.

## Roadmap

- [x] Integrate with redux-form
- [x] Integrate with form validation
- [x] Move imports-/exports-loader to devDependencies
- [x] i18n
- [ ] Todo#Update API & Todo#Edit Functionality
- [ ] File Uploading (e.g. Avatar)
- [ ] Facebook Login
