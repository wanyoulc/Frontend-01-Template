import {isDef} from "../utils"
import {createFlexLine} from "../utils/factory"

function getStyle(element: HtmlElement) {
    if (!element.style) {
        element.style = {};
    }

    for (let prop in element.computedStyle) {
        element.style[prop] = element.computedStyle[prop].value;

        if (element.style[prop].toString().match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        } else if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
    }

    return element.style;
}
// TODO
function layout(element: HtmlElement) {
    if (!element.computedStyle) {
        return;
    }

    const elementStyle = getStyle(element);
    let flexType

    if (elementStyle.display === "flex") {
        flexType = "flex"
    }else if(elementStyle.display === 'inlineFlex'){
        flexType = "inlineFlex"
    }else{
        return
    }

    let items: HtmlElement[];
    if (!element.children) {
        return;
    }

    let style = elementStyle
    items = element.children.filter(el => el.type === "element");
    items.sort((a, b) => a.computedStyle["order"].value || 0 - b.computedStyle["order"].value || 0);

    ['width', 'height'].forEach(size => {
        if(style[size] === 'auto' || style[size] === ''){
            style[size] = null
        }
    })

    if (!style.flexDirection || style.flexDirection === 'auto'){
        style.flexDirection = 'row'
    }
    if(!style.alignItems || style.alignItems === 'auto'){
        style.alignItems = 'stretch'
    }
    if(!style.justifyContent || style.justifyContent === 'auto'){
        style.justifyContent = 'flex-start'
    }
    if(!style.flexWrap || style.flexWrap === 'auto'){
        style.flexWarp = 'nowrap'
    }
    if(!style.alignContent || style.alignContent === 'auto'){
        style.alignContent = 'stretch'
    }

    let mainSize, mainStart, mainEnd, mainSign, mainBase,
        crossSize, crossStart, crossEnd, crossSign, crossBase

    if(style.flexDirection === 'row'){
        mainSize = 'width'
        mainStart = 'left'
        mainEnd = 'right'
        mainSign = +1
        mainBase = 0

        crossSize = 'height'
        crossStart = 'top'
        crossEnd = 'bottom'
    }else if(style.flexDirection === 'row-reverse'){
        mainSize = 'width'
        mainStart = 'right'
        mainEnd = 'left'
        mainSign = -1
        mainBase = style.width

        crossSize = 'height'
        crossStart = 'top'
        crossEnd = 'bottom'
    }else if(style.flexDirection === 'column'){
        mainSize = 'height'
        mainStart = 'top'
        mainEnd = 'bottom'
        mainSign = +1
        mainBase = 0

        crossSize = 'width'
        crossStart = 'left'
        crossEnd = 'right'
    }else if(style.flexDirection === 'column-reverse'){
        mainSize = 'height'
        mainStart = 'bottom'
        mainEnd = 'top'
        mainSign = -1
        mainBase = style.height

        crossSize = 'width'
        crossStart = 'left'
        crossEnd = 'right'
    }else {
        return
    }

    if(style.flexWrap === 'wrap-reverse'){
        let tmp = crossStart
        crossStart = crossEnd
        crossEnd = tmp
        crossSign = -1
        crossBase = 0
    }else{
        crossBase = 0
        crossSign = +1
    }


    let flexLine = createFlexLine()
    const flexLines = [flexLine]

    let mainSpace:number = elementStyle[mainSize]
    let crossSpace = 0
    

    for(let i = 0; i < items.length; i++) {
        const item = items[i]
        const itemStyle = getStyle(item)

        if(isDef(itemStyle[mainSize])){
            itemStyle[mainSize] = 0
        }

        if(itemStyle['flex']){
            flexLine.push(item)
        }else if(style.flexWrap === 'nowrap'){
            mainSpace -= itemStyle[mainSize]
            if(isDef(itemStyle[crossSpace])){
                crossSpace = Math.max(crossSpace, itemStyle[crossSpace])
            }
            flexLine.push(item)
        }else{
            if(itemStyle[mainSize] > style[mainSize]) {
                itemStyle[mainSize] = style[mainSize]
            }

            if(mainSpace < itemStyle[mainSize]){
                 flexLine.mainSpace = mainSpace
                 flexLine.crossSpace = crossSpace
                 flexLine = createFlexLine()
                 flexLine.push(item)
                 flexLines.push(flexLine)
                 mainSpace = style[mainSize]
                 crossSpace = 0
            }else{
                flexLine.push(item)
            }

            if(isDef(itemStyle[crossSpace])){
                crossSpace = Math.max(crossSpace, itemStyle[crossSpace])
            }

            mainSpace -= itemStyle[mainSpace]

        }
    }

    if(style.flexWrap === 'nowrap'){
        flexLine.crossSpace = isDef(style[crossSize]) ? style[crossSize] : crossSpace
    }else{
        flexLine.crossSpace = crossSpace
    }

    if(mainSpace < 0){
        const scale = style[mainSize] / (style[mainSize] - mainSpace)


    }





}

export { layout };
