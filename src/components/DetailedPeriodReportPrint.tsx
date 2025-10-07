import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Print } from '@mui/icons-material';
import { colors, typography, spacing, buttons, shadows } from '../theme/designSystem';

interface TherapyPlanDetail {
  id: string;
  number: number;
  title: string;
  responsibles: string;
  priority: string;
  startDate: string;
  endDate: string;
  progress: number;
  justification: string;
  objective: string;
  metric: string;
  observations: string;
  scoreInitial: number;
  scoreLatest: number;
  scoreAverage: number;
}

interface DetailedPeriodReportPrintProps {
  patient: {
    name: string;
    birthDate: string;
    responsible: string;
  };
  period: {
    id: string;
    startDate: string;
    endDate: string;
  };
  plans: TherapyPlanDetail[];
}

const DetailedPeriodReportPrint: React.FC<DetailedPeriodReportPrintProps> = ({ patient, period, plans }) => {
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
    period: {
      id: period.id || 'Período 02',
      startDate: period.startDate || '01/09/2024',
      endDate: period.endDate || '30/09/2024'
    },
    currentStatus: 'Considera o score das últimas evoluções registradas no período',
    plans: plans || []
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
            Plano Terapêutico - Data de emissão: {reportData.emissionDate}
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

          <Box sx={{ display: 'flex', gap: '2rem', mb: spacing.md }}>
            <Typography sx={{ fontSize: typography.fontSize.sm, color: colors.textPrimary }}>
              <strong>Início:</strong> {reportData.period.startDate}
            </Typography>
            <Typography sx={{ fontSize: typography.fontSize.sm, color: colors.textPrimary }}>
              <strong>Final:</strong> {reportData.period.endDate}
            </Typography>
          </Box>

          <Typography sx={{ fontSize: typography.fontSize.sm, color: colors.textPrimary }}>
            <strong>Panorama atual:</strong> {reportData.currentStatus}
          </Typography>
        </Box>

        {/* Detailed Plans Table */}
        <Box sx={{ mb: spacing.xl }}>
          {/* Legend */}
          <Box sx={{ mb: spacing.sm, display: 'flex', justifyContent: 'flex-end' }}>
            <Typography sx={{ fontSize: '9px', color: colors.textSecondary, fontStyle: 'italic' }}>
              * Exec.: Percentual de execução e sessões realizadas/previstas
            </Typography>
          </Box>

          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: typography.fontSize.xs
            }}
          >
            <thead>
              <tr style={{ backgroundColor: colors.background }}>
                <th style={{
                  padding: '6px',
                  textAlign: 'center',
                  border: '1px solid #ccc',
                  fontWeight: 600,
                  fontSize: '10px',
                  width: '30px'
                }}>#</th>
                <th style={{
                  padding: '6px',
                  textAlign: 'left',
                  border: '1px solid #ccc',
                  fontWeight: 600,
                  fontSize: '10px'
                }}>Título/Responsáveis</th>
                <th style={{
                  padding: '6px',
                  textAlign: 'left',
                  border: '1px solid #ccc',
                  fontWeight: 600,
                  fontSize: '10px',
                  width: '200px'
                }}>Detalhes</th>
                <th style={{
                  padding: '6px',
                  textAlign: 'left',
                  border: '1px solid #ccc',
                  fontWeight: 600,
                  fontSize: '10px',
                  width: '60px'
                }}>Prior.</th>
                <th style={{
                  padding: '6px',
                  textAlign: 'left',
                  border: '1px solid #ccc',
                  fontWeight: 600,
                  fontSize: '10px',
                  width: '90px'
                }}>Início/Final</th>
                <th style={{
                  padding: '6px',
                  textAlign: 'center',
                  border: '1px solid #ccc',
                  fontWeight: 600,
                  fontSize: '10px',
                  width: '65px'
                }}>Execução</th>
              </tr>
            </thead>
            <tbody>
              {reportData.plans.map((plan) => (
                <tr key={plan.id}>
                  <td style={{
                    padding: '6px',
                    border: '1px solid #ccc',
                    textAlign: 'center',
                    fontSize: '9px',
                    verticalAlign: 'top'
                  }}>
                    {plan.number}
                  </td>
                  <td style={{
                    padding: '6px 8px',
                    border: '1px solid #ccc',
                    verticalAlign: 'top'
                  }}>
                    <Typography sx={{ fontSize: '9px', fontWeight: 600, mb: '2px', lineHeight: 1.3 }}>
                      {plan.title}
                    </Typography>
                    <Typography sx={{ fontSize: '8px', color: colors.textSecondary, lineHeight: 1.3 }}>
                      {plan.responsibles}
                    </Typography>
                  </td>
                  <td style={{
                    padding: '6px',
                    border: '1px solid #ccc',
                    fontSize: '8px',
                    verticalAlign: 'top',
                    lineHeight: 1.4
                  }}>
                    <div style={{ marginBottom: '4px' }}>
                      <strong>Justificativa:</strong> {plan.justification}
                    </div>
                    <div style={{ marginBottom: '4px' }}>
                      <strong>Objetivo:</strong> {plan.objective}
                    </div>
                    <div style={{ marginBottom: '4px' }}>
                      <strong>Métrica:</strong> {plan.metric}
                    </div>
                    <div style={{ marginBottom: '4px' }}>
                      <strong>Score Inicial:</strong> {plan.scoreInitial}
                    </div>
                    <div style={{ marginBottom: '4px' }}>
                      <strong>Último Score:</strong> {plan.scoreLatest}
                    </div>
                    <div style={{ marginBottom: '4px' }}>
                      <strong>Score Médio:</strong> {plan.scoreAverage.toFixed(1)}
                    </div>
                    <div>
                      <strong>Observações:</strong> {plan.observations}
                    </div>
                  </td>
                  <td style={{
                    padding: '6px',
                    border: '1px solid #ccc',
                    fontSize: '9px',
                    verticalAlign: 'top'
                  }}>
                    {plan.priority}
                  </td>
                  <td style={{
                    padding: '6px',
                    border: '1px solid #ccc',
                    fontSize: '9px',
                    lineHeight: 1.4,
                    verticalAlign: 'top'
                  }}>
                    {formatDateToBR(plan.startDate)}
                    <br />
                    {formatDateToBR(plan.endDate)}
                  </td>
                  <td style={{
                    padding: '6px',
                    border: '1px solid #ccc',
                    textAlign: 'center',
                    fontSize: '9px',
                    lineHeight: 1.4,
                    verticalAlign: 'top'
                  }}>
                    {plan.progress.toFixed(0)}%
                    <br />
                    <span style={{ fontSize: '8px', color: colors.textSecondary }}>
                      {Math.round((plan.progress / 100) * 10)}/10
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default DetailedPeriodReportPrint;
