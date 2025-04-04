import { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import config from '../config';

const QRCodeGenerator = () => {
  const [text, setText] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text) {
      toast.error('Please enter text or URL');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${config.apiUrl}/qrcodes`, { text });
      setQrCode(response.data.qrCodeUrl);
      toast.success('QR code generated successfully!');
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Error generating QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Generate QR Code
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Enter text or URL"
            value={text}
            onChange={(e) => setText(e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Generate QR Code'}
          </Button>
        </form>

        {qrCode && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <img
              src={qrCode}
              alt="Generated QR Code"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={handleDownload}
              sx={{ mt: 2 }}
            >
              Download QR Code
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default QRCodeGenerator; 