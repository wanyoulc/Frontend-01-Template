type Method =
| "get"
| "GET"
| "delete"
| "Delete"
| "head"
| "HEAD"
| "options"
| "OPTIONS"
| "post"
| "POST"
| "put"
| "PUT"
| "patch"
| "PATCH";



interface requestConfig {
    host: string;
    port?: number;
    path?: string;
    method?: Method;
    headers?: any;
    data?: any;
    params?: any;
}


type HtmlState = (c: string | symbol) => HtmlState | void

interface Token {
    type: "text" | "EOF" | "startTag" | "endTag";
    content?: string;
    tagName?: string;
    isSelfClosing?: boolean;
    attributes ?: HtmlAttribute[];
}

interface HtmlAttribute {
    name: string
    value: string
}

interface HtmlElement {
    type: "element" | "document" | "text";
    attributes? : HtmlAttribute[];
    children?: HtmlElement[];
    tagName?: string
    content?: string;
}