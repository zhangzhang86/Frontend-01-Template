# Week04 总结

## 重学 JavaScript | 结构化

#### 基础部分 - 进程、线程

- 进程是系统分配的独立资源，是 CPU 资源分配的基本单位，进程是由一个或者多个线程组成的。

- 线程是进程的执行流，是CPU调度和分派的基本单位，同个进程之中的多个线程之间是共享该进程的资源的。

##### 浏览器内核

- 浏览器是多进程的，浏览器每一个 tab 标签都代表一个独立的进程（也不一定，因为多个空白 tab 标签会合并成一个进程），浏览器内核（浏览器渲染进程）属于浏览器多进程中的一种。

* 浏览器内核有多种线程在工作。

##### GUI 渲染线程:

* 负责渲染页面，解析 HTML，CSS 构成 DOM 树等，当页面重绘或者由于某种操作引起回流都会调起该线程。
* 和 JS 引擎线程是互斥的，当 JS 引擎线程在工作的时候，GUI 渲染线程会被挂起，GUI 更新被放入在 JS 任务队列中，等待 JS 引擎线程空闲的时候继续执行。

##### JS 引擎线程:

* 单线程工作，负责解析运行 JavaScript 脚本。
* 和 GUI 渲染线程互斥，JS 运行耗时过长就会导致页面阻塞。

##### 事件触发线程:

* 当事件符合触发条件被触发时，该线程会把对应的事件回调函数添加到任务队列的队尾，等待 JS 引擎处理。

##### 定时器触发线程:

* 浏览器定时计数器并不是由 JS 引擎计数的，阻塞会导致计时不准确。
开启定时器触发线程来计时并触发计时，计时完成后会被添加到任务队列中，等待 JS 引擎处理。

##### http 请求线程:

* http 请求的时候会开启一条请求线程。请求完成有结果了之后，将请求的回调函数添加到任务队列中，等待 JS 引擎处理。

#### JavaScript 事件循环机制

* JavaScript 事件循环机制分为浏览器和 Node 事件循环机制，两者的实现技术不一样，浏览器 Event Loop 是 HTML 中定义的规范，Node Event Loop 是由 libuv 库实现。这里主要讲的是浏览器部分。

* Javascript 有一个 main thread 主线程和 call-stack 调用栈(执行栈)，所有的任务都会被放到调用栈等待主线程执行。

##### JS 调用栈

* JS 调用栈是一种后进先出的数据结构。当函数被调用时，会被添加到栈中的顶部，执行完成之后就从栈顶部移出该函数，直到栈内被清空。

#### 同步任务、异步任务

* JavaScript 单线程中的任务分为同步任务和异步任务。同步任务会在调用栈中按照顺序排队等待主线程执行，异步任务则会在异步有了结果后将注册的回调函数添加到任务队列(消息队列)中等待主线程空闲的时候，也就是栈内被清空的时候，被读取到栈中等待主线程执行。任务队列是先进先出的数据结构。

#### 事件循环

* 事件循环是浏览器执行任务的机制，它会不断循环判断消息队列中是否有任务，队列中的任务都是指宏任务，而宏任务中包含微任务队列，在宏任务结束前后执行微任务队列，知道微任务队列中为空才结束这个宏任务。
* 事件循环不属于JavaScript引擎实现的东西，而是由浏览器或node js宿主环境实现的。

### 定时器

* 定时器会开启一条定时器触发线程来触发计时，定时器会在等待了指定的时间后将事件放入到任务队列中等待读取到主线程执行。

* 定时器指定的延时毫秒数其实并不准确，因为定时器只是在到了指定的时间时将事件放入到任务队列中，必须要等到同步的任务和现有的任务队列中的事件全部执行完成之后，才会去读取定时器的事件到主线程执行，中间可能会存在耗时比较久的任务，那么就不可能保证在指定的时间执行。

#### 宏任务与微任务

- 宏任务是消息队列中的一个task，它可能是由用户交互、资源加载、script、web api（setTimeout, setInterval, setImmediate等）等所产生的

