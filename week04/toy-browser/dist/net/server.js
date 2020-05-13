"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
http_1.default.createServer((req, res) => {
    console.log('request received');
    res.setHeader('Content-Type', 'text/plain');
    res.writeHead(200);
    res.end('ok');
});
//# sourceMappingURL=server.js.map