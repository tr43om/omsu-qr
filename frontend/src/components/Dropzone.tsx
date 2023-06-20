import React, { HTMLAttributes } from "react";
import { FiUploadCloud } from "react-icons/fi";

interface DropzoneProps extends HTMLAttributes<HTMLInputElement> {}

const Dropzone = ({ onChange, onDrop }: DropzoneProps) => {
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("drag enter");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("drag leave");
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("drag over");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("drag drop");
  };
  return (
    <div
      className="max-w-2xl mx-auto"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onChange={onChange}
      onDrop={onDrop}
    >
      <div className="flex items-center justify-center w-full group">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-96 border-2 border-gray-400 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 hover:bg-gray-200 hover:border-gray-400 px-8"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <FiUploadCloud className="w-10 h-10 mb-3 text-red-500" />
            <p className="mb-2 text-sm text-neutral font-semibold ">
              Перетащите документы сюда
              <span className="font-extrabold text-red-500 group-hover:underline">
                {" "}
                или выберите вручную
              </span>
            </p>
            <p className="text-xs text-gray-400 ">
              поддерживаемые форматы: .doc, .docx, .pdf
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            name="file"
            accept=".doc, .docx, .pdf"
            multiple
            required
          />
        </label>
      </div>
    </div>
  );
};

export default Dropzone;
