"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { downloadFile, downloadImage } from "../utils";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { BsFileEarmarkPdf, BsFileEarmarkText } from "react-icons/bs";
import { AiOutlineQrcode } from "react-icons/ai";

import ProgressBar from "./ProgressBar";
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
    console.log("dsfsdf");
    const formData = new FormData();
    formData.append("document", file);
    const { pdf, qr, paymentInfo } = await uploadForm(formData);
    console.log("paymentInfo", paymentInfo);
    setQr(qr);
    setBase64PDF(pdf);
  };

  const downloadPdf = () =>
    downloadFile(base64PDF!, `${file.name.split(".")[0]}.pdf`);
  const downloadQR = () => downloadImage(qr?.svg!, "png");

  useEffect(() => {
    (async () => await upload())();
  }, []);

  return (
    <div className="w-full flex  gap-2 items-center mt-3 max-w-xs">
      <BsFileEarmarkText className="w-24 h-24 text-neutral" />
      <div className="w-full">
        <div className="flex justify-between items-center mb-1">
          <p className=" text-neutral  font-semibold ">{file.name}</p>

          <MdOutlineDeleteOutline
            className="h-5 w-5   cursor-pointer text-neutral hover:text-red-600"
            onClick={unattachFile}
          />
        </div>
        <ProgressBar progress={progress} />
        <div className="flex justify-between items-center mt-2">
          <div className="flex  items-center">
            <div className="flex gap-2 ">
              <div className="tooltip " data-tip="скачать документ">
                <button
                  className="btn gap-2 btn-sm btn-primary border-0"
                  onClick={downloadPdf}
                  disabled={isDownloadDisabled}
                >
                  <BsFileEarmarkPdf className="h-5 w-5" />
                  PDF
                </button>
              </div>
              <div className="tooltip " data-tip="скачать QR код">
                <button
                  className="btn gap-2 btn-sm btn-primary border-0"
                  onClick={downloadQR}
                  disabled={isDownloadDisabled}
                >
                  <AiOutlineQrcode className="h-5 w-5" />
                  QR
                </button>
              </div>
            </div>
          </div>
          <p className="text-gray-500 text-sm"> {progress ? progress : 0}%</p>
        </div>
      </div>
    </div>
  );
};

export default File;
