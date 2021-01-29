"use strict";
const axios = require("axios");
const Controller = require("egg").Controller;
const stackParse = require("../../utils/stackParse");
const path = require("path");
const fs = require("fs");

let count = 0;
class HomeController extends Controller {
  async index() {
    const { ctx } = this;

    ctx.body = "ok";
  }

  async addlog() {
    let log = this.ctx.request.body;
    if (log.userId == "未知") {
      log.userId = 0;
    }
    log.time = new Date();
    await this.service.log.addLog(log);
    let ip = this.ctx.request.ip;
    let result = log.error;
    let parser = new stackParse();
    let stackFrame = parser.parseStackTrack(
      log.error,
      log.error.split("\n")[0]
    );

    await parser
      .getOriginalErrorStack(stackFrame)
      .then((res) => {
        if (res.length > 0) {
          result = "";
          res.map((r) => {
            result += `${r.name} ${r.source}:${r.line}:${r.column}\n`;
          });
        }
      })
      .catch((err) => {});

    axios({
      method: "post",
      url:
        "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=df3b42e9-5df4-40bf-9582-4f6fbc37324f",
      data: {
        msgtype: "markdown",
        markdown: {
          content: `新增错误信息\n> 时间：<font color="comment">${log.time.toLocaleString()}</font>\n> 用户：<font color="comment">${
            log.userName
          }</font>\n> ip：<font color="comment">${ip}</font>\n> 错误信息：<font color="comment">${
            log.error
          }</font>\n> 解析信息: <font color="comment">${result}</font>`,
        },
      },
      headers: { "Content-Type": "application/json" },
    });
    this.ctx.body = "ok";
  }

  async writeImolaWxappLog() {
    count = count+1;
    let info = {
      header:{
        ...this.ctx.request.header,
        host:'wxa.imolacn.com'
      },
      query:this.ctx.query,
      time:Date.now()
    }
    let jsonLogPath = path.join(__dirname, `../../logs/wxapp/${++count}-imolaLog.json`);
    console.log(jsonLogPath);
    fs.writeFile(jsonLogPath,JSON.stringify(info),err=> {
      if (err) {
        return console.log("写入失败:",err.message)
      }
      console.log(jsonLogPath,'写入成功');
    })
    this.ctx.body = {
      statusCode:200
    }
  }

  async writeZCWxappLog() {
    let info = {
      header:{
        ...this.ctx.request.header,
        host:'api.zc0901.com'
      },
      query:this.ctx.query,
      time:Date.now()
    }
    let jsonLogPath = path.join(__dirname, `../../logs/wxapp/${count++}-zcLog.json`);
    console.log(jsonLogPath);
    fs.writeFile(jsonLogPath,JSON.stringify(info),err=> {
      if (err) {
        return console.log("写入失败:",err.message)
      }
      console.log(jsonLogPath,'写入成功');
    })
    this.ctx.body = {
      statusCode:200
    }
  }
}

module.exports = HomeController;
