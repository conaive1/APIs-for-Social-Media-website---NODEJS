const mongoose = require("mongoose");
class ConnectMongo {
  constructor() {
    this.gfs = null;
  }
  static getConnect() {
    mongoose
      .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      })
      .then(() => console.log("db is connected"));
    const conn = mongoose.connection;
    conn.once("open", () => {
      this.gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: process.env.MONGO_BUCKET,
      });
    });
  }
}
module.exports.ConnectMongo = ConnectMongo;
