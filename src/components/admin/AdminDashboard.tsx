import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { PlanList } from "./PlanList";

export const AdminDashboard: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h3" gutterBottom align="center">
          Painel Administrativo
        </Typography>
        <PlanList />
      </Box>
    </Container>
  );
};
