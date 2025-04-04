import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Box
} from '@mui/material';
import {
  QrCode as QrCodeIcon,
  QrCodeScanner as QrCodeScannerIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <QrCodeIcon sx={{ fontSize: 40 }} />,
      title: 'Generate QR Codes',
      description: 'Create QR codes for any text or URL with just a few clicks.'
    },
    {
      icon: <QrCodeScannerIcon sx={{ fontSize: 40 }} />,
      title: 'Scan QR Codes',
      description: 'Use your device\'s camera to scan and decode QR codes instantly.'
    },
    {
      icon: <HistoryIcon sx={{ fontSize: 40 }} />,
      title: 'Track History',
      description: 'Keep track of all your generated and scanned QR codes.'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          QR Code Generator & Scanner
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Create, scan, and manage QR codes with ease
        </Typography>
        {!isAuthenticated && (
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{ mt: 2 }}
          >
            Get Started
          </Button>
        )}
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <Box sx={{ mb: 2, color: 'primary.main' }}>
                {feature.icon}
              </Box>
              <Typography variant="h5" component="h2" gutterBottom>
                {feature.title}
              </Typography>
              <Typography color="text.secondary">
                {feature.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home; 