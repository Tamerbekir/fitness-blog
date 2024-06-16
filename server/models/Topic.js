const { Schema, model } = require('mongoose');

const topicSchema = new Schema({
  topicName: {
    type: String,
    required: true,
  },
  post: [{
    type: Schema.Types.ObjectId,
    ref: 'Post',
  }]
})

const Topic = model('Post', topicSchema);

module.exports = Topic;