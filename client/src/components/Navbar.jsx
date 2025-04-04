import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import QrCodeIcon from '@mui/icons-material/QrCode';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <QrCodeIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          QR Code Generator
        </Typography>
        <Box>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
          >
            Generate
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/scan"
          >
            Scan
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/history"
          >
            History
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 