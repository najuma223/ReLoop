import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { isDbConnected } from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'reloop-sustainable-water-secret-2026';

// Persistent memory store with seed demo accounts
export const memoryUsers = [
  {
    _id: 'seed-buyer-1',
    role: 'buyer',
    fullName: 'Green Valley Apartments',
    email: 'buyer@reloop.org',
    phone: '9876543210',
    passwordHash: bcrypt.hashSync('Password123!', 10),
    organization: 'Green Valley Residential Society',
  },
  {
    _id: 'seed-supplier-1',
    role: 'supplier',
    fullName: 'Apex Tech Park STP',
    email: 'supplier@reloop.org',
    phone: '9811122334',
    passwordHash: bcrypt.hashSync('Password123!', 10),
    organization: 'Apex Commercial Facilities Ltd.',
  },
  {
    _id: 'seed-transporter-1',
    role: 'transporter',
    fullName: 'EcoFlow Logistics Fleet',
    email: 'transporter@reloop.org',
    phone: '9877766554',
    passwordHash: bcrypt.hashSync('Password123!', 10),
    organization: 'EcoFlow Water Tanker Services',
  },
  {
    _id: 'seed-verifier-1',
    role: 'verifier',
    fullName: 'AquaCert Labs Quality Assurance',
    email: 'verifier@reloop.org',
    phone: '9844433221',
    passwordHash: bcrypt.hashSync('Password123!', 10),
    organization: 'AquaCert Environmental Testing Services',
  },
];

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { role, fullName, email, phone, password } = req.body;

    if (!email || !password || !fullName || !role) {
      return res.status(400).json({ error: 'All required fields must be filled.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    // Clean and validate phone number (digits only, max 10)
    const cleanedPhone = phone ? phone.replace(/\D/g, '').slice(0, 10) : '';

    if (cleanedPhone && cleanedPhone.length !== 10) {
      return res.status(400).json({ error: 'Phone number must be exactly 10 digits.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let createdId = 'user-' + Date.now();

    // 1. Save to MongoDB if connected
    if (isDbConnected()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }

      const newUser = await User.create({
        role,
        fullName: fullName.trim(),
        email: normalizedEmail,
        phone: cleanedPhone,
        password: hashedPassword,
        organization: fullName.trim(),
      });
      createdId = newUser._id.toString();
    }

    // 2. Also keep memory store synchronized
    const memIndex = memoryUsers.findIndex((u) => u.email === normalizedEmail);
    const newMemoryUser = {
      _id: createdId,
      role,
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: cleanedPhone,
      passwordHash: hashedPassword,
      organization: fullName.trim(),
    };

    if (memIndex >= 0) {
      memoryUsers[memIndex] = newMemoryUser;
    } else {
      memoryUsers.push(newMemoryUser);
    }

    const token = jwt.sign(
      { id: createdId, role, email: normalizedEmail },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: createdId,
        role,
        fullName: fullName.trim(),
        email: normalizedEmail,
        phone: cleanedPhone,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedInput = email.toLowerCase().trim();
    const digitsOnly = email.replace(/\D/g, '');

    let matchedUser = null;

    // Check MongoDB first if available
    if (isDbConnected()) {
      matchedUser = await User.findOne({
        $or: [
          { email: normalizedInput },
          ...(digitsOnly.length >= 10 ? [{ phone: digitsOnly.slice(-10) }] : []),
        ],
      });

      if (matchedUser) {
        const isMatch = await bcrypt.compare(password, matchedUser.password);
        if (!isMatch) {
          return res.status(401).json({ error: 'Invalid email/phone or password.' });
        }

        // Strict role matching: account role must match the selected account type
        if (role && matchedUser.role && matchedUser.role.toLowerCase() !== role.toLowerCase()) {
          const registeredRoleCap = matchedUser.role.charAt(0).toUpperCase() + matchedUser.role.slice(1);
          const selectedRoleCap = role.charAt(0).toUpperCase() + role.slice(1);
          return res.status(403).json({
            error: `Role Mismatch: This account is registered as "${registeredRoleCap}", but you selected "${selectedRoleCap}". Please select "${registeredRoleCap}" to sign in.`,
          });
        }

        const effectiveRole = matchedUser.role;
        const token = jwt.sign(
          { id: matchedUser._id, role: effectiveRole, email: matchedUser.email },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        return res.json({
          message: 'Login successful',
          token,
          user: {
            id: matchedUser._id,
            role: effectiveRole,
            fullName: matchedUser.fullName,
            email: matchedUser.email,
            phone: matchedUser.phone,
            organization: matchedUser.organization,
          },
        });
      }
    }

    // Check memory store
    const memUser = memoryUsers.find(
      (u) =>
        u.email === normalizedInput ||
        (digitsOnly.length >= 10 && u.phone === digitsOnly.slice(-10))
    );

    if (memUser) {
      const isMatch = bcrypt.compareSync(password, memUser.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email/phone or password.' });
      }

      // Strict role matching in memory store
      if (role && memUser.role && memUser.role.toLowerCase() !== role.toLowerCase()) {
        const registeredRoleCap = memUser.role.charAt(0).toUpperCase() + memUser.role.slice(1);
        const selectedRoleCap = role.charAt(0).toUpperCase() + role.slice(1);
        return res.status(403).json({
          error: `Role Mismatch: This account is registered as "${registeredRoleCap}", but you selected "${selectedRoleCap}". Please select "${registeredRoleCap}" to sign in.`,
        });
      }

      const effectiveRole = memUser.role;
      const token = jwt.sign(
        { id: memUser._id, role: effectiveRole, email: memUser.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        message: 'Login successful',
        token,
        user: {
          id: memUser._id,
          role: effectiveRole,
          fullName: memUser.fullName,
          email: memUser.email,
          phone: memUser.phone,
          organization: memUser.organization,
        },
      });
    }

    return res.status(401).json({ error: 'Account not found. Please check your credentials or register.' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// GET CURRENT USER
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No authorization token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: decoded });
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
});

export default router;
