/*****************************************************************************
 * IMPORTS
 *****************************************************************************/

import * as utilsh from '../index.js'





/*****************************************************************************
 * GLOBAL CONSTANTS
 *****************************************************************************/
const TABLE_NAME_PREFIX = 'scrumpoker_';
const CLOSE_VOTATION = 'VOTACION_CERRADA';
const OWNER_VOTATION = 'OWNER';





/*****************************************************************************
 * PRIVATE FUNCTIONS
 *****************************************************************************/





/*****************************************************************************
 * PUBLIC FUNCTIONS
 *****************************************************************************/

function set_updater(func: () => void, time: number = 2000) {
    setInterval(func, time);
}

function get(table_id: string) {
    utilsh.storage.get(`${TABLE_NAME_PREFIX}${table_id}`)
}

function edit(table_id: string, data: string) {
    utilsh.storage.edit(`${TABLE_NAME_PREFIX}${table_id}`, data);
}

function remove(table_id: string) {
    utilsh.storage.remove(`${TABLE_NAME_PREFIX}${table_id}`)
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
