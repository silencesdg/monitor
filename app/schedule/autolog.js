//用于自动发送log
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// const imolaUrl = "https://wxa.imolacn.com/mp/logs/stats";
// const zcUrl = "https://api.zc0901.com/cedit/logs/stats";

const imolaUrl = "http://127.0.0.1:7001/writeWxappLog/imola";
const zcUrl = "http://127.0.0.1:7001/writeWxappLog/zc";

const IMOLATOCKEN =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjgwNjMsInVzZXJJZCI6ODA2Mywic3RvcmUiOm51bGwsImlzTWVtYmVyIjp0cnVlLCJleHAiOjQ3NjQ1NTc5OTF9.DTRSpUQwH4hDAyfHmy8VP-CpH0xvYYoBpnj-_NazqTk";
const WXATOKEN = "d3c8Z+AYktQ3TzPqp9EB3r9HUrzv0QzICZ0R5i6WaiCCJa4eow==";
const ZCAUTHTOKEN =
  "eyJleHBpcmVzIjoxOTI2MzE3OTkxLjc3NDI4MTk3ODYsInNhbHQiOiI1OGUxZTUiLCJpZCI6IjMyNDE5MjExIn1ft3OSCaguYfsGU3ucLpe1CgCEmIbgbyI7j_iznfauGg==";

module.exports = {
  schedule: {
    cron: "00 43 18 * * *", //每天点
    // interval: "3s",
    type: "all", // 指定所有的 worker 都需要执行
    disable: false,
  },
  async task(ctx) {
    let startTime = Date.now();
    let logs = getLogList();
    let oldStartTime = logs[0].time;
    let fromlogTime = startTime - oldStartTime;
    let doneCnt = 0;
    const send = () => {
      for (let i = 0; i < logs.length; i++) {
        const index = i;
        const obj = logs[i];
        if (Date.now() - startTime > obj.time - oldStartTime && !obj.done) {
          // 是否到时间了，需要发送
          obj.done = true;
          doneCnt = doneCnt + 1;
          if (obj.query.st) {
            obj.query.st = obj.query.st * 1 + fromlogTime;
          }
          if (obj.query.et) {
            obj.query.et = obj.query.et * 1 + fromlogTime;
          }
          if (obj.query.at) {
            obj.query.at =
              obj.query.at.slice(0, 13) * 1 +
              fromlogTime +
              obj.query.at.slice(13, obj.query.at.length);
          }
          if (obj.query.ahs) {
            obj.query.ahs =
              obj.query.ahs.slice(0, 13) * 1 +
              fromlogTime +
              obj.query.ahs.slice(13, obj.query.ahs.length);
          }

          if (obj.header["imola-token"]) {
            obj.header["imola-token"] = IMOLATOCKEN;
          }
          if (
            obj.header["X-WXA-API-AUTH-TOKEN"] == "" ||
            obj.header["X-WXA-API-AUTH-TOKEN"]
          ) {
            obj.header["X-WXA-API-AUTH-TOKEN"] = WXATOKEN;
          }
          if (obj.header["WXA-TOKEN"] == "" || obj.header["WXA-TOKEN"]) {
            obj.header["WXA-TOKEN"] = WXATOKEN;
          }

          if (
            obj.header["ZC-AUTH-TOKEN"] == "" ||
            obj.header["ZC-AUTH-TOKEN"]
          ) {
            obj.header["ZC-AUTH-TOKEN"] = ZCAUTHTOKEN;
          }
          obj.query.ufo = "";
          if (obj.header.host == "wxa.imolacn.com") {

            axios({
              method: "get",
              url: imolaUrl,
              params: obj.query,
              headers: obj.header,
            }).then((res) => {
              let a = "已发送小程序imola--"+index+"--:";
              if (obj.query.ev) {
                a += obj.query.ev + "---" + obj.query.life;
              }
              else if (obj.query.wsr) {
                a += obj.wsr
              }
              notify(a);
            }).catch(err => {
              notify("发送小程序失败");
            });;
          } else {

            axios({
              method: "get",
              url: zcUrl,
              params: obj.query,
              headers: obj.header,
            }).then((res) => {
              let a = "已发送小程序zc--"+index+"--:";
              if (obj.query.ev) {
                a += obj.query.ev + "---" + obj.query.life;
              }
              else if (obj.query.wsr) {
                a += obj.wsr
              }
              notify(a);
            }).catch(err => {
              notify("发送小程序失败");
            });
          }
        }
      }

      setTimeout(() => {
        if (doneCnt >= logs.length) {
          // 停止
          notify("小程序发送结束");
        } else {
          send();
        }
      }, 5000);
    };

    send();
  },
};

function notify(content = "") {
  axios({
    method: "post",
    url:
      "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=68b5f0bf-37bb-468b-80f7-05b0b7160f1a",
    data: {
      msgtype: "text",
      text: {
        content,
      },
    },
    headers: { "Content-Type": "application/json" },
  });
}

function getLogList() {
  const dir = path.join(__dirname, "../wxapplog");
  let arr = [];
  var files = fs.readdirSync(dir);

  files = files.sort((a, b) => {
    return a.split("-")[0] * 1 - b.split("-")[0] * 1;
  });
  if (files) {
    //遍历读取到的文件列表
    for (var n = 0; n < files.length; n++) {
      var filename = files[n];
      let fp = path.join(dir, filename);
      arr.push(JSON.parse(fs.readFileSync(fp)));
    }
  }
  return arr;
}
