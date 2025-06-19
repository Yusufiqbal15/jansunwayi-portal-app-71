import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://yadavanubhav848:zHjucA4rNlmQNaay@cluster1.hcyqa2d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1')
  .then(() => {
    console.log('MongoDB connected');
    console.log('Mongoose readyState:', mongoose.connection.readyState); // 1 means connected
  })
  .catch((err) => console.error('MongoDB error:', err));

app.use('/api/auth', authRoutes);

app.listen(5000, () => console.log('Server started on port 5000'));
