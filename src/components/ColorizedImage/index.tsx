import React, { useRef, useEffect } from 'react';

interface ColorizeImageProps {
  imageUrl: string; // Grayscale image URL
  color: string; // Desired overlay color in hex (e.g., '#ff0000')
}

export const ColorizeImage: React.FC<ColorizeImageProps> = ({
  imageUrl,
  color,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the grayscale image
      ctx.drawImage(img, 0, 0);
      const original = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Add a colored overlay
      ctx.globalCompositeOperation = 'darken';
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0, n = imageData.data.length; i < n; i += 4) {
        imageData.data[i + 3] = original.data[i + 3];
      }
      ctx.putImageData(imageData, 0, 0);

      // Reset blend mode
      ctx.globalCompositeOperation = 'source-over';
    };
  }, [imageUrl, color]);

  return <canvas ref={canvasRef} />;
};
