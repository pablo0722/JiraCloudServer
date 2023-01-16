/*****************************************************************************
 * GLOBAL CONSTANTS
 *****************************************************************************/

const debug = true;
const info  = true;
const warn  = true;
const error = true;





/*****************************************************************************
 * GLOBAL VARIABLES
 *****************************************************************************/

let dump: {[key: string]: (arg0: any) => void; };
 dump = {
    'd': (v: any) => d(Object.keys(v)[0] + ': ', Object.values(v)[0]),
    'i': (v: any) => i(Object.keys(v)[0] + ': ', Object.values(v)[0]),
    'w': (v: any) => w(Object.keys(v)[0] + ': ', Object.values(v)[0]),
    'e': (v: any) => e(Object.keys(v)[0] + ': ', Object.values(v)[0]),
};





/*****************************************************************************
 * PUBLIC FUNCTIONS
 *****************************************************************************/

function d(...args: any[]): void {
    if (debug) {
        let mainArguments: any[];
        mainArguments = [].slice.call(args, 0);
        mainArguments.unshift('[DEBUG] ');
        console.log.apply(null, mainArguments);
    }
}

function i(...args: any[]): void {
    if (info) {
        let mainArguments: any[];
        mainArguments = [].slice.call(args, 0);
        mainArguments.unshift('[INFO]  ');
        console.info.apply(null, mainArguments);
    }
}

function w(...args: any[]): void {
    if (warn) {
        let mainArguments: any[];
        mainArguments = [].slice.call(args, 0);
        mainArguments.unshift('[WARN]  ');
        console.info.apply(null, mainArguments);
    }
}

function e(...args: any[]): void {
    if (error) {
        let mainArguments: any[];
        mainArguments = [].slice.call(args, 0);
        mainArguments.unshift('[ERROR] ');
        console.info.apply(null, mainArguments);
    }
}





/*****************************************************************************
 * EXPORTS
 *****************************************************************************/

export {
    // Functions
    dump,
    d,
    i,
    w,
    e
};
