'use client';
import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * ImageCropper — lightweight client-side image crop/resize before upload.
 * Uses canvas to crop + resize. No external dependencies.
 *
 * Props:
 *  - onCropped(blob, dataUrl): called with the cropped image blob and data URL
 *  - onCancel(): called when user cancels
 *  - aspectRatio: optional (e.g., 1 for square, 4/3, 16/9). Default: free crop
 *  - maxWidth: max output width in px (default: 800)
 *  - maxHeight: max output height in px (default: 800)
 *  - file: the File object to crop
 */
export default function ImageCropper({ file, onCropped, onCancel, aspectRatio, maxWidth = 800, maxHeight = 800 }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 50, y: 50, w: 200, h: 200 });
  const [imgDims, setImgDims] = useState({ natW: 0, natH: 0, dispW: 0, dispH: 0 });
  const [dragging, setDragging] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImgSrc(reader.result);
    reader.readAsDataURL(file);
  }, [file]);

  const onImgLoad = useCallback((e) => {
    const img = e.target;
    const natW = img.naturalWidth;
    const natH = img.naturalHeight;
    const dispW = img.clientWidth;
    const dispH = img.clientHeight;
    setImgDims({ natW, natH, dispW, dispH });

    // Default crop to center 80%
    const cw = dispW * 0.8;
    const ch = aspectRatio ? cw / aspectRatio : dispH * 0.8;
    setCrop({ x: (dispW - cw) / 2, y: (dispH - Math.min(ch, dispH * 0.8)) / 2, w: cw, h: Math.min(ch, dispH * 0.8) });
  }, [aspectRatio]);

  const handleMouseDown = (e, type) => {
    e.preventDefault();
    setDragging(type);
  };

  const handleMouseMove = useCallback((e) => {
    if (!dragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    setCrop(prev => {
      let { x, y, w, h } = prev;
      if (dragging === 'move') {
        x = Math.max(0, Math.min(mx - w / 2, imgDims.dispW - w));
        y = Math.max(0, Math.min(my - h / 2, imgDims.dispH - h));
      } else if (dragging === 'resize') {
        w = Math.max(50, Math.min(mx - x, imgDims.dispW - x));
        h = aspectRatio ? w / aspectRatio : Math.max(50, Math.min(my - y, imgDims.dispH - y));
      }
      return { x, y, w, h };
    });
  }, [dragging, imgDims, aspectRatio]);

  const handleMouseUp = useCallback(() => setDragging(null), []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp); };
  }, [handleMouseMove, handleMouseUp]);

  const doCrop = () => {
    if (!imgRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const scaleX = imgDims.natW / imgDims.dispW;
    const scaleY = imgDims.natH / imgDims.dispH;

    const srcX = crop.x * scaleX;
    const srcY = crop.y * scaleY;
    const srcW = crop.w * scaleX;
    const srcH = crop.h * scaleY;

    let outW = srcW;
    let outH = srcH;
    if (outW > maxWidth) { outH *= maxWidth / outW; outW = maxWidth; }
    if (outH > maxHeight) { outW *= maxHeight / outH; outH = maxHeight; }

    canvas.width = outW;
    canvas.height = outH;
    ctx.drawImage(imgRef.current, srcX, srcY, srcW, srcH, 0, 0, outW, outH);

    canvas.toBlob((blob) => {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      onCropped(blob, dataUrl);
    }, 'image/jpeg', 0.9);
  };

  if (!imgSrc) return null;

  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
        <h3 style={{ marginBottom: '1rem' }}><i className="fas fa-crop-alt" style={{ color: 'var(--gold)' }}></i> Crop & Resize Image</h3>

        <div
          ref={containerRef}
          style={{ position: 'relative', display: 'inline-block', maxWidth: '100%', cursor: dragging ? 'grabbing' : 'default', overflow: 'hidden', borderRadius: 'var(--radius-md)', background: '#f1f5f9' }}
        >
          <img
            ref={imgRef}
            src={imgSrc}
            onLoad={onImgLoad}
            style={{ display: 'block', maxWidth: '100%', maxHeight: '60vh' }}
            alt="Crop preview"
          />
          {/* Darkened overlay outside crop */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${crop.x}px ${crop.y}px, ${crop.x}px ${crop.y + crop.h}px, ${crop.x + crop.w}px ${crop.y + crop.h}px, ${crop.x + crop.w}px ${crop.y}px, ${crop.x}px ${crop.y}px)`, pointerEvents: 'none' }} />
          {/* Crop area */}
          <div
            style={{ position: 'absolute', left: crop.x, top: crop.y, width: crop.w, height: crop.h, border: '2px dashed var(--gold)', cursor: 'grab' }}
            onMouseDown={e => handleMouseDown(e, 'move')}
          >
            {/* Resize handle */}
            <div
              style={{ position: 'absolute', right: -6, bottom: -6, width: 12, height: 12, background: 'var(--gold)', borderRadius: '50%', cursor: 'nwse-resize' }}
              onMouseDown={e => handleMouseDown(e, 'resize')}
            />
            {/* Size label */}
            <div style={{ position: 'absolute', bottom: 4, left: 4, fontSize: '0.65rem', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '1px 4px', borderRadius: '3px' }}>
              {Math.round(crop.w * (imgDims.natW / imgDims.dispW))}×{Math.round(crop.h * (imgDims.natH / imgDims.dispH))}
            </div>
          </div>
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <div className="admin-modal-footer" style={{ marginTop: '1rem' }}>
          <button className="admin-btn admin-btn-outline" onClick={onCancel}>Cancel</button>
          <button className="admin-btn admin-btn-primary" onClick={doCrop}><i className="fas fa-check"></i> Crop & Use</button>
        </div>
      </div>
    </div>
  );
}
