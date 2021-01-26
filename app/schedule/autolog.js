//用于自动发送log
const axios = require("axios");
let startTime = Date.now();
module.exports = {
  schedule: {
    cron: "0 0 13 * * *", //每天点
    // interval: "3s",
    type: "all", // 指定所有的 worker 都需要执行
    disable: false,
  },
  async task(ctx) {
    let count = 0;
    startTime = Date.now();
    requestLaunch()
      .then((res) => {
        if (res.data.code == 200 || res.data.code == 0) {
          ctx.logger.info("小程序launch记录--------", res);
          notify("发送小程序launch事件成功");
        } else {
          ctx.logger.info("launch-error--------", res.data);
        }
      })
      .catch((err) => {
        ctx.logger.error("launch---------", err);
        notify("发送小程序launch事件失败");
        this.schedule.disable = true;
      });

    const logShow = () => {
      ++count;
      if (count > 33) {
        requestHide()
          .then((res) => {
            if (res.data.code == 200 || res.data.code == 0) {
              ctx.logger.info("小程序hide记录--------", res);
              notify("发送小程序hide事件成功");
            } else {
              ctx.logger.info("hide-error--------", res.data);
            }
          })
          .catch((err) => {
            ctx.logger.error("hide---------", err);
            notify("发送小程序hide事件失败");
            this.schedule.disable = true;
          });
        return;
      }
      requestShow()
        .then((res) => {
          if (res.data.code == 200 || res.data.code == 0) {
            ctx.logger.info("小程序show记录--------", res);
            notify("发送小程序show事件成功:" + count);
          } else {
            ctx.logger.info("show-error--------", res.data);
          }
        })
        .catch((err) => {
          ctx.logger.error("show---------", res);
          notify("发送小程序show事件失败");
          this.schedule.disable = true;
        });
      setTimeout(() => {
        logShow();
      }, 60000);
    };

    logShow();
  },
};

var tocken =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjgwNjMsInVzZXJJZCI6ODA2Mywic3RvcmUiOm51bGwsImlzTWVtYmVyIjp0cnVlLCJleHAiOjQ3NjQ1NTc5OTF9.DTRSpUQwH4hDAyfHmy8VP-CpH0xvYYoBpnj-_NazqTk";
var WXATOKEN = "d3c8Z+AYktQ3TzPqp9EB3r9HUrzv0QzICZ0R5i6WaiCCJa4eow==";
var ZCAUTHTOKEN =
  "eyJleHBpcmVzIjoxOTI2MzE3OTkxLjc3NDI4MTk3ODYsInNhbHQiOiI1OGUxZTUiLCJpZCI6IjMyNDE5MjExIn1ft3OSCaguYfsGU3ucLpe1CgCEmIbgbyI7j_iznfauGg==";

function configData(life = "launch") {
  let time = Date.now();
  let at = "" + Date.now() + Math.floor(1e7 * Math.random());
  let ahs = "" + Date.now() + Math.floor(1e7 * Math.random());
  let uu = "d185eb1b4d97f5a9b03d47a5337c00bf";
  let launch = {
    br: "devtools",
    pm: "iPhone 6/7/8",
    pr: "2",
    ww: "375",
    wh: "667",
    lang: "zh_CN",
    wv: "7.0.4",
    wvv: "devtools",
    wsdk: "2.14.0",
    sv: "iOS 10.0.1",
    ev: "app",
    life: "launch",
    ec: 0,
    st: startTime,
    at,
    et: time + 200,
    uu,
    v: "7.0.0",
    ak: "",
    wsr: JSON.stringify({ path: "pages/land/land", query: {}, scene: 1001, referrerInfo: {} }),
    oifo: false,
    rq_c: 2,
  };

  let show = {
    br: "devtools",
    pm: "iPhone 6/7/8",
    pr: "2",
    ww: "375",
    wh: "667",
    lang: "zh_CN",
    wv: "7.0.4",
    wvv: "devtools",
    wsdk: "2.14.0",
    sv: "iOS 10.0.1",
    ev: "app",
    life: "show",
    ec: 0,
    st: startTime,
    ahs,
    at,
    et: time + 128,
    uu,
    v: "7.0.0",
    ak: "",
    wsr: JSON.stringify({ path: "pages/land/land", query: {}, scene: 1001, referrerInfo: {} }),
    oifo: false,
    rq_c: 2,
  };

  let hide = {
    br: "devtools",
    pm: "iPhone 6/7/8",
    pr: "2",
    ww: "375",
    wh: "667",
    lang: "zh_CN",
    wv: "7.0.4",
    wvv: "devtools",
    wsdk: "2.14.0",
    sv: "iOS 10.0.1",
    ev: "app",
    life: "show",
    ec: 0,
    st: startTime,
    ahs,
    at,
    et: time + 192,
    uu,
    v: "7.0.0",
    ak: "",
    wsr: JSON.stringify({ path: "pages/home/home", query: {}, scene: 1001, referrerInfo: {} }),
    oifo: false,
    rq_c: 2,
  };

  let home = {
    br: "devtools",
    pm: "iPhone 6/7/8",
    pr: "2",
    ww: 375,
    wh: 667,
    lang: "zh_CN",
    wv: "7.0.4",
    wvv: "devtools",
    wsdk: "2.14.0",
    sv: "iOS 10.0.1",
    nt: "wifi",
    ev: "page",
    st: "1611653817430",
    life: "unload",
    pp: "pages/land/land",
    pc: "",
    dr: "3782",
    ndr: "2678",
    rc: "0",
    bc: "0",
    ahs: "16116538135386007936",
    ifp: "true",
    fp: "pages/land/land",
    at: "16116538135387486327",
    et: "1611653817430",
    uu: "20e7fa71f56069f323a8fa3094456317",
    v: "7.0.0",
    ak: "",
    wsr: JSON.stringify({ path: "pages/land/land", query: {}, scene: 1001, referrerInfo: {} }),
    oifo: "false",
    rq_c: "3",
  };

  return ({ launch: launch, show: show, hide: hide, home }[life]) || launch;
}

