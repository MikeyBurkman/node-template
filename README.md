# node-template
CLI for setting up a node project how I want

## Install
npm i -g MikeyBurkman/node-template

## Run
```sh
mkdir newProject
cd newProject
node-template
npm install
```

## What it does
Copies to the directory:
* package.json
* .gitignore
* .eslintrc
* .editorconfig
* sample index.js
* sample lib folder

## Running on an existing project
If you run this on an existing project, it will only copy  the files that don't already exist. In the case of `package.json` and `.eslintrc`, it will only copy properties that don't already exist in the respective files. For instance, it will only copy any `scripts` commands that aren't already in the existing `package.json` file. It will not overwrite anything, nor will it delete anything.
