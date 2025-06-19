import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  adminid: { type: String, unique: true, sparse: true },
  userid: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], required: true }
});

export default mongoose.model('User', userSchema);