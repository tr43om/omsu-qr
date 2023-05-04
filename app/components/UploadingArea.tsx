"use client";
import { useState } from "react";
import Dropzone from "./Dropzone";

import File from "./File";

const UploadingArea: React.FC = () => {
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const attachFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    setAttachedFiles((prev) => [
      ...(prev || []),
      ...Array.from(selectedFiles || []),
    ]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFiles = e.dataTransfer.files;
      setAttachedFiles((prev) => [
        ...(prev || []),
        ...Array.from(selectedFiles || []),
      ]);
    }
  };

  const deleteFile = (fileIndex: number) => {
    setAttachedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== fileIndex)
    );
  };

  return (
    <section className="  flex gap-16 justify-between">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Dropzone onChange={attachFiles} onDrop={handleDrop} />
      </form>
      <div className="flex-1 max-h-96 overflow-y-auto pr-4 -mt-1">
        <h2 className="text-2xl font-bold text-red-500">Добавленные файлы:</h2>
        {attachedFiles.map((file, index) => (
          <File
            file={file}
            key={file.name}
            unattachFile={() => deleteFile(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default UploadingArea;
