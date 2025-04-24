const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_jwt_secret_key'; // Replace with a secure key in production

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/siwes', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
});
const User = mongoose.model('User', userSchema);

// Application Schema
const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nameOfStudent: { type: String, required: true },
  matricNumber: { type: String, required: true },
  studentEmailAddress: { type: String, required: true },
  courseOfStudy: { type: String, required: true },
  levelOfStudy: { type: String, required: true },
  periodOfAttachmentFrom: { type: String, required: true },
  periodOfAttachmentTo: { type: String, required: true },
  placementOfAddress: { type: String, required: true },
  bankCode: { type: String, required: true },
  bankName: { type: String, required: true },
  accountHolderName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  sortCode: { type: String, required: true },
  siwesYear: { type: String, required: true },
  remarks: { type: String },
  status: { type: String, enum: ['Pending', 'Approved'], default: 'Pending' },
  submissionDate: { type: Date, default: Date.now },
});
const Application = mongoose.model('Application', applicationSchema);

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Register Endpoint
app.post(
  '/api/register',
  [
    body('name').notEmpty().trim().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        email,
        password: hashedPassword,
        role: email === 'admin@example.com' ? 'admin' : 'user', // Mock admin assignment
      });
      await user.save();

      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
      res.status(201).json({ token, user: { id: user._id, name, email, role: user.role } });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login Endpoint
app.post(
  '/api/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Submit Application Endpoint
app.post('/api/submit-application', authenticateToken, async (req, res) => {
  const {
    nameOfStudent,
    matricNumber,
    studentEmailAddress,
    courseOfStudy,
    levelOfStudy,
    periodOfAttachmentFrom,
    periodOfAttachmentTo,
    placementOfAddress,
    bankCode,
    bankName,
    accountHolderName,
    accountNumber,
    sortCode,
    siwesYear,
    remarks,
  } = req.body;

  try {
    const application = new Application({
      userId: req.user.id,
      nameOfStudent,
      matricNumber,
      studentEmailAddress,
      courseOfStudy,
      levelOfStudy,
      periodOfAttachmentFrom,
      periodOfAttachmentTo,
      placementOfAddress,
      bankCode,
      bankName,
      accountHolderName,
      accountNumber,
      sortCode,
      siwesYear,
      remarks,
    });
    await application.save();
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get User's Application Status
app.get('/api/application', authenticateToken, async (req, res) => {
  try {
    const application = await Application.findOne({ userId: req.user.id });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Submissions (Admin Only)
app.get('/api/submissions', authenticateToken, isAdmin, async (req, res) => {
  try {
    const submissions = await Application.find().populate('userId', 'name email');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve Application (Admin Only)
app.patch('/api/submissions/:id/approve', authenticateToken, isAdmin, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    application.status = 'Approved';
    await application.save();
    res.json({ message: 'Application approved', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Download Submissions as CSV (Admin Only)
app.get('/api/submissions/download', authenticateToken, isAdmin, async (req, res) => {
  try {
    const submissions = await Application.find().populate('userId', 'name email');
    const headers = [
      'Name',
      'Matric Number',
      'Email',
      'Course of Study',
      'Status',
      'Submission Date',
      'Level of Study',
      'Period of Attachment (From)',
      'Period of Attachment (To)',
      'Placement Address',
      'Bank Code',
      'Bank Name',
      'Account Holder Name',
      'Account Number',
      'Sort Code',
      'SIWES Year',
      'Remarks',
    ];
    const rows = submissions.map((app) => [
      app.nameOfStudent,
      app.matricNumber,
      app.studentEmailAddress,
      app.courseOfStudy,
      app.status,
      app.submissionDate.toISOString().split('T')[0],
      app.levelOfStudy,
      app.periodOfAttachmentFrom,
      app.periodOfAttachmentTo,
      app.placementOfAddress,
      app.bankCode,
      app.bankName,
      app.accountHolderName,
      app.accountNumber,
      app.sortCode,
      app.siwesYear,
      app.remarks || '',
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    res.header('Content-Type', 'text/csv');
    res.attachment('siwes_submissions.csv');
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});