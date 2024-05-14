const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fname = `${Date.now()} - ${file.originalname}`;
    cb(null, fname);
  },
});

const upload = multer({ storage });

router.get("/add-new", (req, res) => {
  return res.render("add-blog");
});

router.post("/", upload.single("coverPhoto"), async (req, res) => {
  const { title, body } = req.body;
  const file = req.file;

  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageUrl: `/uploads/${file.filename}`,
  });
  return res.redirect("/");
  //   return res.redirect("/blog/${blog._id}");
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );

  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
});

router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;
