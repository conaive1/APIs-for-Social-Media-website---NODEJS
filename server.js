const express = require("express");
const dotevn = require("dotenv");
const { ConnectMongo } = require("./database/ConnecDB");
const errorMiddleware = require("./middleware/errorMiddleware");
const auth = require("./routes/api/auth");
const post = require("./routes/api/post");
const comment = require("./routes/api/comment");
const friends = require("./routes/api/friends");
const MailService = require("./common/mail");
// const bodyParser = require("body-parser");
const app = express();
// app.use(bodyParser.urlencoded({ extended: false }));

dotevn.config();
const port = 3000;
ConnectMongo.getConnect();
app.use(express.json());
MailService.init();
app.use("/api/auth", auth);
app.use("/api/post", post);
app.use("/api/comment", comment);
app.use("/api/friends", friends);
app.use(errorMiddleware);
app.listen(port, () => {
  console.log(`server đang chay tren ${port}`);
});
