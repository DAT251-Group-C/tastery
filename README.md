![FeedApp Header](./app/public/header.png)

![Release workflow status](https://github.com/eirmas/feedapp/actions/workflows/release.yml/badge.svg)

> This projects was created as part of a school assignment (DAT250).

# FeedApp

Empower your voice and make every vote count with our interactive polling app. Create, vote on, and explore polls with ease. Join the community of active participants today and be part of the conversation.

<br>

## Links

### App

[https://feedapp.no/](https://feedapp.no/)

### Storybook

[https://storybook.feedapp.no/](https://storybook.feedapp.no/)

### Swagger

[https://api.feedapp.no/docs](https://api.feedapp.no/docs)

<br>

## Developer documentation

This is a monorepo created with [NX](https://nx.dev/). Start by installing dependencies:

```bash
pnpm i
```

This command will pull in all the necessary packages and libraries required for your project. For the next step, be sure to create a `.env` file with the correct credentials according to [.env.template](.env.template).

### Serve the frontend

If you want to work on the frontend part of your application, use this command:

```bash
pnpm serve:app
```

This command will start a local development server for the frontend, allowing you to view and interact with the application in a development environment.

### Serve the backend

For working on the backend of your application, use the following command:

```bash
pnpm serve:backend
```

This will initiate a local development server specifically for the backend part of your project.

### Serve storybook

We use storybook to have an overview of our UI components. You can serve it with this command:

```bash
pnpm storybook
```

This allows you to view and test your UI components independently, making it easier to work on the visual aspects of your application. It's also a great tool when developing new components.

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

When finished, you should have a new `dist` folder containing built files for both the app and the backend

### Build storybook

For a production-ready version of your Storybook, you can use this command:

```bash
pnpm build-storybook
```

<hr>

Author: Eirik Måsiedvåg (eirik.maaseidvaag@gmail.com)
<br>
<br>
