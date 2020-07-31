const path = require('path');
const fs = require('fs');
const { Readable } = require('stream');
const multistream = require('multistream');

const mkdirsSync = (dirname) => {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

// const mergeFiles = (inputPathList, outputPath, chunkSize) => {
//     const fd = fs.openSync(outputPath, 'w+');
//     const output = fs.createWriteStream(outputPath);
//     const inputList = inputPathList.map((path) => {
//         return fs.createReadStream(path, {
//             // 相当于控制水桶大小
//             highWaterMark: chunkSize // 控制流每次 on data 的大小，默认是16kb
//         });
//     });
//     console.log(inputList)
//     return new Promise((resolve, reject) => {
//         var multiStream = new multistream(inputList);
//         multiStream.pipe(output);
//         multiStream.on('end', () => {
//             fs.closeSync(fd);
//             resolve(true);
//         });
//         multiStream.on('error', (err) => {
//             console.log(err)
//             fs.closeSync(fd);
//             reject(false);
//         });
//     });
// }

const bufferToStream = (binary) => {
    const readableInstanceStream = new Readable({
      read() {
        this.push(binary);
        this.push(null);
      }
    });
    return readableInstanceStream;
}

module.exports = {mkdirsSync, bufferToStream}