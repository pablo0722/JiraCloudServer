/*****************************************************************************
 * IMPORTS
 *****************************************************************************/

import * as fs from 'fs';
import {extend} from './dictionary';





/*****************************************************************************
 * PUBLIC FUNCTIONS
 *****************************************************************************/

function readJSON(filename: string): any {
    let data: any = JSON.parse(fs.readFileSync(filename, 'utf8'));
    
    return data;
}

function writeJSON(filename: string, json: any) {
    json = JSON.stringify(json, null, 4);
    try {
        fs.unlinkSync(filename); // Remove file to truncate content
    } catch {}
    fs.writeFile(filename, json, (err) => {
        if (err) throw err;
        //console.log('complete');
    });
}

function extendJSON(filename: string, json: any) {
    fs.readFile(filename, 'utf8', function readFileCallback(err, data){
        if (err) {
            console.log('error: ', err);
            if (err.code == 'ENOENT') {
                writeJSON(filename, json);
            } else {
                console.log(err);
            }
            return;
        } else {
            let newObj: any;
            if(data){
                let obj: any = JSON.parse(data);
                newObj = extend(obj, json);
            }else{
                newObj = json;
            }
            writeJSON(filename, newObj);
        }
    });
}





/*****************************************************************************
 * EXPORTS
 *****************************************************************************/

export {
    readJSON,
    writeJSON,
    extendJSON,
};