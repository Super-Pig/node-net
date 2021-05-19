const net = require('net')
const MyTransform = require('./myTransform')

const server = net.createServer()

const port = 1234
const host = 'localhost'
const ts = new MyTransform()
let overageBuffer = null

server.listen(port, host)

server.on('listening', () => {
  console.log(`server is running on ${host}:${port}`)
})

server.on('connection', socket => {
  socket.on('data', chunk => {
    if (overageBuffer) {
      chunk = Buffer.concat([overageBuffer, chunk])
    }

    let packageLen = 0

    while (packageLen = ts.getPackageLen(chunk)) {
      const packageContent = chunk.slice(0, packageLen)
      chunk = chunk.slice(packageLen)

      const ret = ts.decode(packageContent)

      console.log(ret)

      socket.write(ts.encode(`hello ${ret.body}`, ret.serialNum))
    }

    overageBuffer = chunk
  })
})

server.on('close', () => {
  console.log('服务端关闭了')
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('地址正在被使用')
  } else {
    console.log(err)
  }
})