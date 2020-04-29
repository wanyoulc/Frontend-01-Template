function convertStringToNumber(str, x) {
    if (str.length === 0) return;

    if (!x) x = 10;
    const re = /^0x([\dA-F]+)$|^0b([01]+)$|^0o([0-7]+)$|^([\dA-F]*(\.[\dA-F]+)?(e[\dA-F]+)?)$/;
    const res = str.match(re)
    const numberLiteral = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', "A", "B", "C", "D", "E", "F"];
    const map = {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        A: 10,
        B: 11,
        C: 12,
        D: 13,
        E: 14,
        F: 15
    };
    if (res) {
        if (res[1] || res[2] || res[3]) {
            // 进制字面量
            let chars 
            if (res[1]) {
                x = 16;
                chars = res[1].split("");
            } else if (res[2]) {
                x = 2;
                chars = res[2].split("");
            } else if (res[3]) {
                x = 8;
                chars = res[3].split("");
            }
            let i = 0;
            let num = 0;
            while (i < chars.length) {
                const curChar = chars[i];
                if (curChar > numberLiteral[x - 1]) return;
                num = num * x;
                num += map[chars[i]];
                i++;
            }
            return num;
        } else if (res[4]) {
            const chars = str.split("");
            let dotIndex = chars.indexOf(".");
            if (dotIndex === -1) dotIndex = Infinity;
            let eIndex = chars.indexOf("e");
            if (eIndex === -1) eIndex = Infinity;
            let i = 0;
            let num = 0;
            while (i < chars.length && i < dotIndex) {
                const curChar = chars[i];
                if (curChar > numberLiteral[x - 1]) return;
                num = num * x;
                num += map[chars[i]];
                i++;
            }
            if(chars[i] === '.'){
                i++;
            }
            let decimal = 1;
            while (i < chars.length && i < eIndex) {
                const curChar = chars[i];
                if (curChar > numberLiteral[x - 1]) return;
                decimal = decimal / x;
                num += map[chars[i]] * decimal;
                i++
            }
            if(chars[i] === 'e'){
                i++
            }
            let exponent = 0;
            while (i < chars.length) {
                const curChar = chars[i];
                if (curChar > numberLiteral[x - 1]) return;
                exponent = exponent * x;
                exponent += map[chars[i]];
                i++;
            }
            if (exponent !== 0) {
                num *= Math.pow(10,exponent);
            }

            return num;
        }
    } else {
        return NaN;
    }
}


function convertNumberToString(number, x){
    let integer = Math.floor(number)
    let decimal = number - integer
    let string = ''
    while(integer > 0){
        string = String(integer % x) + string
        integer = Math.floor(integer / x)
    }
    if (decimal > 0){
        string += '.'
    }
    while(decimal - Math.floor(decimal) > 0){
       decimal *= x 
       string += Math.floor(decimal)
    }
    return string
}


