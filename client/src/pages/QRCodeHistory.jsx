import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
  Pagination,
  TextField,
  Stack,
  Button
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import axios from 'axios';
import config from '../config';
import QRCodeActions from '../components/QRCodeActions';

const ITEMS_PER_PAGE = 9;

const QRCodeHistory = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchText, setSearchText] = useState('');

  const fetchQrCodes = async () => {
    try {
      setLoading(true);
      let url = `${config.apiUrl}/qrcodes?page=${page}&limit=${ITEMS_PER_PAGE}`;
      
      if (startDate) {
        url += `&startDate=${startDate.toISOString()}`;
      }
      if (endDate) {
        url += `&endDate=${endDate.toISOString()}`;
      }
      if (searchText) {
        url += `&search=${encodeURIComponent(searchText)}`;
      }

      const response = await axios.get(url);
      setQrCodes(response.data.qrCodes || []);
      setTotalPages(Math.ceil((response.data.total || 0) / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      toast.error('Error fetching QR codes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQrCodes();
  }, [page, startDate, endDate, searchText]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = (event) => {
    setSearchText(event.target.value);
    setPage(1);
  };

  const handleDateChange = (type, date) => {
    if (type === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    setPage(1);
  };

  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSearchText('');
    setPage(1);
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          QR Code History
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} alignItems="center">
            <TextField
              label="Search QR Codes"
              variant="outlined"
              value={searchText}
              onChange={handleSearch}
              sx={{ minWidth: 200 }}
            />
            
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(date) => handleDateChange('start', date)}
                renderInput={(params) => <TextField {...params} />}
                sx={{ minWidth: 200 }}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(date) => handleDateChange('end', date)}
                renderInput={(params) => <TextField {...params} />}
                sx={{ minWidth: 200 }}
              />
            </LocalizationProvider>

            <Button 
              variant="outlined" 
              onClick={handleClearFilters}
              sx={{ minWidth: 120 }}
            >
              Clear Filters
            </Button>
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {qrCodes.map((qrCode) => (
            <Grid item xs={12} sm={6} md={4} key={qrCode._id}>
              <Card>
                <CardContent>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <img
                      src={qrCode.imageUrl}
                      alt="QR Code"
                      style={{ width: '100%', maxWidth: 200, height: 'auto' }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Created: {format(new Date(qrCode.generatedAt), 'PPpp')}
                  </Typography>
                  <Typography variant="body2" noWrap>
                    {qrCode.text}
                  </Typography>
                </CardContent>
                <CardActions>
                  <QRCodeActions qrCodeUrl={qrCode.imageUrl} qrText={qrCode.text} />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {totalPages > 1 && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default QRCodeHistory; 