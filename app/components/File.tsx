"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { downloadFile, downloadImage } from "../utils";
import { SiMicrosoftword } from "react-icons/si";
import { TiDelete } from "react-icons/ti";
import { MdOutlineDeleteOutline } from "react-icons/md";
import {
  BsFiletypeDocx,
  BsFiletypeSvg,
  BsFiletypePng,
  BsFiletypePdf,
} from "react-icons/bs";

import DownloadButton from "./DownloadButton";
import ProgressBar from "./ProgressBar";
import DownloadDropdown from "./DownloadDropdown";
import { ImageType, UploadingResponse } from "../types";
import { useUploadForm } from "../hooks/useUploadForm";

type FileProps = {
  unattachFile: () => void;
  file: File;
};

const File = ({ unattachFile, file }: FileProps) => {
  const [qr, setQr] = useState<ImageType>();
  const [base64PDF, setBase64PDF] = useState("");
  const { isSuccess, loading, progress, uploadForm } =
    useUploadForm<UploadingResponse>("http://localhost:3001/upload");

  const isDownloadDisabled = !isSuccess || !file;

  const upload = async () => {
    const formData = new FormData();
    formData.append("document", file);
    const { pdf, qr } = await uploadForm(formData);
    setQr(qr);
    setBase64PDF(pdf);
  };

  useEffect(() => {
    (async () => await upload())();
  }, []);

  return (
    <div className="w-full flex  gap-4 items-center mt-5">
      <BsFiletypeDocx className="w-24 h-24 text-neutral" />
      <div className="w-full">
        <div className="flex justify-between items-center mb-3">
          <p className=" text-neutral text-sm font-semibold ">
            {file.name.split(".")[0]}
          </p>

          <MdOutlineDeleteOutline
            className="h-5 w-5   cursor-pointer text-neutral hover:text-red-600"
            onClick={unattachFile}
          />
        </div>
        <ProgressBar progress={progress} />
        <div className="flex justify-between items-center mt-2">
          <div className="flex  items-center">
            <div className="flex ">
              <DownloadButton
                download={() => downloadFile(base64PDF!, "pdf")}
                label="PDF"
                disabled={isDownloadDisabled}
              />
              <DownloadButton
                download={() => downloadImage(qr?.svg!, "svg")}
                label="SVG"
                disabled={isDownloadDisabled}
              />
              <DownloadButton
                download={() => downloadImage(qr?.png!, "png")}
                label="PNG"
                disabled={isDownloadDisabled}
              />
            </div>
          </div>
          <p className="text-gray-500 text-sm"> {progress ? progress : 0}%</p>
        </div>
      </div>

      {/* <div className="ml-auto">
        <DownloadDropdown>
          <DownloadButton
            download={() => downloadFile(base64PDF!, "pdf")}
            label="PDF"
          />
          <DownloadButton
            download={() => downloadImage(qr?.svg!, "svg")}
            label="QR (SVG)"
          />
          <DownloadButton
            download={() => downloadImage(qr?.png!, "png")}
            label="QR (PNG)"
          />
        </DownloadDropdown>
      </div> */}
    </div>
  );
};

export default File;
