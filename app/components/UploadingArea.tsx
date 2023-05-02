"use client";
import { useState } from "react";
import { downloadFile, downloadImage } from "../utils";
import Dropzone from "./Dropzone";
import { useUploadForm } from "../hooks/useUploadForm";
import { SiMicrosoftword } from "react-icons/si";
import { TiDelete } from "react-icons/ti";
import DownloadButton from "./DownloadButton";
import ProgressBar from "./ProgressBar";
import DownloadDropdown from "./DownloadDropdown";

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

const UploadingArea: React.FC = () => {
  const [qr, setQr] = useState<ImageType>();
  const [base64PDF, setBase64PDF] = useState("");
  const [modifiedDocument, setModifiedDocument] = useState<File>();
  const { isSuccess, loading, progress, uploadForm } =
    useUploadForm<UploadingResponse>("http://localhost:3001/upload");

  const isDownloadDisabled = !isSuccess || !modifiedDocument;

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    const formData = new FormData();
    formData.append("document", file);
    setModifiedDocument(file);

    const { pdf, qr } = await uploadForm(formData);
    console.log(qr);
    setQr(qr);
    setBase64PDF(pdf);
  };

  return (
    <section className=" items-center grid justify-center">
      <form>
        <Dropzone
          onChange={upload}
          loading={loading}
          progress={progress}
          filename={modifiedDocument?.name || ""}
        />
        {modifiedDocument && (
          <div className="w-full flex justify-between gap-2 items-center mt-5">
            <div className="flex items-center gap-2">
              <SiMicrosoftword className="w-5 h-5  text-blue-500" />
              <p className="text-xs text-gray-500 ">{modifiedDocument?.name}</p>
            </div>
            <ProgressBar progress={progress} />
            <TiDelete
              className="h-8 w-8 text-red-500 cursor-pointer hover:text-red-600"
              onClick={() => setModifiedDocument(undefined)}
            />
          </div>
        )}
      </form>

      <DownloadDropdown>
        <DownloadButton
          download={() => downloadFile(base64PDF!, "pdf")}
          isDisabled={isDownloadDisabled}
          label="PDF"
        />
        <DownloadButton
          download={() => downloadImage(qr?.svg!, "svg")}
          isDisabled={isDownloadDisabled}
          label="QR (SVG)"
        />
        <DownloadButton
          download={() => downloadImage(qr?.png!, "png")}
          isDisabled={isDownloadDisabled}
          label="QR (PNG)"
        />
      </DownloadDropdown>
    </section>
  );
};

export default UploadingArea;
