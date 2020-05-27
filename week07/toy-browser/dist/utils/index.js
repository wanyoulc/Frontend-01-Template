"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function hexToDecimal(char) {
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
        'a': 10,
        'b': 11,
        'c': 12,
        'd': 13,
        'e': 14,
        'f': 15
    };
    if (Object.keys(map).includes(char)) {
        return map[char];
    }
    else {
        throw new Error('invalid param');
    }
}
exports.hexToDecimal = hexToDecimal;
//# sourceMappingURL=index.js.map