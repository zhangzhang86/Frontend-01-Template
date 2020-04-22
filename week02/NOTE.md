# 第二周总结 编程语言通识基础 & 重讲JavaScript

* 本周主要简单讲述编程语言的基础，解析语义语法，BNF等基础，并且开始精讲JavaScrpit，编程字符编码集包括acsii、unicode的范围。

# 编程语言通识

## 语言按语法分类

### 非形式语言

#### 非严格定义，自然语言的演化方式

	* 中文
	* 英文

### 形式语言 乔姆斯基谱系

#### 0型 无限制文法

	* ?::=? 

#### 1型 上下文相关文法

	* ?<A>?::=?<B>?

#### 2型 上下文无关文法

	* <A>::=?

#### 3型 正则文法

	* <A>::=<A>?

#### 用途

	- 数据描述语言

		* JSON
		* HTML
		* XAML
		* SQL
		* CSS

	- 编程语言

		* C
		* C++
		* Java
		* C#
		* Python
		* Ruby
		* Perl
		* Lisp
		* T-SQL
		* Clojure
		* Haskell
		* JavaScript

- 表达方式

	- 声明式语言

		* JSON
		* HTML
		* XAML
		* SQL
		* CSS
		* Lisp
		* Clojure
		* Haskell

	- 命令型语言

		* C
		* C++
		* Java
		* C#
		* Python
		* Ruby
		* Perl
		* JavaScript

### 现代语言的特例

- C++中，*可能表示乘号或者指针，具体是哪个，取决于星号前面的标识符是否被声明为类型

	- 非形式语言（语法和语义相关了）

- VB中，<可能是小于号，也可能是XML直接量的开始，取决于当前位置是否可以接受XML直接量

	- 1型文法

- Python中，行首的tab符合空格会根据上一行的行首空白以一定规则被处理成虚拟终结符indent或者dedent

	- 非形式语言

- JavaScript中，/ 可能是除号，也可能是正则表达式开头，处理方式类似于VB，字符串模板中也需要特殊处理 }，还有自动插入分号规则

	- 1型文法

## 形式语言产生式

### BNF语法格式

- 语法结构

	- 基础结构称终结符

		- 引号和中间的字符表示终结符

	- 复合结构称非终结符

		- 用尖括号括起来的名称来表示非终结符

	- 符号

		- 可以有括()
		- *表示重复多次
		- |表示或
		- +表示至少一次

- 符号

	- () 可以有括号
	- * 表示重复多次
	- | 表示或
	- + 表示至少一次

### EBNF

### ABNF

## 图灵完备性

### 定义：跟图灵机等效

- 图灵机感性描述：凡是可计算的东西都能计算出来

### 实现方式

- 命令式 - 图灵机

	- 用 goto 实现
	- 用 if 和 while 实现

- 声明式 - lambda

	- 用递归实现

## 动态与静态

### 动态

- 在用户的设备/在线服务器上运行
- 产品实际运行时
- Runtime

### 静态

- 在程序员的设备上
- 产品开发时
- Compiletime

## 类型系统

### 按动静划分

- 动态类型系统
- 静态类型系统

	- 复合类型

		- 结构体

			- 对象：键值对

		- 函数签名

			- 参数的数量不对，参数的类型不对，类型所处的位置不对都会产生签名类型的不匹配

				- 由参数列表和返回值组成-二元组：（T1,T2）=>T3

### 按是否隐式转换划分

- 无隐式转换

	- 强类型

- 有隐式转换

	- 弱类型

### 加入继承后

- 逆变

	- 凡是能用Function<Child>的地方，都能用Function<Parent>

- 协变

	- 凡是能用Array<Parent>的地方，都能用Array<Child>

## 一般命令式编程语言

### Atom

- Identifier
- Literal

### Expression

- Atom
- Operator
- Punctuator

### Statement

- Expression
- Keyword
- Punctuator

### Structure

- Function
- Class
- Process
- Namespace

### Program

- Program
- Module
- Package
- Library

## JavaScript语言通识

### 语法
* 描述程序看起来是什么样的

### 语义
* 描述程序的含义

### 运行时

# JavaScript精讲

## Unicode

### 字符集参考

- https://www.fileformat.info/info/unicode/

### Blocks

- 0~U+007F

	- 常用拉丁字符

		- String.fromCharCode(num)

- U+4E00 ~ U+9FFF

	- CJK ChineseJapaneseKorean三合一

		- 有一些增补区域（extension）

- U+0000 - U+FFFF

	- BMP 范围

### Categories

- https://www.fileformat.info/info/unicode/category/index.htm

## InputElement

### WhiteSpace

- <TAB>
- <VT> 纵向制表符
- <FF> Form Feed
- <SP> 推荐开发时使用
- <NBSP> /u00A0

	- 无分词效果：处理排版时，如果是普通的SP，会在一行放不下时，将它左右断开;<NBSP>它的左右不会断开

- <ZWNBSP> 零宽空格
- <USP>

### LineTerminator

- <LF> Line Feed \n 推荐开发时使用
- <CR>  Carriage Return  \r
- <LS>
- <PS>

### Comment

- //
- /* */

### Token

- 一切有效的东西

	- Punctuator 符号

		- >
		- =
		- <
		- }
		- ......

	- IdentifierName

		- Identifier 标识符

			- 可以以字母、_ 或者 $ 开头，代码中用来标识变量、函数、或属性的字符序列

				- 变量名
				- 属性名

		- Keywords 关键字

			- await
			- break
			- return
			- 特例（全局不可更改变量名）

				- get
				- undefined

		- Future reserved Keywords

			- enum

	- Literal 直接量

		- Number

			- IEEE 754 Double Float
			- 最佳实践

				- 浮点数比较时，需要加精度

					- Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON

				- Number.MAX_SAFE_INTEGER

			- grammar

				- DecimalLiteral

					- 0
					- 0.
					- .2
					- 1e3

				- BinaryIntegerLiteral

					- 0b111

				- OctallIntegerLiteral

					- Oo10

				- HexIntegerLiteral

					- OxFF

		- String

			- Character 字符

				- ASCII
				- Unicode
				- UCS

					- BMP范围

						- U+0000 ~ U+FFFF

				- GB

					- GB2312
					- GBK(GB13000)
					- GB18030

				- ISO-8859
				- BIG5

			- Code point 码点
			- Encoding

				- UTF

					- UTF-8
					- UTF-16 实际内存中是这种方式的

			- grammar

				- "abc"
				- 'abc'
				- `abc`

		- Boolean

			- true
			- false

		- Null
		- Undefined




