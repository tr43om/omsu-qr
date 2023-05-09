type UploadingResponse = {
  qr: {
    svg: string;
    png: string;
  };
  pdf: string;
  paymentInfo: string;
};

interface ImageType {
  svg: string;
  png: string;
}

export type { UploadingResponse, ImageType };
