import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userid: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true } // 'admin' ya 'user'
});

export default mongoose.model('User', userSchema, 'users');