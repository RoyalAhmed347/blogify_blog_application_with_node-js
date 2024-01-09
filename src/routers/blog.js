const express = require("express");
const multer = require("multer");
const path = require("path");
const { BLOG } = require("../models/blog");
const mongoose = require("mongoose");
const COMMENT = require("../models/comment");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/blogs`));
  },
  filename: function (req, file, cb) {
    const fillName = `${Date.now()}_${file.originalname}`;
    cb(null, fillName);
  },
});

const upload = multer({ storage: storage });

router
  .route("/add-new")
  .get(async (req, res) => {
    res.render("addBlog", { user: req.user });
  })
  .post(upload.single("coverImage"), async (req, res) => {
    const { title, content } = req.body;
    const blog = await BLOG.create({
      title,
      content,
      coverImageURL: `/uploads/blogs/${req.file.filename}`,
      createdBy: req.user._id,
    });
    res.redirect(`/blog/v/${blog._id}`);
  });

router.route("/v/:id").get(async (req, res) => {
  const _id = req.params.id;
  const blog = await BLOG.findOne({ _id }).populate({
    path: "createdBy",
  });
  const comment = await COMMENT.find({ bolgId: req.params.id }).populate({
    path: "createdBy",
  });
  console.log("🚀 ~ file: blog.js:46 ~ comment ~ comment:", comment);

  // console.log(blog);
  res.render("viewBlog", { user: req.user, blog, comment });
});

router.route("/comment/:blogId").post(async (req, res) => {
  await COMMENT.create({
    content: req.body.content,
    createdBy: req.user._id,
    bolgId: req.params.blogId,
  });
  res.redirect(`/blog/v/${req.params.blogId}`);
});

module.exports = router;
