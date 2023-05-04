type UploadingResponse = {
  qr: {
    svg: string;
    png: string;
  };
  pdf: string;
};

interface ImageType {
  svg: string;
  png: string;
}

export type { UploadingResponse, ImageType };
