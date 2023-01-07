import { log } from '../../utils/index';

// eslint-disable-next-line no-new-func
const importDynamic = new Function('modulePath', 'return import(modulePath)');

const fetch = async (...args:any[]) => {
  const module = await importDynamic('node-fetch');
  return module.default(...args);
};// npm install --save @types/node-fetch. must be imported dinamically





async function getData(url: string, headers = {}): Promise<string> {
    // Opciones por defecto estan marcadas con un *
    const response = await fetch (url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        //mode: 'no-cors', // no-cors, *cors, same-origin
        //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: 'omit', // include, *same-origin, omit
        headers
    }).catch(error => {
        log.e('WEB ERROR:');
        log.dump.e({error});
    });
    return await response.text (); // parses JSON response into native JavaScript objects
}

async function postData(url: string, data: any, headers = {}): Promise<string> {
    // Opciones por defecto estan marcadas con un *
    const response = await fetch (url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        //mode: 'no-cors', // no-cors, *cors, same-origin
        //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: 'omit', // include, *same-origin, omit
        headers,
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    }).catch(error => {
        log.e('WEB ERROR:');
        log.dump.e({error});
    });
    return await response.text (); // parses JSON response into native JavaScript objects
}

export {
    getData,
    postData
};
