const express = require('express');
const router = express.Router();

const PostController = require('../controllers/post');
const checkAuth = require('../middleware/check-auth');

router.post('/',  PostController.post_create_post);

router.get('/', checkAuth, PostController.post_get_all);

router.get('/:postId', checkAuth, PostController.post_get_post);

router.patch('/:postId', checkAuth, PostController.post_update_post);

router.post('/:postId/comment', checkAuth, PostController.post_comment);

router.delete('/:postId',checkAuth, PostController.post_delete_post);

module.exports = router;