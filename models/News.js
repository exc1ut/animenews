import mongoose from "mongoose";
const Schema = mongoose.Schema;

const newsSchema = Schema({
  img: String,
  title: String,
  date: Date,
  category: { type: Schema.Types.ObjectId, ref: "category" },
  author: String,
  body: String,
  viewed: { type: Number, default: 0 },
});

const news = mongoose.model("news", newsSchema);

export default news;
