import mongoose, { Document, Schema } from 'mongoose';

interface INote extends Document {
  title: string;
  content: string;
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
}

const noteSchema = new Schema<INote>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const Note = mongoose.model<INote>('Note', noteSchema);
export default Note;
