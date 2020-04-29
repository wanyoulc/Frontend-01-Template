# 每周总结可以写在这里

## 浮点数布局

IEEE754标准

## new.target

目的是判断函数是被new调用还是普通调用

防御性编程

## string template
函数调用
``` js
function foo() {
    console.log(arguments)
}
let name = "bar"
foo`Hello ${name}!`

```
jsx曾考虑过使用这种语法

使用这种语法实现模板语言

## reference
由object与key组成，对象的成员访问会返回reference类型


## 左值与右值表达式

当一个对象被用作右值时，用的是其中的值（内容）；
当一个对象被用作左值时，用的是它的地址（身份）。

## void
把后面的表达式变成undefined

## IIFE
最好的创建IIFE的方法是使用void，而不是使用括号。原因有两点，1.语义正确 2.忘写分号时，括号和上一个表达式会粘在一起

## !!
转boolean类型


## 类型转换

###  string number转换



## 装箱拆箱


## completion record

每个语句都有一个completion record

## label


## 复杂语句

### BlockStatement
块作用域

### iterationStatement

根据label消费break，continue

## 作用域与上下文

作用域是从语言的角度描述的，它不关心运行时是什么，也不关心底层的机制是什么，它只关心作用的范围。这个范围是用源代码文本来描述的。

上下文指的是一块内存区域，用来存放变量。

## 异步生成器

可以使用for await循环调用异步生成器

使用异步生成器实现一个间隔1s的定时器

```js
async function* foo(){
    let count = 0
    while(true) {
        yield count++
        await sleep(1000)
    }
}()

void async function(){
    const g = foo()
    for await(let e of g){
        console.log(e)
    }
}()

```

## 声明

### var
注意var的变量提升的行为，ECMA规范里BoundNames描述了这种行为

## 对象

### 对象与结构体

对象不是一种数据存储的工具，而结构体是一种数据存储的工具。

### 对象三要素

唯一性，状态，行为

### 封装，继承，多态
本身是三个不同层面的概念，被误解在了一起。

### 简单地理解多态
同样的代码，却产生不同的行为。

### 状态与行为
行为改变状态，在狗咬人的案例中，人的状态被主要改变，因此咬不应该是狗这个对象上的方法，因为咬这个行为并没有改变狗身上的状态。相反，咬改变了人的状态。而改变狗状态的行为可以是激怒等。同时，人身上的方法可以是受伤，因为受伤改变了人的状态。

总结，每个对象上的方法都应该改变它自身的状态。

面向对象常见的误解就是，用尽可能贴合生活的方式描述对象。事实上，我们不应该受到自然语言描述的干扰，应该先做出良好的抽象，而这种抽象可能并不那么贴合生活。

### 面向对象参考资料

面向对象分析与设计 --Grady Booch

### JS对象模型

只需要关心属性与原型两部分，原型是原型，不是属性

### [[call]]

typeof根据[[call]]判断是否是函数


### 管理复杂正则的技巧

为子正则表达式命名，然后在程序中转换


# Javascript中无法手动实现的对象

- 绑定函数对象
  
  特性： 与原来的函数相关联，但this由我们手动指定

- Array对象

  特性：length随着最大下标而变化

- Object.prototype

  特性： 不能再给他设置原型

- String对象
  
  特性： 支持下标运算，并会去字符串里查找对应元素

- Argument

  特性： 与函数参数相关联  






