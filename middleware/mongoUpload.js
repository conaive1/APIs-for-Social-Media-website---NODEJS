const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const GridFsStorage = require("multer-gridfs-storage");

var storage = new GridFsStorage({
  url: "mongodb://localhost:27017/mangxahoi",
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(20, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename,
          bucketName: process.env.MONGO_BUCKET,
        };
        resolve(fileInfo);
      });
    });
  },
});
const Mongoupload = multer({ storage });
exports.Mongoupload = Mongoupload;
