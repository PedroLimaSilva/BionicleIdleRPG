import { useRef, useEffect } from 'react';

import { applyMaskAvatarDiscoloration } from '../../game/maskAvatarDiscoloration';
import type { MaskDiscoloration } from '../../hooks/maskDiscoloration';

interface CompositedImageProps {
  images: string[]; // Grayscale image URL
  colors: string[]; // Desired overlay color in hex (e.g., '#ff0000')
  className: string;
  style?: React.CSSProperties;
  /** Applied to the final (mask) layer after tinting — Metru double-injected Kanohi crown. */
  maskDiscoloration?: MaskDiscoloration;
}

function renderKey(
  images: string[],
  colors: string[],
  maskDiscoloration: MaskDiscoloration | undefined
): string {
  return JSON.stringify({ colors, images, maskDiscoloration });
}

export const CompositedImage: React.FC<CompositedImageProps> = ({
  className,
  colors,
  images,
  maskDiscoloration,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevRenderKey = useRef('');

  useEffect(() => {
    const nextKey = renderKey(images, colors, maskDiscoloration);
    if (prevRenderKey.current === nextKey) return;
    prevRenderKey.current = nextKey;

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
        for (let j = 0; j < imageData.data.length; j += 4) {
          imageData.data[j + 3] = grayscale.data[j + 3];
        }

        if (maskDiscoloration && i === loadedImages.length - 1) {
          applyMaskAvatarDiscoloration(imageData, maskDiscoloration);
        }

        bctx.putImageData(imageData, 0, 0);
        ctx.drawImage(buffer, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        bctx.clearRect(0, 0, buffer.width, buffer.height);
      }
    });
  }, [colors, images, maskDiscoloration]);

  return <canvas className={className} style={style} ref={canvasRef} />;
};
