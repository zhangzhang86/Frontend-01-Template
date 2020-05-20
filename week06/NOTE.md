# Week6周总结

## 有限状态机

### 有限状态机是一种编程思想

* 其作用主要是描述对象在它的生命周期内所经历的状态序列，以及如何响应来自外界的各种事件。
* 状态机可归纳为4个要素，即现态、条件、动作、次态。"现态" 和 "条件" 是因，"动作" 和 "次态" 是果
- 现态：是指当前所处的状态。
- 条件：又称为“事件”。当一个条件被满足，将会触发一个动作，或者执行一次状态的迁移。
- 动作：条件满足后执行的动作。动作执行完毕后，可以迁移到新的状态，也可以仍旧保持原状态。动作不是必需的，当条件满足后，也可以不执行任何动作，直接迁移到新状态。
- 次态：条件满足后要迁往的新状态。“次态”是相对于“现态”而言的，“次态”一旦被激活，就转变成新的“现态”了。

#### 状态机三个特征

* 状态总数（state）是有限的。
* 任一时刻，只处在一种状态之中。
* 某种条件下，会从一种状态转变（transition）到另一种状态。

```javascript
var menu = {
　　    
　　　　// 当前状态
　　　　currentState: 'hide',
　　
　　　　// 绑定事件
　　　　initialize: function() {
　　　　　　var self = this;
　　　　　　self.on("hover", self.transition);
　　　　},
　　
　　　　// 状态转换
　　　　transition: function(event){
　　　　　　switch(this.currentState) {
　　　　　　　　case "hide":
　　　　　　　　　　this.currentState = 'show';
　　　　　　　　　　doSomething();
　　　　　　　　　　break;
　　　　　　　　case "show":
　　　　　　　　　　this.currentState = 'hide';
　　　　　　　　　　doSomething();
　　　　　　　　　　break;
　　　　　　　　default:
　　　　　　　　　　console.log('Invalid State!');
　　　　　　　　　　break;
　　　　　　}
　　　　}
　　
　　};
```

#### 每一个状态都是一个机器

* 在每一个机器里，我们都可以做计算、存储、输出
* 所有的这些机器接受的输入是一致的
* 状态机的每一个机器本身没有状态，如果我们用函数表示那应该是一个纯函数


#### 每一个机器知道下一个状态

* 每个机器都有确定的下一个状态（Moore）
* 每个机器根据输入决定下一个状态（Mealy）

```javascript
function match(string) {
    let state = start
    for (let char of string) {
        state = state(char)
    }
    return state === end
}

function start(char) {
    if (char === 'a')
        return findA1
    else
        return start
}

function end(char) {
    return end
}

function findA1(char) {
    if (char === 'b')
        return findB1
    else
        return start(char)
}
  
function findB1(char) {
    if (char === 'a')
        return findA2
    else
        return start(char)
}

function findA2(char) {
    if (char === 'b')
        return findB2
    else
        return start(char)
}

function findB2(char) {
    if (char === 'a')
        return findA3
    else
        return start(char)
}

function findA3(char) {
    if (char === 'b')
        return findB3
    else
        return start(char)
}

function findB3(char) {
    if (char === 'x')
        return end
    else
        return findB2(char)
}

console.log(match("foo abbabbx foo2"))
```


## HTML解析实践

### 解包步骤

* 接受HTML文本作为参数，返回一颗DOM树

```javascript

module.exports.parseHTML = function parseHTML(html){
    console.log(html)
}

```

### 第二步： 创建状态机

* 使用FSM实现HTML分析
* 在HTML标签中，已经规定了HTML的状态

```javascript


const EOF = Symbol("EOF") // End of file

function data(char) {

}

module.exports.parseHTML = function parseHTML(html){

  let state = data

  for (let char of html) {
    state = state(c)
  }

  state = state(EOF)
  
}

```

### 第三步： 解析标签

* 主要的标签有：开始标签，结束标签和自封闭标签

