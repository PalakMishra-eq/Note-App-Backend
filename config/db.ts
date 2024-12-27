import mongoose from 'mongoose';

export const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/note-app', {
    
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('DB connection error:', err));
};
