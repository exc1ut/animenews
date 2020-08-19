import mongoose from "mongoose";
const Schema = mongoose.Schema;

const categorySchema = Schema({
  title: String,
  date: Date,
});

const category = mongoose.model("category", categorySchema);

export default category;
