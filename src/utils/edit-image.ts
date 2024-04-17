export type MimeType =
  | 'image/bmp'
  | 'image/jpeg'
  | 'image/jpg'
  | 'image/png'
  | 'image/tif';

interface IOptimizeImage {
  file: MediaSource;
  width?: number;
  height?: number;
  quality?: number;
  mimeType?: MimeType;
}

const MAX_WIDTH = 1000;
const MAX_HEIGHT = 1000;
const MIME_TYPE: MimeType = 'image/png';
const QUALITY = 0.7;

/**
 * Calculate the width and height, constraining the proportions
 * @param img
 * @param maxWidth
 * @param maxHeight
 */
const calculateSize = (
  img: HTMLImageElement,
  maxWidth: number,
  maxHeight: number
) => {
  let width = img.width;
  let height = img.height;

  if (width > height) {
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }
  }
  return [width, height];
};

/**
 * Optimize the image before being uploaded
 * https://labs.madisoft.it/javascript-image-compression-and-resizing/
 * @param param0
 * @returns
 */
export const optimizeImage = ({
  file,
  width = MAX_WIDTH,
  height = MAX_HEIGHT,
  quality = QUALITY,
  mimeType = MIME_TYPE,
}: IOptimizeImage) => {
  const blobURL = URL.createObjectURL(file);
  const canvas = document.createElement('canvas');
  const img = new Image();
  img.src = blobURL;

  return new Promise((resolve) => {
    img.onload = function () {
      URL.revokeObjectURL(img.src);
      const [newWidth, newHeight] = calculateSize(img, width, height);
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      canvas.toBlob(
        (blob) => {
          const url = URL.createObjectURL(blob);
          resolve(url);
        },
        mimeType,
        quality
      );
    };
  });
};

/**
 * Convert image url to a URLBlob
 * @param dataURL
 * @param type
 * @returns
 */
export const dataURLtoBlob = (dataURL: string, type = 'image/png') => {
  const binary = atob(dataURL.split(',')[1]);
  const array = [];
  const length = binary.length;
  let index = 0;

  while (index < length) {
    array.push(binary.charCodeAt(index));
    index++;
  }

  return new Blob([new Uint8Array(array)], { type });
};
