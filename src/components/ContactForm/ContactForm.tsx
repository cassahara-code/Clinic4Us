import React, { useState, useEffect } from "react";
import "./ContactForm.css";
import logo from "../../images/logo_clinic4us.png";
import formContactImage from "../../images/form_contact_image.jpg";

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedSubject?: string;
}

interface FormData {
  nomeCompleto: string;
  email: string;
  whatsapp: string;
  assunto: string;
  mensagem: string;
}

interface Country {
  code: string;
  name: string;
  prefix: string;
  flag: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  isOpen,
  onClose,
  preSelectedSubject,
}) => {
  const [showThankYou, setShowThankYou] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nomeCompleto: "",
    email: "",
    whatsapp: "",
    assunto: preSelectedSubject || "",
    mensagem: "",
  });
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    code: "BR",
    name: "Brasil",
    prefix: "+55",
    flag: "BR",
  });
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const countries: Country[] = [
    { code: "BR", name: "Brasil", prefix: "+55", flag: "BR" },
    { code: "US", name: "Estados Unidos", prefix: "+1", flag: "US" },
    { code: "CA", name: "Canadá", prefix: "+1", flag: "CA" },
    { code: "AR", name: "Argentina", prefix: "+54", flag: "AR" },
    { code: "CL", name: "Chile", prefix: "+56", flag: "CL" },
    { code: "CO", name: "Colômbia", prefix: "+57", flag: "CO" },
    { code: "MX", name: "México", prefix: "+52", flag: "MX" },
    { code: "PE", name: "Peru", prefix: "+51", flag: "PE" },
    { code: "UY", name: "Uruguai", prefix: "+598", flag: "UY" },
    { code: "PY", name: "Paraguai", prefix: "+595", flag: "PY" },
    { code: "BO", name: "Bolívia", prefix: "+591", flag: "BO" },
    { code: "VE", name: "Venezuela", prefix: "+58", flag: "VE" },
    { code: "EC", name: "Equador", prefix: "+593", flag: "EC" },
    { code: "CR", name: "Costa Rica", prefix: "+506", flag: "CR" },
    { code: "PA", name: "Panamá", prefix: "+507", flag: "PA" },
    { code: "GT", name: "Guatemala", prefix: "+502", flag: "GT" },
    { code: "PT", name: "Portugal", prefix: "+351", flag: "PT" },
    { code: "ES", name: "Espanha", prefix: "+34", flag: "ES" },
    { code: "FR", name: "França", prefix: "+33", flag: "FR" },
    { code: "IT", name: "Itália", prefix: "+39", flag: "IT" },
    { code: "DE", name: "Alemanha", prefix: "+49", flag: "DE" },
    { code: "UK", name: "Reino Unido", prefix: "+44", flag: "UK" },
    { code: "AU", name: "Austrália", prefix: "+61", flag: "AU" },
    { code: "JP", name: "Japão", prefix: "+81", flag: "JP" },
    { code: "CN", name: "China", prefix: "+86", flag: "CN" },
    { code: "IN", name: "Índia", prefix: "+91", flag: "IN" },
    { code: "ZA", name: "África do Sul", prefix: "+27", flag: "ZA" },
  ];

  // Update form data when preSelectedSubject changes
  useEffect(() => {
    if (preSelectedSubject) {
      setFormData((prev) => ({
        ...prev,
        assunto: preSelectedSubject,
      }));
    }
  }, [preSelectedSubject]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".country-selector")) {
        setIsCountryDropdownOpen(false);
      }
    };

    if (isCountryDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isCountryDropdownOpen]);

  const formatWhatsApp = (value: string, country: string = "BR") => {
    const numbers = value.replace(/\D/g, "");

    if (country === "BR") {
      if (numbers.length <= 2) return `(${numbers}`;
      if (numbers.length <= 7)
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    } else if (country === "US") {
      if (numbers.length <= 3) return `(${numbers}`;
      if (numbers.length <= 6)
        return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    } else {
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 6)
        return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
      if (numbers.length <= 9)
        return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6)}`;
      return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 9)} ${numbers.slice(9, 12)}`;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "whatsapp") {
      const formatted = formatWhatsApp(value, selectedCountry.code);
      setFormData((prev) => ({
        ...prev,
        [name]: formatted,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    setFormData((prev) => ({
      ...prev,
      whatsapp: "",
    }));
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const clearForm = () => {
    setFormData({
      nomeCompleto: "",
      email: "",
      whatsapp: "",
      assunto: preSelectedSubject || "",
      mensagem: "",
    });
  };

  const handleClose = () => {
    setShowThankYou(false);
    clearForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.nomeCompleto ||
      !formData.email ||
      !formData.whatsapp ||
      !formData.assunto ||
      !formData.mensagem
    ) {
      alert("Todos os campos são obrigatórios!");
      return;
    }

    if (!isValidEmail(formData.email)) {
      alert("Por favor, informe um email válido!");
      return;
    }

    const subject = encodeURIComponent(formData.assunto);
    const body = encodeURIComponent(`
Nome: ${formData.nomeCompleto}
Email: ${formData.email}
WhatsApp: ${selectedCountry.prefix} ${formData.whatsapp}
País: ${selectedCountry.name}
Assunto: ${formData.assunto}

Mensagem:
${formData.mensagem}
    `);

    const mailtoLink = `mailto:adm.clinic4us@gmail.com?subject=${subject}&body=${body}`;
    window.open(mailtoLink, "_blank");

    clearForm();
    setShowThankYou(true);
  };

  if (!isOpen) return null;

  return (
    <div className="contact-modal-overlay" onClick={handleClose}>
      <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
        {!showThankYou ? (
          <>
            <div className="contact-modal-header">
              <div className="modal-logo-title">
                <img src={logo} alt="CLINIC4US" className="modal-logo" />
              </div>
              <button className="close-modal-button" onClick={handleClose}>
                &times;
              </button>
            </div>

            <div className="modal-content-wrapper">
              <div className="modal-image-section">
                <div className="modal-contact-image">
                  <img
                    src={formContactImage}
                    alt="Profissional de saúde"
                    className="contact-image"
                  />
                  <div className="contact-image-overlay">
                    <h3>Fale Conosco</h3>
                  </div>
                </div>
                <div className="contact-benefits">
                  <div className="benefit-item">
                    <span className="benefit-icon">🎯</span>
                    <span>Demonstração personalizada</span>
                  </div>
                  <div className="benefit-item">
                    <span className="benefit-icon">💡</span>
                    <span>Consultoria gratuita</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="nomeCompleto">Nome Completo *</label>
                  <input
                    type="text"
                    id="nomeCompleto"
                    name="nomeCompleto"
                    value={formData.nomeCompleto}
                    onChange={handleInputChange}
                    placeholder="Digite seu nome completo"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="whatsapp">WhatsApp *</label>
                  <div className="phone-input-container">
                    <div className="country-selector">
                      <div
                        className="country-select-custom"
                        onClick={() =>
                          setIsCountryDropdownOpen(!isCountryDropdownOpen)
                        }
                      >
                        <span className="selected-country">
                          <span className="country-prefix">
                            {selectedCountry.prefix}
                          </span>
                        </span>
                        <span className="dropdown-arrow">▼</span>
                      </div>
                      {isCountryDropdownOpen && (
                        <div className="country-dropdown">
                          {countries.map((country) => (
                            <div
                              key={country.code}
                              className={`country-option ${
                                country.code === selectedCountry.code
                                  ? "selected"
                                  : ""
                              }`}
                              onClick={() => {
                                handleCountryChange(country);
                                setIsCountryDropdownOpen(false);
                              }}
                            >
                              <span className="country-info">
                                <span className="country-prefix">
                                  {country.prefix}
                                </span>
                                <span className="country-name">
                                  {country.name}
                                </span>
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      type="tel"
                      id="whatsapp"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder={
                        selectedCountry.code === "BR"
                          ? "(11) 99999-9999"
                          : selectedCountry.code === "US"
                          ? "(123) 456-7890"
                          : "123 456 789"
                      }
                      className="phone-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="assunto">Assunto *</label>
                  <select
                    id="assunto"
                    name="assunto"
                    value={formData.assunto}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="Informações sobre o sistema">
                      Informações sobre o sistema
                    </option>
                    <option value="Demonstração do produto">
                      Demonstração do produto
                    </option>
                    <option value="Planos e preços">Planos e preços</option>
                    <option value="Suporte técnico">Suporte técnico</option>
                    <option value="Parceria comercial">
                      Parceria comercial
                    </option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="mensagem">Mensagem *</label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleInputChange}
                    placeholder="Digite sua mensagem aqui..."
                    rows={4}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="clear-button"
                    onClick={clearForm}
                  >
                    Limpar Campos
                  </button>
                  <button type="submit" className="submit-button">
                    Enviar Mensagem
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="thank-you-screen">
            <div className="thank-you-header">
              <img src={logo} alt="CLINIC4US" className="modal-logo" />
              <button className="close-modal-button" onClick={handleClose}>
                &times;
              </button>
            </div>
            <div className="thank-you-content">
              <div className="thank-you-icon">✓</div>
              <h2>Obrigado pelo contato!</h2>
              <p>Nossos consultores retornarão em breve.</p>
              <button className="thank-you-close-button" onClick={handleClose}>
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactForm;