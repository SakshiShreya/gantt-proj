# GanttProj

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.2.2.

## Before contributing please read this

- First create an issue and tag me so that I get notified about it. You should not work on any issue without being assigned on it.
- If you want to work on any issue, please comment on that issue and tag me.
- When you will be assigned on an issue, you will be able to see a new branch created in the format `issue-[issueNo]-[issue-title]`. You can create a similar branch in your fork or you can create any branch that you like.
- When you are satisfied with your work, please raise a Pull Request (PR). Mention the issue number after the `#` in description. If issue number is not mentioned, I will not review the code. Remember to add me to reviewer.

## Setup the project

- This project uses Firebase for backend. Since we can't add the Firebase API key in public Github repo, please contact me to get the API key.
- Run `npm install` to install all the dependencies.
- In src > environments folder, create two files:
  1. environment.prod.ts
  2. environment.ts
- Check `git status`. Please check that these two files should not come in `git status` as these are mentioned in gitignore. If you can see these two files, then you have probably created these files in the wrong folder. Delete them and follow the process properly.
- In environment.prod.ts, copy the contents of environment1.prod.ts. Similarly in environment.ts, copy the contents of environment1.ts.
- In both the files, replace the `firebaseConfig` object, with the object provided by me. (For contacting me, refer to the description on my [Profile page](https://github.com/SakshiShreya).)
- You are ready now. Please go ahead and run the development server.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

Tests do not exist right now. If you want to contribute, please go ahead.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
