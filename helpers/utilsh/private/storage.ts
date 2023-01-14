/*****************************************************************************
 * IMPORTS
 *****************************************************************************/

import { web } from '../../utils/index.js'





/*****************************************************************************
 * GLOBAL CONSTANTS
 *****************************************************************************/
const STORAGE_GET_LINK = 'https://storage.rada0722.repl.co/get?filename=';
const STORAGE_EDIT_LINK = 'https://storage.rada0722.repl.co/edit?filename=';
const STORAGE_RM_LINK = 'https://storage.rada0722.repl.co/rm?filename=';





/*****************************************************************************
 * PRIVATE FUNCTIONS
 *****************************************************************************/





/*****************************************************************************
 * PUBLIC FUNCTIONS
 *****************************************************************************/

async function get(table_name: string): Promise<string> {
    //scrumpoker_${GET_INPUT['id']}
    return await web.getData (`${STORAGE_GET_LINK}${table_name}.json`)
}

async function edit(table_name: string, data: string): Promise<string> {
    return await web.getData (`${STORAGE_EDIT_LINK}${table_name}.json&${data}`);
}

async function remove(table_name: string): Promise<string> {
    return await web.getData (`${STORAGE_RM_LINK}${table_name}.json`)
}





/*****************************************************************************
 * EXPORTS
 *****************************************************************************/

export {
    // GET
    get,

    // SET
    edit,
    remove
};
