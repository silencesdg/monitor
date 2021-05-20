"use strict";
const Controller = require("egg").Controller;

class BusController extends Controller {
  async index() {
    const { ctx } = this;

    ctx.body = "ok";
  }

  getNext() {
    let {lineID, roLine,station,duration} = this.ctx.request.query;
    return this.ctx.service.bus.getNextBusTime(new Date(),station,lineID, roLine,duration)
  }

}

module.exports = BusController;
