import React, { useState, useEffect } from "react";
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import { useNavigation } from "../contexts/RouterContext";
import { Delete, Edit, Person, Add, ViewModule, FilterAltOff } from '@mui/icons-material';
import { Toast } from "../components/Toast";
import { useToast } from "../hooks/useToast";
import EntityModal, { EntityData } from "../components/modals/EntityModal";
import { FaqButton } from "../components/FaqButton";
import Pagination from "../components/Pagination";

interface UserSession {
  email: string;
  alias: string;
  clinicName: string;
  role: string;
  permissions: string[];
  loginTime: string;
}

interface Entity {
  id: string;
  fantasyName: string;
  cnpjCpf: string;
  socialName: string;
  workingHours: string;
}

const AdminEntities: React.FC = () => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const { goToDashboard } = useNavigation();
  const { toast, showToast, hideToast } = useToast();

  // Estados dos filtros
  const [searchTerm, setSearchTerm] = useState('');

  // Estados da paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // Estados dos modais
  const [isEntityModalOpen, setIsEntityModalOpen] = useState(false);
  const [entityModalMode, setEntityModalMode] = useState<'create' | 'edit'>('create');
  const [entityToEdit, setEntityToEdit] = useState<Entity | null>(null);

  // Dados de exemplo das entidades
  const [entities] = useState<Entity[]>(() => {
    const baseEntities = [
      {
        id: '1',
        fantasyName: 'Instituto Ninho',
        cnpjCpf: '44594155000179',
        socialName: 'Azevedo Marinho Fonoaudiologia',
        workingHours: '08:00 - 20:00'
      },
      {
        id: '2',
        fantasyName: 'Clínica Saúde Total',
        cnpjCpf: '12345678000190',
        socialName: 'Clínica Saúde Total Ltda',
        workingHours: '07:00 - 19:00'
      },
      {
        id: '3',
        fantasyName: 'Centro Médico Esperança',
        cnpjCpf: '98765432000111',
        socialName: 'Centro Médico Esperança SA',
        workingHours: '08:00 - 18:00'
      }
    ];

    // Gerar mais entidades para teste de paginação
    const entities: Entity[] = [];
    for (let i = 0; i < 5; i++) {
      baseEntities.forEach((entity, index) => {
        entities.push({
          ...entity,
          id: `${i * baseEntities.length + index + 1}`,
          fantasyName: `${entity.fantasyName} ${i > 0 ? i + 1 : ''}`.trim()
        });
      });
    }
    return entities;
  });

  // Lógica de filtragem
  const filteredEntities = entities.filter(entity => {
    const matchesSearch = searchTerm === '' ||
      entity.fantasyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.cnpjCpf.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.socialName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Lógica de paginação
  const totalPages = Math.ceil(filteredEntities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEntities = filteredEntities.slice(startIndex, endIndex);

  const handleRevalidateLogin = () => {
    console.log('Revalidando login...');
  };

  const handleNotificationClick = () => {
    console.log('Notificações clicadas');
  };

  const handleUserClick = () => {
    console.log('Perfil de usuário clicado');
  };

  const handleLogoClick = () => {
    goToDashboard();
  };

  const scrollToTop = () => {
    const listContainer = document.querySelector('.admin-plans-list-container');
    if (listContainer) {
      const containerRect = listContainer.getBoundingClientRect();
      const offset = 100;
      const targetPosition = window.pageYOffset + containerRect.top - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setTimeout(scrollToTop, 100);
  };

  // Gerar opções para o seletor de itens por página
  const itemsPerPageOptions = [];
  for (let i = 50; i <= 200; i += 10) {
    itemsPerPageOptions.push(i);
  }

  useEffect(() => {
    const simulatedUserSession: UserSession = {
      email: "admin@clinic4us.com",
      alias: "Admin Demo",
      clinicName: "Admin Dashboard",
      role: "Administrator",
      permissions: ["admin_access", "manage_entities", "view_all"],
      loginTime: new Date().toISOString()
    };

    setUserSession(simulatedUserSession);
  }, []);

  // Reset página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const clearFilters = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleAddEntity = () => {
    setEntityModalMode('create');
    setEntityToEdit(null);
    setIsEntityModalOpen(true);
  };

  const handleEntityAction = (action: string, entityId: string) => {
    const entity = entities.find(e => e.id === entityId);
    if (!entity) return;

    switch (action) {
      case 'view':
        showToast(`Visualizando entidade: ${entity.fantasyName}`, 'info');
        break;
      case 'user':
        showToast(`Gerenciar usuários da entidade: ${entity.fantasyName}`, 'info');
        break;
      case 'edit':
        setEntityModalMode('edit');
        setEntityToEdit(entity);
        setIsEntityModalOpen(true);
        break;
      case 'delete':
        showToast(`Entidade ${entity.fantasyName} removida com sucesso`, 'success');
        break;
      default:
        break;
    }
  };

  const handleSaveEntity = (data: EntityData) => {
    if (entityModalMode === 'create') {
      showToast('Entidade cadastrada com sucesso', 'success');
    } else {
      showToast('Entidade atualizada com sucesso', 'success');
    }
    setIsEntityModalOpen(false);
  };

  const handleEntityRowClick = (entityId: string) => {
    const entity = entities.find(e => e.id === entityId);
    if (entity) {
      showToast(`Visualizando detalhes da entidade: ${entity.fantasyName}`, 'info');
    }
  };

  if (!userSession) {
    return <div>Carregando...</div>;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: '#f8f9fa'
    }}>
      <HeaderInternal
        showCTAButton={false}
        className="login-header"
        isLoggedIn={true}
        userEmail={userSession.email}
        userProfile={userSession.role}
        clinicName={userSession.clinicName}
        notificationCount={5}
        onRevalidateLogin={handleRevalidateLogin}
        onNotificationClick={handleNotificationClick}
        onUserClick={handleUserClick}
        onLogoClick={handleLogoClick}
      />

      <main style={{
        padding: '1rem',
        paddingTop: '0.25rem',
        minHeight: 'calc(100vh - 120px)',
        background: '#f8f9fa',
        marginTop: '20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '100%',
          margin: '0',
          padding: '0'
        }}>
          {/* Título */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}>
            <h1 style={{
              margin: '0',
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#6c757d'
            }}>
              Entidades
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaqButton />
              <button
                onClick={handleAddEntity}
                title="Adicionar nova entidade"
                className="btn-add"
              >
                <Add />
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="schedule-filters" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e9ecef',
            marginBottom: '1rem'
          }}>
            <div className="schedule-filters-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.75rem',
              marginBottom: '1rem'
            }}>
              {/* Busca por palavra */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.95rem',
                  color: '#6c757d',
                  marginBottom: '0.5rem'
                }}>Busca por palavra</label>
                <input
                  type="text"
                  placeholder="Buscar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.375rem 0.5rem',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    color: '#495057',
                    height: '40px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#03B4C6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(3, 180, 198, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ced4da';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Botão limpar filtros */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-end'
              }}>
                <button
                  onClick={clearFilters}
                  title="Limpar filtros"
                  className="btn-clear-filters"
                >
                  <FilterAltOff fontSize="small" />
                </button>
              </div>
            </div>
          </div>

          {/* Paginação superior */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e9ecef',
            marginBottom: '1rem'
          }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              itemsPerPageOptions={itemsPerPageOptions}
              totalItems={filteredEntities.length}
              itemLabel="entidades"
              onPageChange={(page) => {
                setCurrentPage(page);
                setTimeout(scrollToTop, 100);
              }}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>

          {/* Lista de entidades */}
          <div className="admin-plans-list-container">
            <div className="admin-plans-table">
              <div className="admin-plans-table-header" style={{
                display: 'flex',
                gridTemplateColumns: 'unset'
              }}>
                <div className="admin-plans-header-cell" style={{ flex: '0 0 250px', textAlign: 'left' }}>N.Fantasia/Apelido</div>
                <div className="admin-plans-header-cell" style={{ flex: '0 0 180px', textAlign: 'left' }}>CNPJ/CPF</div>
                <div className="admin-plans-header-cell" style={{ flex: '1 1 auto', textAlign: 'left' }}>Razão Social/Nome</div>
                <div className="admin-plans-header-cell" style={{ flex: '0 0 180px', textAlign: 'left' }}>Horário de funcionamento</div>
                <div className="admin-plans-header-cell" style={{ flex: '0 0 200px', textAlign: 'right' }}>Ações</div>
              </div>

              <div className="admin-plans-table-body">
                {paginatedEntities.map((entity) => (
                  <div
                    key={entity.id}
                    className="admin-plans-table-row"
                    onClick={() => handleEntityRowClick(entity.id)}
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      gridTemplateColumns: 'unset'
                    }}
                  >
                    <div className="admin-plans-cell" style={{ flex: '0 0 250px', textAlign: 'left' }} data-label="N.Fantasia/Apelido">
                      {entity.fantasyName}
                    </div>
                    <div className="admin-plans-cell" style={{ flex: '0 0 180px', textAlign: 'left' }} data-label="CNPJ/CPF">
                      {entity.cnpjCpf}
                    </div>
                    <div className="admin-plans-cell" style={{ flex: '1 1 auto', textAlign: 'left', whiteSpace: 'normal', wordBreak: 'break-word' }} data-label="Razão Social/Nome">
                      {entity.socialName}
                    </div>
                    <div className="admin-plans-cell" style={{ flex: '0 0 180px', textAlign: 'left' }} data-label="Horário de funcionamento">
                      {entity.workingHours}
                    </div>
                    <div className="admin-plans-actions" style={{ flex: '0 0 200px', textAlign: 'left' }} data-label="Ações">
                      <button
                        className="action-btn"
                        onClick={(e) => { e.stopPropagation(); handleEntityAction('view', entity.id); }}
                        title="Visualizar entidade"
                        style={{ backgroundColor: '#f0f0f0', color: '#6c757d' }}
                      >
                        <ViewModule fontSize="small" />
                      </button>
                      <button
                        className="action-btn"
                        onClick={(e) => { e.stopPropagation(); handleEntityAction('user', entity.id); }}
                        title="Gerenciar usuários"
                        style={{ backgroundColor: '#f0f0f0', color: '#6c757d' }}
                      >
                        <Person fontSize="small" />
                      </button>
                      <button
                        className="action-btn"
                        onClick={(e) => { e.stopPropagation(); handleEntityAction('edit', entity.id); }}
                        title="Editar entidade"
                        style={{ backgroundColor: '#f0f0f0', color: '#6c757d' }}
                      >
                        <Edit fontSize="small" />
                      </button>
                      <button
                        className="action-btn"
                        onClick={(e) => { e.stopPropagation(); handleEntityAction('delete', entity.id); }}
                        title="Excluir entidade"
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

          {/* Paginação inferior */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e9ecef',
            marginTop: '1rem'
          }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              itemsPerPageOptions={itemsPerPageOptions}
              totalItems={filteredEntities.length}
              itemLabel="entidades"
              onPageChange={(page) => {
                setCurrentPage(page);
                setTimeout(scrollToTop, 100);
              }}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </div>
      </main>

      <FooterInternal />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <EntityModal
        isOpen={isEntityModalOpen}
        onClose={() => setIsEntityModalOpen(false)}
        onSave={handleSaveEntity}
        mode={entityModalMode}
        initialData={entityToEdit ? {
          entityType: 'juridica',
          cnpj: entityToEdit.cnpjCpf,
          inscEstadual: '',
          inscMunicipal: '',
          fantasyName: entityToEdit.fantasyName,
          socialName: entityToEdit.socialName,
          ddd: '',
          phone: '',
          email: '',
          cep: '',
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          startTime: entityToEdit.workingHours.split(' - ')[0] || '08:00',
          endTime: entityToEdit.workingHours.split(' - ')[1] || '18:00'
        } : undefined}
      />
    </div>
  );
};

export default AdminEntities;
