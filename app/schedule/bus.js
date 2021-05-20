//用于自动发送log
module.exports = {
  schedule: {
    // interval: "60s",
    type: "all", // 指定所有的 worker 都需要执行
    disable: false,
  },
  async task(ctx) {
    let zhong_nan_jie_nan_528 = await getData(ctx.curl, "10000283", "10000161");
    addLog(ctx, zhong_nan_jie_nan_528);
  },
};

function addLog(ctx, list) {
  if (list && list[0] && list[0].time) {
    const obj = list[0];
    ctx.service.bus.addBusLog({
      ...obj,
      from: obj.station,
      to: list[list.length - 1].station,
    });
  }
}

async function getData(curl, lineID, roLine) {
  if (!curl) {
    console.log("未获取到curl方法");
    return;
  }
  let res = await curl(
    `http://app.2500.tv/yqgj/lineInfo.php?lineID=${lineID}&roLine=${roLine}`
  );
  if (res && res.data) {
    let html = res.data;

    let tar = html.match(/(?<=>)[\u4e00-\u9fa5].+(?=<)/gim);
    let list = [];
    if (tar && tar.length > 2) {
      for (let i = 2; i < tar.length; i++) {
        if (tar[i].indexOf("苏E") > -1) {
          let arr = tar[i].split(" ");
          list[list.length - 1].time = arr[arr.length - 1];
          list[list.length - 1].busNo = arr[0];
        } else {
          list.push({
            station: tar[i],
            lineID,
            roLine
          });
        }
      }
    }
    return list;
  }
  return null;
}
