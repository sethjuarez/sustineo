import { v4 as uuidv4 } from "uuid";

const CACHE_NAME = "image-cache";
const CACHE_URI = "/__cache/images/";
const MAX_SIZE = 800;

export const readAndCacheFile = (file: File): Promise<string | null> => {
  return new Promise((resolve) => {
    resizeImageFromFile(file, MAX_SIZE).then((blob) => {
      if (!blob) return resolve(null);
      const name = `${CACHE_URI}${uuidv4()}.jpg`;
      cacheBlob(blob, name).then(() => {
        resolve(name);
      });
    });
  });
};

export const readAndCacheVideoFrame = (video: HTMLVideoElement): Promise<string | null> => {
  return new Promise((resolve) => {
    resizeImage(video, MAX_SIZE).then((blob) => {
      if (!blob) return resolve(null);
      const name = `${CACHE_URI}${uuidv4()}.jpg`;
      cacheBlob(blob, name).then(() => {
        resolve(name);
      });
    });
  });
};

// function to resize image from File
export const resizeImageFromFile = (
  file: File,
  max_size: number
): Promise<Blob | null> => {
  return new Promise<Blob | null>((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target) return;
      const img = new Image();
      img.src = e.target.result as string;
      img.onload = () => {
        resizeImage(img, max_size).then((blob) => {
          resolve(blob);
        });
      };
    };
    reader.readAsDataURL(file);
  });
};

export const resizeImage = (
  image: HTMLImageElement | HTMLVideoElement,
  max_size: number
): Promise<Blob | null> => {
  return new Promise<Blob | null>((resolve) => {
    let width =
      image instanceof HTMLImageElement ? image.width : image.videoWidth;
    let height =
      image instanceof HTMLImageElement ? image.height : image.videoHeight;

    if (width > max_size || height > max_size) {
      if (width > height) {
        if (width > max_size) {
          height *= max_size / width;
          width = max_size;
        }
      } else {
        if (height > max_size) {
          width *= max_size / height;
          height = max_size;
        }
      }
    }

    const elem = document.createElement("canvas");
    elem.width = width;
    elem.height = height;
    const ctx = elem.getContext("2d");
    if (!ctx) return resolve(null);
    ctx.drawImage(image, 0, 0, width, height);
    ctx.canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      "image/jpeg",
      1
    );
  });
};

// function to pull image from cache
export const fetchCachedImage = async (
  image: string,
  setImage: (img: string) => void
) => {
  const cache = await caches.open(CACHE_NAME);
  const response = await cache.match(image);
  const blob = await response?.blob();
  // convert blob to data url
  if (blob) {
    const reader = new FileReader();
    reader.readAsDataURL(blob!);
    reader.onloadend = () => {
      const base64data = reader.result;
      setImage(base64data as string);
      // remove the image from cache after setting it
      // This is to ensure that the image is not cached forever
      removeCachedBlob(image);
    };
  }
};

// function to remove image from cache
export const removeCachedBlob = async (image: string | string[]) => {
  const cache = await caches.open(CACHE_NAME);
  if (Array.isArray(image)) {
    image.forEach(async (img) => {
      await cache.delete(img);
    });
  } else await cache.delete(image);
};

// function to add blob to cache
export const cacheBlob = async (blob: Blob, name: string) => {
  const cache = await caches.open(CACHE_NAME);
  const response = new Response(blob);
  cache.put(name, response);
};