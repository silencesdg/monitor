const Service = require("egg").Service;
const util = require("../../utils/index");
class BusService extends Service {
  async addBusLog(log) {
    if (!log || !log.time) {
      return;
    }
    let times = log.time.split(":");
    let h = Number(times[0]),
      m = Number(times[1]),
      s = Number(times[2]);
    if (!h || !m || !s) {
      return;
    }
    let timeDate = util.timeToTimeDate(log.time);
    let res = await this.ctx.model.Bus.findOne({
      time: timeDate,
    });
    if (!res || !res.time) {
      const logModel = new this.ctx.model.Bus({
        ...log,
        time: timeDate,
        stamp: h * 3600 + m * 60 + s,
      });
      logModel.save();
    }
  }

  //   20分钟内下一班车的历史时间记录
  async getNextBusTime(fromTime = new Date(), station, lineID, roLine, miniteDuration = 20) {
    if (!lineID || !roLine) {
      return {
        ok: false,
        message: "缺少线路参数",
      };
    }
    if (!station) {
      return {
        ok: false,
        message: "缺少查询的站点参数",
      };
    }
    let str = util.dateFormat("HH:mm:ss", fromTime);
    if (!str) {
      return {
        ok: false,
        message: "时间参数不正确",
      };
    }
    let times = str.split(":");

    let h = Number(times[0]),
      m = Number(times[1]),
      s = Number(times[2]);
    let condition = {
      stamp: {
        $gte: h * 3600 + m * 60 + s,
        $lte: h * 3600 + m * 60 + s + miniteDuration * 60,
      },
      station,
      lineID,
      roLine
    };

    let res = await this.ctx.model.Bus.find(condition).sort({stamp:1}).limit(5);
    if (!res || !res.length) {
      return {
        ok: false,
        message: "未获取到数据",
      };
    }
    return {
      ok: true,
      list: res.map((item) => {
        return util.dateFormat("HH:mm:ss", item.time);
      }),
    };
  }
}

module.exports = BusService;
