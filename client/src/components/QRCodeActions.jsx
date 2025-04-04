import React from 'react';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Download as DownloadIcon,
  ContentCopy as CopyIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const QRCodeActions = ({ qrCodeUrl, qrText }) => {
  const [emailDialogOpen, setEmailDialogOpen] = React.useState(false);
  const [emailData, setEmailData] = React.useState({ to: '', subject: 'QR Code Share', message: '' });

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR Code downloaded successfully!');
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(qrCodeUrl);
    toast.success('QR Code URL copied to clipboard!');
  };

  const handleEmailShare = () => {
    const mailtoLink = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(
      `${emailData.message}\n\nQR Code URL: ${qrCodeUrl}\nContent: ${qrText}`
    )}`;
    window.location.href = mailtoLink;
    setEmailDialogOpen(false);
    toast.success('Email client opened with QR code details!');
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <Tooltip title="Download QR Code">
        <IconButton onClick={handleDownload} color="primary">
          <DownloadIcon />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Copy QR Code URL">
        <IconButton onClick={handleCopyUrl} color="primary">
          <CopyIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Share via Email">
        <IconButton onClick={() => setEmailDialogOpen(true)} color="primary">
          <EmailIcon />
        </IconButton>
      </Tooltip>

      <Dialog open={emailDialogOpen} onClose={() => setEmailDialogOpen(false)}>
        <DialogTitle>Share QR Code via Email</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="To"
            type="email"
            value={emailData.to}
            onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Subject"
            value={emailData.subject}
            onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Message"
            multiline
            rows={4}
            value={emailData.message}
            onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmailDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEmailShare} variant="contained" color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QRCodeActions; 