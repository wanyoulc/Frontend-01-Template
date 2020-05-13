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