```javascript
unction data(char) {
  if (char == "<") {
    return tagOpen
  } else if (char == EOF) {
    return 
  } else {
    return data
  }
}


// 1. 开始标签
// 2. 结束标签
// 3. 自封闭标签
function tagOpen(char) {
  if (char == "/") { // 结束标签
    return endTagOpen
  } else if (char.match(/^[a-zA-Z]$/)) { // 开始标签
    return tagName(char)
  } else {
    return 
  }
}


function endTagOpen(char) {
  if (char.match(/^[a-zA-Z]$/)) {
    return tagName(char)
  } else if (char == ">") {

  } else if(char == EOF) {

  }
}


function tagName(char) {
  if (char.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (char == "/") {
    return selfClosingStartTag
  } else if (char.match(/^[a-zA-Z]$/)) {
    return tagName
  } else if (char == ">") {
    return data
  } else {
    return tagName
  }
}


function beforeAttributeName(char) {
  if (char.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (char == ">") {
    return data
  } else if (char == "=") {
    return beforeAttributeName
  } else {
    return beforeAttributeName
  }
}


function selfClosingStartTag(char) {
  if (char == ">") {
    return data
  } else if (char == "EOF") {

  } else {

  }
}
```

### 第四步： 创建元素

* 在状态机中，除了状态迁移，我们还要加入业务逻辑
* 在标签结束状态提交标签token

```javascript

function selfClosingStartTag(char) {
  if (char == ">" || char == "/") {
    currentToken.isSelfClosing = true
    currentToken.type = "selfClosingTag"
    emit(currentToken)
    return data
  } else if (char == "EOF") {

  } else {

  }
}

```

### 第五步： 处理属性

* 属性值分为单引号、双引号、无引号三种写法，因此需要较多状态处理
* 处理属性的方式和标签类似
* 属性结束时，把属性加到标签token上

```javascript

function doubleQuotedAttributeValue(char) {
  if (char == "\"") {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if (char == "\u0000") {
    // return data
  } else if (char == EOF) {
    // return data
  } else {
    currentAttribute.value += char
    return doubleQuotedAttributeValue
  }
}

function singleQuotedAttributeValue(char) {
  if (char == "\'") {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if (char == "\u0000") {
    // return data
  } else if (char == EOF) {
    // return data
  } else {
    currentAttribute.value += char
    return singleQuotedAttributeValue
  }
}

function afterQuotedAttributeValue(char) {
  if (char.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (char == "/") {
    return selfClosingStartTag
  } else if (char ==">") {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (char == EOF) {
    // return data
  } else {
    // return data
  }
}

function UnquotedAttributeValue(char) {
  if (char.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value
    // emit(currentToken)
    return beforeAttributeName
  } else if (char == "/") {
    currentToken[currentAttribute.name] = currentAttribute.value
    // emit(currentToken)
    return selfClosingStartTag
  } else if (char == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (char == "\u0000") {
    // return data
  } else if (char == "\"" || char == "\'" || char == "<" || char == "=" || char == "`") {
    // return data
  } else if (char == EOF) {
    // return data
  } else {
    currentAttribute.value += char
    return UnquotedAttributeValue
  }
}


```

### 第六步： 构建DOM树

* 从标签构建DOM树的基本技巧是使用栈
* 遇到开始标签时创建元素并入栈，遇到结束标签的时候出栈
* 自封闭标签可以视为入栈后立刻出栈
* 任何元素的父元素是它入栈前的栈顶

```javascript

function emit(token) {

  if (token.type == "text") 
    return

  let top = stack[stack.length - 1]

  if (token.type == "startTag") {
    let element = {
      type: "element",
      children: [],
      attributes: []
    }

    element.tagName = token.tagName

    for (let p in token) {
      if (p != "type" && p != "tagName") {
        element.attributes.push({
          name: p,
          value: token[p]
        })
      }
    }

    top.children.push(element)
    element.parent = top

    if (!token.isSelfClosing)
      stack.push(element)

    console.log('push', element)

  } else if (token.type == "endTag") {
    if (top.tagName != token.tagName) {
      throw new Error("Tag start end doesn't match")
    } else {
      console.log('pop', stack.pop())
      stack.pop()
    }
  }
}

