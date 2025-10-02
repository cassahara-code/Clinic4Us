import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface FaqData {
  id?: string;
  category: string;
  question: string;
  answer: string;
  videoUrl?: string;
  links?: { text: string; url: string }[];
}

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FaqData) => void;
  faqData?: FaqData;
  mode: 'create' | 'edit';
}

const FaqModal: React.FC<FaqModalProps> = ({ isOpen, onClose, onSave, faqData, mode }) => {
  const [category, setCategory] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [links, setLinks] = useState<{ text: string; url: string }[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (faqData) {
      setCategory(faqData.category || '');
      setQuestion(faqData.question || '');
      setAnswer(faqData.answer || '');
      setVideoUrl(faqData.videoUrl || '');
      setLinks(faqData.links || []);
    } else {
      resetForm();
    }
  }, [faqData, isOpen]);

  const resetForm = () => {
    setCategory('');
    setQuestion('');
    setAnswer('');
    setVideoUrl('');
    setLinks([]);
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!category.trim()) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (!question.trim()) {
      newErrors.question = 'Pergunta é obrigatória';
    }

    if (!answer.trim()) {
      newErrors.answer = 'Resposta é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const data: FaqData = {
      id: faqData?.id,
      category: category.trim(),
      question: question.trim(),
      answer: answer.trim(),
      videoUrl: videoUrl.trim() || undefined,
      links: links.filter(link => link.text.trim() && link.url.trim())
    };

    onSave(data);
    resetForm();
  };

  const handleAddLink = () => {
    setLinks([...links, { text: '', url: '' }]);
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index: number, field: 'text' | 'url', value: string) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
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
      onClick={handleClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '900px',
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
            {mode === 'create' ? 'Novo Item FAQ' : 'Editar Item FAQ'}
          </h3>
          <button
            onClick={handleClose}
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

        {/* Corpo do modal */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem'
          }}>
            {/* Categoria */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#2D3748',
                fontSize: '0.9rem'
              }}>Categoria *</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Administração Cliente"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: errors.category ? '1px solid #E53E3E' : '1px solid #E2E8F0',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
              {errors.category && <span style={{ color: '#E53E3E', fontSize: '0.875rem' }}>{errors.category}</span>}
            </div>

            {/* Pergunta */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#2D3748',
                fontSize: '0.9rem'
              }}>Pergunta *</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Digite a pergunta"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: errors.question ? '1px solid #E53E3E' : '1px solid #E2E8F0',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
              {errors.question && <span style={{ color: '#E53E3E', fontSize: '0.875rem' }}>{errors.question}</span>}
            </div>

            {/* Resposta */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#2D3748',
                fontSize: '0.9rem'
              }}>Resposta *</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Digite a resposta"
                rows={6}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: errors.answer ? '1px solid #E53E3E' : '1px solid #E2E8F0',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
              {errors.answer && <span style={{ color: '#E53E3E', fontSize: '0.875rem' }}>{errors.answer}</span>}
            </div>

            {/* URL do Vídeo */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#2D3748',
                fontSize: '0.9rem'
              }}>URL do Vídeo (opcional)</label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/embed/exemplo"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #E2E8F0',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Links */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#2D3748',
                fontSize: '0.9rem'
              }}>Links Relacionados</label>
              {links.map((link, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={link.text}
                    onChange={(e) => handleLinkChange(index, 'text', e.target.value)}
                    placeholder="Texto do link"
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      border: '1px solid #E2E8F0',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                    placeholder="URL"
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      border: '1px solid #E2E8F0',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(index)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#E2E8F0',
                      color: '#2D3748',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Remover
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddLink}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#E2E8F0',
                  color: '#2D3748',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  marginTop: '0.5rem'
                }}
              >
                + Adicionar Link
              </button>
            </div>
          </div>
        </div>

        {/* Footer do modal */}
        <div style={{
          padding: '1rem 1.5rem',
          background: '#F7FAFC',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          borderRadius: '0 0 12px 12px'
        }}>
          <button
            onClick={handleClose}
            style={{
              padding: '0.625rem 1.25rem',
              background: '#E2E8F0',
              color: '#2D3748',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#CBD5E0'}
            onMouseOut={(e) => e.currentTarget.style.background = '#E2E8F0'}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '0.625rem 1.25rem',
              background: '#03B4C6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#0299AB'}
            onMouseOut={(e) => e.currentTarget.style.background = '#03B4C6'}
          >
            {mode === 'create' ? 'Criar' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FaqModal;
