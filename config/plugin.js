'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  mongoose:{
    enable:true,
    package:'egg-mongoose'
  },

  cors: {
    enable:true,
    package:'egg-cors'
  },

  logger: {
    enable:true,
    package:'egg-logger'
  },

  logrotator: {
    enable:true,
    package:'egg-logrotator'
  }
};
