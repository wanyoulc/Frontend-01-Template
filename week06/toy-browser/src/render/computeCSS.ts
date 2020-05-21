import css, { Rule } from "css";

const rules: Rule[] = [];
function addRules(text: string) {
    const ast = css.parse(text);
    if (ast.stylesheet) {
        rules.push(...ast.stylesheet.rules);
    }
}

function specificity(selector: string): number[] {
    const p = [0, 0, 0, 0];
    const selectorParts = selector.split(" ");
    for (let part of selectorParts) {
        if (part.charAt(0) === "#") {
            p[1] += 1;
        } else if (part.charAt(0) === ".") {
            p[2] += 1;
        } else {
            p[3] += 1;
        }
    }
    return p;
}

function compare(sp1: number[], sp2: number[]){

    if(sp1[0] - sp2[0]){
        return sp1[0] - sp2[0]
    }

    if(sp1[1] - sp2[1]){
        return sp1[1] - sp2[1]
    }

    if(sp1[2] - sp2[2]){
        return sp1[2] - sp2[2]
    }

    return sp1[3] - sp2[3]

}

function match(element: HtmlElement, selector: string) {
    if (!selector) {
        return false;
    }

    if (!element.attributes) {
        // 标签选择器
        if (element.tagName === selector) return true;
        return false;
    }

    if (selector.charAt(0) === ".") {
        const attr = element.attributes.filter(attr => attr.name === "class")[0];
        if (attr.value === selector.slice(1)) {
            return true;
        }
    } else if (selector.charAt(0) === "#") {
        const attr = element.attributes.filter(attr => attr.name === "id")[0];
        if (attr.value === selector.slice(1)) {
            return true;
        }
    } else {
    }
    return false;
}

function computeCSS(element: HtmlElement) {
    // 获取当前元素的父元素
    let currentEl = element;
    const parents: HtmlElement[] = [];
    let matched: boolean = false;
    element.computedStyle = {};
    while (currentEl.parent) {
        parents.push(currentEl.parent);
    }
    for (let rule of rules) {
        // 只适用于后代选择器的匹配
        const selectorParts = rule.selectors![0].split(" ").reverse();
        if (!match(element, selectorParts[0])) {
            continue;
        }

        let j = 1;
        for (let i = parents.length - 1; i >= 0; i--) {
            if (match(parents[i], selectorParts[j])) {
                j++;
            }
        }

        if (j >= selectorParts.length) matched = true;

        if (matched && rule.declarations) {
            const sp = specificity(rule.selectors![0]);
            const computedStyle = element.computedStyle;
            for (let declaration of rule.declarations) {
                let property = computedStyle[(declaration as css.Declaration).property!]
                if (!property) {
                    property = {};
                }
                if (!property.specificity) {
                    property.specificity = sp;
                    property.value = (declaration as css.Declaration).value;
                }else if(compare(property.specificity, sp) <= 0){
                    property.specificity = sp;
                    property.value = (declaration as css.Declaration).value;
                }
            }
        }
    }
}

export { addRules, computeCSS };
