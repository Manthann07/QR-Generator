import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Link
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import config from '../config';

const QRCodeScanner = () => {
  const [result, setResult] = useState('');
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const html5QrCode = useRef(null);
  const fileInputRef = useRef(null);

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  useEffect(() => {
    html5QrCode.current = new Html5Qrcode('reader');
    return () => {
      if (html5QrCode.current?.isScanning) {
        html5QrCode.current.stop();
      }
    };
  }, []);

  const onScanSuccess = async (decodedText) => {
    setResult(decodedText);
    setScanDialogOpen(true);
    
    try {
      setLoading(true);
      await axios.post(`${config.apiUrl}/qrcodes/scan`, { text: decodedText });
      toast.success('QR code scanned successfully!');
    } catch (error) {
      console.error('Error updating scan count:', error);
      toast.error('Error updating scan count');
    } finally {
      setLoading(false);
    }
  };

  const onScanError = (error) => {
    console.warn(error);
  };

  const handleCloseDialog = () => {
    setScanDialogOpen(false);
    setResult('');
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast.success('Copied to clipboard!');
  };

  const handleOpenUrl = () => {
    if (isValidUrl(result)) {
      window.open(result, '_blank', 'noopener,noreferrer');
    }
  };

  const startScanning = async () => {
    try {
      setScanning(true);
      await html5QrCode.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        onScanSuccess,
        onScanError
      );
    } catch (err) {
      console.error('Error starting scanner:', err);
      toast.error('Failed to start camera scanner');
      setScanning(false);
    }
  };

  const stopScanning = async () => {
    try {
      await html5QrCode.current.stop();
      setScanning(false);
    } catch (err) {
      console.error('Error stopping scanner:', err);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const result = await html5QrCode.current.scanFile(file, true);
      onScanSuccess(result);
    } catch (err) {
      console.error('Error scanning file:', err);
      toast.error('Failed to scan QR code from file');
    } finally {
      setLoading(false);
      event.target.value = ''; // Reset file input
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Scan QR Code
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            onClick={scanning ? stopScanning : startScanning}
            color={scanning ? "error" : "primary"}
          >
            {scanning ? "Stop Scanning" : "Start Camera Scanning"}
          </Button>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
            ref={fileInputRef}
          />
          <Button
            variant="outlined"
            onClick={() => fileInputRef.current?.click()}
            disabled={scanning || loading}
          >
            Scan from File
          </Button>
        </Box>

        <Box sx={{ mt: 3, maxWidth: 500, mx: 'auto' }}>
          <div id="reader" style={{ width: '100%' }}></div>
        </Box>
      </Paper>

      <Dialog open={scanDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Scanned Result</DialogTitle>
        <DialogContent>
          <Typography 
            sx={{ 
              wordBreak: 'break-all',
              ...(isValidUrl(result) && {
                color: 'primary.main',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline'
                }
              })
            }}
            onClick={isValidUrl(result) ? handleOpenUrl : undefined}
          >
            {result}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopyToClipboard} disabled={loading}>
            Copy
          </Button>
          {isValidUrl(result) && (
            <Button onClick={handleOpenUrl} color="primary" disabled={loading}>
              Open URL
            </Button>
          )}
          <Button onClick={handleCloseDialog} variant="contained" disabled={loading}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default QRCodeScanner; 