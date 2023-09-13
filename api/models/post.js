const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  comments: [
    {
      sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
      },
      comment: {
         type: 'String', required: true
      },
      sentAt: {
        type: Date,
        default: Date.now,
        required: true,
      },
      liked: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
  ],
});

module.exports = mongoose.model('Post', postSchema);
