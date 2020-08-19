import express from "express";
import axios from "axios";
import News from "../models/News.js";
import Category from "../models/Category.js";
import fs from "fs";
let router = express.Router();
const limit = 8;
//Just testing
router.get("/", (req, res) => res.send("hello world"));

//Creating a Post
//Public
//type: Post
//route: /news

router.post("/", async (req, res) => {
  try {
    let news = new News();

    //assign values from body to model
    news.img = req.body.img;
    news.title = req.body.title;
    news.date = new Date();
    news.category = req.body.category;
    news.author = req.body.author;
    news.body = req.body.body;

    //save to db
    await news.save();

    res.json({ msg: "Success" });
  } catch (error) {
    res.status(404).json({ msg: error });
  }
});

//Get all recent news
//Public
//type: Get
//route: /news/getNews

router.get("/getRecentNews/:page", async (req, res) => {
  let page = parseInt(req.params.page);

  let posts = await News.find()
    .sort({ date: -1 })
    .limit(limit)
    .skip(limit * page)
    .populate("category");

  let count = await News.find().sort({ date: -1 }).estimatedDocumentCount();
  let news = {};
  news.posts = posts;
  news.count = count;

  res.json(news);
});

//Get all popular news
//Public
//type: Get
//route: /news/getNews

router.get("/getPopularNews/:page", async (req, res) => {
  let page = parseInt(req.params.page);
  let posts = await News.find()
    .sort({ viewed: -1 })
    .limit(limit)
    .skip(limit * page)
    .populate("category");
  let count = await News.find().sort({ viewed: -1 }).estimatedDocumentCount();
  let news = {};
  news.posts = posts;
  news.count = count;

  res.json(news);
});

//Get one post by id
//Public
//type: Get
//route: /news/getNewsById/ params = id

router.get("/getNewsById/:id", async (req, res) => {
  try {
    let posts = await News.findById(req.params.id).populate("category");
    posts.viewed++;
    await posts.save();

    res.json(posts);
  } catch (error) {
    res.json({ msg: error });
  }
});

//Get all posts by category id
//Public
//type: Get
//route: /news/getNewsById/ params = id

router.get("/getNewsByCategory/:id/:page", async (req, res) => {
  const { id, page } = req.params;
  console.log(page);

  try {
    let posts = await News.find({ category: id })
      .skip(parseInt(page) * limit)
      .limit(limit)
      .populate("category");

    let count = await News.find({ category: id }).estimatedDocumentCount();
    let news = {};
    news.posts = posts;
    news.count = count;

    res.json(news);
  } catch (error) {
    res.json({ msg: error });
  }
});

// Populate
router.get("/populate", async (req, res) => {
  let categories = await Category.find();

  var data = JSON.parse(fs.readFileSync("articles.json", "utf8"));
  let uniqueArray = data.filter(function (item, pos) {
    return data.indexOf(item) == pos;
  });

  try {
    uniqueArray.forEach(async (i) => {
      let post = new News();
      post.img = i.image;
      post.title = i.title;
      post.date = new Date(i.date);
      post.category =
        categories[Math.floor(Math.random() * categories.length)].id;
      post.author = "Admin";
      post.body = i.body;
      await post.save();
      res.send("copied");
    });
  } catch (error) {
    res.send(error.message);
  }
});

export default router;
