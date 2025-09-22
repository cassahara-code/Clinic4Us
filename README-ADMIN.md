# Tela de Administração de Planos - Clinic4Us

## Como Acessar

Para acessar a tela de administração, use o seguinte URL:

```
http://localhost:3000?page=admin
```

## Funcionalidades Implementadas

### ✅ CRUD Completo de Planos

- **Create**: Criar novos planos
- **Read**: Listar todos os planos
- **Update**: Editar planos existentes
- **Delete**: Excluir planos (com confirmação)

### ✅ Gerenciamento de Benefícios

- Adicionar/remover benefícios dinamicamente
- Controle de benefícios incluídos/não incluídos
- Validação de campos obrigatórios

### ✅ Interface Responsiva

- Material UI com tema moderno
- Tabela responsiva com paginação
- Formulários com validação
- Estados de loading e erro

### ✅ Integração com API

- Endpoint: `https://localhost:7185/api/Plan`
- React Query para cache e sincronização
- Tratamento de erros

## Estrutura de Arquivos Criados

```
src/
├── types/
│   └── Plan.ts                    # Interfaces TypeScript
├── services/
│   └── planService.ts             # Serviços de API
├── hooks/
│   └── usePlans.ts                # React Query hooks
└── components/admin/
    ├── index.ts                   # Exports
    ├── AdminDashboard.tsx         # Dashboard principal
    ├── PlanList.tsx               # Lista de planos
    └── PlanForm.tsx               # Formulário de planos
```

## Como Testar

1. **Inicie o backend** na porta 7185
2. **Inicie o frontend**:
   ```bash
   npm start
   ```
3. **Acesse**: http://localhost:3000?page=admin

## Schema da API

### Criar Plano (POST /api/Plan)

```json
{
  "planTitle": "string",
  "description": "string",
  "monthlyValue": 0,
  "anualyValue": 0,
  "plansBenefits": [
    {
      "itenDescription": "string",
      "covered": true
    }
  ]
}
```

### Resposta da API

```json
{
  "id": 0,
  "planTitle": "string",
  "description": "string",
  "monthlyValue": 0,
  "anualyValue": 0,
  "createdAt": "2025-09-22T20:01:14.656Z",
  "updatedAt": "2025-09-22T20:01:14.656Z",
  "createdBy": 0,
  "updatedBy": 0,
  "plansBenefits": [
    {
      "id": 0,
      "planId": 0,
      "itenDescription": "string",
      "covered": true,
      "createdAt": "2025-09-22T20:01:14.656Z",
      "updatedAt": "2025-09-22T20:01:14.656Z",
      "createdBy": 0,
      "updatedBy": 0
    }
  ]
}
```

## Dependências Adicionadas

- `axios`: Para requisições HTTP
- `@tanstack/react-query`: Já estava no projeto
- `@mui/material`: Já estava no projeto
- `@mui/icons-material`: Já estava no projeto
