import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from '@mui/material';
import { Person } from '@mui/icons-material';
import { usePatients } from '../hooks/usePatients';

const PatientsList: React.FC = () => {
  const {
    data: patients,
    isLoading,
    error
  } = usePatients();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Erro ao carregar pacientes
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Lista de Pacientes
        </Typography>
        <List>
          {patients?.map((patient) => (
            <ListItem key={patient.id}>
              <ListItemAvatar>
                <Avatar>
                  <Person />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={patient.name}
                secondary={
                  <React.Fragment>
                    <Typography variant="body2" color="text.primary">
                      {patient.email}
                    </Typography>
                    {patient.phone}
                  </React.Fragment>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default PatientsList;