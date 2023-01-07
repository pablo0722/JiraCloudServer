"use strict";
/*****************************************************************************
 * PUBLIC FUNCTIONS
 *****************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.extend = void 0;
function extend(obj, src) {
    for (var key in src) {
        if (src[key].constructor == Object) {
            if (obj.hasOwnProperty(key)) {
                obj[key] = extend(obj[key], src[key]);
            }
            else {
                obj[key] = src[key];
            }
        }
        else {
            obj[key] = src[key];
        }
    }
    return obj;
}
exports.extend = extend;
