import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
  Box,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { colors, typography, inputs } from "../../theme/designSystem";
import { entityService } from "../../services/entityService";
import { EntityRequest } from "../../types/entity";

// import { EntityData } from "../../interfaces/EntityData";
import { Entity } from "../../interfaces/adminEntities";

interface EntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Entity) => void;
  mode: "create" | "edit";
  initialData?: Partial<Entity> & { id?: string };
  title?: string;
}

const EntityModal: React.FC<EntityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  mode,
  initialData = {},
  title,
}) => {
  // default form values; don't spread initialData here to avoid overwriting while user types
  const defaultFormValues: Entity = {
    // entityType: "juridica",
    // id: "",
    // cnpjCpf: "",
    // inscricaoEstadual: "",
    // inscricaoMunicipal: "",
    // fantasyName: "",
    // socialName: "",
    // ddd: "",
    // phone: "",
    // email: "",
    // cep: "",
    // street: "",
    // number: "",
    // complement: "",
    // neighborhood: "",
    // city: "",
    // state: "",
    // startTime: "08:00",
    // endTime: "18:00",
    id: "",
    fantasyName: "",
    cnpjCpf: "",
    socialName: "",
    workingHours: "",
    entityType: "juridica",
    inscricaoEstadual: "",
    inscricaoMunicipal: "",
    ddd: "",
    phone: "",
    email: "",
    addressZipcode: "",
    addressStreet: "",
    addressNumber: "",
    addressComplement: "",
    addressNeighborhood: "",
    addressCity: "",
    addressState: "",
    startTime: "",
    endTime: "",
  };

  const [formData, setFormData] = useState<Entity>(defaultFormValues);

  // Initialize the form only when the modal opens. This avoids overwriting the form
  // while the user is typing if the parent passes a new initialData reference.
  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && initialData && Object.keys(initialData).length > 0) {
      console.log("Dados recebidos no modal:", initialData);

      // Extrair horário de funcionamento
      const [startTime = "08:00", endTime = "18:00"] =
        initialData.workingHours?.split(" - ") ?? [];

      console.log("InitialData no mapeamento:", initialData);

      const mappedData: Entity = {
        // Dados principais - campos obrigatórios
        id: initialData.id || "",
        fantasyName: initialData.fantasyName || "",
        cnpjCpf: initialData.cnpjCpf || "",
        socialName: initialData.socialName || "",
        workingHours: initialData.workingHours || `${startTime} - ${endTime}`,
        entityType: initialData.entityType || "juridica",

        // Campos opcionais - mantendo os valores originais mesmo que vazios
        inscricaoEstadual: initialData.inscricaoEstadual || "",
        inscricaoMunicipal: initialData.inscricaoMunicipal || "",

        // Campos de contato - mantendo os valores originais mesmo que vazios
        ddd: initialData.ddd || "",
        phone: initialData.phone || "",
        email: initialData.email || "",

        // Campos de endereço - mantendo os valores originais mesmo que vazios
        addressZipcode: initialData.addressZipcode || "",
        addressStreet: initialData.addressStreet || "",
        addressNumber: initialData.addressNumber || "",
        addressComplement: initialData.addressComplement || "",
        addressNeighborhood: initialData.addressNeighborhood || "",
        addressCity: initialData.addressCity || "",
        addressState: initialData.addressState || "",

        // Campos de horário - usando os valores padrão apenas se necessário
        startTime: startTime || "08:00",
        endTime: endTime || "18:00",
      };

      setFormData(mappedData);
      return;
    }

    // create mode: reset to defaults when opening
    if (mode === "create") {
      setFormData(defaultFormValues);
    }
    // intentionally not including initialData in deps to avoid overwriting while open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, mode]);

  const handleClose = () => {
    setFormData({
      entityType: "juridica",
      id: "",
      cnpjCpf: "",
      inscricaoEstadual: "",
      inscricaoMunicipal: "",
      fantasyName: "",
      socialName: "",
      ddd: "",
      phone: "",
      email: "",
      addressZipcode: "",
      addressStreet: "",
      addressNumber: "",
      addressComplement: "",
      addressNeighborhood: "",
      addressCity: "",
      addressState: "",
      workingHours: "08:00 - 18:00",
      startTime: "08:00",
      endTime: "18:00",
    });
    onClose();
  };

  const handleSave = () => {
    // Monta o payload para a API
    const payload: EntityRequest = {
      id: (initialData as any)?.id || "",
      active: true,
      addressCity: formData.addressCity ?? "",
      addressComplement: formData.addressComplement ?? "",
      addressNeighborhood: formData.addressNeighborhood ?? "",
      addressNumber: formData.addressNumber ?? "",
      addressState: formData.addressState ?? "",
      addressStreet: formData.addressStreet ?? "",
      addressZipcode: formData.addressZipcode ?? "",
      companyName: formData.socialName ?? "",
      defaultEntity: true,
      document: formData.cnpjCpf ?? (formData as any).cnpj ?? "",
      email: formData.email ?? "",
      entityNickName: formData.fantasyName ?? "",
      finalWorkHour: formData.endTime ?? "",
      initialWorkHour: formData.startTime ?? "",
      inscricaoEstadual:
        formData.inscricaoEstadual ?? (formData as any).inscEstadual ?? "",
      inscricaoMunicipal:
        formData.inscricaoMunicipal ?? (formData as any).inscMunicipal ?? "",
      entityType: formData.entityType ?? "juridica",
      phone: formData.phone ?? "",
      phoneCodeArea: formData.ddd ?? "",
      whatsappNumber: 0,
      slug: "string",
    };
    (async () => {
      try {
        const id = (initialData as any)?.id as string | undefined;
        if (mode === "edit" && id) {
          await entityService.updateEntity(id, payload);
        } else {
          await entityService.createEntity(payload);
        }

        onSave(formData);
        handleClose();
      } catch (error: any) {
        // TODO: tratar erro
        console.error(error?.message || error);
        handleClose();
      }
    })();
  };

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return [
      { value: `${hour}:00`, label: `${hour}:00` },
      { value: `${hour}:30`, label: `${hour}:30` },
    ];
  }).flat();

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: colors.primary,
          color: colors.white,
          padding: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontSize: "1.4rem",
            fontWeight: typography.fontWeight.semibold,
            margin: 0,
          }}
        >
          {title ||
            (mode === "create" ? "Cadastrar Entidade" : "Editar Entidade")}
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            color: colors.white,
            padding: "0.25rem",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: "1.5rem" }}>
        <FormControl component="fieldset" sx={{ marginBottom: "0.75rem" }}>
          <RadioGroup
            row
            value={formData.entityType}
            onChange={(e) =>
              setFormData({
                ...formData,
                entityType: e.target.value as "juridica" | "fisica",
              })
            }
          >
            <FormControlLabel
              value="juridica"
              control={
                <Radio
                  sx={{
                    color: colors.primary,
                    "&.Mui-checked": { color: colors.primary },
                  }}
                />
              }
              label="Pessoa Jurídica"
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "0.95rem",
                  color: colors.text,
                },
              }}
            />
            <FormControlLabel
              value="fisica"
              control={
                <Radio
                  sx={{
                    color: colors.primary,
                    "&.Mui-checked": { color: colors.primary },
                  }}
                />
              }
              label="Pessoa Física"
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "0.95rem",
                  color: colors.text,
                },
              }}
            />
          </RadioGroup>
        </FormControl>

        <TextField
          label={formData.entityType === "juridica" ? "CNPJ" : "CPF"}
          value={formData.cnpjCpf}
          onChange={(e) =>
            setFormData({ ...formData, cnpjCpf: e.target.value })
          }
          placeholder={formData.entityType === "juridica" ? "CNPJ" : "CPF"}
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
          sx={{
            marginBottom: "1.5rem",
            "& .MuiOutlinedInput-root": {
              height: inputs.default.height,
              "& fieldset": { borderColor: colors.border },
              "&:hover fieldset": { borderColor: colors.border },
              "&.Mui-focused fieldset": { borderColor: colors.primary },
            },
            "& .MuiInputLabel-root": {
              fontSize: inputs.default.labelFontSize,
              color: colors.textSecondary,
              backgroundColor: colors.white,
              padding: inputs.default.labelPadding,
              "&.Mui-focused": { color: colors.primary },
            },
          }}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
            marginBottom: "1.5rem",
          }}
        >
          <TextField
            label="Insc. Estadual"
            value={formData.inscricaoEstadual}
            onChange={(e) =>
              setFormData({ ...formData, inscricaoEstadual: e.target.value })
            }
            placeholder="Insc. Estadual"
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: inputs.default.height,
                "& fieldset": { borderColor: colors.border },
                "&:hover fieldset": { borderColor: colors.border },
                "&.Mui-focused fieldset": { borderColor: colors.primary },
              },
              "& .MuiInputLabel-root": {
                fontSize: inputs.default.labelFontSize,
                color: colors.textSecondary,
                backgroundColor: colors.white,
                padding: inputs.default.labelPadding,
                "&.Mui-focused": { color: colors.primary },
              },
            }}
          />
          <TextField
            label="Insc. Municipal"
            value={formData.inscricaoMunicipal}
            onChange={(e) =>
              setFormData({ ...formData, inscricaoMunicipal: e.target.value })
            }
            placeholder="Insc. Municipal"
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: inputs.default.height,
                "& fieldset": { borderColor: colors.border },
                "&:hover fieldset": { borderColor: colors.border },
                "&.Mui-focused fieldset": { borderColor: colors.primary },
              },
              "& .MuiInputLabel-root": {
                fontSize: inputs.default.labelFontSize,
                color: colors.textSecondary,
                backgroundColor: colors.white,
                padding: inputs.default.labelPadding,
                "&.Mui-focused": { color: colors.primary },
              },
            }}
          />
        </Box>

        <TextField
          label="Nome Fantasia"
          value={formData.fantasyName}
          onChange={(e) =>
            setFormData({ ...formData, fantasyName: e.target.value })
          }
          placeholder="Nome Fantasia"
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
          sx={{
            marginBottom: "1.5rem",
            "& .MuiOutlinedInput-root": {
              height: inputs.default.height,
              "& fieldset": { borderColor: colors.border },
              "&:hover fieldset": { borderColor: colors.border },
              "&.Mui-focused fieldset": { borderColor: colors.primary },
            },
            "& .MuiInputLabel-root": {
              fontSize: inputs.default.labelFontSize,
              color: colors.textSecondary,
              backgroundColor: colors.white,
              padding: inputs.default.labelPadding,
              "&.Mui-focused": { color: colors.primary },
            },
          }}
        />

        <TextField
          label="Razão Social"
          value={formData.socialName}
          onChange={(e) =>
            setFormData({ ...formData, socialName: e.target.value })
          }
          placeholder="Razão Social"
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
          sx={{
            marginBottom: "1.5rem",
            "& .MuiOutlinedInput-root": {
              height: inputs.default.height,
              "& fieldset": { borderColor: colors.border },
              "&:hover fieldset": { borderColor: colors.border },
              "&.Mui-focused fieldset": { borderColor: colors.primary },
            },
            "& .MuiInputLabel-root": {
              fontSize: inputs.default.labelFontSize,
              color: colors.textSecondary,
              backgroundColor: colors.white,
              padding: inputs.default.labelPadding,
              "&.Mui-focused": { color: colors.primary },
            },
          }}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "100px 1fr",
            gap: "0.75rem",
            marginBottom: "1.5rem",
          }}
        >
          <TextField
            label="DDD"
            value={formData.ddd}
            onChange={(e) => setFormData({ ...formData, ddd: e.target.value })}
            placeholder="DDD"
            inputProps={{ maxLength: 3 }}
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: inputs.default.height,
                "& fieldset": { borderColor: colors.border },
                "&:hover fieldset": { borderColor: colors.border },
                "&.Mui-focused fieldset": { borderColor: colors.primary },
              },
              "& .MuiInputLabel-root": {
                fontSize: inputs.default.labelFontSize,
                color: colors.textSecondary,
                backgroundColor: colors.white,
                padding: inputs.default.labelPadding,
                "&.Mui-focused": { color: colors.primary },
              },
            }}
          />
          <TextField
            label="Telefone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="Telefone"
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: inputs.default.height,
                "& fieldset": { borderColor: colors.border },
                "&:hover fieldset": { borderColor: colors.border },
                "&.Mui-focused fieldset": { borderColor: colors.primary },
              },
              "& .MuiInputLabel-root": {
                fontSize: inputs.default.labelFontSize,
                color: colors.textSecondary,
                backgroundColor: colors.white,
                padding: inputs.default.labelPadding,
                "&.Mui-focused": { color: colors.primary },
              },
            }}
          />
        </Box>

        <TextField
          label="E-mail"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="E-mail"
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
          sx={{
            marginBottom: "1.5rem",
            "& .MuiOutlinedInput-root": {
              height: inputs.default.height,
              "& fieldset": { borderColor: colors.border },
              "&:hover fieldset": { borderColor: colors.border },
              "&.Mui-focused fieldset": { borderColor: colors.primary },
            },
            "& .MuiInputLabel-root": {
              fontSize: inputs.default.labelFontSize,
              color: colors.textSecondary,
              backgroundColor: colors.white,
              padding: inputs.default.labelPadding,
              "&.Mui-focused": { color: colors.primary },
            },
          }}
        />

        <TextField
          label="CEP"
          value={formData.addressZipcode}
          onChange={(e) =>
            setFormData({ ...formData, addressZipcode: e.target.value })
          }
          placeholder="CEP"
          margin="dense"
          InputLabelProps={{ shrink: true }}
          sx={{
            marginBottom: "1.5rem",
            maxWidth: "200px",
            "& .MuiOutlinedInput-root": {
              height: inputs.default.height,
              "& fieldset": { borderColor: colors.border },
              "&:hover fieldset": { borderColor: colors.border },
              "&.Mui-focused fieldset": { borderColor: colors.primary },
            },
            "& .MuiInputLabel-root": {
              fontSize: inputs.default.labelFontSize,
              color: colors.textSecondary,
              backgroundColor: colors.white,
              padding: inputs.default.labelPadding,
              "&.Mui-focused": { color: colors.primary },
            },
          }}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 100px",
            gap: "0.75rem",
            marginBottom: "1.5rem",
          }}
        >
          <TextField
            label="Logradouro (Rua, Avenida, etc.)"
            value={formData.addressStreet}
            onChange={(e) =>
              setFormData({ ...formData, addressStreet: e.target.value })
            }
            placeholder="Logradouro (Rua, Avenida, etc.)"
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: inputs.default.height,
                "& fieldset": { borderColor: colors.border },
                "&:hover fieldset": { borderColor: colors.border },
                "&.Mui-focused fieldset": { borderColor: colors.primary },
              },
              "& .MuiInputLabel-root": {
                fontSize: inputs.default.labelFontSize,
                color: colors.textSecondary,
                backgroundColor: colors.white,
                padding: inputs.default.labelPadding,
                "&.Mui-focused": { color: colors.primary },
              },
            }}
          />
          <TextField
            label="Número"
            value={formData.addressNumber}
            onChange={(e) =>
              setFormData({ ...formData, addressNumber: e.target.value })
            }
            placeholder="Nº"
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: inputs.default.height,
                "& fieldset": { borderColor: colors.border },
                "&:hover fieldset": { borderColor: colors.border },
                "&.Mui-focused fieldset": { borderColor: colors.primary },
              },
              "& .MuiInputLabel-root": {
                fontSize: inputs.default.labelFontSize,
                color: colors.textSecondary,
                backgroundColor: colors.white,
                padding: inputs.default.labelPadding,
                "&.Mui-focused": { color: colors.primary },
              },
            }}
          />
          <TextField
            label="Número"
            value={formData.addressNumber}
            onChange={(e) =>
              setFormData({ ...formData, addressNumber: e.target.value })
            }
            placeholder="Nº"
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: inputs.default.height,
                "& fieldset": { borderColor: colors.border },
                "&:hover fieldset": { borderColor: colors.border },
                "&.Mui-focused fieldset": { borderColor: colors.primary },
              },
              "& .MuiInputLabel-root": {
                fontSize: inputs.default.labelFontSize,
                color: colors.textSecondary,
                backgroundColor: colors.white,
                padding: inputs.default.labelPadding,
                "&.Mui-focused": { color: colors.primary },
              },
            }}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
            marginBottom: "1.5rem",
          }}
        >
          <TextField
            label="Complemento"
            value={formData.addressComplement}
            onChange={(e) =>
              setFormData({ ...formData, addressComplement: e.target.value })
            }
            placeholder="Complemento"
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: inputs.default.height,
                "& fieldset": { borderColor: colors.border },
                "&:hover fieldset": { borderColor: colors.border },
                "&.Mui-focused fieldset": { borderColor: colors.primary },
              },
              "& .MuiInputLabel-root": {
                fontSize: inputs.default.labelFontSize,
                color: colors.textSecondary,
                backgroundColor: colors.white,
                padding: inputs.default.labelPadding,
                "&.Mui-focused": { color: colors.primary },
              },
            }}
          />
          <TextField
            label="Bairro"
            value={formData.addressNeighborhood}
            onChange={(e) =>
              setFormData({ ...formData, addressNeighborhood: e.target.value })
            }
            placeholder="Bairro"
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: inputs.default.height,
                "& fieldset": { borderColor: colors.border },
                "&:hover fieldset": { borderColor: colors.border },
                "&.Mui-focused fieldset": { borderColor: colors.primary },
              },
              "& .MuiInputLabel-root": {
                fontSize: inputs.default.labelFontSize,
                color: colors.textSecondary,
                backgroundColor: colors.white,
                padding: inputs.default.labelPadding,
                "&.Mui-focused": { color: colors.primary },
              },
            }}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 100px",
            gap: "0.75rem",
            marginBottom: "1.5rem",
          }}
        >
          <TextField
            label="Cidade"
            value={formData.addressCity}
            onChange={(e) =>
              setFormData({ ...formData, addressCity: e.target.value })
            }
            placeholder="Cidade"
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: inputs.default.height,
                "& fieldset": { borderColor: colors.border },
                "&:hover fieldset": { borderColor: colors.border },
                "&.Mui-focused fieldset": { borderColor: colors.primary },
              },
              "& .MuiInputLabel-root": {
                fontSize: inputs.default.labelFontSize,
                color: colors.textSecondary,
                backgroundColor: colors.white,
                padding: inputs.default.labelPadding,
                "&.Mui-focused": { color: colors.primary },
              },
            }}
          />
          <TextField
            label="UF"
            value={formData.addressState}
            onChange={(e) =>
              setFormData({ ...formData, addressState: e.target.value })
            }
            placeholder="UF"
            inputProps={{ maxLength: 2 }}
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: inputs.default.height,
                "& fieldset": { borderColor: colors.border },
                "&:hover fieldset": { borderColor: colors.border },
                "&.Mui-focused fieldset": { borderColor: colors.primary },
              },
              "& .MuiInputLabel-root": {
                fontSize: inputs.default.labelFontSize,
                color: colors.textSecondary,
                backgroundColor: colors.white,
                padding: inputs.default.labelPadding,
                "&.Mui-focused": { color: colors.primary },
              },
            }}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
            marginBottom: "2rem",
          }}
        >
          <TextField
            select
            label="Hora Inicial"
            value={formData.startTime || "08:00"}
            onChange={(e) => {
              const newStartTime = e.target.value;
              setFormData({
                ...formData,
                startTime: newStartTime,
                workingHours: `${newStartTime} - ${
                  formData.endTime || "18:00"
                }`,
              });
            }}
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: inputs.default.height,
                "& fieldset": { borderColor: colors.border },
                "&:hover fieldset": { borderColor: colors.border },
                "&.Mui-focused fieldset": { borderColor: colors.primary },
              },
              "& .MuiInputLabel-root": {
                fontSize: inputs.default.labelFontSize,
                color: colors.textSecondary,
                backgroundColor: colors.white,
                padding: inputs.default.labelPadding,
                "&.Mui-focused": { color: colors.primary },
              },
            }}
          >
            {timeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Hora Final"
            value={formData.endTime || "18:00"}
            onChange={(e) => {
              const newEndTime = e.target.value;
              setFormData({
                ...formData,
                endTime: newEndTime,
                workingHours: `${
                  formData.startTime || "08:00"
                } - ${newEndTime}`,
              });
            }}
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: inputs.default.height,
                "& fieldset": { borderColor: colors.border },
                "&:hover fieldset": { borderColor: colors.border },
                "&.Mui-focused fieldset": { borderColor: colors.primary },
              },
              "& .MuiInputLabel-root": {
                fontSize: inputs.default.labelFontSize,
                color: colors.textSecondary,
                backgroundColor: colors.white,
                padding: inputs.default.labelPadding,
                "&.Mui-focused": { color: colors.primary },
              },
            }}
          >
            {timeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          padding: "1.5rem 2rem",
          borderTop: `1px solid ${colors.backgroundAlt}`,
          backgroundColor: colors.background,
          gap: "1rem",
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            padding: "0.75rem 1.5rem",
            border: `1px solid ${colors.border}`,
            borderRadius: "6px",
            backgroundColor: colors.white,
            color: colors.textSecondary,
            fontSize: "1rem",
            fontWeight: typography.fontWeight.medium,
            textTransform: "none",
            "&:hover": {
              backgroundColor: colors.background,
              borderColor: "#adb5bd",
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            padding: "0.75rem 1.5rem",
            borderRadius: "6px",
            backgroundColor: colors.primary,
            color: colors.white,
            fontSize: "1rem",
            fontWeight: typography.fontWeight.medium,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#029AAB",
              boxShadow: "none",
              transform: "translateY(-1px)",
            },
          }}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EntityModal;
