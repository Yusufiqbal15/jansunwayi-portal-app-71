const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://yadavanubhav848:zHjucA4rNlmQNaay@cluster1.hcyqa2d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define a simple Case schema for demonstration
const caseSchema = new mongoose.Schema({
  caseNumber: String,
  name: String,
  filingDate: Date,
  petitionNumber: String,
  noticeNumber: String,
  writType: String,
  department: Number,
  status: String,
  hearingDate: Date,
  reminderSent: Boolean,
  affidavitDueDate: Date,
  affidavitSubmissionDate: Date,
  counterAffidavitRequired: Boolean,
  reminderSentCount: Number,
});

// Define Department schema
const departmentSchema = new mongoose.Schema({
  id: Number,
  name_en: String,
  name_hi: String,
  createdAt: { type: Date, default: Date.now }
});

// Define SubDepartment schema
const subDepartmentSchema = new mongoose.Schema({
  departmentId: Number,
  name_en: String,
  name_hi: String,
  createdAt: { type: Date, default: Date.now }
});

const Case = mongoose.model('Case', caseSchema);
const Department = mongoose.model('Department', departmentSchema);
const SubDepartment = mongoose.model('SubDepartment', subDepartmentSchema);

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.get('/cases', async (req, res) => {
  try {
    const cases = await Case.find({});
    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cases' });
  }
});

app.post('/sub-departments', async (req, res) => {
  try {
    const { departmentId, subDeptNameEn, subDeptNameHi } = req.body;
    
    const newSubDepartment = new SubDepartment({
      departmentId: parseInt(departmentId),
      name_en: subDeptNameEn,
      name_hi: subDeptNameHi
    });
    
    await newSubDepartment.save();
    res.status(201).json(newSubDepartment);
  } catch (err) {
    console.error('Error saving sub-department:', err);
    res.status(500).json({ error: 'Failed to save sub-department' });
  }
});

app.get('/sub-departments', async (req, res) => {
  try {
    const { departmentId } = req.query;
    let query = {};
    
    if (departmentId) {
      query.departmentId = parseInt(departmentId);
    }
    
    const subDepartments = await SubDepartment.find(query);
    res.json(subDepartments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sub-departments' });
  }
});

app.get('/departments', async (req, res) => {
  try {
    const departments = await Department.find({}).sort({ id: 1 });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

app.get('/departments/:id', async (req, res) => {
  try {
    const department = await Department.findOne({ id: parseInt(req.params.id) });
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json(department);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch department' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 