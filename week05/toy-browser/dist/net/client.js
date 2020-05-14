"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __importDefault(require("net"));
const utils_1 = require("../utils");
var responseParserState;
(function (responseParserState) {
    responseParserState[responseParserState["WAITING_STATUS_LINE"] = 0] = "WAITING_STATUS_LINE";
    responseParserState[responseParserState["WAITING_STATUS_LINE_END"] = 1] = "WAITING_STATUS_LINE_END";
    responseParserState[responseParserState["WAITING_HEADER_NAME"] = 2] = "WAITING_HEADER_NAME";
    responseParserState[responseParserState["WAITING_HEADER_SPACE"] = 3] = "WAITING_HEADER_SPACE";
    responseParserState[responseParserState["WAITING_HEADER_VALUE"] = 4] = "WAITING_HEADER_VALUE";
    responseParserState[responseParserState["WAITING_HEADER_LINE_END"] = 5] = "WAITING_HEADER_LINE_END";
    responseParserState[responseParserState["WAITING_HEADER_BLOCK_END"] = 6] = "WAITING_HEADER_BLOCK_END";
    responseParserState[responseParserState["WAITING_BODY"] = 7] = "WAITING_BODY";
})(responseParserState || (responseParserState = {}));
var thunkBodyParserState;
(function (thunkBodyParserState) {
    thunkBodyParserState[thunkBodyParserState["WAITING_LENGTH"] = 0] = "WAITING_LENGTH";
    thunkBodyParserState[thunkBodyParserState["WAITING_LENGTH_LINE_END"] = 1] = "WAITING_LENGTH_LINE_END";
    thunkBodyParserState[thunkBodyParserState["WAITING_THUNK"] = 2] = "WAITING_THUNK";
    thunkBodyParserState[thunkBodyParserState["WAITING_NEW_LINE"] = 3] = "WAITING_NEW_LINE";
    thunkBodyParserState[thunkBodyParserState["WAITING_NEW_LINE_END"] = 4] = "WAITING_NEW_LINE_END";
})(thunkBodyParserState || (thunkBodyParserState = {}));
class Request {
    constructor(options) {
        this.method = options.method || "GET";
        this.host = options.host;
        this.path = options.path || "/";
        this.port = options.port || 80;
        this.body = options.data || {};
        this.headers = options.headers || {};
        this.processHeaders();
    }
    processHeaders() {
        if (!this.headers["Content-Type"]) {
            this.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
        const contentType = this.headers["Content-Type"];
        if (contentType === "application/json") {
            this.bodyText = JSON.stringify(this.body);
        }
        else if (contentType === "application/x-www-form-urlencoded") {
            this.bodyText = Object.keys(this.body)
                .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(this.body[key])}`)
                .join("&");
        }
        this.headers["Content-Length"] = this.bodyText.length;
    }
    toString() {
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers)
            .map(key => `${key}: ${this.headers[key]}`)
            .join("\r\n")}
\r
${this.bodyText}`;
    }
    send(connection) {
        const parser = new ResponseParser();
        return new Promise((resolve, reject) => {
            if (connection) {
                connection.write(this.toString());
            }
            else {
                connection = net_1.default.createConnection({
                    host: this.host,
                    port: this.port
                });
                connection.write(this.toString());
            }
            connection.on('data', (data) => {
                parser.receive(data.toString());
                if (parser.isFinished) {
                    resolve(parser.response);
                }
                connection.end();
            });
            connection.on('error', (err) => {
                reject(err);
                connection.end();
            });
        });
    }
}
class Response {
}
class ResponseParser {
    constructor() {
        this.currentState = responseParserState.WAITING_STATUS_LINE;
        this.statusLine = '';
        this.headers = {};
        this.headerName = '';
        this.headerValue = '';
    }
    get isFinished() {
        return this.bodyParser && this.bodyParser.isFinished;
    }
    get response() {
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.content.join('')
        };
    }
    receive(string) {
        for (let i = 0; i < string.length; i++) {
            this.receiveChar(string.charAt(i));
        }
    }
    receiveChar(char) {
        if (this.currentState === responseParserState.WAITING_STATUS_LINE) {
            if (char === '\r') {
                this.currentState = responseParserState.WAITING_STATUS_LINE_END;
            }
            else if (char === '\n') {
                this.currentState = responseParserState.WAITING_HEADER_NAME;
            }
            else {
                this.statusLine += char;
            }
        }
        else if (this.currentState === responseParserState.WAITING_STATUS_LINE_END) {
            if (char === '\n') {
                this.currentState = responseParserState.WAITING_HEADER_NAME;
            }
        }
        else if (this.currentState === responseParserState.WAITING_HEADER_NAME) {
            if (char === ':') {
                this.currentState = responseParserState.WAITING_HEADER_SPACE;
            }
            else if (char === '\r') {
                this.currentState = responseParserState.WAITING_HEADER_BLOCK_END;
                if (this.headers['Transfer-Encoding'] === 'chunked') {
                    this.bodyParser = new TrunkBodyParser();
                }
            }
            else {
                this.headerName += char;
            }
        }
        else if (this.currentState === responseParserState.WAITING_HEADER_SPACE) {
            if (char === ' ') {
                this.currentState = responseParserState.WAITING_HEADER_VALUE;
            }
        }
        else if (this.currentState === responseParserState.WAITING_HEADER_VALUE) {
            if (char === '\r') {
                this.currentState = responseParserState.WAITING_HEADER_LINE_END;
                this.headers[this.headerName] = this.headerValue;
                this.headerName = '';
                this.headerValue = '';
            }
            else {
                this.headerValue += char;
            }
        }
        else if (this.currentState === responseParserState.WAITING_HEADER_LINE_END) {
            if (char === '\n') {
                this.currentState = responseParserState.WAITING_HEADER_NAME;
            }
        }
        else if (this.currentState === responseParserState.WAITING_HEADER_BLOCK_END) {
            if (char === '\n') {
                this.currentState = responseParserState.WAITING_BODY;
            }
        }
        else if (this.currentState === responseParserState.WAITING_BODY) {
            this.bodyParser.receiveChar(char);
        }
    }
}
class TrunkBodyParser {
    constructor() {
        this.currentState = thunkBodyParserState.WAITING_LENGTH;
        this.length = 0;
        this.content = [];
        this.isFinished = false;
    }
    receiveChar(char) {
        if (this.currentState === thunkBodyParserState.WAITING_LENGTH) {
            if (char === '\r') {
                if (this.length === 0) {
                    this.isFinished = true;
                }
                this.currentState = thunkBodyParserState.WAITING_LENGTH_LINE_END;
            }
            else {
                this.length *= 16;
                this.length += utils_1.hexToDecimal(char);
            }
        }
        else if (this.currentState === thunkBodyParserState.WAITING_LENGTH_LINE_END) {
            if (this.length === 0)
                return;
            if (char === '\n') {
                this.currentState = thunkBodyParserState.WAITING_THUNK;
            }
        }
        else if (this.currentState === thunkBodyParserState.WAITING_THUNK) {
            this.content.push(char);
            this.length--;
            if (this.length === 0) {
                this.currentState = thunkBodyParserState.WAITING_NEW_LINE;
            }
        }
        else if (this.currentState === thunkBodyParserState.WAITING_NEW_LINE) {
            if (char === '\r') {
                this.currentState = thunkBodyParserState.WAITING_NEW_LINE_END;
            }
        }
        else if (this.currentState === thunkBodyParserState.WAITING_NEW_LINE_END) {
            if (char === '\n') {
                this.currentState = thunkBodyParserState.WAITING_LENGTH;
            }
        }
    }
}
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        let request = new Request({
            method: 'POST',
            host: '127.0.0.1',
            port: 8080,
            data: {
                name: 'winter'
            }
        });
        const sock = net_1.default.createConnection({
            host: '127.0.0.1',
            port: 8080
        });
        const data = yield request.send(sock);
        console.log(data);
    });
}
test();
//# sourceMappingURL=client.js.map