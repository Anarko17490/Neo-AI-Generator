
export interface UploadedImage {
  data: string; // Data URL for preview
  mimeType: string;
}

export interface GenerationResult {
  image: string; // base64 string
  text?: string;
}
