import { Routes, Route } from 'react-router-dom';
import { CssBaseline, Container } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import QRCodeGenerator from './pages/QRCodeGenerator';
import QRCodeScanner from './pages/QRCodeScanner';
import QRCodeHistory from './pages/QRCodeHistory';

function App() {
  return (
    <>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<QRCodeGenerator />} />
          <Route path="/scan" element={<QRCodeScanner />} />
          <Route path="/history" element={<QRCodeHistory />} />
        </Routes>
      </Container>
    </>
  );
}

export default App; 