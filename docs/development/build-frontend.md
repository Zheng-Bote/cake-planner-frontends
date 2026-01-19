<!-- DOCTOC SKIP -->

# CakePlanner Frontend

This monorepo project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.1.

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

```bash
ng build --project user-app --base-href / --configuration production
ng build --project admin-panel --base-href / --configuration production
```
