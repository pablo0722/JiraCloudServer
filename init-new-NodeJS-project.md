# How to init new NodeJS Project

## Install npm (if not yet installed)
sudo apt install npm

## Create new project
mkdir myapp
cd myapp
npm init
    package name: name all in lowercase (separate words with "-" if needed)

## To install JS packages
npm install -P xxx

## Create Index.js
###    Here is an example code:
const express = require("express")
var app = express()

app.get("/",function(request,response){
    response.send("Hello World!")
})
app.listen(10000, function () {
    console.log("Started application on port %d", 10000)
});

## Run for test
node index.js

## Install this project globally in the system (so it can be called from anywhere in the computer on the cmd)
npm install -g pkg
pkg ./build/index.js -o worklogger
./worklogger

## To install Typescript
npm install -P typescript

## Install the typings for node (TS versions of JS common libraries)
npm i -D @types/node

## Run for test in typescript
tsc index.ts

## Generate tsconfig.json
tsc --init
# Note:
#    - If you are writing an application that will run purely in Node.js, you should be using "commonjs" modules, not AMD modules, when you compile your TypeScript files.
#    - If you are writing an application that will run both in Node.js and in the browser, you should be using "umd" modules, not AMD modules, when you compile your TypeScript files.

## to run npm scripts:
npm run <script_name>