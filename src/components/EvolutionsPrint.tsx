import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Print } from '@mui/icons-material';
import { colors, typography, spacing, buttons, shadows } from '../theme/designSystem';

interface EvolutionData {
  id: string;
  date: string;
  title: string;
  content: string;
  professional: string;
  professionalId: string;
}

interface EvolutionsPrintProps {
  patient: {
    name: string;
    birthDate: string;
    responsible: string;
  };
  evolutions: EvolutionData[];
}

const EvolutionsPrint: React.FC<EvolutionsPrintProps> = ({ patient, evolutions }) => {
  // Função para formatar datas de YYYY-MM-DD para DD/MM/YYYY
  const formatDateToBR = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
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
      birthDate: formatDateToBR(patient.birthDate) || '15/08/2023',
      responsible: patient.responsible || 'Responsável Teste'
    }
  };

  // Mapear dados de profissionais - TODO: buscar do banco de dados
  const professionalData: { [key: string]: { specialty: string; document: string } } = {
    'dr_silva': { specialty: 'Fonoaudiólogo(a)', document: 'CRFa 2-16515' },
    'dr_souza': { specialty: 'Fisioterapeuta', document: 'Doc. Prof.: 245380-F' },
    'dr_oliveira': { specialty: 'Psicopedagogo(a)', document: 'CBO 2394-25' }
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
            mb: spacing.lg,
            pb: spacing.sm
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              width: '60px',
              height: '60px',
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
                fontSize: '8px',
                fontWeight: typography.fontWeight.bold,
                color: colors.primary,
                textAlign: 'center',
                lineHeight: 1.1,
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
                mb: '2px'
              }}
            >
              {clinicData.name}
            </Typography>
            <Typography
              sx={{
                fontSize: '10px',
                color: colors.textSecondary,
                lineHeight: 1.4
              }}
            >
              {clinicData.address}
              <br />
              {clinicData.cnpj}
            </Typography>
          </Box>
        </Box>

        {/* Title */}
        <Box sx={{ textAlign: 'center', mb: spacing.md }}>
          <Typography
            sx={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.bold,
              color: colors.textPrimary
            }}
          >
            Evolução do Paciente - Data de emissão: {reportData.emissionDate}
          </Typography>
        </Box>

        {/* Patient Information */}
        <Box sx={{ mb: spacing.lg }}>
          <Box sx={{ display: 'flex', gap: '3rem', mb: '4px' }}>
            <Typography sx={{ fontSize: '11px', color: colors.textPrimary }}>
              Paciente: {reportData.patient.name}
            </Typography>
            <Typography sx={{ fontSize: '11px', color: colors.textPrimary }}>
              Data Nasc.: {reportData.patient.birthDate}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: '11px', color: colors.textPrimary }}>
            Responsável: {reportData.patient.responsible}
          </Typography>
        </Box>

        {/* Evolutions Table */}
        <Box
          sx={{
            border: `1px solid ${colors.border}`,
            borderRadius: '4px',
            overflow: 'hidden'
          }}
        >
          {/* Table Header */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '100px 1fr',
              backgroundColor: colors.backgroundAlt,
              borderBottom: `1px solid ${colors.border}`
            }}
          >
            <Box
              sx={{
                p: '8px',
                borderRight: `1px solid ${colors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography
                sx={{
                  fontSize: '11px',
                  fontWeight: typography.fontWeight.bold,
                  color: colors.textPrimary
                }}
              >
                Data
              </Typography>
            </Box>
            <Box sx={{ p: '8px', display: 'flex', alignItems: 'center' }}>
              <Typography
                sx={{
                  fontSize: '11px',
                  fontWeight: typography.fontWeight.bold,
                  color: colors.textPrimary
                }}
              >
                Evolução
              </Typography>
            </Box>
          </Box>

          {/* Table Body */}
          {evolutions.map((evolution, index) => {
            const professionalInfo = professionalData[evolution.professionalId] || {
              specialty: 'Especialidade não definida',
              document: 'Doc. não informado'
            };

            return (
              <Box
                key={evolution.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr',
                  borderBottom:
                    index < evolutions.length - 1 ? `1px solid ${colors.border}` : 'none',
                  '&:nth-of-type(even)': {
                    backgroundColor: colors.background
                  }
                }}
              >
                {/* Date Column */}
                <Box
                  sx={{
                    p: '10px',
                    borderRight: `1px solid ${colors.border}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '10px',
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.textPrimary,
                      lineHeight: 1.2
                    }}
                  >
                    {formatDateToBR(evolution.date)}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '9px',
                      color: colors.textSecondary,
                      lineHeight: 1.2
                    }}
                  >
                    {evolution.title.includes('-') ? evolution.title.split('-')[0].trim() : ''}
                  </Typography>
                </Box>

                {/* Evolution Content Column */}
                <Box sx={{ p: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {/* Professional Info */}
                  <Box sx={{ display: 'flex', gap: '1rem', mb: '4px' }}>
                    <Typography sx={{ fontSize: '10px', color: colors.textPrimary }}>
                      <strong>Profissional:</strong> {evolution.professional}
                    </Typography>
                    <Typography sx={{ fontSize: '10px', color: colors.textPrimary }}>
                      <strong>Especialidade:</strong> {professionalInfo.specialty}
                    </Typography>
                    <Typography sx={{ fontSize: '10px', color: colors.textPrimary }}>
                      {professionalInfo.document}
                    </Typography>
                  </Box>

                  {/* Evolution Content */}
                  <Typography
                    sx={{
                      fontSize: '10px',
                      color: colors.textPrimary,
                      lineHeight: 1.5,
                      whiteSpace: 'pre-line'
                    }}
                  >
                    <strong>Evolução:</strong> {evolution.content}
                  </Typography>
                </Box>
              </Box>
            );
          })}
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
          <Typography sx={{ fontSize: '9px', color: colors.textSecondary }}>
            {clinicData.fullAddress}
          </Typography>
          <Typography sx={{ fontSize: '9px', color: colors.textSecondary }}>
            Telefone: {clinicData.phone}
          </Typography>
          <Typography sx={{ fontSize: '9px', color: colors.textSecondary }}>
            E-mail: {clinicData.email}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default EvolutionsPrint;
