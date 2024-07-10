const { Schema, model } = require('mongoose')

const workoutSchema = new Schema({
  profile: [{
    type: Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  }],
  exercise: [{
    type: Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  }],
  weight: {
    type: Number,
    required: true
  },
  reps: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
}, { timestamps: true })

const Workout = model('Workout', workoutSchema)

module.exports = Workout
