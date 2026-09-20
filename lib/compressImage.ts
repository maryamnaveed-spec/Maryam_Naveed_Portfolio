/**
 * Compresses/resizes an image file in the browser before it's uploaded.
 * This is what actually fixes slow-loading images - a raw phone photo can
 * easily be 4-8MB; nobody needs that much resolution for a web card. We
 * cap the longest side and re-encode as JPEG at a sensible quality, so
 * every image that ever lands in Supabase Storage is already web-sized.
 */
export function compressImage(
  file: File,
  { maxDimension = 1600, quality = 0.82 }: { maxDimension?: number; quality?: number } = {}
): Promise<File> {
  return new Promise((resolve) => {
    // Don't try to re-encode non-raster files (shouldn't happen given our
    // accept="image/*" inputs, but be safe) - just pass them through.
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
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
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          // Keep it simple and consistent: always hand back a .jpg,
          // regardless of the original format (png/heic/webp/etc).
          const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg';
          resolve(new File([blob], newName, { type: 'image/jpeg' }));
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      // If it can't be decoded for some reason, fall back to the original
      // file rather than blocking the upload entirely.
      resolve(file);
    };

    img.src = objectUrl;
  });
}
