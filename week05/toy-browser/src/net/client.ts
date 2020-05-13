import net, { Socket } from "net";

enum responseParserState {
    WAITING_STATUS_LINE,
    WAITING_STATUS_LINE_END,
    WAITING_HEADER_NAME,
    WAITING_HEADER_SPACE,
    WAITING_HEADER_VALUE,
    WAITING_HEADER_LINE_END,
    WAITING_HEADER_BLOCK_END,
    WAITING_BODY
}

enum thunkBodyParserState {
    WAITING_LENGTH,
    WAITING_LENGTH_LINE_END,
    WAITING_THUNK,
    WAITING_NEW_LINE,
    WAITING_NEW_LINE_END
}

class Request {
    method: string;
    host: string;
    path: string;
    port: number;
    body: any;
    bodyText?: string;
    headers: any;

    constructor(options: requestConfig) {
        this.method = options.method || "GET";
        this.host = options.host;
        this.path = options.path || "/";
        this.port = options.port || 80;
        this.body = options.data || {};
        this.headers = options.headers || {};
        this.processHeaders();
    }

    private processHeaders() {
        if (!this.headers["Content-Type"]) {
            this.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
        const contentType = this.headers["Content-Type"];
        if (contentType === "application/json") {
            this.bodyText = JSON.stringify(this.body);
        } else if (contentType === "application/x-www-form-urlencoded") {
            this.bodyText = Object.keys(this.body)
                .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(this.body[key])}`)
                .join("&");
        }
        this.headers["Content-Length"] = this.bodyText!.length;
    }

    toString() {
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers)
    .map(key => `${key}: ${this.headers[key]}`)
    .join("\r\n")}
\r
${this.bodyText}`;
    }

    send(connection:Socket) {
        const parser = new ResponseParser()
        return new Promise((resolve, reject) => {
            if(connection) {
                connection.write(this.toString())
            }else{
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                })
                connection.write(this.toString())
            }
            connection.on('data', (data) => {
                parser.receive(data.toString())
                if (parser.isFinished){
                    resolve(parser.response)
                }
                connection.end()
            })
            connection.on('error',(err) => {
                reject(err)
                connection.end()
            })

        })
    }
}

class Response {}


class ResponseParser {

    currentState: responseParserState
    statusLine: string
    headers: any
    headerName: string
    headerValue: string
    bodyParser?: TrunkBodyParser 

    constructor() {
        this.currentState = responseParserState.WAITING_STATUS_LINE
        this.statusLine = ''
        this.headers = {}
        this.headerName = ''
        this.headerValue = ''
    }

    get isFinished() {
        return this.bodyParser && this.bodyParser.isFinished
    }

    get response() {
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/)
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser!.content.join('')
        }
    }

    receive(string: string) {
        for(let i = 0; i < string.length; i++) {
            this.receiveChar(string.charAt(i))
        }
    }
    receiveChar(char:string) {
        if(this.currentState === responseParserState.WAITING_STATUS_LINE) {
            if(char === '\r'){
                this.currentState = responseParserState.WAITING_STATUS_LINE_END
            }
            else if (char === '\n'){
                this.currentState = responseParserState.WAITING_HEADER_NAME
            }
            else {
                this.statusLine += char
            }
        }else if(this.currentState === responseParserState.WAITING_STATUS_LINE_END) {
            if (char === '\n'){
                this.currentState = responseParserState.WAITING_HEADER_NAME
            }
        }else if(this.currentState === responseParserState.WAITING_HEADER_NAME){
            if(char === ':') {
                this.currentState = responseParserState.WAITING_HEADER_SPACE
            }else if(char === '\r') {
                this.currentState = responseParserState.WAITING_HEADER_BLOCK_END
                
                if(this.headers['Transfer-Encoding'] === 'chunked'){
                    this.bodyParser = new TrunkBodyParser()
                }
            }
            else {
                this.headerName += char
            }
        }else if(this.currentState === responseParserState.WAITING_HEADER_SPACE){
            if(char === ' '){
                this.currentState = responseParserState.WAITING_HEADER_VALUE
            }
        }else if(this.currentState === responseParserState.WAITING_HEADER_VALUE){
            if(char === '\r') {
                this.currentState = responseParserState.WAITING_HEADER_LINE_END
                this.headers[this.headerName] = this.headerValue
                this.headerName = ''
                this.headerValue = ''
            }else {
                this.headerValue += char
            }
        }else if(this.currentState === responseParserState.WAITING_HEADER_LINE_END) {
            if (char === '\n') {
                this.currentState = responseParserState.WAITING_HEADER_NAME
            }
        }else if(this.currentState === responseParserState.WAITING_HEADER_BLOCK_END) {
            if (char === '\n'){
                this.currentState = responseParserState.WAITING_BODY
            }
        }
        else if(this.currentState === responseParserState.WAITING_BODY){
            this.bodyParser!.receiveChar(char)
        }
    }
}

class TrunkBodyParser {

    currentState:thunkBodyParserState
    length:number
    content: Array<string>
    isFinished: boolean
    constructor(){
        this.currentState = thunkBodyParserState.WAITING_LENGTH
        this.length = 0
        this.content = []
        this.isFinished = false
    }

    receiveChar(char: string) {
        if(this.currentState === thunkBodyParserState.WAITING_LENGTH) {
            if(char === '\r'){
                if (this.length === 0){
                    this.isFinished = true
                }
                this.currentState = thunkBodyParserState.WAITING_LENGTH_LINE_END
            }else {
                this.length *= 10
                this.length += char.charCodeAt(0) - '0'.charCodeAt(0)
            }
        }else if (this.currentState === thunkBodyParserState.WAITING_LENGTH_LINE_END) {
            if(char === '\n') {
                this.currentState = thunkBodyParserState.WAITING_THUNK
            }
        }else if(this.currentState === thunkBodyParserState.WAITING_THUNK) {
            this.content.push(char)
            this.length--
            if(this.length === 0){
                this.currentState = thunkBodyParserState.WAITING_NEW_LINE
            }
        }else if (this.currentState === thunkBodyParserState.WAITING_NEW_LINE) {
            if(char === '\r') {
                this.currentState = thunkBodyParserState.WAITING_NEW_LINE_END
            }
        }else if (this.currentState === thunkBodyParserState.WAITING_NEW_LINE_END) {
            if(char === '\n') {
                this.currentState = thunkBodyParserState.WAITING_LENGTH
            }
        }
    }
}

let request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    data: {
        name: 'winter'
    }
})

console.log(request.toString())