```


### 第七步： 处理文本节点

* 文本节点与自封闭标签处理类似
* 多个文本节点需要合并

```javascript

function emit(token) {

  let top = stack[stack.length - 1]

  if (token.type == "startTag") {
    let element = {
      type: "element",
      children: [],
      attributes: []
    }

    element.tagName = token.tagName

    for (let p in token) {
      if (p != "type" && p != "tagName") {
        element.attributes.push({
          name: p,
          value: token[p]
        })
      }
    }

    top.children.push(element)
    element.parent = top

    if (!token.isSelfClosing)
      stack.push(element)
    
    currentTextNode = null
    // console.log('push', element)
  } else if (token.type == "endTag") {
    if (top.tagName != token.tagName) {
      throw new Error("Tag start end doesn't match")
    } else {
      // console.log('pop', stack.pop())
      stack.pop()
    }
    currentTextNode = null
  } else if (token.type == "text") {
    if (currentTextNode == null) {
      currentTextNode = {
        type: "text",
        content: ""
      }
      top.children.push(currentTextNode)
    }
    currentTextNode.content += token.content
    console.log(top.children)
  }
}

```

### 最终代码展示

```javascript
let currentToken = null
let currentAttribute = null
let currentTextNode = null

let stack = [{type: "document", children: []}]

function emit(token) {

  let top = stack[stack.length - 1]

  if (token.type == "startTag") {
    let element = {
      type: "element",
      children: [],
      attributes: []
    }

    element.tagName = token.tagName

    for (let p in token) {
      if (p != "type" && p != "tagName") {
        element.attributes.push({
          name: p,
          value: token[p]
        })
      }
    }

    top.children.push(element)
    element.parent = top

    if (!token.isSelfClosing)
      stack.push(element)
    
    currentTextNode = null
    // console.log('push', element)
  } else if (token.type == "endTag") {
    if (top.tagName != token.tagName) {
      throw new Error("Tag start end doesn't match")
    } else {
      // console.log('pop', stack.pop())
      stack.pop()
    }
    currentTextNode = null
  } else if (token.type == "text") {
    if (currentTextNode == null) {
      currentTextNode = {
        type: "text",
        content: ""
      }
      top.children.push(currentTextNode)
    }
    currentTextNode.content += token.content
    console.log(top.children)
  }
}

const EOF = Symbol("EOF")

function data(char) {
  if (char == "<") {
    return tagOpen
  } else if (char == EOF) {
    emit({
      type: "EOF"
    })
    return 
  } else {
    emit({
      type: "text",
      content: char
    })
    return data
  }
}

function tagOpen(char) {
  if (char == "/") {
    return endTagOpen
  } else if (char.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "startTag",
      tagName: ""
    }
    return tagName(char)
  } else {
    return data
  }
}


function endTagOpen(char) {
  if (char.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "endTag",
      tagName: ""
    }
    return tagName(char)
  } else if (char == ">") {
    return data
  } else if(char == EOF) {
    return data
  }
}


function tagName(char) {
  if (char.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName(char)
  } else if (char == "/") {
    return selfClosingStartTag
  } else if (char.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += char.toLowerCase()
    return tagName
  } else if (char == ">") {
    emit(currentToken)
    return data
  } else {
    return tagName
  }
}


