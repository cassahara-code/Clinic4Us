import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
  Box
} from '@mui/material';
import { Close, Delete, Edit } from '@mui/icons-material';
import { colors, typography, inputs } from '../../theme/designSystem';

interface Category {
  id: string;
  name: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categories: Category[]) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Cliente - Usuários Cliente' },
    { id: '2', name: 'Cursos' },
    { id: '3', name: 'Minha Conta - Todos os usuários' },
    { id: '4', name: 'Navegação - Todos os usuários' },
    { id: '5', name: 'Pacientes' },
    { id: '6', name: 'Sistema - Adm. Owner F4Us' }
  ]);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      if (editingCategoryId) {
        setCategories(categories.map(cat =>
          cat.id === editingCategoryId
            ? { ...cat, name: newCategoryName.trim() }
            : cat
        ));
        setEditingCategoryId(null);
      } else {
        const newCategory: Category = {
          id: `cat-${Date.now()}`,
          name: newCategoryName.trim()
        };
        setCategories([...categories, newCategory]);
      }
      setNewCategoryName('');
    }
  };

  const handleEditCategory = (category: Category) => {
    setNewCategoryName(category.name);
    setEditingCategoryId(category.id);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
  };

  const handleClose = () => {
    setEditingCategoryId(null);
    setNewCategoryName('');
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          maxHeight: '90vh',
        }
      }}
    >
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
        <Typography variant="h6" component="h3" sx={{ fontSize: '1.4rem', fontWeight: typography.fontWeight.semibold, margin: 0 }}>
          Categorias de Funcionalidades
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: colors.white, padding: '0.25rem', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: '1.5rem !important', paddingTop: '2rem !important' }}>
        <Typography sx={{ margin: '0 0 1.5rem 0', fontSize: '0.95rem', color: colors.textSecondary }}>
          Categorias tem a função de organizar os menus.
        </Typography>

        <Box sx={{ marginBottom: '1.5rem' }}>
          <TextField
            label={editingCategoryId ? 'Editar Categoria' : 'Categoria'}
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddCategory();
              }
            }}
            placeholder="Categoria"
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: inputs.default.height,
                '& fieldset': { borderColor: colors.border },
                '&:hover fieldset': { borderColor: colors.border },
                '&.Mui-focused fieldset': { borderColor: colors.primary }
              },
              '& .MuiInputLabel-root': {
                fontSize: inputs.default.labelFontSize,
                color: colors.textSecondary,
                backgroundColor: colors.white,
                padding: inputs.default.labelPadding,
                '&.Mui-focused': { color: colors.primary }
              }
            }}
          />
          <Box sx={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            {editingCategoryId && (
              <Button
                onClick={() => {
                  setEditingCategoryId(null);
                  setNewCategoryName('');
                }}
                variant="outlined"
                sx={{
                  padding: '0.75rem 1.5rem',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '6px',
                  backgroundColor: colors.white,
                  color: colors.textSecondary,
                  fontSize: '1rem',
                  fontWeight: typography.fontWeight.semibold,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: colors.background,
                    borderColor: '#adb5bd',
                  }
                }}
              >
                Cancelar
              </Button>
            )}
            <Button
              onClick={handleAddCategory}
              variant="contained"
              sx={{
                flex: '1 1 auto',
                padding: '0.75rem',
                borderRadius: '6px',
                backgroundColor: colors.primary,
                color: colors.white,
                fontSize: '1rem',
                fontWeight: typography.fontWeight.semibold,
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
          </Box>
        </Box>

        <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', padding: '0.75rem', backgroundColor: colors.backgroundAlt, borderBottom: `2px solid ${colors.border}`, fontWeight: typography.fontWeight.semibold, fontSize: typography.fontSize.sm }}>
            <Box sx={{ flex: '1 1 auto', textAlign: 'left' }}>Categoria</Box>
            <Box sx={{ flex: '0 0 140px', textAlign: 'right' }}>Ações</Box>
          </Box>

          {categories.map((category) => (
            <Box
              key={category.id}
              sx={{
                display: 'flex',
                padding: '1rem 0.75rem',
                borderBottom: `1px solid ${colors.backgroundAlt}`,
                '&:hover': { backgroundColor: colors.background }
              }}
            >
              <Box sx={{ flex: '1 1 auto', textAlign: 'left', color: colors.text }}>{category.name}</Box>
              <Box sx={{ flex: '0 0 140px', textAlign: 'left', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <IconButton
                  onClick={() => handleEditCategory(category)}
                  title="Editar categoria"
                  sx={{
                    backgroundColor: '#f0f0f0',
                    color: colors.textSecondary,
                    padding: '0.5rem',
                    '&:hover': { backgroundColor: '#e0e0e0' }
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteCategory(category.id)}
                  title="Excluir categoria"
                  sx={{
                    backgroundColor: '#f0f0f0',
                    color: colors.textSecondary,
                    padding: '0.5rem',
                    '&:hover': { backgroundColor: '#e0e0e0' }
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModal;
