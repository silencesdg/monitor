'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }


  async addlog() {
    let log = this.ctx.request.body;
    log.time = new Date();
    await this.service.log.addLog(log);

    this.ctx.body = "ok"
  }
}

module.exports = HomeController;
