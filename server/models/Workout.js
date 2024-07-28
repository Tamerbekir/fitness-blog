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
    required: false
  },
  reps: {
    type: Number,
    required: false
  },
  sets: {
    type: Number,
    required: false
  },
  miles: {
    type: Number,
    required: false
  },
  pace: {
    type: Number,
    required: false
  },
  workoutNotes: {
    type: String,
    required: false
  },
  notes: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
}, { timestamps: true })

const Workout = model('Workout', workoutSchema)

module.exports = Workout
