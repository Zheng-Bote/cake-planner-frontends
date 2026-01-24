# CakePlanner Frontend

This monorepo project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.1.

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Clone the Repository](#clone-the-repository)
- [Build](#build)
- [Development server](#development-server)
- [Production build](#production-build)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

---

## Clone the Repository

```bash
git clone https://github.com/Zheng-Bote/cake-planner-frontends.git
cd cake-planner-frontends
```

## Build

To build the project, run the following command:

```bash
nvm use --lts
npm install
```

## Development server

To start the local development instances, run:

```bash
nvm use --lts
ng serve admin-panel --port 4201
ng serve user-app
```

## Production build

````bash
ng build --project user-app --base-href / --configuration production

## Testing

PWA testing locally is very limited to localhost, because it requires a secure context (HTTPS).

```bash
npm install -g http-server

```bash
ng build --project user-app --base-href / --configuration production
http-server ./dist/user-app/browser --port 8080 --proxy http://localhost:4201
````
