const Service = require("egg").Service;

class LogService extends Service {
    async addLog(log) {
        const logModel = new this.ctx.model.Log(log)
        logModel.save()
    }
}

module.exports = LogService