/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1595472067770_8117';

  // add your middleware config here
  config.middleware = [];

  config.security = {
    csrf: {
      enable: false
    },
    domainWhiteList: ['*']
  };
  config.cors = {
    origin: 'http://192.168.101.69:8080',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
  };

  config.cluster = {
    listen: {
      port: 7001, // 端口
      hostname: '192.168.101.69', // 服务器ip
    },
  };

  config.multipart = {
    mode: 'file', // 上传文件模式
    fileExtensions: [
      '', // 支持无扩展文件上传
    ],
  };

  config.io = {
    init: { }, // passed to engine.io
    namespace: {
      '/': {
        connectionMiddleware: [],
        packetMiddleware: [],
      }
    },
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};