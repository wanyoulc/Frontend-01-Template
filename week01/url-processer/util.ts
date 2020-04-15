const originalToString = Object.prototype.toString

function isDate(val: any):val is Date{
    return originalToString.call(val) === '[object Date]'
}

function isObject(val: any):val is Object{
    return typeof val === 'object' && val !== null
}

function isArray(val: any):val is Array<any>{
    return originalToString.call(val) === '[object Array]'
}

export {
    isDate,
    isObject,
    isArray
}
