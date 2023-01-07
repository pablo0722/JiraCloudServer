/*****************************************************************************
 * PUBLIC FUNCTIONS
 *****************************************************************************/

function extend(obj: {[key: string]: any}, src: {[key: string]: any}) {
    for (var key in src) {
        if(src[key].constructor == Object){
            if (obj.hasOwnProperty(key)){
                obj[key] = extend(obj[key], src[key]);
            }else{
                obj[key] = src[key];
            }
        }else{
            obj[key] = src[key];
        }
    }
    return obj;
}





/*****************************************************************************
 * EXPORTS
 *****************************************************************************/

export {
    extend
};