const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  imageUrl: {
    type: String,
    required: true
  },
  scanCount: {
    type: Number,
    default: 0
  },
  lastScannedAt: {
    type: Date
  }
});

// Index for efficient querying
qrCodeSchema.index({ userId: 1, generatedAt: -1 });

const QRCode = mongoose.model('QRCode', qrCodeSchema);

module.exports = QRCode; 