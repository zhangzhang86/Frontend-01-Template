const http = require('http')
const parser = require("./parse.js")
 
// 用于请求的选项
const options = {
   host: 'localhost',
   port: '9901',
   path: '/'  
}
console.log('client ....')
// 处理响应的回调函数
const callback = function(response){
   // 不断更新数据
   let body = ''
   response.on('data', function(data) {
     // console.log('on ---> data' + data);
     body += data
   })
   
   response.on('end', function() {
      // 数据接收完成
      console.log('end ---> body' + body);
      let dom = parser.parseHTML(body)
      console.log('dom', JSON.stringify(dom, null, "    "))
   });
}
// 向服务端发送请求
console.log('send req')
const req = http.request(options, callback)
req.end()