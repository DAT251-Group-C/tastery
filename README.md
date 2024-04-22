![Tastery Header](./apps/app/public/header.png)

![Release workflow status](https://github.com/DAT251-Group-C/tastery/actions/workflows/release.yml/badge.svg)

> This projects was created as part of a school assignment (DAT251).

# Tastery

Tastery is a vibrant food discovery platform where you can explore a wide variety of recipes and share your own culinary creations with the world. Dive into the world of flavors with Tastery!

<br>

## Links

### App

[https://tastery.no](https://tastery.no)

### Swagger

[https://api.tastery.no/docs](https://api.tastery.no/docs)

<br>

## Installation

This is a monorepo created with [NX](https://nx.dev/). Make sure to install Node.JS >=20 and NPM >=10

Start by installing the dependencies:

```bash
pnpm i
```

This command will pull in all the necessary packages and libraries required for your project. For the next step, be sure to create a `.env` file with the correct credentials according to [.env.template](.env.template). Ask in discord for the content.

## Serve the application

Start by serving the backend server:

```bash
pnpm serve:backend
```

Then, start the frontend server:

```bash
pnpm serve:app
```

You should not have the app running on `localhost:8080` and the backend running on `localhost:3000`.

### Run tests

You can execute tests with the following command:

```bash
pnpm test
```

### Run lint

Linting is a code quality practice that helps catch and fix code style issues and potential bugs. You can run the linter with this command:

```bash
pnpm lint
```

If pnpm lint identifies issues in your code, you can automatically fix some of them with the following command:

```bash
pnpm lint:fix
```

This is a handy shortcut to address common code style problems and maintain a consistent codebase.

### Build the application

When you're ready to create a production-ready version of your application, use this command:

```bash
pnpm build
```
