import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Stack
} from '@mui/material';
import {
  LocalHospital,
  CalendarToday,
  Assignment,
  Timeline,
  Assessment,
  AccountBalance,
  People,
  Security,
  CheckCircle,
  Star,
  Phone,
  Email,
  LocationOn
} from '@mui/icons-material';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <CalendarToday sx={{ fontSize: 40 }} />,
      title: 'Agenda Inteligente',
      description: 'Gerencie consultas, horários e disponibilidade de profissionais de forma integrada.'
    },
    {
      icon: <Assignment sx={{ fontSize: 40 }} />,
      title: 'Prontuário Digital',
      description: 'Prontuários eletrônicos seguros e acessíveis, com histórico completo do paciente.'
    },
    {
      icon: <Timeline sx={{ fontSize: 40 }} />,
      title: 'Planos de Ação',
      description: 'Crie e acompanhe planos de tratamento personalizados para cada paciente.'
    },
    {
      icon: <Assessment sx={{ fontSize: 40 }} />,
      title: 'Relatórios Avançados',
      description: 'Dashboards e relatórios completos para análise de performance da clínica.'
    },
    {
      icon: <AccountBalance sx={{ fontSize: 40 }} />,
      title: 'Gestão Financeira',
      description: 'Controle financeiro completo com faturamento, repasses e análise de lucros.'
    },
    {
      icon: <People sx={{ fontSize: 40 }} />,
      title: 'Multi-usuários',
      description: 'Sistema multi-usuário com controle de acesso e permissões por perfil.'
    }
  ];

  const plans = [
    {
      name: 'Essencial',
      price: 'R$ 99',
      period: '/mês',
      description: 'Ideal para clínicas pequenas',
      features: [
        'Até 2 profissionais',
        'Agenda básica',
        'Prontuário digital',
        '500 pacientes',
        'Relatórios básicos',
        'Suporte por email'
      ],
      highlighted: false
    },
    {
      name: 'Profissional',
      price: 'R$ 199',
      period: '/mês',
      description: 'Para clínicas em crescimento',
      features: [
        'Até 10 profissionais',
        'Agenda avançada',
        'Prontuário completo',
        'Pacientes ilimitados',
        'Planos de ação',
        'Formulários de avaliação',
        'Relatórios avançados',
        'Gestão financeira básica',
        'Suporte prioritário'
      ],
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'R$ 399',
      period: '/mês',
      description: 'Para grandes clínicas e grupos',
      features: [
        'Profissionais ilimitados',
        'Todas as funcionalidades',
        'Backoffice completo',
        'Controle de repasses',
        'API personalizada',
        'Integrações avançadas',
        'Multi-unidades',
        'Suporte 24/7',
        'Treinamento incluído'
      ],
      highlighted: false
    }
  ];

  const comparisonFeatures = [
    { feature: 'Número de Profissionais', essencial: '2', profissional: '10', enterprise: 'Ilimitado' },
    { feature: 'Pacientes', essencial: '500', profissional: 'Ilimitado', enterprise: 'Ilimitado' },
    { feature: 'Agenda', essencial: 'Básica', profissional: 'Avançada', enterprise: 'Completa' },
    { feature: 'Prontuário Digital', essencial: '✓', profissional: '✓', enterprise: '✓' },
    { feature: 'Planos de Ação', essencial: '✗', profissional: '✓', enterprise: '✓' },
    { feature: 'Formulários de Avaliação', essencial: '✗', profissional: '✓', enterprise: '✓' },
    { feature: 'Relatórios', essencial: 'Básicos', profissional: 'Avançados', enterprise: 'Completos' },
    { feature: 'Gestão Financeira', essencial: '✗', profissional: 'Básica', enterprise: 'Completa' },
    { feature: 'Backoffice', essencial: '✗', profissional: '✗', enterprise: '✓' },
    { feature: 'Multi-unidades', essencial: '✗', profissional: '✗', enterprise: '✓' },
    { feature: 'API Personalizada', essencial: '✗', profissional: '✗', enterprise: '✓' },
    { feature: 'Suporte', essencial: 'Email', profissional: 'Prioritário', enterprise: '24/7' }
  ];

  return (
    <Box>
      <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 1 }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <LocalHospital sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
            <Typography variant="h5" component="div" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
              Clinic4US
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="primary">Funcionalidades</Button>
            <Button color="primary">Preços</Button>
            <Button color="primary">Contato</Button>
            <Button variant="contained" color="primary">
              Teste Grátis
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
                Transforme sua clínica com nossa plataforma completa
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Sistema completo para gestão de clínicas multidisciplinares com agenda, prontuário digital,
                planos de ação e muito mais. Tudo em um só lugar.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Chip label="30 dias grátis" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                <Chip label="Sem fidelidade" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                <Chip label="Suporte incluso" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              </Stack>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" size="large" sx={{ bgcolor: 'white', color: 'primary.main' }}>
                  Começar Teste Grátis
                </Button>
                <Button variant="outlined" size="large" sx={{ color: 'white', borderColor: 'white' }}>
                  Ver Demonstração
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 400,
                    height: 300,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto'
                  }}
                >
                  <Typography variant="h4" sx={{ opacity: 0.7 }}>
                    [Sua Logo Aqui]
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
            Funcionalidades Completas
          </Typography>
          <Typography variant="h6" align="center" sx={{ mb: 6, color: 'text.secondary' }}>
            Tudo que sua clínica precisa em uma única plataforma
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                  <CardContent>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
            Planos e Preços
          </Typography>
          <Typography variant="h6" align="center" sx={{ mb: 6, color: 'text.secondary' }}>
            Escolha o plano ideal para sua clínica
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {plans.map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    position: 'relative',
                    border: plan.highlighted ? '2px solid' : '1px solid',
                    borderColor: plan.highlighted ? 'primary.main' : 'grey.300',
                    transform: plan.highlighted ? 'scale(1.05)' : 'none'
                  }}
                >
                  {plan.highlighted && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -10,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bgcolor: 'primary.main',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                        MAIS POPULAR
                      </Typography>
                    </Box>
                  )}
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Typography variant="h4" component="h3" sx={{ mb: 1, fontWeight: 'bold' }}>
                      {plan.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {plan.description}
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h3" component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {plan.price}
                      </Typography>
                      <Typography variant="h6" component="span" color="text.secondary">
                        {plan.period}
                      </Typography>
                    </Box>
                    <Button
                      variant={plan.highlighted ? 'contained' : 'outlined'}
                      fullWidth
                      sx={{ mb: 3 }}
                    >
                      Começar Agora
                    </Button>
                    <List dense>
                      {plan.features.map((feature, featureIndex) => (
                        <ListItem key={featureIndex} sx={{ px: 0 }}>
                          <ListItemIcon>
                            <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={feature}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" sx={{ mb: 6, fontWeight: 'bold' }}>
            Comparativo de Planos
          </Typography>
          <Paper sx={{ overflow: 'hidden' }}>
            <Grid container>
              <Grid item xs={12} md={3}>
                <Box sx={{ bgcolor: 'grey.100', p: 2, height: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Funcionalidades
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ p: 2, textAlign: 'center', borderLeft: '1px solid', borderColor: 'grey.300' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    Essencial
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ p: 2, textAlign: 'center', borderLeft: '1px solid', borderColor: 'grey.300', bgcolor: 'primary.light', color: 'white' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Profissional
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ p: 2, textAlign: 'center', borderLeft: '1px solid', borderColor: 'grey.300' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    Enterprise
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            {comparisonFeatures.map((item, index) => (
              <Box key={index}>
                <Divider />
                <Grid container>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {item.feature}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ p: 2, textAlign: 'center', borderLeft: '1px solid', borderColor: 'grey.300' }}>
                      <Typography variant="body2">{item.essencial}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ p: 2, textAlign: 'center', borderLeft: '1px solid', borderColor: 'grey.300', bgcolor: 'primary.light', color: 'white' }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{item.profissional}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ p: 2, textAlign: 'center', borderLeft: '1px solid', borderColor: 'grey.300' }}>
                      <Typography variant="body2">{item.enterprise}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Paper>
        </Container>
      </Box>

      <Box sx={{ py: 8, bgcolor: 'primary.main', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                Pronto para transformar sua clínica?
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
                Comece seu teste gratuito hoje e veja como nosso sistema pode revolucionar a gestão da sua clínica.
              </Typography>
              <Button variant="contained" size="large" sx={{ bgcolor: 'white', color: 'primary.main' }}>
                Iniciar Teste Gratuito
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Security sx={{ fontSize: 60, mb: 2, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Dados seguros e protegidos conforme LGPD
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 6, bgcolor: 'grey.900', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalHospital sx={{ fontSize: 32, mr: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Clinic4US
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                A plataforma completa para gestão de clínicas multidisciplinares.
                Simples, segura e eficiente.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Contato
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Phone sx={{ fontSize: 16, mr: 1, opacity: 0.8 }} />
                <Typography variant="body2">(11) 9999-9999</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Email sx={{ fontSize: 16, mr: 1, opacity: 0.8 }} />
                <Typography variant="body2">contato@clinic4us.com.br</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ fontSize: 16, mr: 1, opacity: 0.8 }} />
                <Typography variant="body2">São Paulo, SP</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Links Úteis
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button color="inherit" sx={{ justifyContent: 'flex-start', textTransform: 'none' }}>
                  Política de Privacidade
                </Button>
                <Button color="inherit" sx={{ justifyContent: 'flex-start', textTransform: 'none' }}>
                  Termos de Uso
                </Button>
                <Button color="inherit" sx={{ justifyContent: 'flex-start', textTransform: 'none' }}>
                  Suporte
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3, bgcolor: 'grey.700' }} />
          <Typography variant="body2" align="center" sx={{ opacity: 0.6 }}>
            © 2024 Clinic4US. Todos os direitos reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;