'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/addlog', controller.home.addlog);
  router.get('/writeWxappLog/imola', controller.home.writeImolaWxappLog);
  router.get('/writeWxappLog/zc', controller.home.writeZCWxappLog);
};
