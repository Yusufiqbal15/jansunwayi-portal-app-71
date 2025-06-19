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

// Create admin user if not exists
(async () => {
  const adminEmail = 'ayodhyaadmin@gmail.com';
  const adminPassword = 'AYODHYACOURTCASE';
  const adminRole = 'admin';

  const existingAdmin = await User.findOne({ adminid: adminEmail, role: adminRole });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await User.create({ adminid: adminEmail, password: hashedPassword, role: adminRole });
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }
})();

app.listen(5000, () => console.log('Server started on port 5000'));
