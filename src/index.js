const express = require("express");
const bodyParser = require("body-parser");
const route = require("./router/route.js");
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const app = express();
const multer = require("multer");

app.use(cors());
app.use(multer().any());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome");
});
mongoose
  .connect(
    "mongodb+srv://tusharbarai1:Tb88774411@cluster0.3hlrc.mongodb.net/UserDB",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});
