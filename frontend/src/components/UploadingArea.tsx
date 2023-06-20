import { useState } from "react";
import Dropzone from "./Dropzone";

import FilesList from "./FilesList";

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
    <section className="flex gap-16 justify-between">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Dropzone onChange={attachFiles} onDrop={handleDrop} />
      </form>
      <FilesList attachedFiles={attachedFiles} unattachFile={deleteFile} />
    </section>
  );
};

export default UploadingArea;
