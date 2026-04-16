const Post = require('../models/Post');

const buildHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const normalizePostInput = (body = {}) => ({
  title: (body.title || '').trim(),
  content: (body.content || '').trim(),
});

exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.getAllPosts();
    res.render('posts/index', { posts, title: 'All Posts' });
  } catch (error) {
    next(error);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.getPostById(req.params.id);

    if (!post) {
      return next(buildHttpError(404, 'That post could not be found.'));
    }

    res.render('posts/show', { post, title: post.title });
  } catch (error) {
    next(error);
  }
};

exports.newPostForm = (req, res) => {
  res.render('posts/new', {
    title: 'Write a New Blog',
    error: null,
    formData: { title: '', content: '' },
  });
};

exports.createPost = async (req, res, next) => {
  const formData = normalizePostInput(req.body);

  if (!formData.title || !formData.content) {
    return res.status(400).render('posts/new', {
      title: 'Write a New Blog',
      error: 'Please add both a title and content before publishing.',
      formData,
    });
  }

  try {
    await Post.createPost(formData.title, formData.content);
    res.redirect('/');
  } catch (error) {
    next(error);
  }
};

exports.editPostForm = async (req, res, next) => {
  try {
    const post = await Post.getPostById(req.params.id);

    if (!post) {
      return next(buildHttpError(404, 'That post could not be found.'));
    }

    res.render('posts/edit', { post, title: `Edit ${post.title}` });
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  const formData = normalizePostInput(req.body);

  if (!formData.title || !formData.content) {
    return res.status(400).render('posts/edit', {
      title: 'Edit Post',
      error: 'Please keep both fields filled in before saving.',
      post: {
        id: req.params.id,
        ...formData,
      },
    });
  }

  try {
    const updatedPost = await Post.updatePost(req.params.id, formData.title, formData.content);

    if (!updatedPost) {
      return next(buildHttpError(404, 'That post could not be found.'));
    }

    res.redirect(`/posts/${req.params.id}`);
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const deletedPost = await Post.deletePost(req.params.id);

    if (!deletedPost) {
      return next(buildHttpError(404, 'That post could not be found.'));
    }

    res.redirect('/');
  } catch (error) {
    next(error);
  }
};
