/**
 * Utility to downscale and optimize camera images before AI processing.
 * Prevents oversized payloads and ensures rapid classification.
 */
export async function optimizeImageForAi(dataUrlOrFile: string | File, maxDimension = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();

    const processLoadedImage = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        // Fallback to original
        resolve(typeof dataUrlOrFile === 'string' ? dataUrlOrFile : URL.createObjectURL(dataUrlOrFile));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(optimizedDataUrl);
    };

    img.onload = processLoadedImage;
    img.onerror = () => {
      // If error, return original string or fallback
      resolve(typeof dataUrlOrFile === 'string' ? dataUrlOrFile : '');
    };

    if (typeof dataUrlOrFile === 'string') {
      img.src = dataUrlOrFile;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(dataUrlOrFile);
    }
  });
}
