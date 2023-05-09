import QRCode from "qrcode";

export const generateQR = async (text: string) => {
  const svg = await QRCode.toString(text, { type: "svg" });
  const png = await QRCode.toDataURL(text, { type: "image/png" });
  return { svg, png };
};
