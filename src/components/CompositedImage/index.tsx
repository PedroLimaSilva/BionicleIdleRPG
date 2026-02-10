import { useRef, useEffect } from 'react';

interface CompositedImageProps {
  images: string[]; // Grayscale image URL
  colors: string[]; // Desired overlay color in hex (e.g., '#ff0000')
  className: string;
}

function arraysEqual(a: string[], b: string[]) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

export const CompositedImage: React.FC<CompositedImageProps> = ({ images, colors, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevImages = useRef<string[]>([]);

  useEffect(() => {
    if (arraysEqual(prevImages.current, images)) return;
    prevImages.current = images;

    Promise.all(
      images.map(
        (url) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = url;
            img.onload = () => resolve(img);
          })
      )
    ).then((loadedImages) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const buffer = document.createElement('canvas');
      const bctx = buffer.getContext('2d', {
        willReadFrequently: true,
      }) as CanvasRenderingContext2D;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      canvas.width = (loadedImages[0] as HTMLImageElement).width;
      canvas.height = (loadedImages[0] as HTMLImageElement).height;
      buffer.width = canvas.width;
      buffer.height = canvas.height;

      for (let i = 0; i < loadedImages.length; i++) {
        const img = loadedImages[i] as HTMLImageElement;

        bctx.drawImage(img, 0, 0);
        const grayscale = bctx.getImageData(0, 0, canvas.width, canvas.height);

        bctx.globalCompositeOperation = 'multiply';
        bctx.fillStyle = colors[i];
        bctx.fillRect(0, 0, canvas.width, canvas.height);

        const imageData = bctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < imageData.data.length; i += 4) {
          imageData.data[i + 3] = grayscale.data[i + 3];
        }

        bctx.putImageData(imageData, 0, 0);
        ctx.drawImage(buffer, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        bctx.clearRect(0, 0, buffer.width, buffer.height);
      }
    });
  }, [images, colors]);

  return <canvas className={className} ref={canvasRef} />;
};
