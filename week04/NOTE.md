# 每周总结可以写在这里

## 事件循环

在JS引擎之外，是JS的调用方使用JS的一种方式。

在OC的JS引擎里同样执行了微任务

出了JS引擎，就是宏任务，也就是说，宏任务是外部代码调用的，比如在V8引擎中的C++代码中调用

在JS引擎内执行的任何代码，都是微任务

宏任务和微任务是一种包裹的关系，需要关注的是宏任务里包裹了哪些微任务。

有一个resolve就产生了一个额外的微任务

微任务按顺序加入到微任务队列里

可以认为，如果有一个纯粹的JS环境，是不存在宏任务的。

## Realm
里面有一套完整的JS对象，比如Object，Date等

## Lexical Environment

Lexical Environment是一个类似链表的结构，它里面的每一项都继承自Environment Record这一基类。闭包的实现原理就是外层的自由变量被传入了函数中，成为了函数的一个Environment Record。

具体的Environment Record含义可见下面的链接：
https://stackoverflow.com/questions/20139050/what-really-is-a-declarative-environment-record-and-how-does-it-differ-from-an-a

https://blog.bitsrc.io/understanding-execution-context-and-execution-stack-in-javascript-1c9ea8642dd0


## Realm
摘自StackOverflow上的回答：

The language reference uses abstract terms because JavaScript environments can vary widely. In the browser, a window (a frame, a window opened with window.open(), or just a plain browser tab) is a realm. A web worker is a different kind of realm than a window, but it's a realm. Same goes for service workers.

It's possible for an object to cross realm boundaries because windows opened from a common base window can intercommunicate via function calls and simple variable references. The mention of instanceof in that excerpt you quoted has to do with that. Consider this code in an \<iframe> window:
``` js
window.parent.someFunction(["hello", "world"]);
```
Then imagine a function in the parent window:

``` js
function someFunction(arg) {
  if (arg instanceof Array) {
    // ... operate on the array
  }
}
```
That won't work. Why? Because the array constructed in the \<iframe> window was constructed from the Array constructor in that realm, and therefore the array is not an instance constructed from the Array in the parent window.

There's a much stronger "wall" between web worker realms and window realms, and such effects don't happen in those interactions.





