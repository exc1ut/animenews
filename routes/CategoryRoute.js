import express from "express";
import Category from "../models/Category.js";

let router = express.Router();

//Get all categories
//Public
//type: Get
//route: /category/

router.get("/", async (req, res) => {
  const categories = await Category.find().sort({ date: -1 });
  res.json(categories);
});

//create a new category
//Public
//type: Post
//route: /category/

router.post("/", async (req, res) => {
  try {
    let category = new Category();

    category.title = req.body.title;
    category.date = new Date();

    await category.save();

    res.json({ msg: "success" });
  } catch (error) {
    res.status(404).json({ msg: error });
  }
});

export default router;
