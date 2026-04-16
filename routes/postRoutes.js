const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.getAllPosts);
router.get('/posts/new', postController.newPostForm);
router.post('/posts', postController.createPost);
router.get('/posts/:id', postController.getPost);
router.get('/posts/:id/edit', postController.editPostForm);
router.post('/posts/:id/update', postController.updatePost);
router.post('/posts/:id/delete', postController.deletePost);

module.exports = router;