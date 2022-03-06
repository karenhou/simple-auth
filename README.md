# Simple Auth

This is a take home project that uses auth0

## Installation

```
npm i
```

## Getting started

For those who are not familar with using auth0(myself included), it's a great platform that pretty much handles all the difficulties for you when dealing with authentication and authorization.

Here are some of the links that help you get started(just pick one to read)

1. [nextjs example from auth0](https://github.com/auth0/nextjs-auth0)
2. [another example from auth0](https://github.com/auth0-samples/auth0-nextjs-samples/tree/main/Sample-01)
3. [simple tutorials from auth0](https://auth0.com/docs/quickstart/webapp/nextjs/01-login)
4. [example from nextjs](https://github.com/vercel/next.js/tree/canary/examples/auth0)

## Made with

- React
- NextJS
- Bootstrap
- SASS
- Auth0(google/facebook)

## Environment variables

Please make sure to add the following variables in the .env.local for dev

```
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL=YOUR_AUTH0_DOMAIN
AUTH0_CLIENT_ID=YOUR_AUTH0_CLIENT_ID
AUTH0_CLIENT_SECRET=YOUR_AUTH0_CLIENT_SECRECT
AUTH0_SECRET=LONG_RANDOM_VAL
AUTH0_MTOM_CLIENT_ID=YOUR_M_TO_M_CLIEND_ID_FOR_APIS
AUTH0_MTOM_CLIENT_SECRET=YOUR_M_TO_M_SECRET_FOR_APIS
```

## Deploy

1. upload it to github
2. connect to vercel
3. make sure to add env variable for [auth0](https://github.com/auth0/nextjs-auth0/blob/main/examples/README.md)

## Roadmap(TODOs)

- explore options like apple
- look into universal login
