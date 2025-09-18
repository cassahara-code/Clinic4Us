import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useCreatePatient } from '../hooks/usePatients';

const AddPatientForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const { mutate: createPatient, isPending, error, isSuccess } = useCreatePatient();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPatient(formData, {
      onSuccess: () => {
        setFormData({ name: '', email: '', phone: '' });
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Adicionar Novo Paciente
        </Typography>
        
        {isSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Paciente adicionado com sucesso!
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Erro ao adicionar paciente
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Nome"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
            disabled={isPending}
          />
          
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            disabled={isPending}
          />
          
          <TextField
            fullWidth
            label="Telefone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            margin="normal"
            required
            disabled={isPending}
          />
          
          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isPending || !formData.name || !formData.email || !formData.phone}
              startIcon={isPending && <CircularProgress size={20} />}
            >
              {isPending ? 'Adicionando...' : 'Adicionar Paciente'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AddPatientForm;