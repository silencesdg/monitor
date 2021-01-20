/* eslint valid-jsdoc: "off" */

"use strict";

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {
    mongoose: {
      client: {
        url: "mongodb://logdbrewrite:123456@127.0.0.1/logdb",
        options: {},
      },
    },
    security: {
      csrf: {
        enable: false,
      },
      domainWhiteList: ["*"],
    },
    cors: {
      origin: "*",
      allowMethods: "GET,POST,OPTIONS",
    },
    logger: {},
    logrotator: {},
  });

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1603778228124_3955";

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
