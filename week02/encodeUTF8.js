const assert = require('assert')

function encodeUTF8(char) {
    const codePoint = char.codePointAt();
    const binCodePointStr = codePoint.toString(2);
    if (codePoint <= 127) {
        const chunk = new Uint8Array(1);
        chunk[0] = parseInt(binCodePointStr, 2);
        return chunk;
    } else if (codePoint <= 2175) {
        // 2175 = 127 + math.pow(2,11)
        const chunk = new Uint8Array(2);
        chunk[1] = parseInt('10' + binCodePointStr.slice(-6), 2)
        chunk[0] = parseInt('110' + binCodePointStr.slice(0,-6).padStart(5,'0'),2)
        return chunk

    } else if (codePoint <= 67711) {
        //67711 = 2175 + math.pow(2,16)
        const chunk = new Uint8Array(3);
        chunk[2] =  parseInt('10' + binCodePointStr.slice(-6), 2)
        chunk[1] =  parseInt('10' + binCodePointStr.slice(-12,-6), 2)
        chunk[0] =  parseInt('1110' + binCodePointStr.slice(0,-12).padStart(4,'0'),2)
        return chunk
    } else {
        const chunk = new Uint8Array(4);
        chunk[3] =  parseInt('10' + binCodePointStr.slice(-6), 2)
        chunk[2] =  parseInt('10' + binCodePointStr.slice(-12, -6), 2)
        chunk[1] =  parseInt('10' + binCodePointStr.slice(-18,-12), 2)
        chunk[0] =  parseInt('11110' + binCodePointStr.slice(0,-18).padStart(3,'0'),2)
        return chunk
    }
}


// test
const str = "☇";
const buf = Buffer.from(str, "utf8");
assert(Buffer.from(encodeUTF8(str)).toString() === str)



