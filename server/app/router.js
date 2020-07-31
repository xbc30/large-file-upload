'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, io } = app;
  router.post('/hash_check', controller.home.hashCheck);
  router.post('/chunks_upload', controller.home.chunksUpload);
  router.post('/chunks_merge', controller.home.chunksMerge);

  // socket.io
  io.of('/').route('upload', io.controller.nsp.upload);
  io.of('/').route('merge', io.controller.nsp.merge);
};
