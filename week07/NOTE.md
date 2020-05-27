# Week07 总结

## 浏览器工作原理 layout排版

### 浏览器排版三代技术  

+ 正常流Normal Flow
  - display block/inline-block/inline  
  - position absolute/relative  
  - float, clear
+ flex 最简单实现的
  > https://developer.mozilla.org/en-US/docs/Glossary/Flex  
  > + flex-direction
  > + flex-wrap
  > + justify-content
  > + align-content

+ grid  
  > https://developer.mozilla.org/en-US/docs/Glossary/Grid  

#### step1 确定主轴/交叉轴


flex-direction: row  
Main: width/x/left/right  
Cross: height/y/top/bottom


flex-direction: column     
Main: height/y/top/bottom  
Cross: width/x/left/right  

#### step2 收集元素进行
+ 分行，跟mainSize属性有关
    + 根据主轴尺寸，把元素分进行  
    + 若设置了no-wrap，则强行分配进第一行

 

#### step3 计算主轴
在flex布局里，可以先算所有元素的主轴方向的尺寸和位置，然后再计算交叉轴方向的位置和尺寸。

 
 计算主轴方向
+ 找出所有Flex元素  
+ 把主轴方向的剩余尺寸按比例分配给这些元素  
+ 若剩余空间为负数，所有Flex元素为0，等比压缩剩余元素

#### Step4 计算交叉轴


计算交叉轴方向
+ 根据每一行flexLine中最大元素尺寸计算行高
+ 根据行高flex-align和item-align，确定元素具体位置

## 浏览器工作原理 绘制
render  
composing  
draw（代码完成）  

绘制需要依赖一个图形环境，这里采用npm包images：  
npmjs.com/package/images

### Step 1 绘制单个元素
+ 绘制在一个viewport上进行
+ 与绘制相关属性
    + background-color
    + border
    + background-image

### Step2 绘制DOM 



## flex布局主轴相关的属性总结

- mainSize 表示元素在主轴的尺寸 在flexDriection为row时为width column时为height

- mainBase 排布元素的起点 可以理解为origin 正向排布时为0 反向排布时对应元素的宽或高

- mainSign 向量的标志符 标识的是元素的排布方向是正向还是反向

- mainStart 元素排布的起始方向

- mainEnd 元素排布的结束方向

## 分行

- 根据元素的主轴尺寸吧元素进行分行

- 如果设置了nowrap 就只有一行 把所有元素都分配进第一行

- 一个flexline在交叉轴的尺寸取决于这个flexline中在交叉轴尺寸最大的一个子元素

## 计算主轴

### 计算主轴方向

  - 找出所有flex元素
  - 把主轴方向剩余尺寸按比例分配给这些元素
  - 若剩余空间为负数 所有flex元素为0 等比压缩剩余元素

## 计算交叉轴

### 计算交叉轴方向
  - 根据每一个flexline中的最大尺寸计算交叉轴尺寸
  - 根据交叉轴尺寸和align-items和align-self计算位置

##	CSS语法

CSS2.1的语法  
https://www.w3.org/TR/CSS21/grammar.html#q25.0    
Appendix G.Grammar of CSS 2.1  

https://www.w3.org/TR/css-syntax-3  

### CSS总体

CSS语法总体来说分为普通rule和带@的rule，普通rule时平时90%时间使用的，@rule处理一些特殊场景使用。

+ @charset
    + 可理解是过时的属性
    + 写CSS一般写成ASCII兼容，不用超过127的字符，超过127的字符用转义处理 
+ @import
+ rules
    + @media
    + @page（可在做浏览器打印时用）
    + __rule__

> CDO： \<!--  
> CDC： -->

### 二、@规则的研究  

https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule

+ @charset：https://www.w3.org/TR/css-syntax-3/
+ @import：https://www.w3.org/TR/css-cascade-4/
+ @media：https://www.w3.org/TR/css3-conditional/
  > @media和@support来自同一份规范，做mediaquary用
+ @page：https://www.w3.org/TR/css-page-3/
+ @counter-style：https://www.w3.org/TR/css-counter-style-3/
+ @keyframes：https://www.w3.org/TR/css-animations-1/
+ @font-face：https://www.w3.org/TR/css-fonts-3/
+ @supports：https://www.w3.org/TR/css3-conditional/  
  > 检查CSS feature用，但本身兼容性存疑 
+ @namespace：https://www.w3.org/TR/css-namespaces-3/
  

### 三、CSS普通规则的结构 

+ Selector
    +  https://www.w3.org/TR/selectors-3/ 10.1Grammar
    +  https://www.w3.org/TR/selectors-4/ （一般不参考）
       > compound-selector-list 复合选择器是标准4里的说法
    ```
    简单选择器：
      #id
      .cls
      :visited
      ::first-letter
      :not(.cls)
    最复杂的选择器混起来用：
    #id.cls.cls2:visited::first-letter:not(.cls)
    
    simple_selector_sequence：
    div#id.cls.cls2:visited::first-letter:not(.cls)

    combinator: 空格 > + ~  
    html div>div#id.cls.cls2:visited::first-letter:not(.cls)
    ```
+ Key
    + Properties
    + Variables：https://www.w3.org/TR/css-variables/ 兼容性较差
+ Value
    +  https://www.w3.org/TR/css-values-4/


## CSS结构一览

#### At-Rules

##### @charset 

##### @import

##### @media

##### @page

##### @namespace

##### @supports 

##### @document

##### @font-face

##### @keyframes

##### @viewport

##### @counter-style

#### rule

##### Selector

- selectors_group
- combinator

	- +
	- >
	- ~

- simple_selector

	- type
	- *
	- #
	- .
	- []
	- :
	- ::
	- :not

##### Declaration

- Key

	- Property
	- Variable

- Value