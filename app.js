var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const cors = require("cors");

// import mongoose
const mongoose = require("mongoose");
mongoose.connect(
  // "mongodb+srv://muhfahmir:bwamern@cluster0.ieype.mongodb.net/db_bwa_staycation?retryWrites=true&w=majority",
  "mongodb://muhfahmir:Muhfahmir@cluster0-shard-00-00.ieype.mongodb.net:27017,cluster0-shard-00-01.ieype.mongodb.net:27017,cluster0-shard-00-02.ieype.mongodb.net:27017/db_bwa_staycation?ssl=true&replicaSet=atlas-9o3dsk-shard-0&authSource=admin&retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
// mongoose.connect("mongodb://localhost:27017/db_bwa_staycation", {
//   useUnifiedTopology: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
//   // useNewUrlParser: true,
// });

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
// router admin
const adminRouter = require("./routes/admin");
const apiRouter = require("./routes/api");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(methodOverride("_method"));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 600000,
    },
  })
);
app.use(cors());
app.use(flash());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// file static
app.use(
  "/sb-admin-2",
  express.static(path.join(__dirname, "node_modules/startbootstrap-sb-admin-2"))
);

app.use("/", indexRouter);
app.use("/users", usersRouter);
// admin
app.use("/admin", adminRouter);
// api
app.use("/api/v1/member", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
