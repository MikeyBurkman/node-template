'use strict';

const path = require('path');
const fs = require('fs-extra');

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
        stdCopy('.gitignore'),
        stdCopy('index.js'),
        stdCopy('lib') // Directory
    ]);
}

// Copythe given file/directory, but only if it doesn't already exist
function stdCopy(fname) {
    const src = path.resolve(templateDir, fname);
    const dest = path.resolve(destDir, fname);
    return fs.exists(dest).then((exists) => {
        if (exists) {
            // No real way to handle these, so just skip them
            console.log(`File/Directory ${fname} already exists, skipping it`);
            return;
        } else {
            console.log(`Copying file/director ${fname}`);
            return fs.copy(src, dest);
        }
    });
}


function jsonCopy(fname) {
    const src = path.resolve(templateDir, fname);
    const dest = path.resolve(destDir, fname);
    return fs.exists(dest).then((exists) => {
        if (exists) {
            // TODO: Do a shallow merge of JSON properites
            console.log(`File ${fname} already exists, skipping it. (Merging for this file will soon be implemented)`);
            return;
        } else {
            console.log(`Copying file ${fname}`);
            return fs.copy(src, dest);
        }
    });
}