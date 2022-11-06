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

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;
