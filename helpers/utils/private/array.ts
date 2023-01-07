/*****************************************************************************
 * PUBLIC FUNCTIONS
 *****************************************************************************/

 function reduce<T>(obj: T[], src: T[]): T[] {
    let ret: T[] = [];
    
    obj.forEach( e1 => {
        let found: boolean = false;
        src.forEach( e2 => {
            if(e1 == e2) {
                found = true;
            }
        });
        if(!found){
            ret.push(e1);
        }
    });
    
    return ret;
}

function unique<T>(arr: T[]): T[] {
    return [...new Set(arr)];
}





/*****************************************************************************
 * EXPORTS
 *****************************************************************************/

export {
    reduce,
    unique
};