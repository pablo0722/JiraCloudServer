"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postData = exports.getData = void 0;
const index_1 = require("../../utils/index");
// eslint-disable-next-line no-new-func
const importDynamic = new Function('modulePath', 'return import(modulePath)');
const fetch = async (...args) => {
    const module = await importDynamic('node-fetch');
    return module.default(...args);
}; // npm install --save @types/node-fetch. must be imported dinamically
async function getData(url, headers = {}) {
    // Opciones por defecto estan marcadas con un *
    const response = await fetch(url, {
        method: 'GET',
        //mode: 'no-cors', // no-cors, *cors, same-origin
        //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: 'omit', // include, *same-origin, omit
        headers
    }).catch(error => {
        index_1.log.e('WEB ERROR:');
        index_1.log.dump.e({ error });
    });
    return await response.text(); // parses JSON response into native JavaScript objects
}
exports.getData = getData;
async function postData(url, data, headers = {}) {
    // Opciones por defecto estan marcadas con un *
    const response = await fetch(url, {
        method: 'POST',
        //mode: 'no-cors', // no-cors, *cors, same-origin
        //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: 'omit', // include, *same-origin, omit
        headers,
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    }).catch(error => {
        index_1.log.e('WEB ERROR:');
        index_1.log.dump.e({ error });
    });
    return await response.text(); // parses JSON response into native JavaScript objects
}
exports.postData = postData;
