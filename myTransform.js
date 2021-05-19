/**
 * 数据传输过程
 * 
 * 进行数据编码，获取二进制数据包
 * 按规则拆解数据，获取指定长度的数据
 */
class MyTransformCode {
  constructor() {
    // 数据包 header 长度，4字节
    this.packageHeaderLen = 4

    // 数据包编号
    this.serialNum = 0

    // 数据包编号长度，2字节
    this.serialLen = 2
  }

  // 编码
  encode(data, serialNum) {
    const body = Buffer.from(data)

    // 先按照指定的长度来申请一片内存空间做为 header 来使用
    const headerBuf = Buffer.alloc(this.packageHeaderLen)

    headerBuf.writeInt16BE(serialNum || this.serialNum)
    headerBuf.writeInt16BE(body.length, this.serialLen)

    if (serialNum === undefined) {
      this.serialNum++
    }

    return Buffer.concat([headerBuf, body])
  }

  // 解码
  decode(buffer) {
    const headerBuf = buffer.slice(0, this.packageHeaderLen)
    const bodyBuf = buffer.slice(this.packageHeaderLen)

    return {
      serialNum: headerBuf.readInt16BE(),
      bodyLength: headerBuf.readInt16BE(this.serialLen),
      body: bodyBuf.toString()
    }
  }

  // 获取包长度的方法
  getPackageLen(buffer) {
    if (buffer.length < this.packageHeaderLen) {
      return 0
    } else {
      return this.packageHeaderLen + buffer.readInt16BE(this.serialLen)
    }
  }
}

module.exports = MyTransformCode