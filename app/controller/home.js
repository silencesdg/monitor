'use strict';
const axios = require("axios");
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }


  async addlog() {
   
    let log = this.ctx.request.body;
    if (log.userId == "未知") {
	log.userId = 0;     
    }    
    log.time = new Date();
    await this.service.log.addLog(log);
    let ip = this.ctx.request.ip;

    axios({
     method: "post",
     url:"https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=df3b42e9-5df4-40bf-9582-4f6fbc37324f",
     data: {
       msgtype: "markdown",
       markdown: {
         content: `新增错误信息\n> 时间：<font color="comment">${log.time.toLocaleString()}</font>\n> 用户：<font color="comment">${log.userName}</font>\n> ip：<font color="comment">${this.ctx.request.ip}</font>\n> 错误信息：<font color="comment">${log.error.replace(/\\/ig,'')}</font>`,
       },
     },
     headers: { "Content-Type": "application/json" },
    });
    this.ctx.body = 'ok';
  }
}

module.exports = HomeController;
