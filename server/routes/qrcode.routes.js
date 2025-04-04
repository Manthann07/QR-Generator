const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth.middleware');
const QRCodeModel = require('../models/qrcode.model');
const nodemailer = require('nodemailer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `qr-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// In-memory storage for QR codes
const qrCodes = [];

// Generate QR Code
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }

    // Generate QR code as data URL
    const qrCodeUrl = await QRCode.toDataURL(text);
    
    // Store QR code in memory
    const qrCode = {
      _id: Date.now().toString(),
      text,
      imageUrl: qrCodeUrl,
      generatedAt: new Date()
    };
    qrCodes.unshift(qrCode); // Add to beginning of array

    res.json({ qrCodeUrl });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ message: 'Error generating QR code' });
  }
});

// Get all QR codes with pagination
router.get('/', (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    let filteredQrCodes = [...qrCodes];

    // Apply date filter if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredQrCodes = filteredQrCodes.filter(qr => {
        const date = new Date(qr.generatedAt);
        return date >= start && date <= end;
      });
    }

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedQrCodes = filteredQrCodes.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredQrCodes.length / limit);

    res.json({
      qrCodes: paginatedQrCodes,
      totalPages,
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error fetching QR codes:', error);
    res.status(500).json({ message: 'Error fetching QR codes' });
  }
});

// Delete QR Code
router.delete('/:id', auth, async (req, res) => {
  try {
    const qrCode = await QRCodeModel.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!qrCode) {
      return res.status(404).json({ message: 'QR Code not found' });
    }

    // Delete the image file
    const filePath = path.join(__dirname, '..', qrCode.imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await qrCode.remove();

    res.json({ message: 'QR Code deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting QR code', error: error.message });
  }
});

// Share QR Code via email
router.post('/share', auth, async (req, res) => {
  try {
    const { qrCodeId, recipientEmail } = req.body;

    const qrCode = await QRCodeModel.findOne({
      _id: qrCodeId,
      userId: req.user._id
    });

    if (!qrCode) {
      return res.status(404).json({ message: 'QR Code not found' });
    }

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: 'Shared QR Code',
      html: `
        <h1>QR Code Shared</h1>
        <p>Here's your QR Code:</p>
        <img src="${process.env.SERVER_URL}${qrCode.imageUrl}" alt="QR Code" />
        <p>Text content: ${qrCode.text}</p>
      `
    });

    res.json({ message: 'QR Code shared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sharing QR code', error: error.message });
  }
});

module.exports = router; 