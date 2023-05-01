"use client";
import { useState } from "react";

const Upload: React.FC = () => {
  const [parsedText, setParsedText] = useState("");
  const [qr, setQr] = useState<Buffer>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    const file = (e.target as HTMLFormElement).file.files[0];
    formData.append("document", file);
    const res = await fetch("http://localhost:3001/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      console.log(data);

      // setParsedText(data.html);

      setQr(Buffer.from(data.qr.svg));
    }
  };

  return (
    <div>
      <h1>Upload a document</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" name="file" accept=".doc, .docx" required />
        <button type="submit">Upload</button>
      </form>
      {/* {parsedText && <div dangerouslySetInnerHTML={{ __html: parsedText }} />} */}
    </div>
  );
};

export default Upload;
