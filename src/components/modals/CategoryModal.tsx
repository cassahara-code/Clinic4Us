import React, { useState } from 'react';
import { Delete, Edit } from '@mui/icons-material';

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
        // Editar categoria existente
        setCategories(categories.map(cat =>
          cat.id === editingCategoryId
            ? { ...cat, name: newCategoryName.trim() }
            : cat
        ));
        setEditingCategoryId(null);
      } else {
        // Adicionar nova categoria
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
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do modal */}
        <div style={{
          background: '#03B4C6',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '12px 12px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '1.4rem',
            fontWeight: '600'
          }}>
            Categorias de Funcionalidades
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            ×
          </button>
        </div>

        {/* Conteúdo */}
        <div style={{ padding: '2rem' }}>
          {/* Descrição */}
          <p style={{
            margin: '0 0 1.5rem 0',
            fontSize: '0.95rem',
            color: '#6c757d'
          }}>
            Categorias tem a função de organizar os menus.
          </p>

          {/* Campo de adicionar/editar categoria */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              color: '#6c757d',
              marginBottom: '0.5rem',
              fontWeight: '600'
            }}>
              {editingCategoryId ? 'Editar Categoria' : 'Categoria'}
            </label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddCategory();
                }
              }}
              placeholder="Categoria"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '6px',
                fontSize: '1rem',
                color: '#495057',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
              }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              {editingCategoryId && (
                <button
                  onClick={() => {
                    setEditingCategoryId(null);
                    setNewCategoryName('');
                  }}
                  style={{
                    flex: '0 0 auto',
                    padding: '0.75rem 1.5rem',
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
                >
                  Cancelar
                </button>
              )}
              <button
                onClick={handleAddCategory}
                style={{
                  flex: '1 1 auto',
                  padding: '0.75rem',
                  background: '#03B4C6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0298a8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#03B4C6'}
              >
                {editingCategoryId ? 'Salvar' : 'Cadastrar'}
              </button>
            </div>
          </div>

          {/* Lista de categorias */}
          <div className="admin-plans-list-container" style={{
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            <div className="admin-plans-table">
              {/* Header da lista */}
              <div className="admin-plans-table-header" style={{
                display: 'flex',
                gridTemplateColumns: 'unset'
              }}>
                <div style={{ flex: '1 1 auto', textAlign: 'left' }}>Categoria</div>
                <div style={{ flex: '0 0 140px', textAlign: 'right' }}>Ações</div>
              </div>

              {/* Items da lista */}
              <div className="admin-plans-table-body">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="admin-plans-table-row"
                    style={{
                      display: 'flex',
                      gridTemplateColumns: 'unset'
                    }}
                  >
                    <div style={{ flex: '1 1 auto', textAlign: 'left' }} data-label="Categoria">
                      {category.name}
                    </div>
                    <div className="admin-plans-actions" style={{ flex: '0 0 140px', textAlign: 'left' }} data-label="Ações">
                      <button
                        className="action-btn"
                        onClick={() => handleEditCategory(category)}
                        title="Editar categoria"
                        style={{ backgroundColor: '#f0f0f0', color: '#6c757d' }}
                      >
                        <Edit fontSize="small" />
                      </button>
                      <button
                        className="action-btn"
                        onClick={() => handleDeleteCategory(category.id)}
                        title="Excluir categoria"
                        style={{ backgroundColor: '#f0f0f0', color: '#6c757d' }}
                      >
                        <Delete fontSize="small" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
