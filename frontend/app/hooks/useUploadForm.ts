import { useState } from "react";
import axios, { AxiosRequestConfig } from "axios";

export const useUploadForm = <T>(
  url: string
): {
  uploadForm: (formData: FormData) => Promise<T>;
  isSuccess: boolean;
  progress: number;
  loading: boolean;
} => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress(progressEvent) {
      if (!progressEvent.total) return;

      const progress = Math.round(
        (progressEvent.loaded / progressEvent.total) * 50
      );
      setProgress(progress);
    },
    onDownloadProgress: (progressEvent) => {
      if (!progressEvent.total) return;

      const progress = 50 + (progressEvent.loaded / progressEvent.total) * 50;
      setProgress(progress);
    },
  };

  const uploadForm = async (formData: FormData) => {
    setLoading(true);
    try {
      const { data } = await axios.post(url, formData, config);
      setLoading(false);
      setIsSuccess(true);
      return data;
    } catch (error) {
      setIsSuccess(false);
    }
  };

  return { uploadForm, isSuccess, progress, loading };
};
