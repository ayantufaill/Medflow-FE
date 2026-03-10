import { useRef, useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';

/**
 * Reusable signature capture pad. User can draw with mouse or touch.
 * Optional: pass onChange(signatureDataUrl) to get base64 image when signature changes.
 * Optional: pass value (data URL) to show existing signature.
 */
const SignaturePad = ({
  width = 320,
  height = 80,
  onChange,
  value = null,
  showClearButton = true,
  sx = {},
}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const hasDrawnRef = useRef(false);

  const getCoords = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  const draw = useCallback(
    (e) => {
      if (!isDrawing) return;
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const { x, y } = getCoords(e);
      ctx.lineTo(x, y);
      ctx.stroke();
      hasDrawnRef.current = true;
    },
    [isDrawing, getCoords]
  );

  const startDrawing = useCallback(
    (e) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const { x, y } = getCoords(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    },
    [getCoords]
  );

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawnRef.current) return;
    try {
      const dataUrl = canvas.toDataURL('image/png');
      setIsEmpty(false);
      onChange?.(dataUrl);
    } catch {
      // ignore
    }
  }, [isDrawing, onChange]);

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasDrawnRef.current = false;
    setIsEmpty(true);
    onChange?.(null);
  }, [onChange]);

  // Initialize canvas size and stroke style
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#212121';
    ctx.lineWidth = 2 * dpr;
    ctx.lineCap = 'round';
  }, [width, height]);

  // If value (data URL) is provided, draw it on canvas
  useEffect(() => {
    if (!value || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      hasDrawnRef.current = true;
      setIsEmpty(false);
    };
    img.src = value;
  }, [value]);

  return (
    <Box sx={{ ...sx }}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: width,
          height,
          borderRadius: 1,
          border: '1px solid #e0e0e0',
          bgcolor: '#ffffff',
          overflow: 'hidden',
          cursor: 'crosshair',
        }}
      >
        {isEmpty && !value && (
          <Typography
            variant="body2"
            sx={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#bdbdbd',
              pointerEvents: 'none',
            }}
          >
            Signature
          </Typography>
        )}
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: `${width}px`,
            height: `${height}px`,
            touchAction: 'none',
          }}
        />
      </Box>
      {showClearButton && (
        <Button
          size="small"
          onClick={clear}
          sx={{
            mt: 0.5,
            textTransform: 'none',
            fontSize: 12,
            color: '#757575',
          }}
        >
          Clear
        </Button>
      )}
    </Box>
  );
};

export default SignaturePad;
