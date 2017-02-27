# Express-React-HMR-Boilerplate

![Image of Express-React-HMR-Boilerplate]
(/src/public/img/logo.png)

A boilerplate for scaffolding production-ready MERN stack projects.

| | master | dev |
| --- | --- | --- |
| Build Status | [![Build Status](https://travis-ci.org/gocreating/express-react-hmr-boilerplate.svg?branch=master)](https://travis-ci.org/gocreating/express-react-hmr-boilerplate) | [![Build Status](https://travis-ci.org/gocreating/express-react-hmr-boilerplate.svg?branch=dev)](https://travis-ci.org/gocreating/express-react-hmr-boilerplate) |
| Dependency Status | [![Dependency Status](https://david-dm.org/gocreating/express-react-hmr-boilerplate.svg)](https://david-dm.org/gocreating/express-react-hmr-boilerplate) | - |

## Demo

<https://express-react-hmr-boilerplate.herokuapp.com/>

## Techniques

- Nodejs + Express
- Reactjs + Redux + Redux-Thunk + React-Router + React-Router-Redux + Redux-Form + React-Intl
- Mongodb + Mongoose + MongoLab
- Normalizr
- Livereload
- Server-Side Rendering (SSR) & State Fetching (Isomorphic)
- Webpack + Code Splitting
- CSS Modules
- ES6/7 + Babel
- Travis CI
- Heroku Deploy Script
- PM2 for Production Serving
- Examples
  - Todo List App
    - List + Paginate
    - Create
    - Update
    - Delete
  - Passport
    - Jwt Authentication
    - Social Authentication
  - i18n
  - Upload avatar
  - Recaptcha
  - Ajax progress bar
  - Google Analytics
  - Admin System
- React Native

## Setup your new project

Follow the commands below to integrate this boilerplate into your own project as `mirror` branch.

``` bash
cd <your_project>
git flow init -d
git remote add -t master mirror https://github.com/gocreating/express-react-hmr-boilerplate.git
git fetch mirror master:mirror # git fetch <remote> <rbranch>:<lbranch>

git flow feature start mirror
git merge --no-ff --no-edit mirror
git flow feature finish mirror

# git flow feature start tune-mirror
# tune the boilerplate to suit your own project
# git flow feature finish tune-mirror

git remote add origin <your_project.git>
git push -u origin master
```

Once there is a new version of this boilerplate, you can upgrade with the following commands

```
git checkout mirror
# git pull mirror dev
#          ^^^^^^ ^^^ → upgrade local mirror branch from boilerplate's dev branch
# git fetch mirror dev:mirror --update-head-ok
git checkout develop
git flow feature start upgrade-mirror
git merge --no-ff --no-edit mirror
# solve conflicts
git flow feature finish upgrade-mirror
```

## Installation

```
npm install -g gulp
npm install
```

## Config MongoDB (**Required**)

Most services this boilerplate provides rely on mongoDB. You must config your own mongoDB URIs. The only thing you need to do is create your own `configs/project/mongo/credential.js` based on the provided template `configs/project/mongo/credential.tmpl.js`.

## Config Nodemailer (Optional)

### Gmail

Here I take the popular gmail service as example.

1. Create your own `configs/project/nodemailer/credential.js`

  You can check all supported services [here](https://github.com/nodemailer/nodemailer-wellknown#supported-services)

2. Fix security issue

  If you are going to run tests on travis or deploy the app on heroku, you might meet the issue that the app cannot login your gmail account from travis/heroku server. You need to manually authorize permissions to your testing/production servers.
  > This is also documented on [nodemailer](https://github.com/nodemailer/nodemailer#tldr-usage-example)

  2.1. Turn on [2-step verification](https://www.google.com/landing/2step/)

  2.2. Get [app passwords](https://support.google.com/accounts/answer/185833?hl=en)

  2.3. Replace config's origin password with app password

## Config Google Analytics (Optional)

TBD

## Config Social Authentication (Optional)

### Facebook

TBD

### LinkedIn

TBD

## Config ReCAPTCHA (Optional)

1. Get your API keys on [reCAPTCHA](https://www.google.com/recaptcha/admin)
2. Save keys in  `configs/project/recaptcha/credential.js`.

## Config [Firebase](https://console.firebase.google.com/) (Optional)

Firebase provides 5GB/user file storage for [free](https://firebase.google.com/pricing/) and is backed up by google cloud storage service. Thus we use firebase storage `for free` to host user avatars.

1. Follow the doc [Add Firebase to your Server](https://firebase.google.com/docs/server/setup)
2. Save the credential file to `configs/project/firebase/credential.json`
3. Update `configs/project/firebase/client.js`

  - Open [Firebase console](https://console.firebase.google.com/)
  - Enter your app
  - Go to `Auth` page
  - Click on `網路設定` and get your configuration
  - Replace the following part with your configuration

    ```
    var config = {
      apiKey: '<your-api-key>',
      authDomain: '<your-auth-domain>',
      databaseURL: '<your-database-url>',
      storageBucket: '<your-storage-bucket>'
    };
    ```
4. Update `configs/project/client.js` and `configs/project/server.js`

  Make sure there is a `firebase` entry in each file:
  ```js
  // configs/project/client.js
  module.exports = {
    // ...
    firebase: require('./firebase/client'),
    // ...
  };
  ```

  ```js
  // configs/project/server.js
  module.exports = {
    // ...
    firebase: require('./firebase/credential.json'),
    // ...
  };
  ```
5. Setup firebase storage security rule

  We follow the doc [Secure User Data](https://firebase.google.com/docs/storage/security/user-security), and use the following rules to restrict user permissions.

  > Don't forget to change the project name into your own

  ```
  service firebase.storage {
    match /b/express-react-hmr-boilerplate.appspot.com/o {
      match /{env}/{userId}/avatar.jpg {
      	allow read;
        allow write: if request.auth.uid == userId;
      }
    }
  }
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

### Test on local

```
npm test
```

### Test on Travis

There are some sensitive configs inside the project, e.g., facebook app secret or firebase token, while we still need Travis to support our testing automation. Try the following command:

```
gulp dumpConfigs
```

It will show you a 3-step instruction to setup private Travis environment variables.

> To sync configs on local side and on travis, you need to repeat the steps every time you update configs or tests

## Deploy

### Deploy on [Heroku](https://www.heroku.com/)

Please login heroku first, and run the command

```
gulp build:production
gulp deploy [--app=<heroku_app_name>] [--create]
```

#### Options

- `-a`, `--app`

  Specify new or existing app name of heroku. Default will be package name inside `package.json`.

- `-c`, `--create`

  If you want to create new app on heroku, please use this switch.

### Deploy on local windows system

1. [Allow port 80 for both inbound and outbound](https://www.youtube.com/watch?v=oxY81uM3yzs)
2. Open terminal as `administrator`
3. Launch production server:

  ```
  set PORT=80 && npm run pm2
  ```

## React Native

For development, just use:

```bash
npm run android
```

For production or distributing APK, please refer to the setup part of [Generating Signed APK](https://facebook.github.io/react-native/docs/signed-apk-android.html). You can use helper scripts below:

```bash
npm run android-keygen
npm run release-android
npm run install-android
```

## Caveats

### Form Adapter

We use redux-form as the infrastructure to construct all form elements. Since there is a [losing focus issue](https://github.com/erikras/redux-form/issues/1094), please don't render form adapters inside component's render cycle.

```
// working

class SomeForm extends Component {
  // ...

  someDollarAdapter = ({ input, ...rest }) => {
    return (
      <span>
        <Input input={input} {...rest} /> $NTD
      </span>
    );
  };

  render() {
    return (
      <Form>
        <Field
          name="budget"
          component={FormField}
          label="Budget"
          adapter={this.someDollarAdapter}
          type="number"
        />
      </Form>
    );
  }
};
```

```
// broken

class SomeForm extends Component {
  // ...

  render() {
    return (
      <Form>
        <Field
          name="budget"
          component={FormField}
          label="Budget"
          adapter={({ input, ...rest }) => {
            return (
              <span>
                <Input input={input} {...rest} /> $NTD
              </span>
            );
          }}
          type="number"
        />
      </Form>
    );
  }
};
```

## Roadmap

### v1.0

- [x] Travis Testing ([e527369](../../commit/e5273694dd5a75305e8a778c0ac660d2e7340916))
- [x] Disable submit button when form submitting ([88557e4](../../commit/88557e47a978238b0a0dee198a7c86f0aa01145a))
- [x] Asynchronous redux-form validation (detect duplicate email) ([4eff5b5](../../commit/4eff5b583b6ab3a70f36441d77805550c4224b14))
- [x] Error handling ([ca4db0d](../../commit/ca4db0d594e13950e46b32c5458e1a695136c0c3))
  - reference: [Checklist: Best Practices of Node.JS Error Handling](http://goldbergyoni.com/checklist-best-practices-of-node-js-error-handling/)
- [x] PM2 Integration ([e427d7c](../../commit/e427d7c3a9efea971557b0a2d7a6397b43ca4760))
- [x] Rename resource as resource`s` ([039baad](../../commit/039baadff0bdb22e5340153a2a9fe1935f87b7d9))
- [x] Todo#Update API & Todo#Edit Functionality ([daf1773](../../commit/daf1773e9e1bd43f7ce4b0106a77b03b78ae6c0c))
- [x] Pagination Mechanism ([9668797](../../commit/9668797568b5d4b6a3c7f6f47e54dff9ed343802))
- [x] Bug Fix for Intl ([49f085f](../../commit/49f085f51054c7d8f8a7968f616a8ffc01458094))
  - reference:
    1. [Changing locale and FormattedMessage not updated instantly](https://github.com/yahoo/react-intl/issues/371)
    2. [react-redux API docs](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)
- [x] User Roles ([1613ea6](../../commit/1613ea6e4253f8216946ef0fc1f989293ed60e61))
- [x] Admin ([4321886](../../commit/4321886d3c9ecfb047013d1daa76c0ee3ca5412c))
- [x] Google analytics ([9af2719](../../commit/9af27196c9bc88764e47a79bd5e0044237c6c5a4))
- [x] Social Auth for Facebook And LinkedIn ([ccaaa60](../../commit/ccaaa608e7efa0a0c1693ddd7072c0e4e62d003b))
- [x] Reacr-Router-Redux Integration ([5e4306d](../../commit/5e4306d20a4feed40290739d0ca6f7bda1920df5))
- [x] Use react-bootstrap in ErrorList ([e44eb0b](../../commit/e44eb0b078fe7d0610c00a5c63b165f2ed31039f))
- [x] Google Recaptcha ([5655a29](../../commit/5655a29c74fca6f2af4b75538820470b1cfe9619))
- [x] Mail Service ([616ca6e](../../commit/616ca6edfae5ba4df361d5d6dbef0a28571e9ea2))
- [x] Email Verification ([5a6ef75](../../commit/5a6ef757d7499cae71f69b605460ff7868d3a5ec))
- [x] Edit User Profile ([3b0b475](../../commit/3b0b475edc9ba05269a15fec96a61930aa154fcc))
- [x] Password Recovery ([91f3eb8](../../commit/91f3eb8242b8ecd96c22de4a0b2de68ae57a11bb))
- [x] Restrict Local Upload File (size and MIME type) ([0c2461f](../../commit/0c2461f27048e5e667fa9d4d806f2fed38dad20c))
- [x] Resend Verification Email ([013feb4](../../commit/013feb49884de1977afb4efb4114cd14e05ad30c))
- [x] Improve Testing ([c6a4172](../../commit/c6a4172f57d56632622cc4178474b853bcafa560))
- [x] Add Checkbox to Agree Terms ([d6b814d](../../commit/d6b814d78185bfa25c26f37df6e4aa1ec338b48a))
- [x] Add `plaintext`, `checkbox`, `checkboxes`, `textarea`, `select`, `rangeSlider`, `airSingleDate` and `airDateRange` Type Form Fields ([2bbf17d](../../commit/2bbf17d808deb8783cdef2be815eea3a576dcbd1))
- [x] Add Hint for Disabled Social Auth Service ([813b089](../../commit/813b0896f57f1487f1235fc0797edec18e3b59f3))
- [x] Fix bug: Mongoose promise out of date ([52cca26](../../commit/52cca26ef4fa12d419f2ea165835ed9e8fa05f26))
- [x] Add Logo ([a527b4f](../../commit/a527b4f695a8309946b0de070a08066cbb4bee5d))
- [x] Patch XSS Vulnerability ([c18644b](../../commit/c18644b7243d482c37e763d9e2427790a9392213))
  - reference: [The Most Common XSS Vulnerability in React.js Applications](https://medium.com/node-security/the-most-common-xss-vulnerability-in-react-js-applications-2bdffbcc1fa0#.6j1r3sndu)
- [ ] Landing Page
- [ ] Translate Languages
- [x] Add MIT License ([43a5267](../../commit/43a526723a8c831fc307e24689206ecce5dab380))
- [ ] Update Packages

### v1.0+

- [ ] Disqus Thread
- [ ] Restrict Firebase Upload File (size and MIME type)
- [ ] Information List
- [ ] [Stripe](https://stripe.com/) Payment System + Donation Button Example
- [ ] Facebook Messenger Bot Example
- [ ] Phone Verification
- [ ] Automatically Refresh Token