- setTimeout会产生宏任务
- 微任务是宏任务中的一个子任务组，在宏任务结束前执行，为什么会有微任务的出现？因为在消息队列中无法根据优先级来执行任务，导致实时性较高的任务无法立即执行，像监听DOM元素的MutationObserve等，Promise.resolve 和 Promise.reject 都会产生一个微任务。微任务中也有可能产生一个微任务，当所以微任务执行完成才会结束当前的宏任务。
- 列表里的所有微任务执行完才会执行下一个宏任务
- Promise的then方法以及async函数里的await会将一个微任务入队，微任务列表里的微任务按入队顺序执行

#### 代码示例

```javascript

async function afoo(){
    console.log("1");
    await new Promise(resolve => resolve());
    console.log("2");
}

new Promise(resolve => (console.log("3"), resolve()))
    .then(()=>(
        console.log("4"), 
        new Promise(resolve => resolve())
            .then(() => console.log("5")) ));

setTimeout(function(){
    console.log("6");
    new Promise(resolve => resolve()) .then(console.log("7"));
}, 0);

console.log("8");
console.log("9");
afoo();

```

## 延伸总结 iOS系统的RunLoop机制 - 用于横向对比JS的事件循环，简单总结不作深度延伸

### Runloop是什么

* Runloop顾名思义就是跑(run)圈(loop)，放在代码里就是循环。

* 这个循环存在的意义是什么呢？如果没有循环，一个线程在执行完一个任务后就会退出。而循环能够让我们保证线程不退出，有随时响应和处理事件的能力。这种模型被称作Event Loop，由事件驱动。

```objective-C
function loop() {
    initialize();
    do {
    //等待消息
        var message = get_next_message();
    //处理消息
        process_message(message);
    } while (message != quit);
}
```

* 起到的作用

- 等待事件发生：使程序一直运行接受用户输入

- 计划事件：决定程序在何时应该处理哪些Event

- 调用解耦：事件产生方不需要等待事件处理结束再产生下一个事件

- 节省CPU时间：等待事件发生时不需要耗费CPU

### Runloop的组成结构

* Runloop中可以存在多个mode，mode是一种运行场景。

* Runloop一次只能在一种mode下运行，切换mode必须停止后重新开始运行。

* 默认Runloop至少带有

- Default mode（默认模式，大部分操作均在此模式）

- Event tracking mode（追踪用户拖动或者其他交互时使用）

- Common modes（是一个模式集合，runloop会把加入commonItems的事件同步到common modes中的所有mode，默认集合中已有default mode和event tracking mode）

* 可以自己为runloop添加自定义mode。每个mode封装了自己需要响应的事件和需要通知的observer。这些事件的形式有两种：timer和input source。另外可以在mode中注册observer来观察runloop的运行状态。

- timer：给线程发送同步事件，但是是在未来指定时间发送或者周期性的响应事件。

- source：给线程发送异步事件，分为两种，source0和source1。source0需要手动在另一个线程手动触发（通过调用 void CFRunLoopSourceSignal ( CFRunLoopSourceRef source ); ），CFSocket就是这种形式；source1是基于mach port的事件，程序只要把message塞给port，底层就会触发runloop中对应source1。目前CFMachPort和CFMessagePort是这种形式。以上描述来自CFRunloopSource Reference

- observer：可以观察六种runloop的运行状态：

```objective-C

 typedef CF_OPTIONS(CFOptionFlags, CFRunLoopActivity) {
     kCFRunLoopEntry = (1UL << 0),//进入runloop
     kCFRunLoopBeforeTimers = (1UL << 1),//准备处理timer
     kCFRunLoopBeforeSources = (1UL << 2),//准备处理source
     kCFRunLoopBeforeWaiting = (1UL << 5),//准备休眠
     kCFRunLoopAfterWaiting = (1UL << 6),//休眠结束，处理事件之前
     kCFRunLoopExit = (1UL << 7),//runloop退出
     kCFRunLoopAllActivities = 0x0FFFFFFFU//所有状态
};

```