function beforeAttributeName(char) {
  if (char.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (char == ">" || char == "/" || char == EOF) {
    return afterAttributeName(char)
  } else if (char == "=") {
    return 
  } else {
    currentAttribute = {
      name: "",
      value: ""
    }
    return attributeName(char)
  }
}

function afterAttributeName(char) {
  if (char == "/") {
    return selfClosingStartTag
  } else if (char == EOF) {
    return 
  } else {
    emit(currentToken)
    return data
  }
}

function attributeName(char) {
  if (char.match(/^[\t\n\f ]$/) || char == "/" || char == ">" || char == EOF) { 
    return afterAttributeName(char)
  } else if (char == "=") {
    return beforeAttributeValue
  } else if (char == "\u0000") {
    return data
  } else if (char == "\"" || char == "\'" || char == "<") {
    return attributeName
  } else {
    currentAttribute.name += char
    return attributeName
  }
}

function beforeAttributeValue(char) {
  if (char.match(/^[\t\n\f ]$/) || char == "/" || char == ">" || char == EOF) { 
    return beforeAttributeValue
  } else if (char == "\"") {
    return doubleQuotedAttributeValue
  } else if (char == "\'") {
    return singleQuotedAttributeValue
  } else if (char == ">") {
    emit(currentToken)
    return data
  } else {
    return UnquotedAttributeValue(char)
  }
}

function doubleQuotedAttributeValue(char) {
  if (char == "\"") {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if (char == "\u0000") {
    return data
  } else if (char == EOF) {
    return data
  } else {
    currentAttribute.value += char
    return doubleQuotedAttributeValue
  }
}

function singleQuotedAttributeValue(char) {
  if (char == "\'") {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if (char == "\u0000") {
    return data
  } else if (char == EOF) {
    return data
  } else {
    currentAttribute.value += char
    return singleQuotedAttributeValue
  }
}

function afterQuotedAttributeValue(char) {
  if (char.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (char == "/") {
    return selfClosingStartTag
  } else if (char ==">") {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (char == EOF) {
    return data
  } else {
    return data
  }
}

function UnquotedAttributeValue(char) {
  if (char.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return beforeAttributeName
  } else if (char == "/") {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return selfClosingStartTag
  } else if (char == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (char == "\u0000") {
    return data
  } else if (char == "\"" || char == "\'" || char == "<" || char == "=" || char == "`") {
    return data
  } else if (char == EOF) {
    return data
  } else {
    currentAttribute.value += char
    return UnquotedAttributeValue
  }
}


function selfClosingStartTag(char) {
  if (char == ">" || char == "/") {
    currentToken.isSelfClosing = true
    emit(currentToken)
    return data
  } else if (char == "EOF") {
    return data
  } else {
    return data
  }
}

module.exports.parseHTML = function parseHTML(html){

  let state = data

  for (let char of html) {
    state = state(char)
  }

  state = state(EOF)
  
}
```

## CSS Computing

### 第一步： 收集CSS规则

* 遇到 style 标签时，我们把 CSS 规则保存起来
* 我们调用 CSS Parser 来分析 CSS 规则
* 我们必须要仔细研究此库分析 CSS 规则的格式


### 第二步： 添加调用

* 当我们创建一个元素后，立即计算 CSS
* 理论上，当我们分析一个元素时，所有 CSS 规则已经收集完毕
* 在真实浏览器中，可能遇到写在 body 的 style 标签，需要重新 CSS 计算的情况，这里我们忽略


#### 第三步： 获取父元素序列

* 在 computeCss 函数中，我们必须知道元素的所有父元素才能判断元素与规则是否匹配
* 我们从上一步骤的 stack，可以获取本元素所有的父元素
* 因为我们首先获取的是”当前元素“，所以我们获得和计算父元素匹配的顺序是从内向外


#### 第四步： 拆分选择器

* 选择器也要从当前元素从外排列
* 复杂选择器拆成针对单个元素的选择器，用循环匹配父元素队列


#### 第五步： 计算选择器与元素匹配关系

* 根据选择器的类型和元素属性，计算是否与当前元素匹配
* 这里仅实现了三种基本选择器，实际的浏览器中要处理复合选择器


#### 第六步： 生成Computed属性

* 一旦选择匹配，就应用选择器到元素上，形成 computedStyle


#### 第七步： 确定覆盖关系

* CSS 规则根据 specificity 和后来优先规则覆盖
* specificity 是个四元组，越左边权重越高
* 一个 CSS 规则的 specificity 根据包含的简单选择器相加而成

#### 代码

```javascript

// 收集 CSS 规则
const css = require('css')
let currentToken = null
let currentAttribute = null
let currentTextNode = null

let stack = [{type: "document", children: []}]

// 加入一个新的函数，addCSSRules，这里我们把 CSS 规则暂存到一个数组里
let rules = []
function addCSSRules(text) {
  const ast = css.parse(text)
  rules.push(...ast.stylesheet.rules)
}

function match(element, selector) {
  if (!selector || !element.attributes) 
    return false
  
  if (selector.charAt(0) == "#") {
    const attr = element.attributes.filter(attr => attr.name === "id")[0]
    if (attr && attr.value === selector.replace("#", ''))
      return true
  } else if (selector.charAt(0) == ".") {
    const attr = element.attributes.filter(attr => attr.name === "class")[0]
    if (attr) {
      const attrClassArray = attr.value.split(' ')
      for (let attrClass of attrClassArray) {
        if (attrClass === selector.replace(".", '')) {
          return true
        }
      }
    }
  } else {
    if (element.tagName === selector) {
      return true
    }
  }
  return false
}

function specificity(selector) {
  const p = [0, 0, 0, 0]
  const selectorParts = selector.split(" ")
  for (let part of selectorParts) {
    if (part.charAt(0) == "#") {
      p[1] += 1
    } else if (part.charAt(0) == ".") {
      p[2] += 1
    } else {
      p[3] += 1
    }
  }
  return p
}

function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0]
  }
  if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1]
  }
  if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2]
  }
  return sp1[3] - sp2[3]
}

