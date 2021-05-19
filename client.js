const net = require('net')
const MyTransform = require('./myTransform')

const ts = new MyTransform()
let overageBuffer = null

const client = net.createConnection({
  host: 'localhost',
  port: 1234
})

client.on('connect', () => {
  client.write(ts.encode('拉勾教育1'))
  client.write(ts.encode('拉勾教育2'))
  client.write(ts.encode('拉勾教育3'))
  client.write(ts.encode('拉勾教育4'))
})

client.on('data', chunk => {
  if (overageBuffer) {
    chunk = Buffer.concat([overageBuffer, chunk])
  } 
  
  let packageLen = 0

  while(packageLen = ts.getPackageLen(chunk)){
    const packageContent = chunk.slice(0, packageLen)
    chunk = chunk.slice(packageLen)

    const ret = ts.decode(packageContent)

    console.log(ret)

    overageBuffer = chunk
  }
})

client.on('close', () => {
  console.log('客户端断开连接')
})