// lib/tiptap-utils.ts

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function handleImageUpload(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed.');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image is too large.');
  }

  // Simulate image upload
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}
