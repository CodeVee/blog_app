const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const BlogSchema = new Schema({
  id: ObjectId,
  created_at: Date,
  title: String,
  description: String,
  author: {
    type: ObjectId, required: true, ref: 'Users'
  },
  state: { type: String, enum: ['draft', 'published'], default: 'draft'},
  read_count: { type: Number, default: 1 },
  reading_time: Number,
  body: String,
  tags: [String]
});

BlogSchema.pre(
  'save',
  function (next) {
      const blog = this;
      const text = blog.title + ' ' + blog.description + ' ' + blog.body;
      const wpm = 100;
      const words = text.trim().split(/\s+/).length;
      const time = Math.ceil(words / wpm);

      blog.reading_time = time;
      next();
  }
);

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;
