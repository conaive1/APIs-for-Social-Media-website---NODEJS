const express = require("express");
const dotevn = require("dotenv");
const { ConnectMongo } = require("./database/ConnecDB");
const errorMiddleware = require("./middleware/errorMiddleware");
const auth = require("./routes/api/auth");
const app = express();
dotevn.config();
const post = 3000;
ConnectMongo.getConnect();
app.use(express.json());
app.use("/api/auth", auth);
app.use(errorMiddleware);
app.listen(post, () => {
  console.log(`server đang chay tren ${post}`);
});