function configHeaders() {
  return {
    Host: "wxa.imolacn.com",
    "User-Agent":
      "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1 wechatdevtools/1.03.2006090 MicroMessenger/7.0.4 Language/zh_CN webview/",
    "Sec-Fetch-Dest": "empty",
    "sec-ch-ua": "nwjs 75",
    "Sec-Fetch-Mode": "cors",
    AldStat: "MiniApp-Stat",
    "Content-Type": "application/json",
    "Sec-Fetch-Site": "cross-site",
    Accept: "*/*",
    Referer:
      "https://servicewechat.com/wxe8468f37e74f86eb/devtools/page-frame.html",
    "Accept-Encoding": "gzip, deflate, br",
    "IMOLA-TOKEN": tocken,
    "X-WXA-API-AUTH-TOKEN": WXATOKEN,
    "ZC-AUTH-TOKEN": ZCAUTHTOKEN,
  };
}

function configNormalHeaders() {
  return {
    Host: "mini.imolacn.com",
    "User-Agent":
      "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1 wechatdevtools/1.03.2006090 MicroMessenger/7.0.4 Language/zh_CN webview/",
    "Sec-Fetch-Dest": "empty",
    "sec-ch-ua": "nwjs 75",
    "Sec-Fetch-Mode": "cors",
    AldStat: "MiniApp-Stat",
    "Content-Type": "application/json",
    "Sec-Fetch-Site": "cross-site",
    Accept: "*/*",
    Referer:
      "https://servicewechat.com/wxe8468f37e74f86eb/devtools/page-frame.html",
    "Accept-Encoding": "gzip, deflate, br",
    Authorization: tocken,
    "X-WXA-API-AUTH-TOKEN": WXATOKEN,
    "ZC-AUTH-TOKEN": ZCAUTHTOKEN,
  };
}

function configZCHeaders() {
  return {
    Host: "api.zc0901.com",
    "User-Agent":
      "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1 wechatdevtools/1.03.2006090 MicroMessenger/7.0.4 Language/zh_CN webview/",
    "Sec-Fetch-Dest": "empty",
    "sec-ch-ua": "nwjs 75",
    "Sec-Fetch-Mode": "cors",
    AldStat: "MiniApp-Stat",
    "Content-Type": "application/json",
    "Sec-Fetch-Site": "cross-site",
    Accept: "*/*",
    Referer:
      "https://servicewechat.com/wxe8468f37e74f86eb/devtools/page-frame.html",
    "Accept-Encoding": "gzip, deflate, br",
    "WXA-TOKEN": WXATOKEN,
  };
}

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

function requestLaunch() {
  axios({
    method: "get",
    url: "https://api.zc0901.com/cedit/logs/stats",
    params: configData("launch"),
    headers: configZCHeaders(),
  });
  axios({
    method: "get",
    url: "https://mini.imolacn.com/api/mini/v2/home",
    params: { lat: "31.26249", lng: "120.63212" },
    headers: configNormalHeaders(),
  });
  return axios({
    method: "get",
    url: "https://wxa.imolacn.com/mp/logs/stats",
    params: configData("launch"),
    headers: configHeaders(),
  });
}

function requestShow() {
  // 进入落地页面发送的
  axios({
    method: "get",
    url: "https://api.zc0901.com/cedit/logs/stats",
    params: configData("home"),
    headers: configZCHeaders(),
  });

  axios({
    method: "get",
    url: "https://wxa.imolacn.com/mp/logs/stats",
    params: configData("home"),
    headers: configHeaders(),
  });

  // app show生命周期发送的
  axios({
    method: "get",
    url: "https://api.zc0901.com/cedit/logs/stats",
    params: configData("show"),
    headers: configZCHeaders(),
  });
  return axios({
    method: "get",
    url: "https://wxa.imolacn.com/mp/logs/stats",
    params: configData("show"),
    headers: configHeaders(),
  });
}

function requestHide() {
  axios({
    method: "get",
    url: "https://api.zc0901.com/cedit/logs/stats",
    params: configData("hide"),
    headers: configZCHeaders(),
  });
  return axios({
    method: "get",
    url: "https://wxa.imolacn.com/mp/logs/stats",
    params: configData("hide"),
    headers: configHeaders(),
  });
}
