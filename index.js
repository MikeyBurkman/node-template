#! /usr/bin/env node

'use strict';

const path = require('path');
const fs = require('fs-extra');
const Promise = require('bluebird');
const isObject = require('is-plain-object');
const uniq = require('uniq-array');

const destDir = process.cwd();
const templateDir = path.resolve(__dirname, 'template');

console.log('Starting...');
copyEverything()
  .then(() => console.log('Finished!'))
  .catch((err) => console.log('ERROR: ', err.stack));

function copyEverything() {
  return Promise.all([
    jsonCopy('package.json'),
    jsonCopy('.eslintrc'),
    stdCopy('.editorconfig'),
    stdCopy('gitignore', '.gitignore'),
    stdCopy('index.js'),
    stdCopy('lib') // Directory
  ]);
}

// Copythe given file/directory, but only if it doesn't already exist
function stdCopy(fname, finalName) {
  if (!finalName) {
    // Npm ignores some files, like .gitignore, so we have the ability
    //  to rename the files on copy
    finalName = fname;
  }
  const src = path.resolve(templateDir, fname);
  const dest = path.resolve(destDir, finalName);
  return fs.exists(dest).then((exists) => {
    if (exists) {
      // No real way to handle these, so just skip them
      console.log(`File/Directory ${finalName} already exists, skipping it`);
      return;
    } else {
      console.log(`Copying file/directory ${finalName}`);
      return fs.copy(src, dest);
    }
  });
}

function jsonCopy(fname) {
  const src = path.resolve(templateDir, fname);
  const dest = path.resolve(destDir, fname);
  return fs.exists(dest).then((exists) => {
    if (exists) {
      console.log(`File ${fname} already exists, merging new properties if necessary`);
      return Promise.props({
        base: fs.readFile(dest),
        updates: fs.readFile(src)
      }).then((o) => {
        const newPj = mergeJson(JSON.parse(o.base), JSON.parse(o.updates));
        return fs.writeFile(dest, JSON.stringify(newPj, null, 2));
      });
    } else {
      console.log(`Copying file ${fname}`);
      return fs.copy(src, dest);
    }
  });
}

function mergeJson(baseJson, updatesJson) {
  const res = {};

  const props = Object.keys(baseJson).concat(Object.keys(updatesJson));

  uniq(props).forEach((key) => {
    if (baseJson[key] === undefined) {
      res[key] = updatesJson[key];
    } else if (isObject(baseJson[key])) {
      // Merge the two objects, but don't overwrite anything!
      res[key] = Object.assign({}, updatesJson[key], baseJson[key]);
    } else {
      // Already exists and isn't an object so we can't merge anything, so just ignore it
      res[key] = baseJson[key];
    }
  });
  return res;
}
