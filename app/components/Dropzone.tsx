import React, { HTMLAttributes } from "react";
import { FiUploadCloud } from "react-icons/fi";

interface DropzoneProps extends HTMLAttributes<HTMLInputElement> {
  loading: boolean;
  progress: number;
  filename: string;
}

const Dropzone = ({ onChange, loading, progress, filename }: DropzoneProps) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 hover:bg-gray-200 hover:border-gray-400    "
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {loading ? (
              <span
                className="animate-spin inline-block w-10 h-10 mb-3 border-[3px] border-current border-t-transparent text-blue-500 rounded-full"
                role="status"
                aria-label="loading"
              >
                <span className="sr-only">Загрузка...</span>
              </span>
            ) : (
              <FiUploadCloud className="w-10 h-10 mb-3 text-blue-500" />
            )}
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              Перетащите файл сюда
              <span className="font-semibold"> или выберите вручную</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              doc, docx
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            name="file"
            accept=".doc, .docx"
            required
            onChange={onChange}
          />
        </label>
      </div>
    </div>
  );
};

export default Dropzone;
