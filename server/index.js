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

// Enhanced Case schema to match frontend requirements
const caseSchema = new mongoose.Schema({
  caseNumber: { type: String, required: true },
  name: { type: String, required: true },
  filingDate: { type: Date, required: true },
  petitionNumber: String,
  noticeNumber: String,
  writType: String,
  department: { type: Number, required: true },
  subDepartment: { type: mongoose.Schema.Types.ObjectId, ref: 'SubDepartment' },
  status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' },
  hearingDate: Date,
  reminderSent: { type: Boolean, default: false },
  affidavitDueDate: Date,
  affidavitSubmissionDate: Date,
  counterAffidavitRequired: { type: Boolean, default: false },
  reminderSentCount: { type: Number, default: 0 },
  lastReminderSent: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Department schema
const departmentSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name_en: { type: String, required: true },
  name_hi: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// SubDepartment schema
const subDepartmentSchema = new mongoose.Schema({
  departmentId: { type: Number, required: true },
  name_en: { type: String, required: true },
  name_hi: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Email reminder schema
const emailReminderSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
  email: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['sent', 'failed'], default: 'sent' }
});

const Case = mongoose.model('Case', caseSchema);
const Department = mongoose.model('Department', departmentSchema);
const SubDepartment = mongoose.model('SubDepartment', subDepartmentSchema);
const EmailReminder = mongoose.model('EmailReminder', emailReminderSchema);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ===== CASE ENDPOINTS =====

// Get all cases with filtering and pagination
app.get('/cases', async (req, res) => {
  try {
    const { 
      department, 
      subDepartment, 
      status, 
      page, 
      limit,
      search 
    } = req.query;
    
    let query = {};
    
    if (department) query.department = parseInt(department);
    if (subDepartment) {
      // Handle both ObjectId and departmentId filtering
      if (mongoose.Types.ObjectId.isValid(subDepartment)) {
        query.subDepartment = subDepartment;
      } else {
        // If it's a departmentId, find sub-departments first
        const subDepts = await SubDepartment.find({ departmentId: parseInt(subDepartment) });
        const subDeptIds = subDepts.map(sub => sub._id);
        query.subDepartment = { $in: subDeptIds };
      }
    }
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { caseNumber: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { petitionNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    let casesQuery = Case.find(query).populate('subDepartment').sort({ createdAt: -1 });
    
    // Only apply pagination if both page and limit are provided
    if (page && limit) {
      const skip = (parseInt(page) - 1) * parseInt(limit);
      casesQuery = casesQuery.skip(skip).limit(parseInt(limit));
    }
    
    const cases = await casesQuery;
    const total = await Case.countDocuments(query);
    
    res.json({
      cases,
      pagination: page && limit ? {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      } : null
    });
  } catch (err) {
    console.error('Error fetching cases:', err);
    res.status(500).json({ error: 'Failed to fetch cases' });
  }
});

// Get case by ID
app.get('/cases/:id', async (req, res) => {
  try {
    const caseId = req.params.id;
    const caseData = await Case.findById(caseId);
    
    if (!caseData) {
      return res.status(404).json({ error: 'Case not found' });
    }
    
    res.json(caseData);
  } catch (err) {
    console.error('Error fetching case:', err);
    res.status(500).json({ error: 'Failed to fetch case' });
  }
});

// Create new case
app.post('/cases', async (req, res) => {
  try {
    const caseData = req.body;
    
    // If subDepartment is provided, validate it exists
    if (caseData.subDepartment) {
      const subDept = await SubDepartment.findById(caseData.subDepartment);
      if (!subDept) {
        return res.status(400).json({ error: 'Sub-department not found' });
      }
      // Use the sub-department's _id
      caseData.subDepartment = subDept._id;
    }
    
    console.log('Creating case with data:', caseData);
    const newCase = new Case(caseData);
    await newCase.save();
    
    // Populate sub-department details for response
    await newCase.populate('subDepartment');
    
    console.log('Case created successfully:', newCase);
    res.status(201).json(newCase);
  } catch (err) {
    console.error('Error creating case:', err);
    res.status(500).json({ error: 'Failed to create case' });
  }
});

// Update case
app.put('/cases/:id', async (req, res) => {
  try {
    const caseId = req.params.id;
    const updateData = { ...req.body, updatedAt: new Date() };
    
    const updatedCase = await Case.findByIdAndUpdate(
      caseId, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!updatedCase) {
      return res.status(404).json({ error: 'Case not found' });
    }
    
    res.json(updatedCase);
  } catch (err) {
    console.error('Error updating case:', err);
    res.status(500).json({ error: 'Failed to update case' });
  }
});

// Delete case
app.delete('/cases/:id', async (req, res) => {
  try {
    const caseId = req.params.id;
    const deletedCase = await Case.findByIdAndDelete(caseId);
    
    if (!deletedCase) {
      return res.status(404).json({ error: 'Case not found' });
    }
    
    res.json({ message: 'Case deleted successfully' });
  } catch (err) {
    console.error('Error deleting case:', err);
    res.status(500).json({ error: 'Failed to delete case' });
  }
});

// ===== SUB-DEPARTMENT ENDPOINTS =====

// Create sub-department
app.post('/sub-departments', async (req, res) => {
  try {
    const { departmentId, subDeptNameEn, subDeptNameHi } = req.body;
    
    // Validate department exists
    const department = await Department.findOne({ id: parseInt(departmentId) });
    if (!department) {
      return res.status(400).json({ error: 'Department not found' });
    }
    
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

// Get sub-departments with optional filtering
app.get('/sub-departments', async (req, res) => {
  try {
    const { departmentId } = req.query;
    let query = {};
    
    if (departmentId) {
      query.departmentId = parseInt(departmentId);
    }
    
    const subDepartments = await SubDepartment.find(query).sort({ createdAt: -1 });
    res.json(subDepartments);
  } catch (err) {
    console.error('Error fetching sub-departments:', err);
    res.status(500).json({ error: 'Failed to fetch sub-departments' });
  }
});

// Get sub-department by ID
app.get('/sub-departments/:id', async (req, res) => {
  try {
    const subDeptId = req.params.id;
    const subDepartment = await SubDepartment.findById(subDeptId);
    
    if (!subDepartment) {
      return res.status(404).json({ error: 'Sub-department not found' });
    }
    
    res.json(subDepartment);
  } catch (err) {
    console.error('Error fetching sub-department:', err);
    res.status(500).json({ error: 'Failed to fetch sub-department' });
  }
});

// Update sub-department
app.put('/sub-departments/:id', async (req, res) => {
  try {
    const subDeptId = req.params.id;
    const updateData = req.body;
    
    const updatedSubDept = await SubDepartment.findByIdAndUpdate(
      subDeptId,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedSubDept) {
      return res.status(404).json({ error: 'Sub-department not found' });
    }
    
    res.json(updatedSubDept);
  } catch (err) {
    console.error('Error updating sub-department:', err);
    res.status(500).json({ error: 'Failed to update sub-department' });
  }
});

// Delete sub-department
app.delete('/sub-departments/:id', async (req, res) => {
  try {
    const subDeptId = req.params.id;
    
    // Check if any cases are using this sub-department
    const casesUsingSubDept = await Case.findOne({ subDepartment: subDeptId });
    if (casesUsingSubDept) {
      return res.status(400).json({ 
        error: 'Cannot delete sub-department that has associated cases' 
      });
    }
    
    const deletedSubDept = await SubDepartment.findByIdAndDelete(subDeptId);
    
    if (!deletedSubDept) {
      return res.status(404).json({ error: 'Sub-department not found' });
    }
    
    res.json({ message: 'Sub-department deleted successfully' });
  } catch (err) {
    console.error('Error deleting sub-department:', err);
    res.status(500).json({ error: 'Failed to delete sub-department' });
  }
});

// ===== DEPARTMENT ENDPOINTS =====

// Get all departments
app.get('/departments', async (req, res) => {
  try {
    const departments = await Department.find({}).sort({ id: 1 });
    res.json(departments);
  } catch (err) {
    console.error('Error fetching departments:', err);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

// Get department by ID
app.get('/departments/:id', async (req, res) => {
  try {
    const department = await Department.findOne({ id: parseInt(req.params.id) });
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json(department);
  } catch (err) {
    console.error('Error fetching department:', err);
    res.status(500).json({ error: 'Failed to fetch department' });
  }
});

// Create department
app.post('/departments', async (req, res) => {
  try {
    const { id, name_en, name_hi } = req.body;
    
    // Check if department with this ID already exists
    const existingDept = await Department.findOne({ id: parseInt(id) });
    if (existingDept) {
      return res.status(400).json({ error: 'Department with this ID already exists' });
    }
    
    const newDepartment = new Department({
      id: parseInt(id),
      name_en,
      name_hi
    });
    
    await newDepartment.save();
    res.status(201).json(newDepartment);
  } catch (err) {
    console.error('Error creating department:', err);
    res.status(500).json({ error: 'Failed to create department' });
  }
});

// ===== EMAIL REMINDER ENDPOINTS =====

// Send email reminder
app.post('/email-reminders', async (req, res) => {
  try {
    const { caseId, email } = req.body;
    
    // Validate case exists
    const caseData = await Case.findById(caseId);
    if (!caseData) {
      return res.status(404).json({ error: 'Case not found' });
    }
    
    // Create email reminder record
    const emailReminder = new EmailReminder({
      caseId,
      email
    });
    
    await emailReminder.save();
    
    // Update case reminder count
    await Case.findByIdAndUpdate(caseId, {
      $inc: { reminderSentCount: 1 },
      reminderSent: true,
      lastReminderSent: new Date()
    });
    
    // TODO: Integrate with actual email service (SendGrid, AWS SES, etc.)
    console.log(`Email reminder sent for case ${caseId} to ${email}`);
    
    res.status(201).json({
      message: 'Email reminder sent successfully',
      reminderId: emailReminder._id
    });
  } catch (err) {
    console.error('Error sending email reminder:', err);
    res.status(500).json({ error: 'Failed to send email reminder' });
  }
});

// Get email reminders for a case
app.get('/email-reminders/case/:caseId', async (req, res) => {
  try {
    const { caseId } = req.params;
    const reminders = await EmailReminder.find({ caseId }).sort({ sentAt: -1 });
    res.json(reminders);
  } catch (err) {
    console.error('Error fetching email reminders:', err);
    res.status(500).json({ error: 'Failed to fetch email reminders' });
  }
});

// ===== STATISTICS ENDPOINTS =====

// Get dashboard statistics
app.get('/statistics', async (req, res) => {
  try {
    const totalCases = await Case.countDocuments();
    const pendingCases = await Case.countDocuments({ status: 'Pending' });
    const resolvedCases = await Case.countDocuments({ status: 'Resolved' });
    const totalDepartments = await Department.countDocuments();
    const totalSubDepartments = await SubDepartment.countDocuments();
    
    // Cases by department
    const casesByDepartment = await Case.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Recent cases
    const recentCases = await Case.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      totalCases,
      pendingCases,
      resolvedCases,
      totalDepartments,
      totalSubDepartments,
      casesByDepartment,
      recentCases
    });
  } catch (err) {
    console.error('Error fetching statistics:', err);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// ===== SEED DATA ENDPOINT =====

// Seed initial data
app.post('/seed-data', async (req, res) => {
  try {
    // Seed departments
    const departments = [
      { id: 1, name_en: "Administration Department", name_hi: "प्रशासन विभाग" },
      { id: 2, name_en: "Development Department", name_hi: "विकास विभाग" }
    ];
    
    for (const dept of departments) {
      await Department.findOneAndUpdate(
        { id: dept.id },
        dept,
        { upsert: true, new: true }
      );
    }
    
    res.json({ message: 'Seed data created successfully' });
  } catch (err) {
    console.error('Error seeding data:', err);
    res.status(500).json({ error: 'Failed to seed data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
  console.log(`API Documentation: Available endpoints:`);
  console.log(`- GET /cases - Get all cases`);
  console.log(`- POST /cases - Create new case`);
  console.log(`- PUT /cases/:id - Update case`);
  console.log(`- DELETE /cases/:id - Delete case`);
  console.log(`- GET /sub-departments - Get sub-departments`);
  console.log(`- POST /sub-departments - Create sub-department`);
  console.log(`- GET /departments - Get departments`);
  console.log(`- POST /email-reminders - Send email reminder`);
});