function computeCSS(element) {
  const elements = stack.slice().reverse()

  if (!element.computedStyle)
    element.computedStyle = {}
  
  for (let rule of rules) {
    const selectorParts = rule.selectors[0].split(" ").reverse()

    if (!match(element, selectorParts[0]))
      continue

    let matched = false

    let j = 1

    for (let i = 0; i < elements.length; i ++) {
      if (match(elements[i], selectorParts[j])) {
        j ++
      }
    }
    if (j >= selectorParts.length) {
      matched = true
    }
    if (matched) {
      const sp = specificity(rule.selectors[0])
      const computedStyle = element.computedStyle
      for (let declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {}
        }
        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value
          computedStyle[declaration.property].specificity = sp
        } else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
          computedStyle[declaration.property].value = declaration.value
          computedStyle[declaration.property].specificity = sp
        }
      }
    }
  }
}

function emit(token) {

  let top = stack[stack.length - 1]

  if (token.type == "startTag") {
    let element = {
      type: "element",
      children: [],
      attributes: []
    }

    element.tagName = token.tagName

    for (let p in token) {
      if (p != "type" && p != "tagName") {
        element.attributes.push({
          name: p,
          value: token[p]
        })
      }
    }

    computeCSS(element)

    top.children.push(element)
    element.parent = top

    if (!token.isSelfClosing)
      stack.push(element)
    
    currentTextNode = null

  } else if (token.type == "endTag") {
    if (top.tagName != token.tagName) {
      throw new Error("Tag start end doesn't match")
    } else {
      /** 遇到 style 标签时，执行添加 CCS 规则的操作 */
      if (top.tagName === "style") {
        addCSSRules(top.children[0].content)
      }
      stack.pop()
    }
    currentTextNode = null
  } else if (token.type == "text") {
    if (currentTextNode == null) {
      currentTextNode = {
        type: "text",
        content: ""
      }
      top.children.push(currentTextNode)
    }
    currentTextNode.content += token.content
    // console.log(top.children)
  }
}

const EOF = Symbol("EOF")

function data(char) {
  if (char == "<") {
    return tagOpen
  } else if (char == EOF) {
    emit({
      type: "EOF"
    })
    return 
  } else {
    emit({
      type: "text",
      content: char
    })
    return data
  }
}

