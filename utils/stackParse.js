const ErrorStackParser = require("error-stack-parser");
const { SourceMapConsumer } = require("source-map");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
class StackPaser {
  constructor() {
    this.consumers = {};
  }

  async getOriginalErrorStack(stackFrame) {
    const origin = [];
    for (let v of stackFrame) {
      origin.push(await this.getOriginPosition(v));
    }
    // 销毁所有consumers
    Object.keys(this.consumers).forEach((key) => {
      this.consumers[key].destroy && this.consumers[key].destroy();
      delete this.consumers[key]
    });
    return origin;
  }

  async getOriginPosition(stackFrame) {
    let { columnNumber, lineNumber, fileName } = stackFrame;
    let consumer = this.consumers[fileName];
    if (consumer === undefined) {
      let sourceMap = await axios({
        url: fileName + ".map",
        method: "get"
      });
      consumer = await new SourceMapConsumer(JSON.stringify(sourceMap.data), null);
      this.consumers[fileName] = consumer;
    }
    const parseData = consumer.originalPositionFor({
      line: lineNumber,
      column: columnNumber,
    });
    return parseData;
  }

  /*** 错误堆栈反序列化 * @param {*} stack 错误堆栈 */
  parseStackTrack(stack, message) {
    const error = new Error(message);
    error.stack = stack;
    const stackFrame = ErrorStackParser.parse(error);
    return stackFrame;
  }
}

module.exports = StackPaser;
