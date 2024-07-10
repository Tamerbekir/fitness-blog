const { Schema, model } = require('mongoose')

const exerciseSchema = new Schema({
  exerciseName: {
    type: String,
    required: true
  },
  workout: [{
    type: Schema.Types.ObjectId,
    ref: 'Workout'
  }]
})

const Exercise = model('Exercise', exerciseSchema)

module.exports = Exercise