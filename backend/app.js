const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const routes = require("./routes");
const { requestLogger, errorLogger } = require("./middlewares/logger");
require("dotenv").config();
const { mongoDbAdress, handleServerError } = require("./utils/constants");

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect(mongoDbAdress, {
  useNewUrlParser: true,
});

app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

app.use(requestLogger);

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://aroundtheus-MurrK-smb.students.nomoreparties.sbs"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  next();
});

app.use(cors());
app.options("*", cors());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server has crashed");
  }, 0);
});

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(handleServerError());

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
