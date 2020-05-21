import { isEOF } from "../utils/index";
import {computeCSS, addRules} from "./computeCSS"
const tagNameRE = /^[a-zA-Z]$/;
const whitespaceRE = /^[\t\n\f ]$/;
const attrNameRE = /^[a-zA-Z]$/;
const attrValueRE = /^[a-zA-Z]$/;
const declareRE = /^[a-zA-Z ]$/;

let currentToken: Token;
let currentAttrbute: HtmlAttribute;

const stack: HtmlElement[] = [{type: "document", children: []}]
let currentTextNode: HtmlElement | null


function emit(token: Token) {
    let top = stack[stack.length - 1]
    if(token.type === 'startTag'){
        const element:HtmlElement = {
            type: "element",
            attributes: token.attributes,
            tagName: token.tagName
        }
        top.children ? top.children.push(element): top.children = [element]
        element.parent = top    
        computeCSS(element)
        if (!token.isSelfClosing){
            stack.push(element)
        }
        currentTextNode = null
    }else if(token.type === 'endTag'){
        if(top.tagName !== token.tagName){
            throw new Error("Tag does not matched")
        }else{
            if(token.tagName === 'style' && top.children){
                addRules(top.children[0].content!)
            }
            stack.pop()
        }
    }else if(token.type === 'text'){
        if(currentTextNode === null){
            currentTextNode = {
                type: "text",
                content: ""
            }
            currentTextNode.parent = top
            top.children ? top.children.push(currentTextNode): top.children = [currentTextNode]
        }
        currentTextNode.content += token.content!
    }
}

function data(c: string | symbol): HtmlState | void {
    if (c === "<") {
        return tagOpen;
    } else if (isEOF(c)) {
        emit({
            type: "EOF"
        });
        return;
    } else {
        emit({
            type: "text",
            content: c as string
        });
        return data;
    }
}

function tagOpen(c: string | symbol): HtmlState | void {
    if (isEOF(c)) {
    } else if (c === "/") {
        return endTagOpen;
    } else if ((c as string).match(tagNameRE)) {
        currentToken = {
            type: "startTag",
            tagName: ""
        };
        return tagName(c);
    } else if (c === "!") {
        return markupDeclarationOpen;
    } else {
        return tagOpen;
    }
}

function endTagOpen(c: string | symbol): HtmlState | void {
    if (isEOF(c)) {
    } else if (c.match(tagNameRE)) {
        currentToken = {
            type: "endTag",
            tagName: ""
        };
        return tagName(c);
    } else {
    }
}

function tagName(c: string | symbol): HtmlState | void {
    if (isEOF(c)) {
    } else if (c.match(whitespaceRE)) {
        return beforeAttrName;
    } else if (c === "/") {
        return selfClosingStartTag;
    } else if (c.match(tagNameRE)) {
        currentToken.tagName += c; //.tolowerCase()
        return tagName;
    } else if (c === ">") {
        emit(currentToken);
        return data;
    } else {
        currentToken.tagName += c;
        return tagName;
    }
}

function beforeAttrName(c: string | symbol): HtmlState | void {
    if (isEOF(c)) {
        return afterAttrName(c);
    } else if (c.match(whitespaceRE)) {
        return beforeAttrName;
    } else if (c === "/" || c === ">") {
        return afterAttrName(c);
    } else if (c === "=") {
    } else {
        currentAttrbute = {
            name: "",
            value: ""
        };
        return afterAttrName(c);
    }
}

function attrName(c: string | symbol): HtmlState | void {
    if (isEOF(c)) {
        return afterAttrName(c);
    } else if (c.match(attrNameRE)) {
        currentAttrbute.name += c;
        return attrName;
    } else if (c === "=") {
        return beforeAttrValue;
    } else if (c.match(whitespaceRE) || c === "/" || c === ">") {
        return afterAttrName(c);
    }
}

// 未区分引号
function beforeAttrValue(c: string | symbol): HtmlState | void {
    if (isEOF(c)) {
        return beforeAttrValue;
    } else if (c.match(whitespaceRE) || c === "/" || c === ">") {
        return beforeAttrValue;
    } else if (c.match(attrValueRE)) {
        return attrValue(c);
    } else {
    }
}

function attrValue(c: string | symbol): HtmlState | void {
    if (isEOF(c)) {
    } else if (c.match(attrValueRE) || c.match(whitespaceRE)) {
        currentAttrbute.value += c;
        return attrValue(c);
        // 未考虑无引号的情况
    } else if (c === "'" || c === '"') {
        currentToken.attributes
            ? currentToken.attributes.push(currentAttrbute)
            : (currentToken.attributes = [currentAttrbute]);
        return afterAttrValue
    }
}

function afterAttrValue(c: string | symbol): HtmlState | void{
        if(isEOF(c)){

        }else if(c.match(whitespaceRE)){
            return beforeAttrName
        }else if(c === '/'){
            return selfClosingStartTag
        }else if(c === '>'){
            currentToken.attributes
            ? currentToken.attributes.push(currentAttrbute)
            : (currentToken.attributes = [currentAttrbute]);
            emit(currentToken)
            return data
        }
}

function afterAttrName(c: string | symbol): HtmlState | void{
    if(isEOF(c)){
        
    }else if(c.match(whitespaceRE)){
        return afterAttrName
    }else if(c === '/'){
        return selfClosingStartTag
    }else if(c === '='){
        return beforeAttrValue
    }else if(c === '>'){
        currentToken.attributes
        ? currentToken.attributes.push(currentAttrbute)
        : (currentToken.attributes = [currentAttrbute]);
        emit(currentToken)
        return data
    }else{
        currentToken.attributes
        ? currentToken.attributes.push(currentAttrbute)
        : (currentToken.attributes = [currentAttrbute]);
        currentAttrbute = {
            name: "",
            value: ""
        }
        return attrName
    }
}

function selfClosingStartTag(c: string | symbol): HtmlState | void {
    if (isEOF(c)) {
    } else if (c === ">") {
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    } else {
        return selfClosingStartTag;
    }
}

function markupDeclarationOpen(c: string | symbol): HtmlState | void {
    if (isEOF(c)) {
    } else if (c.match(declareRE)) {
        return markupDeclarationOpen;
    } else if (c === ">") {
        return data;
    }
}

function parseHtml(html: string) {
    let state: HtmlState = data;
    for (let c of html) {
        const res = state(c);
        if (res) {
            state = res;
        }
    }
}
