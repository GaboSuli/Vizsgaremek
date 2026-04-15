import React, { useState, useRef, useCallback } from 'react';
import Avatar from './Avatar.jsx';
import Button from '../ui/Button.jsx';
import './AvatarUploader.css';

export default function AvatarUploader({ currentUrl, userName, onSave, saving }) {
  const [preview, setPreview] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [mode, setMode] = useState('idle'); // idle | preview
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      setMode('preview');
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    handleFile(file);
  }, [handleFile]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    setPreview(urlInput.trim());
    setMode('preview');
  };

  const handleCancel = () => {
    setPreview(null);
    setUrlInput('');
    setMode('idle');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSave = () => {
    if (preview) {
      onSave?.(preview);
    }
  };

  const handleRemove = () => {
    onSave?.('');
    setPreview(null);
    setMode('idle');
  };

  const displaySrc = mode === 'preview' ? preview : currentUrl;

  return (
    <div className="avatar-uploader">
      <div className="avatar-uploader__current">
        <Avatar src={displaySrc} name={userName} size="2xl" />
        {mode === 'preview' && (
          <span className="avatar-uploader__badge">Előnézet</span>
        )}
      </div>

      {mode === 'idle' ? (
        <>
          {/* Drop zone */}
          <div
            className={`avatar-uploader__dropzone ${dragOver ? 'avatar-uploader__dropzone--active' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            <svg className="avatar-uploader__dropzone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="avatar-uploader__dropzone-text">
              <strong>Húzd ide a képet</strong> vagy kattints a tallózáshoz
            </p>
            <span className="avatar-uploader__dropzone-hint">PNG, JPG, WEBP — max 5MB</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="avatar-uploader__file-input"
            />
          </div>

          {/* URL input */}
          <div className="avatar-uploader__url-row">
            <span className="avatar-uploader__url-divider">vagy adj meg URL-t</span>
            <div className="avatar-uploader__url-input-group">
              <input
                type="url"
                className="form-control avatar-uploader__url-input"
                placeholder="https://example.com/photo.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={handleUrlSubmit}
                disabled={!urlInput.trim()}
              >
                Előnézet
              </Button>
            </div>
          </div>

          {/* Remove button if there's a current image */}
          {currentUrl && currentUrl !== 'user.png' && currentUrl.trim() !== '' && (
            <button className="avatar-uploader__remove-btn" onClick={handleRemove}>
              Profilkép eltávolítása
            </button>
          )}
        </>
      ) : (
        /* Preview mode actions */
        <div className="avatar-uploader__actions">
          <Button variant="primary" onClick={handleSave} loading={saving}>
            Mentés
          </Button>
          <Button variant="ghost" onClick={handleCancel}>
            Mégse
          </Button>
        </div>
      )}
    </div>
  );
}
