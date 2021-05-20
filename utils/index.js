Date.prototype.format = dateFormat;
function dateFormat(fmt, date) {
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(), // 年
    "m+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "M+": date.getMinutes().toString(), // 分
    "S+": date.getSeconds().toString(), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
      );
    }
  }
  return fmt;
}

// 格式：15:02:02
function timeToTimeDate(timeStr) {
    let d = new Date();
    let li = timeStr.split(':')
    let fns = ['setHours','setMinutes','setSeconds'];
    for (let i = 0; i < li.length; i++) {
        d[fns[i]](li[i])        
    }
    return d
}

export default {
  dateFormat,
  timeToTimeDate
};
