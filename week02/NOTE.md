# Week02学习总结

## Unicode
Unicode是一个字符集，其中每个字符被映射到一个正整数上，称之为码点。

Ascii字符集的码点在大多数字符集中都得以保留

编码指的是字符串实际的存储方式

js处理bmp之外的字符（emoji）使用fromCodePoint api

区分源文件的编码（一般使用UTF8，利于存储和传输）和源码里字符串编码（JS使用UTF-16）。

unicode的体系有block和category等。前者按块分类，与unicode的值强相关。后者按字符的意义分类。

## JS词法
```
InputElement::
    WhiteSpace
    LineTerminal
    Comment
    Token
```

```
WhiteSpace::
    <TAB>
    <VT> 
    <FF>
    <SP>
    <NBSP>
    <BOM>
    <USP> 
```

NBSP与SP的区别，前者是non-break的，也就是说不会造成英文分词。

```
LineTerminal:
    <LF>
    <CR> 
    <LS> 
    <PS> 
```
```
Token:
    IdentifierName
        Keyword
        Future Reserved Keywords
        Identifier
    Literal
        null
        undefined
        boolean
        number
        string
        object
        symbol
    Punctuator 
    
```

undefined不是关键字，是一个全局的变量名。在函数这种局部作用域内可以声明一个undefined的局部变量，覆盖的全局的undefined，从而达到改变undefined值的效果

## 操作底层数据
### typed array

Typed Arrays are an efficient way to store arrays of numbers that are of the same type - 8-bit integer, unsigned 16-bit integers, 32-bit floats, etc.

typed array具有严格的类型限制，比如一个Uint8类型的数组，它的每一位都只能是一个0-255范围内的整数，如果你存于一个小于0的数，那么它会被自动转换为0，如果存入一个大于255的数，会被自动转换为255

### array buffer
ArrayBuffer 对象用来表示通用的、固定长度的原始二进制数据缓冲区。ArrayBuffer 不能直接操作，而是要通过类型数组对象或 DataView 对象来操作，它们会将缓冲区中的数据表示为特定的格式，并通过这些格式来读写缓冲区的内容。

### dataview