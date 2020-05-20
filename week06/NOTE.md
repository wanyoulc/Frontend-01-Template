# 每周总结可以写在这里

## 状态机

可以使用generator实现状态机

## tag和element区别

tag是文本层面上的称呼，位于词法分析阶段。而element是我们最终构造出来的元素

## 什么时候进行computed css的计算
应该在解析完开始标签后就进行computed css的计算，因为子元素往往会依赖于父元素的某些属性，尽早对父元素的css进行计算有利于性能。

## CSS computed的思路
先获取所有css的规则，再去根据规则进行匹配

## css inheritance

在使用到对应属性时发生，比如在排版或者绘制阶段，而不是在css计算阶段

## important
在实际开发中不允许使用important，important一般用于线上修复


