This app features

* [Vue.js]() - a frontend framework
* [Webpack]() - a tool to bundle your files
* [vue-router]() - client-side routing
* [Axios]() - a library to call your REST api
* [vue-bootstrap]() which adds [Twitter bootstrap v4]() styling to the site
* Authentication with [GitHub]()

### Getting started

First make sure you have [`npm` and `node.js`](https://nodejs.org/en/download/) installed

Next, clone the boilerplate from GitHub:

```bash
git clone https://github.com/akeshavan/vue-auth-boilerplate
```

Then install all `npm` packages:

```bash
cd vue-auth-boilerplate/my-app
npm install
```

To run the app, do:

```bash
npm run dev
```

And navigate to [http://localhost:8080](http://localhost:8080) (or wherever npm starts the server). As you make changes to your app, the browser will reload so you don't have to keep refreshing the page.

### Setting up OAuth:

You need to set up oauth to your own server in order for this boilerplate to work.

#### Register a new application on GitHub

On your GitHub account, go to Settings > Developer Settings > OAuth Apps > New OAuth App.
Fill out the form, making sure that your **Authorization callback URL** is `http://localhost:8080`.
Take note of the `client_id` and `client_secret` of your app.

#### Server side

Your server endpoint should be something like `http://your_rest_api.com/authenticate/code`, where code is a string from GitHub that's procided by the client.

The server should return a JSON that looks like:

```js
{"token": "secret_token_from_the_server"}
```

This token will be used for all future calls to your server. In this example, our server is the GitHub api.

If you don't have a server, then set one up with [prose/gatekeeper and heroku](https://github.com/prose/gatekeeper#heroku-button)

Your server needs to have the `client_secret` handy.

#### Client side

In the `src/config.js` file of this boilerplate app, edit it so that your `client_id` and authentication endpoint `authUrl` are correct.

```js
export default {
authUrl: 'https://your_authentication_endpoint/',
clientId: 'your github client id',
redirectUri: 'http://localhost:8080', //eventually this will become your production url
};
```

### Production

To build the app for production, do:

```bash
npm run build
```

Everything in the `dist/` folder is your production app.