function tagOpen(char) {
  if (char == "/") { // 结束标签
    return endTagOpen
  } else if (char.match(/^[a-zA-Z]$/)) { // 开始标签
    currentToken = {
      type: "startTag",
      tagName: ""
    }
    return tagName(char)
  } else {
    return data
  }
}


function endTagOpen(char) {
  if (char.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "endTag",
      tagName: ""
    }
    return tagName(char)
  } else if (char == ">") {
    return data
  } else if(char == EOF) {
    return data
  }
}


function tagName(char) {
  if (char.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName(char)
  } else if (char == "/") {
    return selfClosingStartTag
  } else if (char.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += char.toLowerCase()
    return tagName
  } else if (char == ">") {
    emit(currentToken)
    return data
  } else {
    return tagName
  }
}


function beforeAttributeName(char) {
  if (char.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (char == ">" || char == "/" || char == EOF) {
    return afterAttributeName(char)
  } else if (char == "=") {
    return 
  } else {
    currentAttribute = {
      name: "",
      value: ""
    }
    return attributeName(char)
  }
}

function afterAttributeName(char) {
  if (char == "/") {
    return selfClosingStartTag
  } else if (char.match(/^[\t\n\f ]$/)) {
    return afterAttributeName
  } else if (char == "=") {
    return beforeAttributeValue
  } else if (char == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (char == EOF) {
    return 
  } else {
    currentToken[currentAttribute.name] = currentAttribute.value
    currentAttribute = {
      name: "",
      value: ""
    }
    return attributeName(char)
  }
}

function attributeName(char) {
  if (char.match(/^[\t\n\f ]$/) || char == "/" || char == ">" || char == EOF) { 
    return afterAttributeName(char)
  } else if (char == "=") {
    return beforeAttributeValue
  } else if (char == "\u0000") {
    return data
  } else if (char == "\"" || char == "\'" || char == "<") {
    return attributeName
  } else {
    currentAttribute.name += char
    return attributeName
  }
}

function beforeAttributeValue(char) {
  if (char.match(/^[\t\n\f ]$/) || char == "/" || char == ">" || char == EOF) { 
    return beforeAttributeValue
  } else if (char == "\"") {
    return doubleQuotedAttributeValue
  } else if (char == "\'") {
    return singleQuotedAttributeValue
  } else if (char == ">") {
    emit(currentToken)
    return data
  } else {
    return UnquotedAttributeValue(char)
  }
}

function doubleQuotedAttributeValue(char) {
  if (char == "\"") {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if (char == "\u0000") {
    return data
  } else if (char == EOF) {
    return data
  } else {
    currentAttribute.value += char
    return doubleQuotedAttributeValue
  }
}

function singleQuotedAttributeValue(char) {
  if (char == "\'") {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if (char == "\u0000") {
    return data
  } else if (char == EOF) {
    return data
  } else {
    currentAttribute.value += char
    return singleQuotedAttributeValue
  }
}

function afterQuotedAttributeValue(char) {
  if (char.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (char == "/") {
    return selfClosingStartTag
  } else if (char ==">") {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (char == EOF) {
    return data
  } else {
    return data
  }
}

function UnquotedAttributeValue(char) {
  if (char.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return beforeAttributeName
  } else if (char == "/") {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return selfClosingStartTag
  } else if (char == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (char == "\u0000") {
    return data
  } else if (char == "\"" || char == "\'" || char == "<" || char == "=" || char == "`") {
    return data
  } else if (char == EOF) {
    return data
  } else {
    currentAttribute.value += char
    return UnquotedAttributeValue
  }
}


function selfClosingStartTag(char) {
  if (char == ">" || char == "/") {
    currentToken.isSelfClosing = true
    emit(currentToken)
    return data
  } else if (char == "EOF") {
    return data
  } else {
    return data
  }
}

module.exports.parseHTML = function parseHTML(html){

  let state = data

  for (let char of html) {
    state = state(char)
  }

  state = state(EOF)

  return rules
}

```


