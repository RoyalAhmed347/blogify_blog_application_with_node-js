require("dotenv").config();
const express = require("express");
const hbs = require("hbs");
const mongoose = require("mongoose");
const uesrRouter = require("./src/routers/user");
const blogRouter = require("./src/routers/blog");
const cookieParser = require("cookie-parser");
const { checkForAuthToken } = require("./middlewares/auth");
const { BLOG } = require("./src/models/blog");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(express.static("./public"));
app.use(checkForAuthToken("loginToken"));
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log(`Database is connected`))
  .catch((e) => console.log(`Database Error${e}`));

app.set("view engine", "hbs");
app.set("views", "./template/view");
hbs.registerPartials("./template/Partials");

app.get("/", async (req, res) => {
  const allBlogs = await BLOG.find({});

  res.render("index", { user: req.user, blogs: allBlogs });
});
app.use("/user", uesrRouter);
app.use("/blog", blogRouter);

app.listen(PORT, () => console.log(`Server is started on port ${PORT}`));
