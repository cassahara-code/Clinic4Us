# Padrões de Modais - Clinic4Us

Este documento define os padrões para criação e uso de modais no sistema Clinic4Us.

## Índice

1. [Tipos de Modais](#tipos-de-modais)
2. [ConfirmModal - Modal de Confirmação](#confirmmodal---modal-de-confirmação)
3. [Modais de CRUD](#modais-de-crud)
4. [Estrutura Base](#estrutura-base)
5. [Estilos Padrão](#estilos-padrão)
6. [Melhores Práticas](#melhores-práticas)
7. [Exemplos Completos](#exemplos-completos)

---

## Tipos de Modais

### 1. ConfirmModal (Confirmação/Exclusão)
- **Quando usar**: Confirmações de ações destrutivas (excluir, desativar, etc.)
- **Componente**: `src/components/modals/ConfirmModal.tsx`
- **Características**:
  - Modal pequeno e focado
  - Mensagem clara e objetiva
  - Aviso visual (box laranja)
  - Botões de ação destacados

### 2. Modais de CRUD (Create, Read, Update)
- **Quando usar**: Adicionar, editar ou visualizar dados
- **Exemplos**: EntityModal, PlanModal, EvolutionModal
- **Características**:
  - Formulários com múltiplos campos
  - Validação de dados
  - Modos 'add' e 'edit' (NÃO incluir modo 'delete')

### 3. Modais Informativos
- **Quando usar**: Exibir informações detalhadas sem ação
- **Características**:
  - Apenas leitura
  - Botão de fechar

---

## ConfirmModal - Modal de Confirmação

### Props Interface

```typescript
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  warningMessage?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}
```

### Quando Usar

✅ **USE ConfirmModal para:**
- Exclusões de registros
- Ações irreversíveis
- Confirmações importantes
- Avisos críticos

❌ **NÃO use ConfirmModal para:**
- Formulários de edição
- Entrada de dados
- Visualização de detalhes

### Exemplo de Uso Correto

```tsx
// ❌ ERRADO - Modo delete no modal de edição
<EntityModal
  mode="delete"  // NÃO FAÇA ISSO
  onDelete={handleDelete}
  // ...
/>

// ✅ CORRETO - Use ConfirmModal separado
<ConfirmModal
  isOpen={isDeleteModalOpen}
  title="Excluir Entidade"
  message={`Tem certeza que deseja excluir a entidade "${entityName}"?`}
  warningMessage="Esta ação não poderá ser desfeita."
  confirmButtonText="Excluir"
  cancelButtonText="Cancelar"
  onConfirm={handleConfirmDelete}
  onCancel={handleCancelDelete}
  type="danger"
/>
```

### Estados Necessários

```typescript
// Estados para o modal de confirmação
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

// Funções handlers
const handleOpenDeleteModal = (item: Item) => {
  setItemToDelete(item);
  setIsDeleteModalOpen(true);
};

const handleConfirmDelete = () => {
  if (itemToDelete) {
    // Lógica de exclusão
    console.log('Deletar:', itemToDelete.id);
    // API call, etc.
  }
  setIsDeleteModalOpen(false);
  setItemToDelete(null);
};

const handleCancelDelete = () => {
  setIsDeleteModalOpen(false);
  setItemToDelete(null);
};
```

---

## Modais de CRUD

### Interface Base

```typescript
interface CRUDModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => void;
  editData?: FormData | null;
  mode: 'add' | 'edit';  // IMPORTANTE: SEM 'delete'
  title?: string;
}
```

### Regras Importantes

1. **NUNCA inclua modo 'delete'** em modais de CRUD
2. **Use apenas 'add' e 'edit'** como modos
3. **Separe a lógica de exclusão** em um ConfirmModal dedicado
4. **Um modal = Uma responsabilidade**

### Estrutura do Componente

```tsx
const MyModal: React.FC<MyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editData,
  mode
}) => {
  const [formData, setFormData] = useState<FormData>(
    editData || initialState
  );

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  const getTitle = () => {
    return mode === 'add' ? 'Adicionar Item' : 'Editar Item';
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{getTitle()}</DialogTitle>
      <DialogContent>
        {/* Campos do formulário */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit}>Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};
```

---

## Estrutura Base

### Layout Padrão dos Modais

```tsx
<Dialog
  open={isOpen}
  onClose={onClose}
  maxWidth="md"  // sm, md, lg, xl
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      maxHeight: '90vh'
    }
  }}
>
  {/* Cabeçalho */}
  <DialogTitle
    sx={{
      backgroundColor: colors.primary,
      color: colors.white,
      padding: '1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <Typography variant="h6" sx={{ fontSize: '1.4rem' }}>
      {title}
    </Typography>
    <IconButton onClick={onClose} sx={{ color: colors.white }}>
      <Close />
    </IconButton>
  </DialogTitle>

  {/* Conteúdo */}
  <DialogContent sx={{
    padding: '1.5rem !important',
    paddingTop: '2rem !important'
  }}>
    {/* Seu conteúdo aqui */}
  </DialogContent>

  {/* Ações */}
  <DialogActions sx={{
    padding: '1.5rem 2rem',
    borderTop: `1px solid ${colors.backgroundAlt}`,
    backgroundColor: colors.background,
    gap: '1rem'
  }}>
    <Button onClick={onClose} variant="outlined">
      Cancelar
    </Button>
    <Button onClick={handleSubmit} variant="contained">
      Salvar
    </Button>
  </DialogActions>
</Dialog>
```

---

## Estilos Padrão

### Importações Necessárias

```typescript
import { colors, typography, inputs } from '../../theme/designSystem';
import { getDefaultTextFieldSx, getMultilineTextFieldSx } from '../../theme/textFieldStyles';
```

### DialogTitle

```typescript
sx={{
  backgroundColor: colors.primary,
  color: colors.white,
  padding: '1.5rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}}
```

### DialogContent

```typescript
sx={{
  padding: '1.5rem !important',
  paddingTop: '2rem !important'
}}
```

### DialogActions

```typescript
sx={{
  padding: '1.5rem 2rem',
  borderTop: `1px solid ${colors.backgroundAlt}`,
  backgroundColor: colors.background,
  gap: '1rem'
}}
```

### Botões

```typescript
// Botão Cancelar
<Button
  onClick={onClose}
  variant="outlined"
  sx={{
    padding: '0.75rem 1.5rem',
    border: `1px solid ${colors.border}`,
    borderRadius: '6px',
    backgroundColor: colors.white,
    color: colors.textSecondary,
    fontSize: '1rem',
    fontWeight: typography.fontWeight.medium,
    textTransform: 'none',
    '&:hover': {
      backgroundColor: colors.background,
      borderColor: '#adb5bd',
    }
  }}
>
  Cancelar
</Button>

// Botão Salvar/Confirmar
<Button
  onClick={handleSubmit}
  variant="contained"
  sx={{
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    backgroundColor: colors.primary,
    color: colors.white,
    fontSize: '1rem',
    fontWeight: typography.fontWeight.medium,
    textTransform: 'none',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: '#029AAB',
      boxShadow: 'none',
      transform: 'translateY(-1px)',
    }
  }}
>
  Salvar
</Button>
```

### Campos de Formulário

```tsx
// TextField simples
<TextField
  label="Nome"
  fullWidth
  value={formData.name}
  onChange={handleInputChange}
  InputLabelProps={getDefaultInputLabelProps()}
  sx={getDefaultTextFieldSx()}
/>

// TextField multiline
<TextField
  label="Descrição"
  fullWidth
  multiline
  rows={3}
  value={formData.description}
  onChange={handleInputChange}
  InputLabelProps={getMultilineInputLabelProps()}
  sx={getMultilineTextFieldSx()}
/>
```

---

## Melhores Práticas

### 1. Separação de Responsabilidades

✅ **CORRETO**
```typescript
// Modal de edição
<EntityModal mode="edit" />

// Modal de exclusão separado
<ConfirmModal
  title="Excluir Entidade"
  message="Tem certeza?"
/>
```

❌ **INCORRETO**
```typescript
// Tudo em um modal
<EntityModal mode="delete" />
```

### 2. Gerenciamento de Estado

```typescript
// ✅ Estados separados para cada modal
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

// ❌ Um estado para múltiplas ações
const [modalMode, setModalMode] = useState<'add' | 'edit' | 'delete'>('add');
```

### 3. Handlers de Ação

```typescript
// ✅ Handlers específicos e claros
const handleEditItem = (item: Item) => {
  setItemToEdit(item);
  setIsEditModalOpen(true);
};

const handleDeleteItem = (item: Item) => {
  setItemToDelete(item);
  setIsDeleteModalOpen(true);
};

// ❌ Handler genérico confuso
const handleAction = (action: string, item: Item) => {
  // Lógica confusa aqui
};
```

### 4. Nomenclatura

```typescript
// ✅ Nomes descritivos
isDeleteModalOpen
isEditModalOpen
handleConfirmDelete
handleCancelDelete

// ❌ Nomes genéricos
isOpen
modalOpen
handleConfirm
```

### 5. Mensagens Claras

```typescript
// ✅ Mensagens específicas
message={`Tem certeza que deseja excluir "${item.name}"?`}
warningMessage="Esta ação não poderá ser desfeita."

// ❌ Mensagens genéricas
message="Tem certeza?"
```

---

## Exemplos Completos

### Exemplo 1: Modal de CRUD (Entidade)

```tsx
// EntityModal.tsx
interface EntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EntityData) => void;
  editData?: EntityData | null;
  mode: 'add' | 'edit';
}

const EntityModal: React.FC<EntityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editData,
  mode
}) => {
  const [formData, setFormData] = useState<EntityData>(
    editData || { name: '', cpnj: '', ... }
  );

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ backgroundColor: colors.primary, color: colors.white }}>
        {mode === 'add' ? 'Adicionar Entidade' : 'Editar Entidade'}
      </DialogTitle>
      <DialogContent sx={{ padding: '1.5rem !important', paddingTop: '2rem !important' }}>
        <TextField
          label="Nome"
          fullWidth
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          sx={getDefaultTextFieldSx()}
        />
        {/* Mais campos... */}
      </DialogContent>
      <DialogActions sx={{ padding: '1.5rem 2rem', backgroundColor: colors.background }}>
        <Button onClick={onClose} variant="outlined">Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};
```

### Exemplo 2: Uso no Componente Pai

```tsx
// AdminEntities.tsx
const AdminEntities: React.FC = () => {
  // Estados para modal de edição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
  const [entityModalMode, setEntityModalMode] = useState<'add' | 'edit'>('add');

  // Estados para modal de exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<Entity | null>(null);

  // Handlers de edição
  const handleEditEntity = (entity: Entity) => {
    setEditingEntity(entity);
    setEntityModalMode('edit');
    setIsEditModalOpen(true);
  };

  const handleSaveEntity = (data: EntityData) => {
    // Lógica de salvar
    console.log('Salvar:', data);
  };

  // Handlers de exclusão
  const handleDeleteEntity = (entity: Entity) => {
    setEntityToDelete(entity);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (entityToDelete) {
      // Lógica de exclusão
      console.log('Deletar:', entityToDelete.id);
    }
    setIsDeleteModalOpen(false);
    setEntityToDelete(null);
  };

  return (
    <>
      {/* Botões de ação */}
      <IconButton onClick={() => handleEditEntity(entity)}>
        <Edit />
      </IconButton>
      <IconButton onClick={() => handleDeleteEntity(entity)}>
        <Delete />
      </IconButton>

      {/* Modal de Edição */}
      <EntityModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEntity}
        editData={editingEntity}
        mode={entityModalMode}
      />

      {/* Modal de Exclusão */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Excluir Entidade"
        message={entityToDelete
          ? `Tem certeza que deseja excluir "${entityToDelete.name}"?`
          : "Tem certeza que deseja excluir esta entidade?"}
        warningMessage="Esta ação não poderá ser desfeita."
        confirmButtonText="Excluir"
        cancelButtonText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        type="danger"
      />
    </>
  );
};
```

---

## Checklist de Criação de Modal

### Antes de criar um novo modal:

- [ ] Defini claramente o propósito do modal
- [ ] Escolhi o tipo correto (Confirm, CRUD, Informativo)
- [ ] Verifiquei se já existe um componente similar
- [ ] Li este guia de padrões

### Ao criar um modal CRUD:

- [ ] Interface com props corretas (isOpen, onClose, onSave, editData, mode)
- [ ] Modos apenas 'add' e 'edit' (SEM 'delete')
- [ ] Estilos usando design system
- [ ] TextFields usando funções de textFieldStyles.ts
- [ ] DialogTitle com background colors.primary
- [ ] DialogContent com padding padrão
- [ ] DialogActions com gap e background

### Ao implementar exclusão:

- [ ] Usei ConfirmModal (não Dialog customizado)
- [ ] Criei estados separados (isDeleteModalOpen, itemToDelete)
- [ ] Criei handlers específicos (handleConfirmDelete, handleCancelDelete)
- [ ] Mensagem clara e específica
- [ ] warningMessage presente
- [ ] type="danger"

---

## Migração de Código Antigo

### Passo 1: Identificar Modais com Modo Delete

```bash
# Buscar por modais com modo delete
grep -r "mode.*delete" src/components/modals/
```

### Passo 2: Refatorar

1. Remover 'delete' do tipo de mode
2. Remover props onDelete
3. Remover lógica de exclusão do modal
4. Criar ConfirmModal separado
5. Atualizar componente pai

### Passo 3: Testar

- [ ] Modal de adição funciona
- [ ] Modal de edição funciona
- [ ] Modal de exclusão funciona
- [ ] Estados são limpos ao fechar
- [ ] Não há erros no console

---

## Referências

- Design System: `src/theme/designSystem.ts`
- TextField Styles: `src/theme/textFieldStyles.ts`
- ConfirmModal: `src/components/modals/ConfirmModal.tsx`
- Exemplos:
  - `src/components/modals/EntityModal.tsx`
  - `src/components/modals/EvolutionModal.tsx`
  - `src/admin/AdminEntities.tsx`
