const { BlogModel } = require('../models')
const moment = require('moment'); 

exports.createBlog = async (req, res) => {
    const {
        title,
        description,
        body,
        tags
      } = req.body;

    const text = title + ' ' + description + ' ' + body;
    const wpm = 100;
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wpm);

    const author = req.user;

    const blog = await BlogModel.create({ 
        title,
        created_at: moment().toDate(),
        description,
        body,
        tags,
        reading_time: time,
        author,
    })
    
    return res.json({ status: true, blog })
}

exports.getBlog = async (req, res) => {
    const { blogId } = req.params;
    const blog = await BlogModel.findById(blogId).populate('author');

    if (!blog) {
        return res.status(404).json({ status: false, blog: null })
    }
    blog.read_count = blog.read_count + 1;

    await blog.save()

    blog.author.password = null;

    return res.json({ status: true, blog })
}

exports.getBlogs  = async (req, res) => {
    const { query } = req;
    const {
        author,
        title, 
        tags, 
        order = 'asc', 
        order_by = 'created_at', 
        page = 1, 
        per_page = 20 
    } = query;

    const findQuery = {};

    if (author) {
        findQuery.author = author;
    }
    if (title) {
        findQuery.title = title;
    }
    if (tags) {
        const filterTags = tags.split(',')
        findQuery.tags = { $in: filterTags }
    }

    const sortQuery = {};

    const sortAttributes = order_by.split(',')

    for (const attribute of sortAttributes) {
        if (order === 'asc' && order_by) {
            sortQuery[attribute] = 1
        }
    
        if (order === 'desc' && order_by) {
            sortQuery[attribute] = -1
        }
    }

    const blogs = await BlogModel
    .find(findQuery)
    .sort(sortQuery)
    .skip(page - 1)
    .limit(per_page)

    return res.status(200).json({ status: true, blogs })
}
exports.getAuthorBlogs  = async (req, res) => {
    const { query, user } = req;
    const {
        state, 
        page = 1, 
        per_page = 20 
    } = query;

    const findQuery = {
        author: user
    };

    if (state) {
        findQuery.author = state;
    }
    
    const blogs = await BlogModel
    .find(findQuery)
    .skip(page - 1)
    .limit(per_page)

    return res.status(200).json({ status: true, blogs })
}

exports.updateBlog = async (req, res) => {
    const { id } = req.params;
    const {
        title,
        description,
        body,
        tags
    } = req.body; 

    const author = req.user;

    const blog = await BlogModel.findOne({ _id: id, author })

    if (!blog) {
        return res.status(404).json({ status: false, blog: null })
    }
    
    blog.title = title;
    blog.description = description;
    blog.body = body;
    blog.tags = tags;

    const text = title + ' ' + description + ' ' + body;
    const wpm = 100;
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wpm);

    blog.reading_time = time;

    await blog.save()

    return res.json({ status: true, blog })
}

exports.updateBlogState = async (req, res) => {
    const { id } = req.params;
    const { state } = req.body;
    const author = req.user;
    console.log(author)
    const blog = await BlogModel.findOne({ _id: id, author })

    if (!blog) {
        return res.status(404).json({ status: false, blog: null })
    }
    
    if (state !== 'published') {
        return res.status(422).json({ status: false, blog: null, message: 'Invalid operation' })
    }

    blog.state = state;

    await blog.save()

    return res.json({ status: true, blog })
}

exports.deleteBlog = async (req, res) => {
    const { id } = req.params;
    const author = req.user;

    const blog = await BlogModel.findOne({ _id: id, author })

    if (!blog) {
        return res.status(404).json({ status: false, blog: null })
    }

    blog.deleteOne();
    await blog.save()

    return res.json({ status: true, blog })
}
