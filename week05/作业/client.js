const net = require('net')

class Request {
    // method url = host + port + path
    // body = k/v
    // headers
    constructor(options) {
        this.method = options.method || 'GET'
        this.host = options.host;
        this.port = options.host || 80
        this.path = options.path || '/'
        this.body = options.body || {}
        this.headers = options.headers || {}
        if (!this.headers["Content-Type"]) {
            this.headers["Content-Type"] = 'application/x-www-form-urlencoded'
        }

        if (this.headers["Content-Type"] === 'application/json') {
            this.bodyText = JSON.stringify(this.body)
        } else if (this.headers["Content-Type"] === 'application/x-www-form-urlencoded') {
            this.bodyText = Object.keys(this.body).map(key => {
                return `${key}=${encodeURIComponent(this.body[key])}`
            }).join('&')
        }
        this.headers['Content-Length'] = this.bodyText.length
    }
    toString() {
        return [
            `${this.method} ${this.path} HTTP/1.1`,
            `${Object.entries(this.headers).map(([k, v]) => `${k}: ${v}`).join('\r\n')}`,
            '',
            `${this.bodyText}`
          ].join('\r\n');
    }
    open() {

    }
    send() { }
}

class Response {

}

let client = net.createConnection({ port: 8888, host: '127.0.0.1' }, () => {
    let request = new Request({
        method: 'GET',
        host: '127.0.0.1',
        port: '8888',
        path: '/',
        body: {
            name: 'ha'
        }
    })
    console.log(request.toString())
    client.write(request.toString())
})
client.on('data', (data) => {
    console.log(data.toString())
    client.end()
})

client.on('end', function () {
    console.log('disconnected from server')
})