const Post = require('../models/post');
const mongoose = require('mongoose');

exports.post_create_post = (req, res, next) => {
    const post = new Post({
        _id: new mongoose.Types.ObjectId(),
        createdBy: req.body.createdBy,
        message: req.body.message,
      });
      post
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: 'Created post successfully',
          createdPost: {
            createdBy: result.createdBy,
            message: result.message,
            createdAt: result.createdAt,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/post/' + result._id
            }
          }
      });
      }).catch(err => { 
        console.log(err);
        res.status(500).json({
          error: err 
        });
    });  
}
exports.post_get_all = (req, res, next) => {
    Post.find()
      .select('createdBy message comments') 
      .exec()
      .then(doc => {
        const response = {
          count: doc.length,
          post: doc.map(doc => {
            return {
              createdBy: doc.createdBy,
              message: doc.message,
              comments: doc.comments,
              _id: doc._id,
              request: {
                type: 'GET',
                url: 'http://localhost:3000/post/' + doc._id
              }
            }
          })
        }
        res.status(200).json(response);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }
  
    exports.post_get_post = (req, res, next) => {
        const id = req.params.postId;
        Post.findById(id)
        .select('createdBy message comments')
        .exec()
        .then(doc => {
         console.log("From Database",doc);
         if(doc){
           res.status(200).json({
             post: doc,
             request: {
               type: 'GET',
               description: 'GET all products',
               url: 'http://localhost:3000/post/'
             }
           });
         }else{
           res.status(404).json({
             message: "no valid enrty found from provided Id"
           })
         }
        
        })
        .catch(err => {
         console.log(err);
         res.status(500).json({eroor: err});
        });
    }

    exports.post_update_post = (req, res, next) => {
    const id = req.params.postId;
    Post.updateOne({ _id: id}, {$set: {message: req.body.message}})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Post updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/post/' + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    }) 
}

exports.post_comment = (req, res, next) => {
    const postId = req.params.postId;
    const comment = {
        sentBy: req.body.sentBy,
        comment: req.body.comment,
        liked: [postId],
        sentAt: Date.now(),
      };
      Post.findByIdAndUpdate(
        postId,
        { $push: { comments: comment} },
        { new: true }
      )
      .populate('comments.sentBy', 'userId')
      .exec()
      .then((updatedPost) => {
        if (!updatedPost) {
          return res.status(404).json({ message: 'Post not found' });
        }
        res.status(201).json(updatedPost);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Failed to add comment' });
      });
      
}


exports.post_delete_post = (req, res, next) => {
    Post.deleteOne({ _id: req.params.postId })
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Post deleted"
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        });
     });
}
