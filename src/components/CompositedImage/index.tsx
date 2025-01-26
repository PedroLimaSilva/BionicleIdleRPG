import React, { useRef, useEffect } from 'react';

interface CompositedImageProps {
  images: string[]; // Grayscale image URL
  colors: string[]; // Desired overlay color in hex (e.g., '#ff0000')
}

export const CompositedImage: React.FC<CompositedImageProps> = ({
  images: imageUrls,
  colors: colors,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Wait for all images to be loaded.
    Promise.all(
      imageUrls.map(
        (imageUrl) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = imageUrl;
            img.onload = () => resolve(img);
          })
      )
    ).then((images) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = (images[0] as HTMLImageElement).width;
      canvas.height = (images[0] as HTMLImageElement).height;

      // create offscreen buffer,
      const bufferContainer = document.getElementById('buffer');
      if (bufferContainer) {
        bufferContainer.innerHTML = '';
      }
      const buffer = document.createElement('canvas');
      document.getElementById('buffer')?.appendChild(buffer);
      buffer.width = canvas.width;
      buffer.height = canvas.height;
      const bctx = buffer.getContext('2d', {
        willReadFrequently: true,
      }) as CanvasRenderingContext2D;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      for (let i = 0; i < images.length; i++) {
        const img = images[i] as HTMLImageElement;

        // Draw the grayscale image to buffer
        bctx.drawImage(img, 0, 0);

        const grayscale = bctx.getImageData(0, 0, canvas.width, canvas.height);

        // Add a colored overlay
        bctx.globalCompositeOperation = 'multiply';
        bctx.fillStyle = colors[i];
        bctx.fillRect(0, 0, canvas.width, canvas.height);

        const imageData = bctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0, n = imageData.data.length; i < n; i += 4) {
          imageData.data[i + 3] = grayscale.data[i + 3];
        }
        bctx.putImageData(imageData, 0, 0);
        ctx.drawImage(buffer, 0, 0)

        // Reset blend mode
        ctx.globalCompositeOperation = 'source-over';

        // Reset Buffer
        bctx!.clearRect(0, 0, buffer.width, buffer.height);
      }
    });
  }, [imageUrls, colors]);

  return <canvas ref={canvasRef} />;
};
