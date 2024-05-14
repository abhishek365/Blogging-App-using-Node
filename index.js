const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const userRoute = require("./routers/user");
const blogRoute = require("./routers/blog");
const { default: mongoose } = require("mongoose");
const { checkAuth } = require("./middleware/authentication");
const Blog = require("./models/blog");

const app = express();
const PORT = 8000;

mongoose
  .connect("mongodb://localhost:27017/Blogify")
  .then(() => {
    console.log("Mongodb connected successfully");
  })
  .catch((error) => console.log("Mongodb connection failed", error));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve('./public')));
app.use(checkAuth("token"));

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  const user = req.user;

  res.render("home", { user, blogs: allBlogs });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
