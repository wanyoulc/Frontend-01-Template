const css = require("css")

const cssText = `.foo {width:200px;height:200px;} #bar{color:red;} div .foo{display:flex}`

const ast = css.parse(cssText)

ast.stylesheet.rules.forEach((rule) => {
    console.log(rule)
})

