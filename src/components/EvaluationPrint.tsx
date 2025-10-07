import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Print } from '@mui/icons-material';
import { colors, typography, spacing, buttons, shadows } from '../theme/designSystem';

interface EvaluationPrintProps {
  patient: {
    name: string;
    birthDate: string;
    responsible: string;
  };
  evaluation: {
    id: string;
    form: string;
    createdDate: string;
    deadline: string;
    status: string;
    observations: string;
    requestedBy: string;
  };
}

const EvaluationPrint: React.FC<EvaluationPrintProps> = ({ patient, evaluation }) => {
  // Função para formatar datas de YYYY-MM-DD para DD/MM/YYYY
  const formatDateToBR = (dateString: string): string => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // Mock data - TODO: Replace with actual database query
  const clinicData = {
    name: 'INSTITUTO NINHO',
    address: 'Azenedo Marinho Fornagioli, 1170',
    cnpj: 'CNPJ: 44.694.160/0001-79',
    phone: '+55 11 4990707',
    email: 'atendimento@ninhoinstituto.com.br',
    fullAddress: 'R: Monsenhor Nuno de Faria Paiva, 177, Mogilar - Mogi das Cruzes - SP',
    logo: null
  };

  const reportData = {
    emissionDate: new Date().toLocaleDateString('pt-BR'),
    patient: {
      name: patient.name || 'Paciente Teste',
      birthDate: patient.birthDate || '15/08/2023',
      responsible: patient.responsible || 'Pacitente Teste Responsável 1'
    },
    evaluation: {
      form: evaluation.form || 'Avaliação Inicial',
      createdDate: evaluation.createdDate || '01/01/2025',
      deadline: evaluation.deadline || '31/01/2025',
      status: evaluation.status || 'Em andamento',
      observations: evaluation.observations || '',
      requestedBy: evaluation.requestedBy || 'Dr. Silva'
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: colors.background,
        padding: '2rem',
        '@media print': {
          padding: '0',
          backgroundColor: '#fff'
        }
      }}
    >
      {/* Print Button - Hide on print */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mb: spacing.md,
          '@media print': {
            display: 'none'
          }
        }}
      >
        <Button
          variant="contained"
          startIcon={<Print />}
          onClick={handlePrint}
          sx={{
            backgroundColor: colors.primary,
            color: colors.white,
            padding: buttons.primary.padding,
            fontSize: buttons.primary.fontSize,
            fontWeight: buttons.primary.fontWeight,
            textTransform: buttons.primary.textTransform,
            borderRadius: buttons.primary.borderRadius,
            boxShadow: buttons.primary.boxShadow,
            '&:hover': {
              backgroundColor: colors.primaryHover,
              boxShadow: buttons.primary.hover.boxShadow
            }
          }}
        >
          Imprimir
        </Button>
      </Box>

      {/* Print Content */}
      <Paper
        sx={{
          maxWidth: '210mm',
          margin: '0 auto',
          padding: '20mm',
          backgroundColor: colors.white,
          minHeight: '297mm',
          boxShadow: shadows.base,
          borderRadius: '12px',
          '@media print': {
            boxShadow: shadows.none,
            margin: 0,
            maxWidth: 'none',
            padding: '15mm',
            borderRadius: 0
          }
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: spacing.xl,
            pb: spacing.md,
            borderBottom: `2px solid ${colors.backgroundAlt}`
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: `2px solid ${colors.primary}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.primaryLight
            }}
          >
            <Typography
              sx={{
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.bold,
                color: colors.primary,
                textAlign: 'center',
                lineHeight: 1.2,
                whiteSpace: 'pre-line'
              }}
            >
              {clinicData.name.split(' ').join('\n')}
            </Typography>
          </Box>

          {/* Clinic Info */}
          <Box sx={{ textAlign: 'right' }}>
            <Typography
              sx={{
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.bold,
                color: colors.textPrimary,
                mb: spacing.xs
              }}
            >
              {clinicData.name}
            </Typography>
            <Typography
              sx={{
                fontSize: typography.fontSize.xs,
                color: colors.textSecondary,
                lineHeight: 1.6
              }}
            >
              {clinicData.address}
              <br />
              {clinicData.cnpj}
            </Typography>
          </Box>
        </Box>

        {/* Title */}
        <Box sx={{ textAlign: 'center', mb: spacing.xl }}>
          <Typography
            sx={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.textPrimary,
              mb: spacing.xs
            }}
          >
            Avaliação - Data de emissão: {reportData.emissionDate}
          </Typography>
        </Box>

        {/* Patient Information */}
        <Box sx={{ mb: spacing.xl }}>
          <Box sx={{ display: 'flex', gap: '2rem', mb: spacing.sm }}>
            <Typography sx={{ fontSize: typography.fontSize.sm, color: colors.textPrimary }}>
              <strong>Paciente:</strong> {reportData.patient.name}
            </Typography>
            <Typography sx={{ fontSize: typography.fontSize.sm, color: colors.textPrimary }}>
              <strong>Data nasc.:</strong> {reportData.patient.birthDate}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: typography.fontSize.sm, color: colors.textPrimary, mb: spacing.md }}>
            <strong>Responsável:</strong> {reportData.patient.responsible}
          </Typography>

          <Box sx={{ display: 'flex', gap: '2rem', mb: spacing.sm }}>
            <Typography sx={{ fontSize: typography.fontSize.sm, color: colors.textPrimary }}>
              <strong>Formulário:</strong> {reportData.evaluation.form}
            </Typography>
            <Typography sx={{ fontSize: typography.fontSize.sm, color: colors.textPrimary }}>
              <strong>Status:</strong> {reportData.evaluation.status}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: '2rem', mb: spacing.md }}>
            <Typography sx={{ fontSize: typography.fontSize.sm, color: colors.textPrimary }}>
              <strong>Data Criação:</strong> {reportData.evaluation.createdDate}
            </Typography>
            <Typography sx={{ fontSize: typography.fontSize.sm, color: colors.textPrimary }}>
              <strong>Prazo:</strong> {reportData.evaluation.deadline}
            </Typography>
          </Box>

          <Typography sx={{ fontSize: typography.fontSize.sm, color: colors.textPrimary }}>
            <strong>Solicitante:</strong> {reportData.evaluation.requestedBy}
          </Typography>
        </Box>

        {/* Content Area - TODO: Add evaluation content */}
        <Box
          sx={{
            mb: spacing.xl,
            minHeight: '400px',
            padding: spacing.lg,
            backgroundColor: colors.background,
            borderRadius: '8px',
            border: `1px solid ${colors.border}`
          }}
        >
          <Typography
            sx={{
              fontSize: typography.fontSize.sm,
              color: colors.textSecondary,
              textAlign: 'center',
              fontStyle: 'italic',
              mt: '180px'
            }}
          >
            [Conteúdo da avaliação será desenvolvido posteriormente]
          </Typography>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            mt: spacing.xl,
            pt: spacing.md,
            borderTop: `1px solid ${colors.border}`,
            textAlign: 'center'
          }}
        >
          <Typography sx={{ fontSize: typography.fontSize.xs, color: colors.textSecondary }}>
            {clinicData.fullAddress}
          </Typography>
          <Typography sx={{ fontSize: typography.fontSize.xs, color: colors.textSecondary }}>
            Telefone: {clinicData.phone}
          </Typography>
          <Typography sx={{ fontSize: typography.fontSize.xs, color: colors.textSecondary }}>
            E-mail: {clinicData.email}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default EvaluationPrint;
