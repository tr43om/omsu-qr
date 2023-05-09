import React from "react";
import File from "./File";

type FileListProps = {
  attachedFiles: File[];
  unattachFile: (index: number) => void;
};

const FilesList = ({ attachedFiles, unattachFile }: FileListProps) => {
  return (
    <div className="flex-1 max-h-96 overflow-y-auto pr-4 -mt-1">
      {attachedFiles.map((file, index) => (
        <File
          file={file}
          key={file.name}
          unattachFile={() => unattachFile(index)}
        />
      ))}
      {attachedFiles.length <= 0 && (
        <div className="flex items-center justify-center justify-items-center h-full">
          <p className=" text-gray-400 text-sm text-center">
            Здесь будут отображаться загруженные файлы
          </p>
        </div>
      )}
    </div>
  );
};

export default FilesList;
