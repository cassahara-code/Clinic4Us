import React, { useState } from 'react';
import { Rotate90DegreesCw, ZoomIn, ZoomOut, RestartAlt, CenterFocusStrong, CameraAlt } from '@mui/icons-material';

interface PhotoUploadProps {
  photo?: string;
  photoRotation?: number;
  photoZoom?: number;
  photoFlipX?: number;
  photoPositionX?: number;
  photoPositionY?: number;
  onPhotoChange: (photoData: {
    photo?: string;
    photoRotation?: number;
    photoZoom?: number;
    photoFlipX?: number;
    photoPositionX?: number;
    photoPositionY?: number;
  }) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  photo,
  photoRotation = 0,
  photoZoom = 1,
  photoFlipX = 1,
  photoPositionX = 0,
  photoPositionY = 0,
  onPhotoChange
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialZoom, setInitialZoom] = useState<number>(1);

  const handlePhotoMouseDown = (e: React.MouseEvent) => {
    if (!photo) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - photoPositionX,
      y: e.clientY - photoPositionY
    });
  };

  const handlePhotoMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !photo) return;
    e.preventDefault();

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    // Limitar o movimento dentro da área do preview (250x250px)
    const maxX = 125;
    const maxY = 125;
    const minX = -125;
    const minY = -125;

    const clampedX = Math.max(minX, Math.min(maxX, newX));
    const clampedY = Math.max(minY, Math.min(maxY, newY));

    onPhotoChange({
      photo,
      photoRotation,
      photoZoom,
      photoFlipX,
      photoPositionX: clampedX,
      photoPositionY: clampedY
    });
  };

  const handlePhotoMouseUp = () => {
    setIsDragging(false);
  };

  const handlePhotoMouseLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onPhotoChange({
          photo: event.target?.result as string,
          photoRotation: 0,
          photoZoom: undefined, // Will be set by onLoad
          photoFlipX: 1,
          photoPositionX: 0,
          photoPositionY: 0
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;

    const containerWidth = 250;
    const containerHeight = 250;
    const imgAspectRatio = img.naturalWidth / img.naturalHeight;
    const containerAspectRatio = containerWidth / containerHeight;

    let initialScale = 1;
    if (imgAspectRatio > containerAspectRatio) {
      // Image is wider than container - scale to fit width
      initialScale = containerWidth / img.naturalWidth;
    } else {
      // Image is taller than container - scale to fit height
      initialScale = containerHeight / img.naturalHeight;
    }

    // Always store the initial zoom for reset functionality
    setInitialZoom(initialScale);

    // Only set initial scale if it's not already set
    if (photoZoom === undefined || photoZoom === 1) {
      onPhotoChange({
        photo,
        photoRotation,
        photoZoom: initialScale,
        photoFlipX,
        photoPositionX,
        photoPositionY
      });
    }
  };

  const updatePhoto = (updates: Partial<{
    photo?: string;
    photoRotation?: number;
    photoZoom?: number;
    photoFlipX?: number;
    photoPositionX?: number;
    photoPositionY?: number;
  }>) => {
    onPhotoChange({
      photo,
      photoRotation,
      photoZoom,
      photoFlipX,
      photoPositionX,
      photoPositionY,
      ...updates
    });
  };

  return (
    <div className="photo-upload-component">
      <div
        className="photo-preview"
        onClick={() => !photo && document.getElementById('photo-upload')?.click()}
        onMouseMove={handlePhotoMouseMove}
        onMouseUp={handlePhotoMouseUp}
        onMouseLeave={handlePhotoMouseLeave}
      >
        {photo ? (
          <img
            src={photo}
            alt="Foto do paciente"
            className="patient-photo"
            style={{
              transform: `translate(-50%, -50%) translate(${photoPositionX}px, ${photoPositionY}px) rotate(${photoRotation}deg) scale(${photoZoom}) scaleX(${photoFlipX})`,
              transformOrigin: 'center',
              transition: isDragging ? 'none' : 'transform 0.3s ease',
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onMouseDown={handlePhotoMouseDown}
            draggable={false}
            onLoad={handleImageLoad}
          />
        ) : (
          <div className="no-photo-placeholder">
            <div className="photo-icon"><CameraAlt fontSize="large" /></div>
            <span>Clique para adicionar foto</span>
          </div>
        )}
      </div>
      <input
        type="file"
        id="photo-upload"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {/* Controles principais */}
      <div className="photo-main-controls">
        <button
          type="button"
          className="btn-photo-main"
          onClick={() => document.getElementById('photo-upload')?.click()}
        >
          {photo ? 'Alterar' : 'Selecionar'}
        </button>
        {photo && (
          <button
            type="button"
            className="btn-photo-main btn-remove"
            onClick={() => onPhotoChange({
              photo: '',
              photoRotation: 0,
              photoZoom: 1,
              photoFlipX: 1,
              photoPositionX: 0,
              photoPositionY: 0
            })}
            title="Remover foto"
          >
            Remover
          </button>
        )}
      </div>

      {/* Controles de edição */}
      {photo && (
        <div className="photo-edit-controls">
          <div className="edit-control-row">
            <button
              type="button"
              className="btn-photo-edit-small"
              title="Girar à esquerda"
              onClick={() => updatePhoto({ photoRotation: photoRotation - 90 })}
            >
              <Rotate90DegreesCw fontSize="small" />
            </button>
            <button
              type="button"
              className="btn-photo-edit-small"
              title="Girar à direita"
              onClick={() => updatePhoto({ photoRotation: photoRotation + 90 })}
            >
              <Rotate90DegreesCw fontSize="small" style={{ transform: 'scaleX(-1)' }} />
            </button>
            <button
              type="button"
              className="btn-photo-edit-small"
              title="Zoom out"
              onClick={() => updatePhoto({ photoZoom: Math.max(0.1, photoZoom - 0.1) })}
            >
              <ZoomOut fontSize="small" />
            </button>
            <button
              type="button"
              className="btn-photo-edit-small"
              title="Zoom in"
              onClick={() => updatePhoto({ photoZoom: Math.min(5, photoZoom + 0.1) })}
            >
              <ZoomIn fontSize="small" />
            </button>
            <button
              type="button"
              className="btn-photo-edit-small"
              title="Reset"
              onClick={() => onPhotoChange({
                photo,
                photoRotation: 0,
                photoZoom: initialZoom,
                photoFlipX: 1,
                photoPositionX: 0,
                photoPositionY: 0
              })}
            >
              <RestartAlt fontSize="small" />
            </button>
            <button
              type="button"
              className="btn-photo-edit-small"
              title="Centralizar posição"
              onClick={() => updatePhoto({ photoPositionX: 0, photoPositionY: 0 })}
            >
              <CenterFocusStrong fontSize="small" />
            </button>
          </div>
        </div>
      )}

      <div className="photo-instructions">
        <small>JPG, PNG, GIF • Max 5MB</small>
        {photo && (
          <>
            <small>🖱️ Arraste a foto para posicioná-la</small>
            <small>📐 A foto será cortada no tamanho do preview ao salvar</small>
          </>
        )}
      </div>
    </div>
  );
};

export default PhotoUpload;
