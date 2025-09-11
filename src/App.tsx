import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Typography, Box, Card, CardContent, Button, Grid } from '@mui/material';
import { LocalHospital } from '@mui/icons-material';
import PatientsList from './components/PatientsList';
import AddPatientForm from './components/AddPatientForm';

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <LocalHospital sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
              <Typography variant="h3" component="h1" gutterBottom>
                Clinic4US
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom>
                      Bem-vindo ao Sistema de Gestão Clínica
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Sistema completo para gerenciamento de clínicas e consultórios médicos.
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Button variant="contained" sx={{ mr: 2 }}>
                        Pacientes
                      </Button>
                      <Button variant="outlined">
                        Agendamentos
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <PatientsList />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <AddPatientForm />
              </Grid>
            </Grid>
          </Box>
        </Container>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
