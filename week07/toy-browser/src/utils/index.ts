import {EOF} from "../@types/globalVar"

function hexToDecimal(char: string):number | never{
    const map = {
        '0': 0,
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        'a' :10,
        'b': 11,
        'c': 12,
        'd': 13,
        'e': 14,
        'f': 15
    }
    if (Object.keys(map).includes(char)){
        return map[char as keyof typeof map]
    }else { 
        throw new Error('invalid param')
    }
}

function isEOF(c: string | symbol) :c is symbol{
    return c === Symbol.for("EOF")
}

function isAuto(c: string):boolean{
    return c === 'auto' || c === '' || c === (void 0) || c === null
}

function isDef(c: string):boolean{
    return !(c === (void 0) || c === null)
}


export {hexToDecimal, isEOF, isAuto, isDef}