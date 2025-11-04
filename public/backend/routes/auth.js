const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { db, COLLECTIONS } = require('../config/firebase');
const { sendVerificationEmail } = require('../utils/emailService');

const router = express.Router();

// Register user
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['student', 'institute', 'company']),
  body('name').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role, name, additionalData } = req.body;

    // Check if user already exists
    const usersRef = db.collection(COLLECTIONS.USERS);
    const snapshot = await usersRef.where('email', '==', email).get();
    if (!snapshot.empty) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const userData = {
      email,
      password: hashedPassword,
      role,
      name,
      isVerified: false,
      verificationToken: Math.random().toString(36).substring(2),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add role-specific data
    if (role === 'student') {
      userData.studentData = {
        highSchool: additionalData?.highSchool || '',
        graduationYear: additionalData?.graduationYear || '',
        qualifications: []
      };
    } else if (role === 'institute') {
      userData.instituteData = {
        type: additionalData?.type || '',
        location: additionalData?.location || '',
        accreditation: additionalData?.accreditation || ''
      };
    } else if (role === 'company') {
      userData.companyData = {
        industry: additionalData?.industry || '',
        size: additionalData?.size || '',
        location: additionalData?.location || '',
        isApproved: false
      };
    }

    const userRef = await usersRef.add(userData);
    
    // Send verification email
    await sendVerificationEmail(email, userData.verificationToken);

    res.status(201).json({
      message: 'User registered successfully. Please check your email for verification.',
      userId: userRef.id
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify email
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const usersRef = db.collection(COLLECTIONS.USERS);
    const snapshot = await usersRef.where('verificationToken', '==', token).get();
    
    if (snapshot.empty) {
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    const userDoc = snapshot.docs[0];
    await usersRef.doc(userDoc.id).update({
      isVerified: true,
      verificationToken: null,
      updatedAt: new Date()
    });

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const usersRef = db.collection(COLLECTIONS.USERS);
    const snapshot = await usersRef.where('email', '==', email).get();
    
    if (snapshot.empty) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    if (!user.isVerified) {
      return res.status(401).json({ error: 'Please verify your email first' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: {
        id: userDoc.id,
        ...userWithoutPassword
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;