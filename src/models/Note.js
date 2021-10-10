import mongoose from 'mongoose'

const { ObjectId } = mongoose.Schema.Types

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
  },
  color: {
    type: String,
    default: '#FEF3C7'
  },
  user: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true })

export default mongoose.model('Note', NoteSchema)
