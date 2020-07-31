'use strict';
const path = require('path');
const fs = require('fs');
const multistream = require('multistream');
const { streamMerge } = require('split-chunk-merge');
const uploadPath = path.join(__dirname, '../../uploads');
const {mkdirsSync, mergeFiles} = require("../utils");

const Controller = require('egg').Controller;

class HomeController extends Controller {
  // 哈希检查
  async hashCheck() {
    const {
      ctx
    } = this;
    const {
      total,
      chunkSize,
      hash
    } = ctx.request.body;

    const chunksPath = path.join(uploadPath, hash + '-' + chunkSize, '/');
    if (fs.existsSync(chunksPath)) {
      // 目录存在，判断是否已上传完还是需要断点续传
      const chunks = fs.readdirSync(chunksPath);
      if (chunks.length !== 0 && chunks.length == total) {
        ctx.status = 200;
        ctx.body = {
          success: true,
          msg: '检查成功，文件在服务器上已存在，不需要重复上传',
          data: {
            type: 2, // type=2 为文件已上传过
          }
        };
      } else {
        const index = []
        chunks.forEach(item => {
          const chunksNameArr = item.split('-')
          index.push(chunksNameArr[chunksNameArr.length - 1])
        })
        ctx.status = 200;
        ctx.body = {
          success: true,
          msg: '检查成功，需要断点续传',
          data: {
            type: 1, // type=2 为文件已上传过
            index
          }
        };
      }
    } else {
      ctx.status = 200;
      ctx.body = {
        success: true,
        msg: '检查成功',
        data: {
          type: 0, // type=0 为从未上传
        }
      };
    }

  }
  // 分片上传
  async chunksUpload() {
    const {
      ctx
    } = this;
    // 获取form-data
    const {
      name,
      total,
      index,
      size,
      chunkSize,
      hash
    } = ctx.request.body;
    const file = ctx.request.files[0]

    const chunksPath = path.join(uploadPath, hash + '-' + chunkSize, '/');
    if (!fs.existsSync(chunksPath)) mkdirsSync(chunksPath);
    // 不使用fs.renameSync， 因为在windonw开发时可能会出现跨分区权限问题
    // file.filepath为eggjs设置的临时文件目录 借助管道流转移到{server-root}/uploads目录下
    const readStream = fs.createReadStream(file.filepath)
    const writeStream = fs.createWriteStream(chunksPath + hash + '-' + index);
    // 管道输送
    readStream.pipe(writeStream);
    readStream.on('end', function () {
      // 删除临时文件
      fs.unlinkSync(file.filepath);
    });
    ctx.status = 200;
    ctx.body = {
      success: true,
      msg: '上传成功',
      data: ''
    };
  }
  // 分片合并
  async chunksMerge() {
    const {
      ctx
    } = this;
    const {
      chunkSize,
      name,
      total,
      hash
    } = ctx.request.body;
    // 根据hash值，获取分片文件。
    const chunksPath = path.join(uploadPath, hash + '-' + chunkSize, '/');
    const filePath = path.join(uploadPath, name);
    // 读取所有的chunks 文件名存放在数组中
    const chunks = fs.readdirSync(chunksPath);
    const chunksPathList = []
    if (chunks.length !== total || chunks.length === 0) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        msg: '切片文件数量与请求不符合，无法合并',
        data: ''
      };
    }
    chunks.forEach(item => {
      chunksPathList.push(path.join(chunksPath, item))
    })

    // const writeStream = fs.createWriteStream(filePath);
    try {
      await streamMerge(chunksPathList, filePath, chunkSize)
      ctx.status = 200;
      ctx.body = {
        success: true,
        msg: '合并成功',
        data: ''
      };
    } catch {
      ctx.status = 200;
      ctx.body = {
        success: false,
        msg: '合并失败，请重试',
        data: ''
      };
    }
  }
}

module.exports = HomeController;