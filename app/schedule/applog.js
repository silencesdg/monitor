//用于自动发送log
const axios = require("axios");

module.exports = {
  schedule: {
    cron: "0 30 16 * * *", //每天点
    // interval: "10s",
    type: "all", // 指定所有的 worker 都需要执行
    disable: false,
  },
  async task(ctx) {
    var count = 0;
    axios({
      method: "get",
      url: "https://nestciao.zc0901.com/api/app/v3/log/stat",
      params: { action: "start" },
      headers: configHeaders(),
    })
      .then((res) => {
        if (res.data.code == 200 || res.data.code == 0) {
          notify("应用开始日志");
        } else {
          notify("应用开始日志---出现错误");
        }
      })
      .catch((err) => {
        notify("应用开始日志---出现错误");
      });

    const logShow = () => {
      ++count;
      if (count == 33) {
        axios({
          method: "get",
          url: "https://nestciao.zc0901.com/api/app/v3/log/stat",
          params: { action: "end" },
          headers: configHeaders(),
        })
          .then((res) => {
            if (res.data.code == 200 || res.data.code == 0) {
              notify("应用结束日志");
            } else {
              notify("应用结束日志---出现错误");
            }
          })
          .catch((err) => {
            notify("应用结束日志---出现错误");
          });
        return;
      }

      requestHome(count);

      setTimeout(() => {
        logShow();
      }, 60000);
    };

    logShow();
  },
};

var tocken =
  "bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjM2NCwiZXhwIjo0NzY0NzIzOTAwfQ.49ecB7SByLp9l-EGH7S9aA0F8BFy6yTNlTvs9Q5-ids";

function configHeaders() {
  return {
    host: "nestciao.zc0901.com",
    "user-agent": "Dart/2.10 (dart:io)",
    deviceid: "80a4519d54dede00",
    version: { appVersion: "1.0.5" },
    "accept-encoding": "gzip",
    "content-length": 0,
    authorization: tocken,
    production: true,
    registrationid: "65kyod62b1rfw8w",
    platform: "android",
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

function requestHome(count) {
  axios({
    method: "get",
    url: "https://nestciao.zc0901.com/api/app/v3/mine/home",
    params: {},
    headers: configHeaders(),
  })
    .then((res) => {
      if (res.data.code == 200 || res.data.code == 0) {
        if (
          res.data.data &&
          res.data.data.user &&
          res.data.data.user.mobile == "18550789309"
        ) {
          notify("应用home日志成功:" + count);
        } else {
          notify("应用home出现问题：您的信息已过期");
        }
      } else {
        notify("应用home日志---出现错误");
      }
    })
    .catch((err) => {
      notify("应用home日志---出现错误");
    });
}
