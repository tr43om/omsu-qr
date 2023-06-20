export function base64ToBlob(base64: string, contentType: string) {
  const binary = atob(base64);
  const buffer = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    buffer[i] = binary.charCodeAt(i);
  }

  return new Blob([buffer], { type: contentType });
}

export function downloadFile(base64PDF: string, fileName: string) {
  const blob = base64ToBlob(base64PDF, "application/pdf");
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();

  // Clean up the URL object after the download is complete
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

export const downloadImage = (url: string, type: "svg" | "png") => {
  const link = document.createElement("a");
  link.href = type === "svg" ? URL.createObjectURL(new Blob([url])) : url;
  link.setAttribute("download", `qrcode.${type}`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
